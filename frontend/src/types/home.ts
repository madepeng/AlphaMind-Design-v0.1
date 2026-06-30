export interface MarketDTO {
  nasdaq: number;
  sp500: number;
  sox: number;
}

export interface HomeEventDTO {
  title: string;
  summary: string;
}

export interface HomeDTO {
  market: MarketDTO;
  events: HomeEventDTO[];
  summary: string;
}
