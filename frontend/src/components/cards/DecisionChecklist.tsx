import type { FormEvent, KeyboardEvent } from "react";

import {
  type DecisionSaveHandler,
  useDecisionChecklist,
} from "../../hooks/useDecisionChecklist";
import type {
  DecisionQuestionField,
  DecisionValue,
} from "../../types/decision";
import { BaseCard } from "../common/BaseCard";
import { PrimaryButton } from "../common/PrimaryButton";
import { Toast } from "../common/Toast";
import { Select } from "../forms/Select";
import { TextArea } from "../forms/TextArea";

const questions = [
  {
    field: "reason",
    label: "Why is this company worth researching today?",
    title: "Why today?",
  },
  {
    field: "bullCase",
    label: "What is the strongest bull case?",
    title: "Bull Case",
  },
  {
    field: "risk",
    label: "What is the biggest risk?",
    title: "Risk",
  },
  {
    field: "exitPlan",
    label: "What will you do if the thesis is wrong?",
    title: "Exit Plan",
  },
] satisfies Array<{
  field: DecisionQuestionField;
  label: string;
  title: string;
}>;

const decisionOptions: DecisionValue[] = [
  "Buy",
  "Hold",
  "Sell",
  "Watch",
];

interface DecisionChecklistProps {
  onSave?: DecisionSaveHandler;
}

export function DecisionChecklist({ onSave }: DecisionChecklistProps) {
  const {
    editDecision,
    editQuestion,
    form,
    isValid,
    save,
    savedDecision,
    status,
  } = useDecisionChecklist(onSave);
  const isSaving = status === "saving";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void save();
  };

  const handleShortcut = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      void save();
    }
  };

  return (
    <BaseCard>
      <form onKeyDown={handleShortcut} onSubmit={handleSubmit}>
        <p className="text-sm text-[#9CA3AF]">
          Complete the five-step research checklist before saving a decision.
        </p>
        <div className="mt-6 space-y-5">
          {questions.map((question, index) => {
            const id = `decision-question-${index + 1}`;
            return (
              <label className="block text-sm font-medium" htmlFor={id} key={id}>
                Question {index + 1} · {question.title}
                <span className="mt-1 block text-xs font-normal text-[#9CA3AF]">
                  {question.label}
                </span>
                <TextArea
                  aria-label={`Question ${index + 1}`}
                  className="mt-2"
                  id={id}
                  maxLength={300}
                  onChange={(event) =>
                    editQuestion(question.field, event.target.value)
                  }
                  required
                  value={form[question.field]}
                />
              </label>
            );
          })}
          <label
            className="block text-sm font-medium"
            htmlFor="decision-select"
          >
            Question 5 · Decision
            <span className="mt-1 block text-xs font-normal text-[#9CA3AF]">
              What is today&apos;s decision?
            </span>
            <Select
              aria-label="Question 5"
              className="mt-2"
              id="decision-select"
              onChange={(event) =>
                editDecision(event.target.value as DecisionValue)
              }
              required
              value={form.decision}
            >
              {decisionOptions.map((decision) => (
                <option key={decision} value={decision}>
                  {decision}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <PrimaryButton
            disabled={!isValid || isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save Decision"}
          </PrimaryButton>
          {status === "success" && savedDecision ? (
            <p className="text-sm text-[#22C55E]" role="status">
              Decision Saved.
            </p>
          ) : null}
        </div>
      </form>
      {status === "error" ? (
        <Toast message="Failed to save." tone="error" />
      ) : null}
    </BaseCard>
  );
}
