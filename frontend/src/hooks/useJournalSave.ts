import { useRef, useState } from "react";

import { saveJournal } from "../services/journalService";
import type { JournalCreateDTO } from "../types/journal";

type JournalSaveStatus = "idle" | "saving" | "error";

export function useJournalSave() {
  const [status, setStatus] = useState<JournalSaveStatus>("idle");
  const isSavingRef = useRef(false);

  const save = async (journal: JournalCreateDTO): Promise<boolean> => {
    if (isSavingRef.current) {
      return false;
    }
    isSavingRef.current = true;
    setStatus("saving");
    try {
      await saveJournal(journal);
      setStatus("idle");
      return true;
    } catch {
      setStatus("error");
      return false;
    } finally {
      isSavingRef.current = false;
    }
  };

  return { save, status };
}
