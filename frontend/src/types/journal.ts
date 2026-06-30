import type { DecisionValue } from "./decision";

export interface JournalDTO {
  id: number;
  ticker: string;
  summary: string | null;
  reason: string;
  bullCase: string;
  risk: string;
  exitPlan: string;
  decision: DecisionValue;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JournalViewDTO extends JournalDTO {
  companyName: string;
}

export interface JournalCreateDTO {
  ticker: string;
  summary: string | null;
  reason: string;
  bullCase: string;
  risk: string;
  exitPlan: string;
  decision: DecisionValue;
  note: string | null;
}
