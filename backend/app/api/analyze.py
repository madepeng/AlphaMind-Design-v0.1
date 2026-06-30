from fastapi import APIRouter, Depends

from app.ai import AIService
from app.schemas.ai import AnalyzeRequestDTO, AnalyzeResponseDTO

router = APIRouter(prefix="/api/v1/analyze", tags=["ai"])


def get_ai_service() -> AIService:
    return AIService()


@router.post("", response_model=AnalyzeResponseDTO)
async def analyze_company(
    request: AnalyzeRequestDTO,
    service: AIService = Depends(get_ai_service),
) -> AnalyzeResponseDTO:
    data = await service.CompanyAnalysis(request.ticker)
    return AnalyzeResponseDTO(data=data)
