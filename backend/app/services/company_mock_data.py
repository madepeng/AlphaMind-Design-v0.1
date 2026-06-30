from app.schemas.company import (
    CompanyAISummaryDTO,
    CompanyDataDTO,
    CompanyHeaderDTO,
    CompanyNewsDTO,
)

MOCK_NEWS = [
    CompanyNewsDTO(
        title="NVIDIA expands its AI infrastructure platform",
        publishedAt="2026-06-30",
        source="Mock News",
    ),
    CompanyNewsDTO(
        title="Cloud customers continue investing in accelerated computing",
        publishedAt="2026-06-29",
        source="Mock Markets",
    ),
    CompanyNewsDTO(
        title="New product roadmap focuses on computing efficiency",
        publishedAt="2026-06-28",
        source="Mock Technology",
    ),
]

MOCK_AI_SUMMARY = CompanyAISummaryDTO(
    summary=(
        "NVIDIA remains central to accelerated computing infrastructure. "
        "Cloud investment supports demand, while execution, competition, "
        "export restrictions, and customer spending are the factors "
        "to monitor."
    ),
    bullCase=[
        "Demand for accelerated computing remains strong.",
        "The software ecosystem supports customer retention.",
        "New products can improve performance and efficiency.",
    ],
    risk=[
        "Valuation leaves limited room for execution mistakes.",
        "Competition may pressure pricing and market share.",
        "Export restrictions can limit addressable demand.",
    ],
    watchItems=[
        "Next earnings report and forward guidance.",
        "New platform shipment progress.",
        "Cloud customer capital expenditure trends.",
    ],
)

COMPANY_MOCKS = {
    "NVDA": CompanyDataDTO(
        header=CompanyHeaderDTO(
            ticker="NVDA",
            companyName="NVIDIA",
            industry="Semiconductor",
            marketCap="3.8T",
            price=185.23,
            changePercent=1.82,
        ),
        news=MOCK_NEWS,
        aiSummary=MOCK_AI_SUMMARY,
    ),
    "AAPL": CompanyDataDTO(
        header=CompanyHeaderDTO(
            ticker="AAPL",
            companyName="Apple",
            industry="Consumer Electronics",
            marketCap="3.2T",
            price=213.32,
            changePercent=0.84,
        ),
        news=[
            CompanyNewsDTO(
                title="Apple updates its device and services roadmap",
                publishedAt="2026-06-30",
                source="Mock News",
            )
        ],
        aiSummary=CompanyAISummaryDTO(
            summary=(
                "Apple continues to combine a large installed device base "
                "with recurring services revenue. Product demand, ecosystem "
                "engagement, supply-chain execution, and the pace of new "
                "platform adoption remain the main items for research."
            ),
            bullCase=[
                "The installed base supports recurring services demand.",
                "Brand strength supports durable customer retention.",
            ],
            risk=[
                "Hardware replacement cycles can slow.",
                "Regulatory action may affect platform economics.",
            ],
            watchItems=[
                "Next product launch.",
                "Services growth and gross margin.",
            ],
        ),
    ),
    "TSM": CompanyDataDTO(
        header=CompanyHeaderDTO(
            ticker="TSM",
            companyName="TSMC",
            industry="Semiconductor Manufacturing",
            marketCap="1.2T",
            price=226.15,
            changePercent=1.42,
        ),
        news=[
            CompanyNewsDTO(
                title="TSMC advances next-generation manufacturing capacity",
                publishedAt="2026-06-30",
                source="Mock News",
            )
        ],
        aiSummary=CompanyAISummaryDTO(
            summary=(
                "TSMC remains a critical manufacturer for advanced chips. "
                "Demand for leading-edge capacity is constructive, while "
                "capital intensity, geographic expansion, customer mix, and "
                "manufacturing execution remain the key research variables."
            ),
            bullCase=[
                "Leading process technology supports strong demand.",
                "A diverse customer base reduces single-product exposure.",
            ],
            risk=[
                "New facilities require significant capital investment.",
                "Geopolitical uncertainty remains material.",
            ],
            watchItems=[
                "Advanced-node utilization.",
                "Overseas facility ramp progress.",
            ],
        ),
    ),
}


def get_company_mock(ticker: str) -> CompanyDataDTO:
    company = COMPANY_MOCKS.get(ticker)
    if company:
        return company.model_copy(deep=True)

    return CompanyDataDTO(
        header=CompanyHeaderDTO(
            ticker=ticker,
            companyName=ticker,
            industry="Unknown",
            marketCap="N/A",
            price=100.0,
            changePercent=0.0,
        ),
        news=[
            CompanyNewsDTO(
                title=f"{ticker} research update",
                publishedAt="2026-06-30",
                source="Mock News",
            )
        ],
        aiSummary=CompanyAISummaryDTO(
            summary=(
                f"{ticker} is available as a mock research profile. Review "
                "the company context, current operating performance, major "
                "risks, and upcoming public events before forming an "
                "independent investment decision."
            ),
            bullCase=["Further research may identify durable strengths."],
            risk=["Only mock information is available in this version."],
            watchItems=["Review the next public company update."],
        ),
    )
