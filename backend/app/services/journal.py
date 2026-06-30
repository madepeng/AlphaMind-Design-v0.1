from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.exceptions import NotFoundException
from app.models import JournalModel
from app.repositories import JournalRepository
from app.schemas.journal import JournalCreateDTO, JournalDTO


class JournalService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repository = JournalRepository(session)

    async def list(self) -> list[JournalDTO]:
        models = await self.repository.list()
        return [self._to_dto(model) for model in models]

    async def detail(self, journal_id: int) -> JournalDTO:
        model = await self.repository.get(journal_id)
        if model is None:
            raise NotFoundException("Not Found")
        return self._to_dto(model)

    async def save(self, request: JournalCreateDTO) -> None:
        await self.repository.create(
            JournalModel(
                ticker=request.ticker,
                summary=request.summary,
                reason=request.reason,
                bull_case=request.bullCase,
                risk=request.risk,
                exit_plan=request.exitPlan,
                decision=request.decision,
                note=request.note,
            )
        )
        await self.session.commit()

    async def delete(self, journal_id: int) -> None:
        model = await self.repository.get(journal_id)
        if model is None:
            raise NotFoundException("Not Found")
        await self.repository.delete(model)
        await self.session.commit()

    @staticmethod
    def _to_dto(model: JournalModel) -> JournalDTO:
        if model.id is None:
            raise ValueError("Journal must be persisted before serialization")
        return JournalDTO(
            id=model.id,
            ticker=model.ticker,
            summary=model.summary,
            reason=model.reason,
            bullCase=model.bull_case,
            risk=model.risk,
            exitPlan=model.exit_plan,
            decision=model.decision,
            note=model.note,
            createdAt=model.created_at,
            updatedAt=model.updated_at,
        )
