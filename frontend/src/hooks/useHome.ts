import { useEffect, useState } from "react";

import { getHome } from "../api/homeApi";
import type { HomeDTO } from "../types/home";

type HomeState =
  | { status: "loading" }
  | { status: "loaded"; data: HomeDTO }
  | { status: "error" };

export function useHome() {
  const [state, setState] = useState<HomeState>({ status: "loading" });
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let isActive = true;

    getHome()
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
  }, [requestId]);

  const retry = () => {
    setState({ status: "loading" });
    setRequestId((currentRequestId) => currentRequestId + 1);
  };

  return { state, retry };
}
