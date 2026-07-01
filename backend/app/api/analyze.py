from fastapi import APIRouter, Depends

from app.ai import AIService
from app.database.session import get_session
from app.repositories import SettingsRepository
from app.schemas.ai import AnalyzeRequestDTO, AnalyzeResponseDTO
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter(prefix="/api/v1/analyze", tags=["ai"])


def get_ai_service(
    session: AsyncSession = Depends(get_session),
) -> AIService:
    return AIService(settings_repository=SettingsRepository(session))


@router.post("", response_model=AnalyzeResponseDTO)
async def analyze_company(
    request: AnalyzeRequestDTO,
    service: AIService = Depends(get_ai_service),
) -> AnalyzeResponseDTO:
    data = await service.CompanyAnalysis(request.ticker)
    return AnalyzeResponseDTO(data=data)
