export type DecisionValue = "Buy" | "Hold" | "Sell" | "Watch";

export interface DecisionFormState {
  reason: string;
  bullCase: string;
  risk: string;
  exitPlan: string;
  decision: DecisionValue;
}

export type DecisionQuestionField =
  | "reason"
  | "bullCase"
  | "risk"
  | "exitPlan";

export type DecisionSaveStatus =
  | "editing"
  | "saving"
  | "success"
  | "error";
