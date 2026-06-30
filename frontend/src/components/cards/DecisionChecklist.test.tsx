import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { DecisionSaveHandler } from "../../hooks/useDecisionChecklist";
import { DecisionChecklist } from "./DecisionChecklist";

afterEach(cleanup);

function completeChecklist() {
  for (let index = 1; index <= 4; index += 1) {
    fireEvent.change(screen.getByLabelText(`Question ${index}`), {
      target: { value: `Answer ${index}` },
    });
  }
  fireEvent.change(screen.getByLabelText("Question 5"), {
    target: { value: "Hold" },
  });
}

function deferredSave() {
  let resolvePromise: () => void = () => undefined;
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });
  return { promise, resolve: resolvePromise };
}

describe("DecisionChecklist", () => {
  it("keeps Save disabled until every question is complete", () => {
    render(<DecisionChecklist />);

    const saveButton = screen.getByRole("button", {
      name: "Save Decision",
    });

    expect(screen.getByLabelText("Question 5")).toHaveValue("Watch");
    expect(saveButton).toBeDisabled();

    completeChecklist();

    expect(saveButton).toBeEnabled();
  });

  it("enforces the 300 character question limit", () => {
    render(<DecisionChecklist />);

    expect(screen.getByLabelText("Question 1")).toHaveAttribute(
      "maxlength",
      "300",
    );
  });

  it("shows Saving, blocks duplicate submissions, and succeeds locally", async () => {
    const pending = deferredSave();
    const onSave = vi.fn<DecisionSaveHandler>(() => pending.promise);
    render(<DecisionChecklist onSave={onSave} />);
    completeChecklist();

    fireEvent.click(screen.getByRole("button", { name: "Save Decision" }));

    const savingButton = screen.getByRole("button", { name: "Saving..." });
    expect(savingButton).toBeDisabled();
    fireEvent.click(savingButton);
    expect(onSave).toHaveBeenCalledTimes(1);

    pending.resolve();

    expect(await screen.findByText("Decision Saved.")).toBeInTheDocument();
    expect(screen.queryByText("View Journal")).not.toBeInTheDocument();
  });

  it("returns to Editing when a saved answer changes", async () => {
    render(<DecisionChecklist />);
    completeChecklist();
    fireEvent.click(screen.getByRole("button", { name: "Save Decision" }));
    expect(await screen.findByText("Decision Saved.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Question 1"), {
      target: { value: "Updated answer" },
    });

    expect(screen.queryByText("Decision Saved.")).not.toBeInTheDocument();
  });

  it("shows an Error and allows retry after a local save failure", async () => {
    const onSave = vi
      .fn<DecisionSaveHandler>()
      .mockRejectedValueOnce(new Error("Local failure"))
      .mockResolvedValueOnce();
    render(<DecisionChecklist onSave={onSave} />);
    completeChecklist();

    fireEvent.click(screen.getByRole("button", { name: "Save Decision" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to save.",
    );
    expect(
      screen.getByRole("button", { name: "Save Decision" }),
    ).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Save Decision" }));

    expect(await screen.findByText("Decision Saved.")).toBeInTheDocument();
    expect(onSave).toHaveBeenCalledTimes(2);
  });

  it("saves a valid form with Ctrl + Enter", async () => {
    const onSave = vi.fn<DecisionSaveHandler>().mockResolvedValue();
    render(<DecisionChecklist onSave={onSave} />);
    completeChecklist();

    fireEvent.keyDown(screen.getByLabelText("Question 4"), {
      ctrlKey: true,
      key: "Enter",
    });

    expect(await screen.findByText("Decision Saved.")).toBeInTheDocument();
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
