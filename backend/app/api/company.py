from fastapi import APIRouter

from app.schemas.company import CompanyResponseDTO
from app.services.company import CompanyService

router = APIRouter(prefix="/api/v1/company", tags=["company"])


@router.get("/{ticker}", response_model=CompanyResponseDTO)
async def get_company(ticker: str) -> CompanyResponseDTO:
    data = await CompanyService().get_company(ticker)
    return CompanyResponseDTO(data=data)
