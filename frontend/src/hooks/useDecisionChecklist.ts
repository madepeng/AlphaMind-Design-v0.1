import { useCallback, useMemo, useRef, useState } from "react";

import { saveDecisionLocally } from "../services/decisionService";
import type {
  DecisionFormState,
  DecisionQuestionField,
  DecisionSaveStatus,
  DecisionValue,
} from "../types/decision";

export type DecisionSaveHandler = (
  decision: DecisionFormState,
) => Promise<void>;

const INITIAL_DECISION: DecisionFormState = {
  reason: "",
  bullCase: "",
  risk: "",
  exitPlan: "",
  decision: "Watch",
};

export function useDecisionChecklist(
  onSave: DecisionSaveHandler = saveDecisionLocally,
) {
  const [form, setForm] = useState<DecisionFormState>(INITIAL_DECISION);
  const [savedDecision, setSavedDecision] =
    useState<DecisionFormState | null>(null);
  const [status, setStatus] = useState<DecisionSaveStatus>("editing");
  const isSavingRef = useRef(false);

  const isValid = useMemo(
    () =>
      form.reason.trim().length > 0 &&
      form.bullCase.trim().length > 0 &&
      form.risk.trim().length > 0 &&
      form.exitPlan.trim().length > 0 &&
      ["Buy", "Hold", "Sell", "Watch"].includes(form.decision),
    [form],
  );

  const editQuestion = (
    field: DecisionQuestionField,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("editing");
  };

  const editDecision = (decision: DecisionValue) => {
    setForm((current) => ({ ...current, decision }));
    setStatus("editing");
  };

  const save = useCallback(async () => {
    if (!isValid || isSavingRef.current) {
      return;
    }

    isSavingRef.current = true;
    setStatus("saving");

    try {
      await onSave(form);
      setSavedDecision({ ...form });
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      isSavingRef.current = false;
    }
  }, [form, isValid, onSave]);

  return {
    editDecision,
    editQuestion,
    form,
    isValid,
    save,
    savedDecision,
    status,
  };
}
