import { Skeleton } from "../../components/common/Skeleton";

export function SettingsLoadingView() {
  return (
    <div aria-label="Loading Settings">
      <Skeleton className="h-6 w-28" />
      <Skeleton className="mt-8 h-64 w-full" />
      <Skeleton className="mt-8 h-28 w-full" />
    </div>
  );
}
