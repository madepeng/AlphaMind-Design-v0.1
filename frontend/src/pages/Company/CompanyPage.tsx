import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CompanyAISummary } from "../../components/cards/CompanyAISummary";
import { CompanyHeaderCard } from "../../components/cards/CompanyHeaderCard";
import { DecisionChecklist } from "../../components/cards/DecisionChecklist";
import { NewsList } from "../../components/cards/NewsList";
import { BaseCard } from "../../components/common/BaseCard";
import { EmptyView } from "../../components/common/EmptyView";
import { ErrorView } from "../../components/common/ErrorView";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { Toast } from "../../components/common/Toast";
import { AppLayout } from "../../components/layout/AppLayout";
import { useCompany } from "../../hooks/useCompany";
import { useJournalSave } from "../../hooks/useJournalSave";
import type { CompanyAISummaryDTO } from "../../types/company";
import type { DecisionFormState } from "../../types/decision";
import {
  CompanyLoadingView,
  CompanySummaryLoadingView,
} from "./CompanyLoadingView";

export function CompanyPage() {
  const { ticker = "" } = useParams();
  const navigate = useNavigate();
  const { retry, state } = useCompany(ticker);
  const { save: saveJournal, status: journalStatus } = useJournalSave();
  const [decisionDraft, setDecisionDraft] =
    useState<DecisionFormState | null>(null);
  const [isDecisionValid, setDecisionValid] = useState(false);
  const handleDraftChange = useCallback(
    (draft: DecisionFormState, isValid: boolean) => {
      setDecisionDraft(draft);
      setDecisionValid(isValid);
    },
    [],
  );

  if (state.status === "loading") {
    return (
      <AppLayout rightPanel={<CompanySummaryLoadingView />}>
        <CompanyLoadingView />
      </AppLayout>
    );
  }

  if (state.status === "error") {
    return (
      <AppLayout
        rightPanel={
          <EmptyView
            description="AI analysis unavailable."
            onRefresh={retry}
          />
        }
      >
        <ErrorView
          description="Company data could not be loaded."
          onRetry={retry}
        />
      </AppLayout>
    );
  }

  const { aiSummary, header, news } = state.data;
  const isAnalysisEmpty = hasNoAnalysis(aiSummary);

  return (
    <AppLayout
      rightPanel={
        <CompanySummaryPanel
          analysis={aiSummary}
          isEmpty={isAnalysisEmpty}
          onRefresh={retry}
        />
      }
    >
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">
          Company research
        </p>
        <h1 className="mt-2 text-2xl font-semibold">{header.companyName}</h1>
      </header>

      <section aria-label="Company Header" className="mt-8">
        <CompanyHeaderCard header={header} />
      </section>

      <section aria-labelledby="news-heading" className="mt-10">
        <h2 className="text-lg font-semibold" id="news-heading">
          Latest News
        </h2>
        <div className="mt-4">
          {news.length ? (
            <NewsList news={news} ticker={header.ticker} />
          ) : (
            <EmptyView description="No recent news." onRefresh={retry} />
          )}
        </div>
      </section>

      <section aria-labelledby="analysis-heading" className="mt-10">
        <h2 className="text-lg font-semibold" id="analysis-heading">
          AI Summary
        </h2>
        <div className="mt-4">
          {isAnalysisEmpty ? (
            <EmptyView
              description="AI analysis unavailable."
              onRefresh={retry}
            />
          ) : (
            <CompanyAISummary analysis={aiSummary} />
          )}
        </div>
      </section>

      <section aria-labelledby="checklist-heading" className="mt-10">
        <h2 className="text-lg font-semibold" id="checklist-heading">
          Decision Checklist
        </h2>
        <div className="mt-4">
          <DecisionChecklist onDraftChange={handleDraftChange} />
        </div>
      </section>

      <section aria-labelledby="journal-heading" className="mt-10">
        <h2 className="text-lg font-semibold" id="journal-heading">
          Journal Shortcut
        </h2>
        <PrimaryButton
          className="mt-4"
          disabled={!isDecisionValid || journalStatus === "saving"}
          onClick={async () => {
            if (!decisionDraft) {
              return;
            }
            const saved = await saveJournal({
              ticker: header.ticker,
              summary: null,
              ...decisionDraft,
              note: null,
            });
            if (saved) {
              navigate("/journal");
            }
          }}
        >
          {journalStatus === "saving" ? "Saving..." : "Save Journal"}
        </PrimaryButton>
      </section>

      {journalStatus === "error" ? (
        <Toast message="Failed to save journal." tone="error" />
      ) : null}
    </AppLayout>
  );
}

interface CompanySummaryPanelProps {
  analysis: CompanyAISummaryDTO;
  isEmpty: boolean;
  onRefresh: () => void;
}

function CompanySummaryPanel({
  analysis,
  isEmpty,
  onRefresh,
}: CompanySummaryPanelProps) {
  return (
    <section aria-labelledby="company-summary-heading">
      <h2 className="text-lg font-semibold" id="company-summary-heading">
        AI Summary
      </h2>
      <div className="mt-4">
        {isEmpty ? (
          <EmptyView
            description="AI analysis unavailable."
            onRefresh={onRefresh}
          />
        ) : (
          <BaseCard>
            <p className="text-sm leading-6 text-[#9CA3AF]">
              {analysis.summary}
            </p>
          </BaseCard>
        )}
      </div>
    </section>
  );
}

function hasNoAnalysis(analysis: CompanyAISummaryDTO): boolean {
  return (
    !analysis.summary.trim() &&
    analysis.bullCase.length === 0 &&
    analysis.risk.length === 0 &&
    analysis.watchItems.length === 0
  );
}
