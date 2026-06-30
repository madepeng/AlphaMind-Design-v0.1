import { useEffect, useState } from "react";

import { getCompany } from "../api/companyApi";
import type { CompanyDTO } from "../types/company";

type CompanyState =
  | { status: "loading" }
  | { status: "loaded"; data: CompanyDTO }
  | { status: "error" };

export function useCompany(ticker: string) {
  const [state, setState] = useState<CompanyState>({ status: "loading" });
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let isActive = true;

    getCompany(ticker)
      .then((data) => {
        if (isActive) {
          setState({ status: "loaded", data });
        }
      })
      .catch(() => {
        if (isActive) {
          setState({ status: "error" });
        }
      });

    return () => {
      isActive = false;
    };
  }, [requestId, ticker]);

  const retry = () => {
    setState({ status: "loading" });
    setRequestId((current) => current + 1);
  };

  return { retry, state };
}
