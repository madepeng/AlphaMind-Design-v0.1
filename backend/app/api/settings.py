from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database.session import get_session
from app.schemas.settings import (
    SettingsDTO,
    SettingsResponseDTO,
    SettingsSuccessResponseDTO,
)
from app.services import SettingsService

router = APIRouter(prefix="/api/v1/settings", tags=["settings"])


@router.get("", response_model=SettingsResponseDTO)
async def get_settings(
    session: AsyncSession = Depends(get_session),
) -> SettingsResponseDTO:
    data = await SettingsService(session).get()
    return SettingsResponseDTO(data=data)


@router.put("", response_model=SettingsSuccessResponseDTO)
async def save_settings(
    request: SettingsDTO,
    session: AsyncSession = Depends(get_session),
) -> SettingsSuccessResponseDTO:
    await SettingsService(session).save(request)
    return SettingsSuccessResponseDTO()
