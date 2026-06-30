import httpx
import pytest

from app.main import app
from app.services import HomeService


@pytest.mark.asyncio
async def test_home_endpoint_returns_api_spec_response() -> None:
    transport = httpx.ASGITransport(app=app)

    async with httpx.AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        response = await client.get("/api/v1/home")

    payload = response.json()

    assert response.status_code == 200
    assert payload["success"] is True
    assert set(payload["data"]) == {"market", "events", "summary"}
    assert set(payload["data"]["market"]) == {"nasdaq", "sp500", "sox"}
    assert all(
        set(event) == {"title", "summary"}
        for event in payload["data"]["events"]
    )
    assert len(payload["data"]["events"]) <= 3
    assert 100 <= len(payload["data"]["summary"]) <= 200


@pytest.mark.asyncio
async def test_home_service_returns_mock_home_data() -> None:
    data = await HomeService().get_home()

    assert data.market.nasdaq == 1.25
    assert len(data.events) == 3
    assert data.summary
