import { BaseCard } from "../../components/common/BaseCard";
import { formatJournalDate } from "../../services/journalService";
import type { JournalViewDTO } from "../../types/journal";

interface JournalListProps {
  journals: JournalViewDTO[];
  onSelect: (journalId: number) => void;
  selectedId?: number;
}

export function JournalList({
  journals,
  onSelect,
  selectedId,
}: JournalListProps) {
  return (
    <div className="mt-4 space-y-3">
      {journals.map((journal) => (
        <BaseCard
          className={
            journal.id === selectedId ? "border-[#F9FAFB]" : ""
          }
          key={journal.id}
        >
          <button
            className="w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9FAFB]"
            onClick={() => onSelect(journal.id)}
            type="button"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{journal.ticker}</p>
                <p className="mt-1 text-xs text-[#9CA3AF]">
                  {journal.companyName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#F9FAFB]">{journal.decision}</p>
                <time className="mt-1 block text-xs text-[#9CA3AF]">
                  {formatJournalDate(journal.createdAt)}
                </time>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#9CA3AF]">
              {journal.summary || "No AI Summary Yet."}
            </p>
          </button>
        </BaseCard>
      ))}
    </div>
  );
}
