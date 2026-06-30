from sqlmodel import col, func, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models import WatchlistModel


class WatchlistRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, model: WatchlistModel) -> WatchlistModel:
        self.session.add(model)
        return model

    async def get(self, model_id: int) -> WatchlistModel | None:
        return await self.session.get(WatchlistModel, model_id)

    async def get_by_ticker(self, ticker: str) -> WatchlistModel | None:
        statement = select(WatchlistModel).where(
            WatchlistModel.ticker == ticker
        )
        result = await self.session.exec(statement)
        return result.first()

    async def list(self) -> list[WatchlistModel]:
        statement = select(WatchlistModel).order_by(
            col(WatchlistModel.created_at)
        )
        result = await self.session.exec(statement)
        return list(result.all())

    async def count(self) -> int:
        result = await self.session.exec(
            select(func.count()).select_from(WatchlistModel)
        )
        return result.one()

    async def update(self, model: WatchlistModel) -> WatchlistModel:
        return await self.session.merge(model)

    async def delete(self, model: WatchlistModel) -> None:
        await self.session.delete(model)
