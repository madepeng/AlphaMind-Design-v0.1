import httpx
import pytest

from app.main import app
from app.services import CompanyService


@pytest.mark.asyncio
async def test_company_endpoint_returns_api_spec_response() -> None:
    transport = httpx.ASGITransport(app=app)

    async with httpx.AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/company/nvda")

    payload = response.json()

    assert response.status_code == 200
    assert payload["success"] is True
    assert set(payload["data"]) == {"header", "news", "aiSummary"}
    assert payload["data"]["header"] == {
        "ticker": "NVDA",
        "companyName": "NVIDIA",
        "industry": "Semiconductor",
        "marketCap": "3.8T",
        "price": 185.23,
        "changePercent": 1.82,
    }
    assert all(
        set(item) == {"title", "publishedAt", "source"}
        for item in payload["data"]["news"]
    )
    assert set(payload["data"]["aiSummary"]) == {
        "summary",
        "bullCase",
        "risk",
        "watchItems",
    }


@pytest.mark.asyncio
async def test_company_service_respects_content_limits() -> None:
    data = await CompanyService().get_company("NVDA")

    assert len(data.news) <= 10
    assert 100 <= len(data.aiSummary.summary) <= 200
    assert len(data.aiSummary.bullCase) <= 3
    assert len(data.aiSummary.risk) <= 3
    assert len(data.aiSummary.watchItems) <= 3


@pytest.mark.asyncio
async def test_unknown_company_uses_safe_mock_fallback() -> None:
    data = await CompanyService().get_company(" amd ")

    assert data.header.ticker == "AMD"
    assert data.header.companyName == "AMD"
    assert data.news
    assert data.aiSummary.summary
