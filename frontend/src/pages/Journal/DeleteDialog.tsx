import { useEffect } from "react";

import { DangerButton } from "../../components/common/DangerButton";
import { SecondaryButton } from "../../components/common/SecondaryButton";

interface DeleteDialogProps {
  isDeleting: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

export function DeleteDialog({
  isDeleting,
  onCancel,
  onDelete,
}: DeleteDialogProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isDeleting, onCancel]);

  return (
    <div
      aria-labelledby="delete-journal-title"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#111827]/80"
      role="dialog"
    >
      <div className="w-[420px] rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-xl">
        <h2 className="text-lg font-semibold" id="delete-journal-title">
          Delete this journal?
        </h2>
        <p className="mt-2 text-sm text-[#9CA3AF]">
          This research record will be permanently removed.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton disabled={isDeleting} onClick={onCancel}>
            Cancel
          </SecondaryButton>
          <DangerButton
            className="opacity-100"
            disabled={isDeleting}
            onClick={onDelete}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </DangerButton>
        </div>
      </div>
    </div>
  );
}
