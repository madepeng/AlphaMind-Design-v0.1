from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parents[2] / "alphamind.db"


def get_database_url(database_path: Path) -> str:
    return f"sqlite+aiosqlite:///{database_path}"
