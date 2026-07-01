import os
from pathlib import Path


def get_application_data_directory() -> Path:
    configured_path = os.getenv("ALPHAMIND_DATA_DIR")
    if configured_path:
        return Path(configured_path).expanduser().resolve()
    return Path(__file__).resolve().parents[2]


DATABASE_PATH = get_application_data_directory() / "alphamind.db"


def get_database_url(database_path: Path) -> str:
    return f"sqlite+aiosqlite:///{database_path}"
