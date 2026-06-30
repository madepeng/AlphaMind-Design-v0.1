import { useMemo, useState } from "react";

import { EmptyView } from "../../components/common/EmptyView";
import { ErrorView } from "../../components/common/ErrorView";
import { Toast } from "../../components/common/Toast";
import { AppLayout } from "../../components/layout/AppLayout";
import { useJournal } from "../../hooks/useJournal";
import { filterJournals } from "../../services/journalService";
import { DeleteDialog } from "./DeleteDialog";
import { JournalDetail } from "./JournalDetail";
import { JournalList } from "./JournalList";
import {
  JournalDetailLoadingView,
  JournalLoadingView,
} from "./JournalLoadingView";
import { JournalToolbar } from "./JournalToolbar";

export function JournalPage() {
  const { remove, retry, select, state } = useJournal();
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const journals = useMemo(
    () => (state.status === "loaded" ? state.journals : []),
    [state],
  );
  const filteredJournals = useMemo(
    () => filterJournals(journals, query),
    [journals, query],
  );

  const handleDelete = async () => {
    if (deleteId === null) {
      return;
    }
    setDeleting(true);
    try {
      await remove(deleteId);
      setDeleteId(null);
      setDeleteError(false);
    } catch {
      setDeleteError(true);
    } finally {
      setDeleting(false);
    }
  };

  if (state.status === "loading") {
    return (
      <AppLayout rightPanel={<JournalDetailLoadingView />}>
        <JournalLoadingView />
      </AppLayout>
    );
  }

  if (state.status === "error") {
    return (
      <AppLayout
        rightPanel={
          <ErrorView
            description="Journal detail could not be loaded."
            onRetry={retry}
          />
        }
      >
        <ErrorView
          description="Journal data could not be loaded."
          onRetry={retry}
        />
      </AppLayout>
    );
  }

  const selectedJournal =
    state.detail.status === "loaded" ? state.detail.data : null;
  const rightPanel =
    state.detail.status === "loading" ? (
      <JournalDetailLoadingView />
    ) : state.detail.status === "error" ? (
      <ErrorView
        description="Journal detail could not be loaded."
        onRetry={retry}
      />
    ) : selectedJournal ? (
      <JournalDetail
        journal={selectedJournal}
        onDelete={() => setDeleteId(selectedJournal.id)}
      />
    ) : (
      <EmptyView
        description="Start your first research."
        onRefresh={retry}
        showRefresh={false}
        title="No Journal Yet."
      />
    );

  return (
    <AppLayout rightPanel={rightPanel}>
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">
          Research history
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Journal</h1>
      </header>

      <JournalToolbar onSearch={setQuery} query={query} />

      <section aria-labelledby="journal-list-heading" className="mt-6">
        <h2 className="text-lg font-semibold" id="journal-list-heading">
          Journal List
        </h2>
        {journals.length === 0 ? (
          <div className="mt-4">
            <EmptyView
              description="Start your first research."
              onRefresh={retry}
              showRefresh={false}
              title="No Journal Yet."
            />
          </div>
        ) : filteredJournals.length === 0 ? (
          <p className="mt-4 text-sm text-[#9CA3AF]">
            No matching journals.
          </p>
        ) : (
          <JournalList
            journals={filteredJournals}
            onSelect={(journalId) => void select(journalId)}
            selectedId={selectedJournal?.id}
          />
        )}
      </section>

      {deleteId !== null ? (
        <DeleteDialog
          isDeleting={isDeleting}
          onCancel={() => setDeleteId(null)}
          onDelete={() => void handleDelete()}
        />
      ) : null}
      {deleteError ? (
        <Toast message="Something went wrong." tone="error" />
      ) : null}
    </AppLayout>
  );
}
