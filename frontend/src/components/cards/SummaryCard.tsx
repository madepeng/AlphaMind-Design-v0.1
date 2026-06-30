import { BaseCard } from "../common/BaseCard";

interface SummaryCardProps {
  summary: string;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <BaseCard>
      <p className="text-sm leading-6 text-[#F9FAFB]">{summary}</p>
    </BaseCard>
  );
}
