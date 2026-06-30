import { useState } from "react";

import { EventCard } from "../../components/cards/EventCard";
import { MarketCard } from "../../components/cards/MarketCard";
import { SummaryCard } from "../../components/cards/SummaryCard";
import { EmptyView } from "../../components/common/EmptyView";
import { ErrorView } from "../../components/common/ErrorView";
import { AppLayout } from "../../components/layout/AppLayout";
import { useHome } from "../../hooks/useHome";
import type { HomeDTO } from "../../types/home";
import { HomeLoadingView, SummaryLoadingView } from "./HomeLoadingView";

const MARKET_UPDATED_AT = "Updated 10:30 AM";

export function HomePage() {
  const { state, retry } = useHome();
  const [notice, setNotice] = useState<string | null>(null);

  if (state.status === "loading") {
    return (
      <AppLayout rightPanel={<SummaryLoadingView />}>
        <HomeLoadingView />
      </AppLayout>
    );
  }

  if (state.status === "error") {
    return (
      <AppLayout
        rightPanel={
          <EmptyView
            description="AI daily summary is unavailable."
            onRefresh={retry}
          />
        }
      >
        <ErrorView onRetry={retry} />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      rightPanel={
        <RightPanel
          onRefresh={retry}
          summary={state.data.summary}
        />
      }
    >
      <HomeContent
        data={state.data}
        notice={notice}
        onEventSelect={() => setNotice("Coming Soon")}
        onRefresh={retry}
      />
    </AppLayout>
  );
}

interface HomeContentProps {
  data: HomeDTO;
  notice: string | null;
  onEventSelect: () => void;
  onRefresh: () => void;
}

function HomeContent({
  data,
  notice,
  onEventSelect,
  onRefresh,
}: HomeContentProps) {
  return (
    <>
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">
          Daily overview
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Home</h1>
      </header>

      <section aria-labelledby="market-heading" className="mt-8">
        <h2 className="text-lg font-semibold" id="market-heading">
          Today's Market
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <MarketCard
            change={data.market.nasdaq}
            name="Nasdaq"
            updatedAt={MARKET_UPDATED_AT}
          />
          <MarketCard
            change={data.market.sp500}
            name="S&P500"
            updatedAt={MARKET_UPDATED_AT}
          />
          <MarketCard
            change={data.market.sox}
            name="SOX"
            updatedAt={MARKET_UPDATED_AT}
          />
        </div>
      </section>

      <section aria-labelledby="events-heading" className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" id="events-heading">
            Today's Events
          </h2>
          {notice ? (
            <p className="text-sm text-[#F59E0B]" role="status">
              {notice}
            </p>
          ) : null}
        </div>
        {data.events.length === 0 ? (
          <div className="mt-4">
            <EmptyView onRefresh={onRefresh} />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {data.events.slice(0, 3).map((event) => (
              <EventCard
                event={event}
                key={event.title}
                onSelect={onEventSelect}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

interface RightPanelProps {
  onRefresh: () => void;
  summary: string;
}

function RightPanel({ onRefresh, summary }: RightPanelProps) {
  return (
    <section aria-labelledby="summary-heading">
      <h2 className="text-lg font-semibold" id="summary-heading">
        AI Daily Summary
      </h2>
      <div className="mt-4">
        {summary.trim() ? (
          <SummaryCard summary={summary} />
        ) : (
          <EmptyView
            description="AI daily summary is unavailable."
            onRefresh={onRefresh}
          />
        )}
      </div>
    </section>
  );
}
