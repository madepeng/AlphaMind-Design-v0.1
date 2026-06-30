from pydantic import BaseModel, Field, field_validator

from app.schemas.company import CompanyAISummaryDTO


class AnalyzeRequestDTO(BaseModel):
    ticker: str = Field(min_length=1, max_length=10)

    @field_validator("ticker")
    @classmethod
    def validate_ticker(cls, value: str) -> str:
        if value != value.upper() or value != value.strip():
            raise ValueError("ticker must be uppercase")
        return value


class AnalyzeResponseDTO(BaseModel):
    success: bool = True
    data: CompanyAISummaryDTO
