from app.schemas import HomeDataDTO, HomeEventDTO, MarketDTO


class HomeService:
    async def get_home(self) -> HomeDataDTO:
        return HomeDataDTO(
            market=MarketDTO(
                nasdaq=1.25,
                sp500=0.82,
                sox=2.41,
            ),
            events=[
                HomeEventDTO(
                    title="Micron Earnings",
                    summary="Revenue beat expectations and guidance remained steady.",
                ),
                HomeEventDTO(
                    title="Semiconductor Strength",
                    summary="Chip shares are leading today's broad market advance.",
                ),
                HomeEventDTO(
                    title="Fed Commentary",
                    summary="Policy guidance remains focused on incoming inflation data.",
                ),
            ],
            summary=(
                "Markets are broadly positive today, led by semiconductor strength "
                "after fresh earnings updates. Keep the current research plan, "
                "review chip exposure, and watch for follow-through."
            ),
        )
