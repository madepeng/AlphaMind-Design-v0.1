import json
from time import perf_counter
from typing import Any

import httpx
import structlog
from pydantic import ValidationError

from app.config.settings import AppSettings, get_settings
from app.core.exceptions import ExternalAPIException
from app.schemas.company import CompanyAISummaryDTO

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


class AIService:
    def __init__(
        self,
        client: httpx.AsyncClient | None = None,
        settings: AppSettings | None = None,
    ) -> None:
        self.client = client
        self.settings = settings or get_settings()

    async def CompanyAnalysis(self, ticker: str) -> CompanyAISummaryDTO:
        api_key = self.settings.openai_api_key
        if api_key is None or not api_key.get_secret_value():
            raise ExternalAPIException("AI analysis unavailable.")

        started_at = perf_counter()
        try:
            payload = await self._create_response(
                ticker,
                api_key.get_secret_value(),
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
        api_key: str,
    ) -> dict[str, Any]:
        request = {
            "model": self.settings.openai_model,
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
            "Authorization": f"Bearer {api_key}",
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
