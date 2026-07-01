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

SETTINGS_PAYLOAD = {
    "openaiApiKey": "sk-test-settings",
    "model": "gpt-5.5",
    "theme": "dark",
}


@pytest_asyncio.fixture
async def settings_client(tmp_path: Path) -> AsyncIterator[httpx.AsyncClient]:
    path = tmp_path / "settings.db"
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
async def test_get_settings_returns_defaults(
    settings_client: httpx.AsyncClient,
) -> None:
    response = await settings_client.get("/api/v1/settings")

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "data": {
            "openaiApiKey": "",
            "model": "gpt-5.5",
            "theme": "dark",
        },
    }


@pytest.mark.asyncio
async def test_put_and_get_settings(
    settings_client: httpx.AsyncClient,
) -> None:
    response = await settings_client.put(
        "/api/v1/settings",
        json=SETTINGS_PAYLOAD,
    )

    assert response.status_code == 200
    assert response.json() == {"success": True}
    assert (await settings_client.get("/api/v1/settings")).json()["data"] == (
        SETTINGS_PAYLOAD
    )


@pytest.mark.asyncio
async def test_put_settings_updates_existing_rows(
    settings_client: httpx.AsyncClient,
) -> None:
    await settings_client.put("/api/v1/settings", json=SETTINGS_PAYLOAD)

    response = await settings_client.put(
        "/api/v1/settings",
        json={**SETTINGS_PAYLOAD, "model": "gpt-5.4-mini"},
    )

    assert response.status_code == 200
    data = (await settings_client.get("/api/v1/settings")).json()["data"]
    assert data["model"] == "gpt-5.4-mini"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "payload",
    [
        {**SETTINGS_PAYLOAD, "model": " "},
        {**SETTINGS_PAYLOAD, "theme": "light"},
    ],
)
async def test_put_settings_validates_request(
    settings_client: httpx.AsyncClient,
    payload: dict[str, str],
) -> None:
    response = await settings_client.put("/api/v1/settings", json=payload)

    assert response.status_code == 400
    assert response.json() == {
        "success": False,
        "message": "Validation Error",
    }
