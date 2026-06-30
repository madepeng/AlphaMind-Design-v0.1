import { useCallback, useEffect, useState } from "react";

import {
  loadJournal,
  loadJournals,
  removeJournal,
} from "../services/journalService";
import type { JournalViewDTO } from "../types/journal";

type DetailState =
  | { status: "empty" }
  | { status: "loading" }
  | { status: "loaded"; data: JournalViewDTO }
  | { status: "error" };

type JournalState =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "loaded";
      journals: JournalViewDTO[];
      detail: DetailState;
    };

export function useJournal() {
  const [state, setState] = useState<JournalState>({ status: "loading" });
  const [requestId, setRequestId] = useState(0);

  const load = useCallback(async () => {
    const journals = await loadJournals();
    if (journals.length === 0) {
      setState({
        status: "loaded",
        journals,
        detail: { status: "empty" },
      });
      return;
    }
    const detail = await loadJournal(journals[0].id);
    setState({
      status: "loaded",
      journals,
      detail: { status: "loaded", data: detail },
    });
  }, []);

  useEffect(() => {
    let isActive = true;
    loadJournals()
      .then(async (journals) => {
        if (journals.length === 0) {
          if (isActive) {
            setState({
              status: "loaded",
              journals,
              detail: { status: "empty" },
            });
          }
          return;
        }
        const detail = await loadJournal(journals[0].id);
        if (isActive) {
          setState({
            status: "loaded",
            journals,
            detail: { status: "loaded", data: detail },
          });
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
  }, [load, requestId]);

  const retry = () => {
    setState({ status: "loading" });
    setRequestId((current) => current + 1);
  };

  const select = async (journalId: number) => {
    if (state.status !== "loaded") {
      return;
    }
    setState({ ...state, detail: { status: "loading" } });
    try {
      const detail = await loadJournal(journalId);
      setState((current) =>
        current.status === "loaded"
          ? { ...current, detail: { status: "loaded", data: detail } }
          : current,
      );
    } catch {
      setState((current) =>
        current.status === "loaded"
          ? { ...current, detail: { status: "error" } }
          : current,
      );
    }
  };

  const remove = async (journalId: number) => {
    await removeJournal(journalId);
    await load();
  };

  return { remove, retry, select, state };
}
