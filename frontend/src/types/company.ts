export interface CompanyHeaderDTO {
  ticker: string;
  companyName: string;
  industry: string;
  marketCap: string;
  price: number;
  changePercent: number;
}

export interface CompanyNewsDTO {
  title: string;
  publishedAt: string;
  source: string;
}

export interface CompanyAISummaryDTO {
  summary: string;
  bullCase: string[];
  risk: string[];
  watchItems: string[];
}

export interface CompanyDTO {
  header: CompanyHeaderDTO;
  news: CompanyNewsDTO[];
  aiSummary: CompanyAISummaryDTO;
}
