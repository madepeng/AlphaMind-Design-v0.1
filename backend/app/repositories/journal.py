from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models import JournalModel


class JournalRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, model: JournalModel) -> JournalModel:
        self.session.add(model)
        return model

    async def get(self, model_id: int) -> JournalModel | None:
        return await self.session.get(JournalModel, model_id)

    async def list(self) -> list[JournalModel]:
        result = await self.session.exec(select(JournalModel))
        return list(result.all())

    async def update(self, model: JournalModel) -> JournalModel:
        return await self.session.merge(model)

    async def delete(self, model: JournalModel) -> None:
        await self.session.delete(model)
