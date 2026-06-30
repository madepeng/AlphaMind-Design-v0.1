from typing import Annotated

from fastapi import APIRouter, Depends

from app.schemas import HomeResponseDTO
from app.services import HomeService

router = APIRouter(prefix="/api/v1", tags=["home"])


@router.get("/home", response_model=HomeResponseDTO)
async def get_home(
    service: Annotated[HomeService, Depends(HomeService)],
) -> HomeResponseDTO:
    data = await service.get_home()
    return HomeResponseDTO(data=data)
