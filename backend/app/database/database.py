from pathlib import Path

import structlog
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlmodel import SQLModel

from app.database.config import DATABASE_PATH, get_database_url
from app.models import JournalModel, SettingsModel, WatchlistModel

logger = structlog.get_logger()

REGISTERED_MODELS = (WatchlistModel, JournalModel, SettingsModel)


def create_database_engine(path: Path) -> AsyncEngine:
    return create_async_engine(get_database_url(path), echo=False)


engine = create_database_engine(DATABASE_PATH)


async def initialize_database(
    database_engine: AsyncEngine = engine,
    path: Path = DATABASE_PATH,
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    database_exists = path.exists()

    async with database_engine.begin() as connection:
        await connection.run_sync(SQLModel.metadata.create_all)

    logger.info(
        "database_initialized",
        created=not database_exists,
        path=str(path),
        tables=[model.__tablename__ for model in REGISTERED_MODELS],
    )
