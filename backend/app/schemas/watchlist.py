from pydantic import BaseModel, ConfigDict


class WatchlistCreateDTO(BaseModel):
    ticker: str


class WatchlistItemDTO(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    ticker: str
    companyName: str
    price: float
    change: float


class WatchlistResponseDTO(BaseModel):
    success: bool = True
    data: list[WatchlistItemDTO]


class SuccessResponseDTO(BaseModel):
    success: bool = True
