import { Skeleton } from "../../components/common/Skeleton";

export function WatchlistLoadingView() {
  return (
    <div aria-label="Loading Watchlist">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="mt-8 h-10 w-full" />
      <div className="mt-6 grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-24" key={index} />
        ))}
      </div>
      <Skeleton className="mt-6 h-10 w-28" />
    </div>
  );
}
