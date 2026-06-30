import { BaseCard } from "../../components/common/BaseCard";
import { DangerButton } from "../../components/common/DangerButton";
import { formatJournalDate } from "../../services/journalService";
import type { JournalViewDTO } from "../../types/journal";

interface JournalDetailProps {
  journal: JournalViewDTO;
  onDelete: () => void;
}

const detailFields = [
  ["Question 1 · Why today?", "reason"],
  ["Question 2 · Bull Case", "bullCase"],
  ["Question 3 · Risk", "risk"],
  ["Question 4 · Exit Plan", "exitPlan"],
] as const;

export function JournalDetail({
  journal,
  onDelete,
}: JournalDetailProps) {
  return (
    <section aria-labelledby="journal-detail-heading">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">
            Journal Detail
          </p>
          <h2 className="mt-2 text-lg font-semibold" id="journal-detail-heading">
            {journal.ticker} · {journal.companyName}
          </h2>
          <time className="mt-1 block text-xs text-[#9CA3AF]">
            {formatJournalDate(journal.createdAt)}
          </time>
        </div>
        <DangerButton
          aria-label={`Delete ${journal.ticker} journal`}
          className="opacity-100"
          onClick={onDelete}
        >
          Delete
        </DangerButton>
      </div>

      <div className="mt-6 space-y-4">
        <BaseCard>
          <h3 className="text-sm font-medium">AI Summary</h3>
          <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">
            {journal.summary || "No AI Summary Yet."}
          </p>
        </BaseCard>
        {detailFields.map(([label, field]) => (
          <BaseCard key={field}>
            <h3 className="text-sm font-medium">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">
              {journal[field]}
            </p>
          </BaseCard>
        ))}
        <BaseCard>
          <h3 className="text-sm font-medium">Decision</h3>
          <p className="mt-2 text-sm text-[#9CA3AF]">{journal.decision}</p>
        </BaseCard>
        <BaseCard>
          <h3 className="text-sm font-medium">Note</h3>
          <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">
            {journal.note || "No note."}
          </p>
        </BaseCard>
      </div>
    </section>
  );
}
