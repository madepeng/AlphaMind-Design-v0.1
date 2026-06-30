import { useCallback, useEffect, useState } from "react";

import {
  addWatchlistItem,
  deleteWatchlistItem,
  getWatchlist,
} from "../api/watchlistApi";
import type { WatchlistItemDTO } from "../types/watchlist";

type WatchlistState =
  | { status: "loading" }
  | { status: "loaded"; data: WatchlistItemDTO[] }
  | { status: "error" };

export function useWatchlist() {
  const [state, setState] = useState<WatchlistState>({ status: "loading" });
  const [requestId, setRequestId] = useState(0);

  const load = useCallback(async () => {
    const data = await getWatchlist();
    setState({ status: "loaded", data });
  }, []);

  useEffect(() => {
    let isActive = true;

    getWatchlist()
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
    setRequestId((current) => current + 1);
  };

  const add = async (ticker: string) => {
    await addWatchlistItem(ticker);
    await load();
  };

  const remove = async (ticker: string) => {
    await deleteWatchlistItem(ticker);
    await load();
  };

  return { add, remove, retry, state };
}
