import { BaseCard } from "../common/BaseCard";

interface MarketCardProps {
  change: number;
  name: string;
  updatedAt: string;
}

export function MarketCard({ change, name, updatedAt }: MarketCardProps) {
  const isPositive = change >= 0;
  const formattedChange = `${isPositive ? "+" : ""}${change.toFixed(2)}%`;

  return (
    <BaseCard>
      <p className="text-sm text-[#9CA3AF]">{name}</p>
      <p
        className={`mt-3 text-2xl font-semibold ${
          isPositive ? "text-[#22C55E]" : "text-[#EF4444]"
        }`}
      >
        {formattedChange}
      </p>
      <p className="mt-3 text-xs text-[#9CA3AF]">{updatedAt}</p>
    </BaseCard>
  );
}
