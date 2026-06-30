import { Skeleton } from "../../components/common/Skeleton";

export function JournalLoadingView() {
  return (
    <div aria-label="Loading Journal">
      <Skeleton className="h-6 w-28" />
      <Skeleton className="mt-8 h-10 w-full" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton className="h-28" key={index} />
        ))}
      </div>
    </div>
  );
}

export function JournalDetailLoadingView() {
  return (
    <div aria-label="Loading Journal Detail">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="mt-6 h-28" />
      <Skeleton className="mt-4 h-32" />
      <Skeleton className="mt-4 h-32" />
    </div>
  );
}
