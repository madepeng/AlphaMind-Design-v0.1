from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models import SettingsModel


class SettingsRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, model: SettingsModel) -> SettingsModel:
        self.session.add(model)
        return model

    async def get(self, model_id: int) -> SettingsModel | None:
        return await self.session.get(SettingsModel, model_id)

    async def list(self) -> list[SettingsModel]:
        result = await self.session.exec(select(SettingsModel))
        return list(result.all())

    async def update(self, model: SettingsModel) -> SettingsModel:
        return await self.session.merge(model)

    async def delete(self, model: SettingsModel) -> None:
        await self.session.delete(model)
