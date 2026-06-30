import { PrimaryButton } from "./PrimaryButton";

interface ErrorViewProps {
  onRetry: () => void;
}

export function ErrorView({ onRetry }: ErrorViewProps) {
  return (
    <div
      className="rounded-xl border border-[#EF4444] bg-[#1F2937] p-6"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-[#F9FAFB]">
        Something went wrong.
      </h2>
      <p className="mt-2 text-sm text-[#9CA3AF]">
        Home data could not be loaded.
      </p>
      <PrimaryButton className="mt-4" onClick={onRetry}>
        Retry
      </PrimaryButton>
    </div>
  );
}
