import { useEffect, useState } from "react";

import { PrimaryButton } from "../../components/common/PrimaryButton";
import { SecondaryButton } from "../../components/common/SecondaryButton";
import { Input } from "../../components/forms/Input";

interface AddDialogProps {
  isSaving: boolean;
  onAdd: (ticker: string) => void;
  onClose: () => void;
}

export function AddDialog({
  isSaving,
  onAdd,
  onClose,
}: AddDialogProps) {
  const [ticker, setTicker] = useState("");

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      aria-labelledby="add-company-title"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#111827]/80"
      role="dialog"
    >
      <div className="w-[440px] rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-xl">
        <h2 className="text-lg font-semibold" id="add-company-title">
          Add Company
        </h2>
        <p className="mt-2 text-sm text-[#9CA3AF]">
          Search by ticker to add a company to your watchlist.
        </p>
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            onAdd(ticker);
          }}
        >
          <label className="text-sm font-medium" htmlFor="ticker-search">
            Ticker
          </label>
          <Input
            autoFocus
            className="mt-2"
            id="ticker-search"
            maxLength={10}
            onChange={(event) => setTicker(event.target.value)}
            placeholder="NVDA"
            value={ticker}
          />
          <div className="mt-6 flex justify-end gap-3">
            <SecondaryButton disabled={isSaving} onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton disabled={isSaving || !ticker.trim()} type="submit">
              {isSaving ? "Adding..." : "Add"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
