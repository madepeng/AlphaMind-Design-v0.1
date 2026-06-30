import { Skeleton } from "../../components/common/Skeleton";

export function CompanyLoadingView() {
  return (
    <div aria-label="Loading Company">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="mt-6 h-44 w-full" />
      <Skeleton className="mt-8 h-6 w-32" />
      <div className="mt-4 space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="mt-8 h-56 w-full" />
    </div>
  );
}

export function CompanySummaryLoadingView() {
  return (
    <div aria-label="Loading Company AI Summary">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="mt-4 h-48 w-full" />
    </div>
  );
}
