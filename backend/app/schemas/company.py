from pydantic import BaseModel


class CompanyHeaderDTO(BaseModel):
    ticker: str
    companyName: str
    industry: str
    marketCap: str
    price: float
    changePercent: float


class CompanyNewsDTO(BaseModel):
    title: str
    publishedAt: str
    source: str


class CompanyAISummaryDTO(BaseModel):
    summary: str
    bullCase: list[str]
    risk: list[str]
    watchItems: list[str]


class CompanyDataDTO(BaseModel):
    header: CompanyHeaderDTO
    news: list[CompanyNewsDTO]
    aiSummary: CompanyAISummaryDTO


class CompanyResponseDTO(BaseModel):
    success: bool = True
    data: CompanyDataDTO
