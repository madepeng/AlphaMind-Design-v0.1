import { useMemo, useState } from "react";

import { CompanyCard } from "../../components/cards/CompanyCard";
import { EmptyView } from "../../components/common/EmptyView";
import { ErrorView } from "../../components/common/ErrorView";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { Toast } from "../../components/common/Toast";
import { Input } from "../../components/forms/Input";
import { AppLayout } from "../../components/layout/AppLayout";
import { useWatchlist } from "../../hooks/useWatchlist";
import { AddDialog } from "./AddDialog";
import { WatchlistLoadingView } from "./WatchlistLoadingView";

export function WatchlistPage() {
  const { add, remove, retry, state } = useWatchlist();
  const [query, setQuery] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    tone: "error" | "notice";
  } | null>(null);

  const companies = useMemo(
    () => (state.status === "loaded" ? state.data : []),
    [state],
  );
  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toUpperCase();
    if (!normalizedQuery) {
      return companies;
    }
    return companies.filter(
      (company) =>
        company.ticker.includes(normalizedQuery) ||
        company.companyName.toUpperCase().includes(normalizedQuery),
    );
  }, [companies, query]);

  const handleAdd = async (ticker: string) => {
    setSaving(true);
    try {
      await add(ticker);
      setDialogOpen(false);
      setToast(null);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Something went wrong.",
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ticker: string) => {
    try {
      await remove(ticker);
      setToast(null);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Something went wrong.",
        tone: "error",
      });
    }
  };

  const rightPanel = (
    <section aria-labelledby="watchlist-summary-heading">
      <h2 className="text-lg font-semibold" id="watchlist-summary-heading">
        AI Summary
      </h2>
      <div className="mt-4">
        <EmptyView
          description="AI summary is not available for Watchlist."
          onRefresh={retry}
        />
      </div>
    </section>
  );

  if (state.status === "loading") {
    return (
      <AppLayout rightPanel={rightPanel}>
        <WatchlistLoadingView />
      </AppLayout>
    );
  }

  if (state.status === "error") {
    return (
      <AppLayout rightPanel={rightPanel}>
        <ErrorView
          description="Watchlist data could not be loaded."
          onRetry={retry}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout rightPanel={rightPanel}>
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">
          Research companies
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Watchlist</h1>
      </header>

      <section aria-label="Search watchlist" className="mt-8">
        <Input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search ticker or company name"
          type="search"
          value={query}
        />
      </section>

      <section aria-labelledby="companies-heading" className="mt-6">
        <h2 className="text-lg font-semibold" id="companies-heading">
          Company List
        </h2>
        {companies.length === 0 ? (
          <div className="mt-4">
            <EmptyView
              description="Add your first company."
              onRefresh={retry}
            />
          </div>
        ) : filteredCompanies.length === 0 ? (
          <p className="mt-4 text-sm text-[#9CA3AF]">No matching companies.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {filteredCompanies.map((company) => (
              <CompanyCard
                company={company}
                key={company.ticker}
                onDelete={handleDelete}
                onSelect={(ticker) =>
                  setToast({ message: `${ticker}: Coming Soon`, tone: "notice" })
                }
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-6">
        <PrimaryButton onClick={() => setDialogOpen(true)}>
          Add Company
        </PrimaryButton>
      </div>

      {isDialogOpen ? (
        <AddDialog
          isSaving={isSaving}
          onAdd={handleAdd}
          onClose={() => setDialogOpen(false)}
        />
      ) : null}
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
    </AppLayout>
  );
}
