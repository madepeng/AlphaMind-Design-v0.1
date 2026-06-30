from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


DecisionValue = Literal["Buy", "Hold", "Sell", "Watch"]


class JournalCreateDTO(BaseModel):
    ticker: str = Field(min_length=1, max_length=10)
    summary: str | None = None
    reason: str = Field(min_length=1, max_length=300)
    bullCase: str = Field(min_length=1, max_length=300)
    risk: str = Field(min_length=1, max_length=300)
    exitPlan: str = Field(min_length=1, max_length=300)
    decision: DecisionValue
    note: str | None = None

    @field_validator("ticker")
    @classmethod
    def validate_ticker(cls, value: str) -> str:
        if value != value.upper() or value != value.strip():
            raise ValueError("ticker must be uppercase")
        return value

    @field_validator("reason", "bullCase", "risk", "exitPlan")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("field cannot be empty")
        return value


class JournalDTO(BaseModel):
    id: int
    ticker: str
    summary: str | None
    reason: str
    bullCase: str
    risk: str
    exitPlan: str
    decision: DecisionValue
    note: str | None
    createdAt: datetime
    updatedAt: datetime


class JournalListResponseDTO(BaseModel):
    success: bool = True
    data: list[JournalDTO]


class JournalDetailResponseDTO(BaseModel):
    success: bool = True
    data: JournalDTO


class JournalSuccessResponseDTO(BaseModel):
    success: bool = True
