import { BaseCard } from "../common/BaseCard";
import { DangerButton } from "../common/DangerButton";
import type { WatchlistItemDTO } from "../../types/watchlist";

interface CompanyCardProps {
  company: WatchlistItemDTO;
  onDelete: (ticker: string) => void;
  onSelect: (ticker: string) => void;
}

export function CompanyCard({
  company,
  onDelete,
  onSelect,
}: CompanyCardProps) {
  const changeLabel = `${company.change >= 0 ? "+" : ""}${company.change.toFixed(2)}%`;

  return (
    <BaseCard className="group">
      <div
        className="flex cursor-pointer items-center justify-between gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9FAFB]"
        onClick={() => onSelect(company.ticker)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(company.ticker);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="min-w-0">
          <p className="text-lg font-semibold text-[#F9FAFB]">
            {company.ticker}
          </p>
          <p className="mt-1 truncate text-sm text-[#9CA3AF]">
            {company.companyName}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-medium text-[#F9FAFB]">
            ${company.price.toFixed(2)}
          </p>
          <p
            className={`mt-1 text-sm ${
              company.change >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"
            }`}
          >
            {changeLabel}
          </p>
        </div>
        <DangerButton
          aria-label={`Delete ${company.ticker}`}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(company.ticker);
          }}
        >
          Delete
        </DangerButton>
      </div>
    </BaseCard>
  );
}
