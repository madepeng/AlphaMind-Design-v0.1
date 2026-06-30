const MOCK_NEWS_BASE_URL = "https://example.com/alphamind-news";

export function getMockNewsUrl(ticker: string, title: string): string {
  const query = new URLSearchParams({ ticker, title });
  return `${MOCK_NEWS_BASE_URL}?${query.toString()}`;
}
