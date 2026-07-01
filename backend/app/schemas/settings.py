from typing import Literal

from pydantic import BaseModel, field_validator


class SettingsDTO(BaseModel):
    openaiApiKey: str = ""
    model: str = "gpt-5.5"
    theme: Literal["dark"] = "dark"

    @field_validator("model")
    @classmethod
    def validate_model(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("model cannot be empty")
        return value.strip()


class SettingsResponseDTO(BaseModel):
    success: bool = True
    data: SettingsDTO


class SettingsSuccessResponseDTO(BaseModel):
    success: bool = True
