from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models import WatchlistModel


class WatchlistRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, model: WatchlistModel) -> WatchlistModel:
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return model

    async def get(self, model_id: int) -> WatchlistModel | None:
        return await self.session.get(WatchlistModel, model_id)

    async def list(self) -> list[WatchlistModel]:
        result = await self.session.exec(select(WatchlistModel))
        return list(result.all())

    async def update(self, model: WatchlistModel) -> WatchlistModel:
        managed_model = await self.session.merge(model)
        await self.session.commit()
        await self.session.refresh(managed_model)
        return managed_model

    async def delete(self, model: WatchlistModel) -> None:
        await self.session.delete(model)
        await self.session.commit()
