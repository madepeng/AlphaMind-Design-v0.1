from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.exceptions import (
    BusinessException,
    NotFoundException,
    ValidationException,
)
from app.models import WatchlistModel
from app.repositories import WatchlistRepository
from app.schemas.watchlist import WatchlistItemDTO

WATCHLIST_LIMIT = 20

COMPANY_NAMES = {
    "AAPL": "Apple",
    "NVDA": "NVIDIA",
    "TSM": "TSMC",
}

MARKET_MOCKS = {
    "AAPL": (213.32, 0.84),
    "NVDA": (185.20, 2.13),
    "TSM": (226.15, 1.42),
}


class WatchlistService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repository = WatchlistRepository(session)

    async def list_watchlist(self) -> list[WatchlistItemDTO]:
        models = await self.repository.list()
        return [self._to_dto(model) for model in models]

    async def add(self, raw_ticker: str) -> None:
        ticker = self._normalize_ticker(raw_ticker)

        if await self.repository.get_by_ticker(ticker):
            raise BusinessException("Already Exists")
        if await self.repository.count() >= WATCHLIST_LIMIT:
            raise BusinessException("Watchlist Full")

        company_name = COMPANY_NAMES.get(ticker, ticker)
        await self.repository.create(
            WatchlistModel(ticker=ticker, company_name=company_name)
        )
        await self.session.commit()

    async def delete(self, raw_ticker: str) -> None:
        ticker = self._normalize_ticker(raw_ticker)
        model = await self.repository.get_by_ticker(ticker)

        if model is None:
            raise NotFoundException("Not Found")

        await self.repository.delete(model)
        await self.session.commit()

    @staticmethod
    def _normalize_ticker(raw_ticker: str) -> str:
        ticker = raw_ticker.strip().upper()
        if not 1 <= len(ticker) <= 10:
            raise ValidationException("Validation Error")
        return ticker

    @staticmethod
    def _to_dto(model: WatchlistModel) -> WatchlistItemDTO:
        price, change = MARKET_MOCKS.get(model.ticker, (100.0, 0.0))
        return WatchlistItemDTO(
            ticker=model.ticker,
            companyName=model.company_name,
            price=price,
            change=change,
        )
