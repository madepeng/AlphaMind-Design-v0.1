import json
from dataclasses import dataclass
from time import perf_counter
from typing import Any, Protocol

import httpx
import structlog
from pydantic import ValidationError

from app.config.settings import AppSettings, get_settings
from app.core.exceptions import ConfigurationException, ExternalAPIException
from app.models import SettingsModel
from app.schemas.company import CompanyAISummaryDTO
from app.services.settings import OPENAI_API_KEY, OPENAI_MODEL

logger = structlog.get_logger()

OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"
OPENAI_TIMEOUT_SECONDS = 10.0

ANALYSIS_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "summary": {
            "type": "string",
            "minLength": 100,
            "maxLength": 200,
        },
        "bullCase": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
            "maxItems": 3,
        },
        "risk": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
            "maxItems": 3,
        },
        "watchItems": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
            "maxItems": 3,
        },
    },
    "required": ["summary", "bullCase", "risk", "watchItems"],
    "additionalProperties": False,
}


class SettingsReader(Protocol):
    async def get_by_key(self, key: str) -> SettingsModel | None: ...


@dataclass(frozen=True)
class AIConfiguration:
    api_key: str
    model: str


class AIService:
    def __init__(
        self,
        client: httpx.AsyncClient | None = None,
        settings: AppSettings | None = None,
        settings_repository: SettingsReader | None = None,
    ) -> None:
        self.client = client
        self.settings = settings or get_settings()
        self.settings_repository = settings_repository

    async def CompanyAnalysis(self, ticker: str) -> CompanyAISummaryDTO:
        configuration = await self._get_configuration()

        started_at = perf_counter()
        try:
            payload = await self._create_response(
                ticker,
                configuration,
            )
            analysis = self._parse_analysis(payload)
        except (
            httpx.HTTPError,
            json.JSONDecodeError,
            KeyError,
            TypeError,
            ValueError,
            ValidationError,
        ) as exception:
            logger.error(
                "ai_analysis_failed",
                provider="openai",
                duration_ms=round((perf_counter() - started_at) * 1000),
                error_type=type(exception).__name__,
            )
            raise ExternalAPIException("AI analysis unavailable.") from exception

        logger.info(
            "ai_analysis_completed",
            provider="openai",
            duration_ms=round((perf_counter() - started_at) * 1000),
        )
        return analysis

    async def _create_response(
        self,
        ticker: str,
        configuration: AIConfiguration,
    ) -> dict[str, Any]:
        request = {
            "model": configuration.model,
            "instructions": (
                "You are an investment research assistant, not a financial "
                "advisor. Give balanced, concise research context. Do not "
                "claim access to real-time prices or news. The summary must "
                "be 100 to 200 characters. Return one to three items for "
                "each list."
            ),
            "input": f"Create a company research analysis for ticker {ticker}.",
            "store": False,
            "text": {
                "format": {
                    "type": "json_schema",
                    "name": "company_analysis",
                    "strict": True,
                    "schema": ANALYSIS_SCHEMA,
                }
            },
        }
        headers = {
            "Authorization": f"Bearer {configuration.api_key}",
            "Content-Type": "application/json",
        }

        if self.client is not None:
            response = await self.client.post(
                OPENAI_RESPONSES_URL,
                headers=headers,
                json=request,
            )
        else:
            async with httpx.AsyncClient(
                timeout=OPENAI_TIMEOUT_SECONDS,
            ) as client:
                response = await client.post(
                    OPENAI_RESPONSES_URL,
                    headers=headers,
                    json=request,
                )

        response.raise_for_status()
        payload = response.json()
        if not isinstance(payload, dict):
            raise TypeError("OpenAI response must be an object")
        return payload

    async def _get_configuration(self) -> AIConfiguration:
        database_api_key = await self._get_database_value(OPENAI_API_KEY)
        database_model = await self._get_database_value(OPENAI_MODEL)
        environment_api_key = self.settings.openai_api_key
        api_key = database_api_key or (
            environment_api_key.get_secret_value()
            if environment_api_key is not None
            else ""
        )
        if not api_key:
            raise ConfigurationException("Configuration Error")

        model = database_model or self.settings.openai_model or "gpt-5.5"
        return AIConfiguration(api_key=api_key, model=model)

    async def _get_database_value(self, key: str) -> str:
        if self.settings_repository is None:
            return ""
        model = await self.settings_repository.get_by_key(key)
        return model.value.strip() if model and model.value else ""

    @staticmethod
    def _parse_analysis(payload: dict[str, Any]) -> CompanyAISummaryDTO:
        if payload.get("status") != "completed":
            raise ValueError("OpenAI response was not completed")

        for output in payload["output"]:
            if output.get("type") != "message":
                continue
            for content in output.get("content", []):
                if content.get("type") == "refusal":
                    raise ValueError("OpenAI refused the analysis")
                if content.get("type") == "output_text":
                    parsed = json.loads(content["text"])
                    return CompanyAISummaryDTO.model_validate(parsed)

        raise ValueError("OpenAI response did not contain output text")
