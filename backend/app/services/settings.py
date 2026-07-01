from sqlmodel.ext.asyncio.session import AsyncSession

from app.models import SettingsModel
from app.models.common import utc_now
from app.repositories import SettingsRepository
from app.schemas.settings import SettingsDTO

OPENAI_API_KEY = "OPENAI_API_KEY"
OPENAI_MODEL = "OPENAI_MODEL"
THEME = "THEME"


class SettingsService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repository = SettingsRepository(session)

    async def get(self) -> SettingsDTO:
        models = await self.repository.list()
        values = {model.key: model.value for model in models}
        return SettingsDTO(
            openaiApiKey=values.get(OPENAI_API_KEY) or "",
            model=values.get(OPENAI_MODEL) or "gpt-5.5",
            theme="dark",
        )

    async def save(self, request: SettingsDTO) -> None:
        await self._upsert(OPENAI_API_KEY, request.openaiApiKey)
        await self._upsert(OPENAI_MODEL, request.model)
        await self._upsert(THEME, request.theme)
        await self.session.commit()

    async def _upsert(self, key: str, value: str) -> None:
        model = await self.repository.get_by_key(key)
        if model is None:
            await self.repository.create(
                SettingsModel(key=key, value=value or None)
            )
            return

        model.value = value or None
        model.updated_at = utc_now()
        await self.repository.update(model)
