from app.core.exceptions import ValidationException
from app.schemas.company import CompanyDataDTO
from app.services.company_mock_data import get_company_mock


class CompanyService:
    async def get_company(self, raw_ticker: str) -> CompanyDataDTO:
        ticker = self._normalize_ticker(raw_ticker)
        return get_company_mock(ticker)

    @staticmethod
    def _normalize_ticker(raw_ticker: str) -> str:
        ticker = raw_ticker.strip().upper()
        if not 1 <= len(ticker) <= 10:
            raise ValidationException("Validation Error")
        return ticker
