const MOCK_NEWS_BASE_URL = "https://example.com/alphamind-news";

const COMPANY_NAMES: Record<string, string> = {
  AAPL: "Apple",
  NVDA: "NVIDIA",
  TSM: "TSMC",
};

export function getMockNewsUrl(ticker: string, title: string): string {
  const query = new URLSearchParams({ ticker, title });
  return `${MOCK_NEWS_BASE_URL}?${query.toString()}`;
}

export function getCompanyName(ticker: string): string {
  return COMPANY_NAMES[ticker] ?? ticker;
}
