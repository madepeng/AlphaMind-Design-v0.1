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


JOURNAL_PAYLOAD = {
    "ticker": "NVDA",
    "summary": None,
    "reason": "Review earnings.",
    "bullCase": "Demand remains strong.",
    "risk": "Competition may increase.",
    "exitPlan": "Reassess after the next report.",
    "decision": "Hold",
    "note": None,
}


@pytest_asyncio.fixture
async def journal_client(tmp_path: Path) -> AsyncIterator[httpx.AsyncClient]:
    path = tmp_path / "journal.db"
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
async def test_post_and_list_journals_match_api_spec(
    journal_client: httpx.AsyncClient,
) -> None:
    response = await journal_client.post(
        "/api/v1/journal",
        json=JOURNAL_PAYLOAD,
    )

    assert response.status_code == 200
    assert response.json() == {"success": True}

    items = (await journal_client.get("/api/v1/journal")).json()["data"]
    assert len(items) == 1
    assert items[0]["ticker"] == "NVDA"
    assert items[0]["summary"] is None
    assert items[0]["bullCase"] == JOURNAL_PAYLOAD["bullCase"]
    assert items[0]["exitPlan"] == JOURNAL_PAYLOAD["exitPlan"]
    assert set(items[0]) == {
        "id",
        "ticker",
        "summary",
        "reason",
        "bullCase",
        "risk",
        "exitPlan",
        "decision",
        "note",
        "createdAt",
        "updatedAt",
    }


@pytest.mark.asyncio
async def test_post_persists_confirmed_ai_summary(
    journal_client: httpx.AsyncClient,
) -> None:
    summary = "User-confirmed AI summary."

    response = await journal_client.post(
        "/api/v1/journal",
        json={**JOURNAL_PAYLOAD, "summary": summary},
    )

    assert response.status_code == 200
    items = (await journal_client.get("/api/v1/journal")).json()["data"]
    assert items[0]["summary"] == summary


@pytest.mark.asyncio
async def test_get_journal_detail(
    journal_client: httpx.AsyncClient,
) -> None:
    await journal_client.post("/api/v1/journal", json=JOURNAL_PAYLOAD)
    journal_id = (await journal_client.get("/api/v1/journal")).json()["data"][
        0
    ]["id"]

    response = await journal_client.get(f"/api/v1/journal/{journal_id}")

    assert response.status_code == 200
    assert response.json()["data"]["reason"] == JOURNAL_PAYLOAD["reason"]
    assert response.json()["data"]["decision"] == "Hold"


@pytest.mark.asyncio
async def test_list_is_newest_first(
    journal_client: httpx.AsyncClient,
) -> None:
    await journal_client.post("/api/v1/journal", json=JOURNAL_PAYLOAD)
    await journal_client.post(
        "/api/v1/journal",
        json={**JOURNAL_PAYLOAD, "ticker": "AAPL"},
    )

    items = (await journal_client.get("/api/v1/journal")).json()["data"]

    assert [item["ticker"] for item in items] == ["AAPL", "NVDA"]


@pytest.mark.asyncio
async def test_delete_journal(
    journal_client: httpx.AsyncClient,
) -> None:
    await journal_client.post("/api/v1/journal", json=JOURNAL_PAYLOAD)
    journal_id = (await journal_client.get("/api/v1/journal")).json()["data"][
        0
    ]["id"]

    response = await journal_client.delete(f"/api/v1/journal/{journal_id}")

    assert response.status_code == 200
    assert response.json() == {"success": True}
    assert (await journal_client.get("/api/v1/journal")).json()["data"] == []


@pytest.mark.asyncio
async def test_missing_journal_returns_not_found(
    journal_client: httpx.AsyncClient,
) -> None:
    response = await journal_client.get("/api/v1/journal/999")

    assert response.status_code == 404
    assert response.json() == {"success": False, "message": "Not Found"}


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("ticker", "nvda"),
        ("decision", "Maybe"),
        ("reason", "   "),
    ],
)
async def test_post_validates_journal(
    journal_client: httpx.AsyncClient,
    field: str,
    value: str,
) -> None:
    response = await journal_client.post(
        "/api/v1/journal",
        json={**JOURNAL_PAYLOAD, field: value},
    )

    assert response.status_code == 400
    assert response.json() == {
        "success": False,
        "message": "Validation Error",
    }
