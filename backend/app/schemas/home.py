from typing import Literal

from pydantic import BaseModel


class MarketDTO(BaseModel):
    nasdaq: float
    sp500: float
    sox: float


class HomeEventDTO(BaseModel):
    title: str
    summary: str


class HomeDataDTO(BaseModel):
    market: MarketDTO
    events: list[HomeEventDTO]
    summary: str


class HomeResponseDTO(BaseModel):
    success: Literal[True] = True
    data: HomeDataDTO
