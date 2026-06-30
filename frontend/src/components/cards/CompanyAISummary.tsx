import type { CompanyAISummaryDTO } from "../../types/company";
import { BaseCard } from "../common/BaseCard";

interface CompanyAISummaryProps {
  analysis: CompanyAISummaryDTO;
}

const listSections = [
  { key: "bullCase", title: "Bull Case" },
  { key: "risk", title: "Risk" },
  { key: "watchItems", title: "Watch Items" },
] as const;

export function CompanyAISummary({
  analysis,
}: CompanyAISummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <BaseCard className="col-span-3">
        <h3 className="text-sm font-semibold">Summary</h3>
        <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">
          {analysis.summary}
        </p>
      </BaseCard>
      {listSections.map((section) => (
        <BaseCard key={section.key}>
          <h3 className="text-sm font-semibold">{section.title}</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#9CA3AF]">
            {analysis[section.key].slice(0, 3).map((item) => (
              <li className="flex gap-2" key={item}>
                <span aria-hidden="true">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </BaseCard>
      ))}
    </div>
  );
}
