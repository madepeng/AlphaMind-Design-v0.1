from datetime import datetime

from sqlalchemy import Column, DateTime, Text
from sqlmodel import Field, SQLModel

from app.models.common import utc_now


class JournalModel(SQLModel, table=True):
    __tablename__ = "journal"

    id: int | None = Field(default=None, primary_key=True)
    ticker: str = Field(sa_column=Column(Text, nullable=False, index=True))
    summary: str = Field(sa_column=Column(Text, nullable=False))
    reason: str = Field(sa_column=Column(Text, nullable=False))
    bull_case: str = Field(sa_column=Column(Text, nullable=False))
    risk: str = Field(sa_column=Column(Text, nullable=False))
    exit_plan: str = Field(sa_column=Column(Text, nullable=False))
    decision: str = Field(sa_column=Column(Text, nullable=False))
    note: str | None = Field(
        default=None,
        sa_column=Column(Text, nullable=True),
    )
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            index=True,
        ),
    )
    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
