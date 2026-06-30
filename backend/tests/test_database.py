from collections.abc import AsyncIterator
from pathlib import Path

import pytest
import pytest_asyncio
from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database.database import create_database_engine, initialize_database
from app.models import JournalModel, SettingsModel, WatchlistModel
from app.repositories import (
    JournalRepository,
    SettingsRepository,
    WatchlistRepository,
)


@pytest_asyncio.fixture
async def database(
    tmp_path: Path,
) -> AsyncIterator[tuple[Path, AsyncEngine]]:
    path = tmp_path / "alphamind.db"
    database_engine = create_database_engine(path)
    await initialize_database(database_engine, path)

    yield path, database_engine

    await database_engine.dispose()


@pytest.mark.asyncio
async def test_database_and_tables_are_created(
    database: tuple[Path, AsyncEngine],
) -> None:
    path, database_engine = database

    async with database_engine.connect() as connection:
        table_names = await connection.run_sync(
            lambda sync_connection: inspect(sync_connection).get_table_names()
        )

    assert path.exists()
    assert set(table_names) == {"watchlist", "journal", "settings"}


@pytest.mark.asyncio
async def test_existing_database_is_not_recreated(
    database: tuple[Path, AsyncEngine],
) -> None:
    path, database_engine = database

    async with database_engine.begin() as connection:
        await connection.execute(
            text(
                "INSERT INTO watchlist (ticker, company_name, created_at) "
                "VALUES ('AAPL', 'Apple', CURRENT_TIMESTAMP)"
            )
        )

    await initialize_database(database_engine, path)

    async with database_engine.connect() as connection:
        result = await connection.execute(text("SELECT COUNT(*) FROM watchlist"))

    assert result.scalar_one() == 1


def test_sqlmodel_metadata_matches_database_specification() -> None:
    expected_columns = {
        "watchlist": {"id", "ticker", "company_name", "created_at"},
        "journal": {
            "id",
            "ticker",
            "summary",
            "reason",
            "bull_case",
            "risk",
            "exit_plan",
            "decision",
            "note",
            "created_at",
            "updated_at",
        },
        "settings": {"id", "key", "value", "updated_at"},
    }

    assert set(SQLModel.metadata.tables) == set(expected_columns)

    for table_name, column_names in expected_columns.items():
        assert set(SQLModel.metadata.tables[table_name].columns.keys()) == column_names


@pytest.mark.asyncio
async def test_column_types_nullability_and_indexes_match_specification(
    database: tuple[Path, AsyncEngine],
) -> None:
    _, database_engine = database

    async with database_engine.connect() as connection:
        schemas = await connection.run_sync(_inspect_schema)

    assert schemas["watchlist"]["columns"] == {
        "id": ("INTEGER", False),
        "ticker": ("TEXT", False),
        "company_name": ("TEXT", False),
        "created_at": ("DATETIME", False),
    }
    assert schemas["journal"]["columns"] == {
        "id": ("INTEGER", False),
        "ticker": ("TEXT", False),
        "summary": ("TEXT", False),
        "reason": ("TEXT", False),
        "bull_case": ("TEXT", False),
        "risk": ("TEXT", False),
        "exit_plan": ("TEXT", False),
        "decision": ("TEXT", False),
        "note": ("TEXT", True),
        "created_at": ("DATETIME", False),
        "updated_at": ("DATETIME", False),
    }
    assert schemas["settings"]["columns"] == {
        "id": ("INTEGER", False),
        "key": ("TEXT", False),
        "value": ("TEXT", True),
        "updated_at": ("DATETIME", False),
    }
    assert schemas["watchlist"]["indexes"] == {("ticker",): True}
    assert schemas["journal"]["indexes"] == {
        ("ticker",): False,
        ("created_at",): False,
    }
    assert schemas["settings"]["indexes"] == {("key",): True}


def _inspect_schema(sync_connection):  # type: ignore[no-untyped-def]
    inspector = inspect(sync_connection)
    schema: dict[str, dict[str, object]] = {}

    for table_name in ("watchlist", "journal", "settings"):
        columns = {
            column["name"]: (str(column["type"]), column["nullable"])
            for column in inspector.get_columns(table_name)
        }
        indexes = {
            tuple(index["column_names"]): index["unique"]
            for index in inspector.get_indexes(table_name)
        }
        schema[table_name] = {"columns": columns, "indexes": indexes}

    return schema


@pytest.mark.asyncio
async def test_database_connection_is_available(
    database: tuple[Path, AsyncEngine],
) -> None:
    _, database_engine = database

    async with database_engine.connect() as connection:
        result = await connection.execute(text("SELECT 1"))

    assert result.scalar_one() == 1


@pytest.mark.asyncio
async def test_repositories_can_be_instantiated(
    database: tuple[Path, AsyncEngine],
) -> None:
    _, database_engine = database
    session_factory = async_sessionmaker(
        database_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async with session_factory() as session:
        assert isinstance(WatchlistRepository(session), WatchlistRepository)
        assert isinstance(JournalRepository(session), JournalRepository)
        assert isinstance(SettingsRepository(session), SettingsRepository)


@pytest.mark.asyncio
async def test_repository_crud_interfaces(
    database: tuple[Path, AsyncEngine],
) -> None:
    _, database_engine = database
    session_factory = async_sessionmaker(
        database_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async with session_factory() as session:
        watchlist_repository = WatchlistRepository(session)
        journal_repository = JournalRepository(session)
        settings_repository = SettingsRepository(session)

        watchlist = await watchlist_repository.create(
            WatchlistModel(ticker="AAPL", company_name="Apple")
        )
        journal = await journal_repository.create(
            JournalModel(
                ticker="AAPL",
                summary="Summary",
                reason="Reason",
                bull_case="Bull case",
                risk="Risk",
                exit_plan="Exit plan",
                decision="Watch",
            )
        )
        setting = await settings_repository.create(
            SettingsModel(key="THEME", value="dark")
        )

        assert watchlist.id is not None
        assert journal.id is not None
        assert setting.id is not None
        assert await watchlist_repository.get(watchlist.id) == watchlist
        assert await journal_repository.get(journal.id) == journal
        assert await settings_repository.get(setting.id) == setting
        assert await watchlist_repository.list() == [watchlist]
        assert await journal_repository.list() == [journal]
        assert await settings_repository.list() == [setting]

        watchlist.company_name = "Apple Inc."
        journal.note = "Reviewed"
        setting.value = "dark-mode"

        assert (
            await watchlist_repository.update(watchlist)
        ).company_name == "Apple Inc."
        assert (await journal_repository.update(journal)).note == "Reviewed"
        assert (await settings_repository.update(setting)).value == "dark-mode"

        await watchlist_repository.delete(watchlist)
        await journal_repository.delete(journal)
        await settings_repository.delete(setting)

        assert await watchlist_repository.list() == []
        assert await journal_repository.list() == []
        assert await settings_repository.list() == []
