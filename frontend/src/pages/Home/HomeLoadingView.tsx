import { Skeleton } from "../../components/common/Skeleton";

export function HomeLoadingView() {
  return (
    <div aria-label="Loading Home dashboard">
      <Skeleton className="h-7 w-40" />
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[0, 1, 2].map((item) => (
          <Skeleton className="h-32" key={item} />
        ))}
      </div>
      <Skeleton className="mt-10 h-6 w-36" />
      <div className="mt-4 space-y-4">
        {[0, 1, 2].map((item) => (
          <Skeleton className="h-24" key={item} />
        ))}
      </div>
    </div>
  );
}

export function SummaryLoadingView() {
  return (
    <div aria-label="Loading AI daily summary">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="mt-4 h-40" />
    </div>
  );
}
