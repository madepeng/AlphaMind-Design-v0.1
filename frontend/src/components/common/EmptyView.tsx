import { PrimaryButton } from "./PrimaryButton";

interface EmptyViewProps {
  description?: string;
  onRefresh: () => void;
}

export function EmptyView({
  description = "Today has no major market events.",
  onRefresh,
}: EmptyViewProps) {
  return (
    <div className="rounded-xl border border-dashed border-[#374151] bg-[#1F2937] p-6 text-center">
      <h3 className="text-sm font-medium text-[#F9FAFB]">No data available.</h3>
      <p className="mt-2 text-sm text-[#9CA3AF]">{description}</p>
      <PrimaryButton className="mt-4" onClick={onRefresh}>
        Refresh
      </PrimaryButton>
    </div>
  );
}
