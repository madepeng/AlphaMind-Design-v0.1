from datetime import datetime

from sqlalchemy import Column, DateTime, Text
from sqlmodel import Field, SQLModel

from app.models.common import utc_now


class WatchlistModel(SQLModel, table=True):
    __tablename__ = "watchlist"

    id: int | None = Field(default=None, primary_key=True)
    ticker: str = Field(
        sa_column=Column(Text, nullable=False, unique=True, index=True)
    )
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
