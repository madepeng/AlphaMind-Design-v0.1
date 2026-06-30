from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database.session import get_session
from app.schemas.journal import (
    JournalCreateDTO,
    JournalDetailResponseDTO,
    JournalListResponseDTO,
    JournalSuccessResponseDTO,
)
from app.services.journal import JournalService

router = APIRouter(prefix="/api/v1/journal", tags=["journal"])


@router.get("", response_model=JournalListResponseDTO)
async def list_journals(
    session: AsyncSession = Depends(get_session),
) -> JournalListResponseDTO:
    data = await JournalService(session).list()
    return JournalListResponseDTO(data=data)


@router.get("/{journal_id}", response_model=JournalDetailResponseDTO)
async def get_journal(
    journal_id: int,
    session: AsyncSession = Depends(get_session),
) -> JournalDetailResponseDTO:
    data = await JournalService(session).detail(journal_id)
    return JournalDetailResponseDTO(data=data)


@router.post("", response_model=JournalSuccessResponseDTO)
async def save_journal(
    request: JournalCreateDTO,
    session: AsyncSession = Depends(get_session),
) -> JournalSuccessResponseDTO:
    await JournalService(session).save(request)
    return JournalSuccessResponseDTO()


@router.delete("/{journal_id}", response_model=JournalSuccessResponseDTO)
async def delete_journal(
    journal_id: int,
    session: AsyncSession = Depends(get_session),
) -> JournalSuccessResponseDTO:
    await JournalService(session).delete(journal_id)
    return JournalSuccessResponseDTO()
