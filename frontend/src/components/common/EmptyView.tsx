import { PrimaryButton } from "./PrimaryButton";

interface EmptyViewProps {
  description?: string;
  onRefresh: () => void;
  showRefresh?: boolean;
  title?: string;
}

export function EmptyView({
  description = "Today has no major market events.",
  onRefresh,
  showRefresh = true,
  title = "No data available.",
}: EmptyViewProps) {
  return (
    <div className="rounded-xl border border-dashed border-[#374151] bg-[#1F2937] p-6 text-center">
      <h3 className="text-sm font-medium text-[#F9FAFB]">{title}</h3>
      <p className="mt-2 text-sm text-[#9CA3AF]">{description}</p>
      {showRefresh ? (
        <PrimaryButton className="mt-4" onClick={onRefresh}>
          Refresh
        </PrimaryButton>
      ) : null}
    </div>
  );
}
