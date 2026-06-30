import { useCallback, useRef, useState } from "react";

import { analyzeCompany } from "../api/companyApi";
import type { CompanyAISummaryDTO } from "../types/company";

export type CompanyAnalysisState =
  | { status: "idle"; data: CompanyAISummaryDTO }
  | { status: "loading" }
  | { status: "loaded"; data: CompanyAISummaryDTO }
  | { status: "error" };

export function useCompanyAnalysis(
  ticker: string,
  initialAnalysis: CompanyAISummaryDTO,
) {
  const [state, setState] = useState<CompanyAnalysisState>({
    status: "idle",
    data: initialAnalysis,
  });
  const isLoadingRef = useRef(false);

  const analyze = useCallback(async () => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setState({ status: "loading" });
    try {
      const data = await analyzeCompany(ticker);
      setState({ status: "loaded", data });
    } catch {
      setState({ status: "error" });
    } finally {
      isLoadingRef.current = false;
    }
  }, [ticker]);

  return { analyze, state };
}
