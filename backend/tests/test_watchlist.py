from collections.abc import AsyncIterator
from pathlib import Path

import httpx
import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database.database import create_database_engine, initialize_database
from app.database.session import get_session
from app.main import app


@pytest_asyncio.fixture
async def watchlist_client(
    tmp_path: Path,
) -> AsyncIterator[httpx.AsyncClient]:
    path = tmp_path / "watchlist.db"
    engine = create_database_engine(path)
    await initialize_database(engine, path)
    session_factory = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async def override_session() -> AsyncIterator[AsyncSession]:
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_session] = override_session
    transport = httpx.ASGITransport(app=app)

    async with httpx.AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        yield client

    app.dependency_overrides.clear()
    await engine.dispose()


@pytest.mark.asyncio
async def test_get_watchlist_returns_api_spec_shape(
    watchlist_client: httpx.AsyncClient,
) -> None:
    await watchlist_client.post("/api/v1/watchlist", json={"ticker": "NVDA"})

    response = await watchlist_client.get("/api/v1/watchlist")

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "data": [
            {
                "ticker": "NVDA",
                "companyName": "NVIDIA",
                "price": 185.2,
                "change": 2.13,
            }
        ],
    }


@pytest.mark.asyncio
async def test_post_normalizes_ticker_and_uses_ticker_as_unknown_company_name(
    watchlist_client: httpx.AsyncClient,
) -> None:
    response = await watchlist_client.post(
        "/api/v1/watchlist",
        json={"ticker": "  amd  "},
    )

    assert response.status_code == 200
    assert response.json() == {"success": True}

    items = (await watchlist_client.get("/api/v1/watchlist")).json()["data"]
    assert items[0]["ticker"] == "AMD"
    assert items[0]["companyName"] == "AMD"


@pytest.mark.asyncio
async def test_post_rejects_duplicate_ticker(
    watchlist_client: httpx.AsyncClient,
) -> None:
    await watchlist_client.post("/api/v1/watchlist", json={"ticker": "AAPL"})

    response = await watchlist_client.post(
        "/api/v1/watchlist",
        json={"ticker": " aapl "},
    )

    assert response.status_code == 400
    assert response.json() == {
        "success": False,
        "message": "Already Exists",
    }


@pytest.mark.asyncio
async def test_post_rejects_item_when_watchlist_is_full(
    watchlist_client: httpx.AsyncClient,
) -> None:
    for index in range(20):
        response = await watchlist_client.post(
            "/api/v1/watchlist",
            json={"ticker": f"T{index}"},
        )
        assert response.status_code == 200

    response = await watchlist_client.post(
        "/api/v1/watchlist",
        json={"ticker": "FULL"},
    )

    assert response.status_code == 400
    assert response.json() == {
        "success": False,
        "message": "Watchlist Full",
    }


@pytest.mark.asyncio
@pytest.mark.parametrize("ticker", ["   ", "ABCDEFGHIJK"])
async def test_post_rejects_invalid_ticker(
    watchlist_client: httpx.AsyncClient,
    ticker: str,
) -> None:
    response = await watchlist_client.post(
        "/api/v1/watchlist",
        json={"ticker": ticker},
    )

    assert response.status_code == 400
    assert response.json() == {
        "success": False,
        "message": "Validation Error",
    }


@pytest.mark.asyncio
async def test_delete_removes_ticker(
    watchlist_client: httpx.AsyncClient,
) -> None:
    await watchlist_client.post("/api/v1/watchlist", json={"ticker": "TSM"})

    response = await watchlist_client.delete("/api/v1/watchlist/tsm")

    assert response.status_code == 200
    assert response.json() == {"success": True}
    assert (await watchlist_client.get("/api/v1/watchlist")).json()["data"] == []
