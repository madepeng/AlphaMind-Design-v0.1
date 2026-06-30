from collections.abc import AsyncIterator

import httpx
import pytest

from app.ai import AIService
from app.api.analyze import get_ai_service
from app.config.settings import AppSettings
from app.core.exceptions import ExternalAPIException
from app.main import app
from app.schemas.company import CompanyAISummaryDTO

ANALYSIS = CompanyAISummaryDTO(
    summary=(
        "NVIDIA has a strong position in accelerated computing, while its "
        "valuation, competition, and execution remain important research risks."
    ),
    bullCase=["AI infrastructure demand remains strong."],
    risk=["Valuation can amplify execution risk."],
    watchItems=["Next earnings and product shipments."],
)


class StubAIService(AIService):
    async def CompanyAnalysis(self, ticker: str) -> CompanyAISummaryDTO:
        assert ticker == "NVDA"
        return ANALYSIS


@pytest.fixture
async def analyze_client() -> AsyncIterator[httpx.AsyncClient]:
    def override_ai_service() -> AIService:
        return StubAIService()

    app.dependency_overrides[get_ai_service] = override_ai_service
    transport = httpx.ASGITransport(app=app)

    async with httpx.AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        yield client

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_analyze_endpoint_matches_api_spec(
    analyze_client: httpx.AsyncClient,
) -> None:
    response = await analyze_client.post(
        "/api/v1/analyze",
        json={"ticker": "NVDA"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "data": ANALYSIS.model_dump(),
    }


@pytest.mark.asyncio
@pytest.mark.parametrize("ticker", ["nvda", " NVDA", "", "ABCDEFGHIJK"])
async def test_analyze_endpoint_validates_ticker(
    analyze_client: httpx.AsyncClient,
    ticker: str,
) -> None:
    response = await analyze_client.post(
        "/api/v1/analyze",
        json={"ticker": ticker},
    )

    assert response.status_code == 400
    assert response.json() == {
        "success": False,
        "message": "Validation Error",
    }


@pytest.mark.asyncio
async def test_ai_service_calls_responses_api_and_parses_output() -> None:
    def handle_request(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/v1/responses"
        assert request.headers["authorization"] == "Bearer test-key"
        body = request.read().decode()
        assert '"model":"gpt-5.5"' in body
        assert '"type":"json_schema"' in body
        return httpx.Response(
            200,
            json={
                "status": "completed",
                "output": [
                    {
                        "type": "message",
                        "content": [
                            {
                                "type": "output_text",
                                "text": ANALYSIS.model_dump_json(),
                            }
                        ],
                    }
                ],
            },
        )

    transport = httpx.MockTransport(handle_request)
    settings = AppSettings(
        openai_api_key="test-key",
        openai_model="gpt-5.5",
    )
    async with httpx.AsyncClient(transport=transport) as client:
        result = await AIService(
            client=client,
            settings=settings,
        ).CompanyAnalysis("NVDA")

    assert result == ANALYSIS


@pytest.mark.asyncio
async def test_ai_service_maps_provider_failure() -> None:
    transport = httpx.MockTransport(
        lambda _: httpx.Response(500, json={"error": {"message": "failed"}})
    )
    settings = AppSettings(openai_api_key="test-key")

    async with httpx.AsyncClient(transport=transport) as client:
        service = AIService(client=client, settings=settings)
        with pytest.raises(
            ExternalAPIException,
            match="AI analysis unavailable.",
        ):
            await service.CompanyAnalysis("NVDA")
