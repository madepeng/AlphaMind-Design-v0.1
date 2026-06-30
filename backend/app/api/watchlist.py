from fastapi import APIRouter, Depends, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database.session import get_session
from app.schemas.watchlist import (
    SuccessResponseDTO,
    WatchlistCreateDTO,
    WatchlistResponseDTO,
)
from app.services.watchlist import WatchlistService

router = APIRouter(prefix="/api/v1/watchlist", tags=["watchlist"])


@router.get("", response_model=WatchlistResponseDTO)
async def get_watchlist(
    session: AsyncSession = Depends(get_session),
) -> WatchlistResponseDTO:
    data = await WatchlistService(session).list_watchlist()
    return WatchlistResponseDTO(data=data)


@router.post(
    "",
    response_model=SuccessResponseDTO,
    status_code=status.HTTP_200_OK,
)
async def add_watchlist_item(
    request: WatchlistCreateDTO,
    session: AsyncSession = Depends(get_session),
) -> SuccessResponseDTO:
    await WatchlistService(session).add(request.ticker)
    return SuccessResponseDTO()


@router.delete("/{ticker}", response_model=SuccessResponseDTO)
async def delete_watchlist_item(
    ticker: str,
    session: AsyncSession = Depends(get_session),
) -> SuccessResponseDTO:
    await WatchlistService(session).delete(ticker)
    return SuccessResponseDTO()
