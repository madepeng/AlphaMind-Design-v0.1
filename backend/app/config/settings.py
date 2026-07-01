import os
from functools import lru_cache
from pathlib import Path

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

REPOSITORY_ROOT = Path(__file__).resolve().parents[3]
ENV_FILE = (
    Path(os.environ["ALPHAMIND_DATA_DIR"]).expanduser().resolve() / ".env"
    if os.getenv("ALPHAMIND_DATA_DIR")
    else REPOSITORY_ROOT / ".env"
)


class AppSettings(BaseSettings):
    openai_api_key: SecretStr | None = None
    openai_model: str = "gpt-5.5"

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> AppSettings:
    return AppSettings()
