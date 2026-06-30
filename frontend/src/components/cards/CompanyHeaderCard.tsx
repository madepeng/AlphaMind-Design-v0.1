import type { CompanyHeaderDTO } from "../../types/company";
import { BaseCard } from "../common/BaseCard";

interface CompanyHeaderCardProps {
  header: CompanyHeaderDTO;
}

export function CompanyHeaderCard({ header }: CompanyHeaderCardProps) {
  const changeLabel = `${header.changePercent >= 0 ? "+" : ""}${header.changePercent.toFixed(2)}%`;

  return (
    <BaseCard>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-2xl font-semibold">{header.ticker}</p>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            {header.companyName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">${header.price.toFixed(2)}</p>
          <p
            className={`mt-1 text-sm ${
              header.changePercent >= 0
                ? "text-[#22C55E]"
                : "text-[#EF4444]"
            }`}
          >
            {changeLabel}
          </p>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[#374151] pt-4">
        <div>
          <dt className="text-xs text-[#9CA3AF]">Industry</dt>
          <dd className="mt-1 text-sm">{header.industry}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#9CA3AF]">Market Cap</dt>
          <dd className="mt-1 text-sm">{header.marketCap}</dd>
        </div>
      </dl>
    </BaseCard>
  );
}
