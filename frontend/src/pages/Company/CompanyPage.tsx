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
import {
  type CompanyAnalysisState,
  useCompanyAnalysis,
} from "../../hooks/useCompanyAnalysis";
import { useJournalSave } from "../../hooks/useJournalSave";
import type {
  CompanyAISummaryDTO,
  CompanyDTO,
} from "../../types/company";
import type { DecisionFormState } from "../../types/decision";
import {
  CompanyLoadingView,
  CompanySummaryLoadingView,
} from "./CompanyLoadingView";

export function CompanyPage() {
  const { ticker = "" } = useParams();
  const { retry, state } = useCompany(ticker);

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

  return (
    <CompanyContent
      company={state.data}
      key={`${ticker}:${state.data.header.ticker}`}
      onCompanyRetry={retry}
      ticker={ticker}
    />
  );
}

interface CompanyContentProps {
  company: CompanyDTO;
  onCompanyRetry: () => void;
  ticker: string;
}

function CompanyContent({
  company,
  onCompanyRetry,
  ticker,
}: CompanyContentProps) {
  const navigate = useNavigate();
  const { aiSummary: initialAnalysis, header, news } = company;
  const { analyze, state: analysisState } = useCompanyAnalysis(
    ticker,
    initialAnalysis,
  );
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
  const analysis = getAnalysis(analysisState);
  const isAnalyzing = analysisState.status === "loading";
  const confirmedSummary =
    analysisState.status === "loaded"
      ? analysisState.data.summary
      : null;

  return (
    <AppLayout
      rightPanel={
        <CompanySummaryPanel
          analysis={analysis}
          onRetry={analyze}
          status={analysisState.status}
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
            <EmptyView
              description="No recent news."
              onRefresh={onCompanyRetry}
            />
          )}
        </div>
      </section>

      <section aria-labelledby="analysis-heading" className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold" id="analysis-heading">
            AI Summary
          </h2>
          <PrimaryButton disabled={isAnalyzing} onClick={analyze}>
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </PrimaryButton>
        </div>
        <div className="mt-4">
          {analysisState.status === "loading" ? (
            <CompanySummaryLoadingView />
          ) : analysisState.status === "error" ? (
            <ErrorView
              description="AI analysis could not be generated."
              onRetry={analyze}
            />
          ) : hasNoAnalysis(analysis) ? (
            <EmptyView
              description="AI analysis unavailable."
              onRefresh={analyze}
            />
          ) : (
            <CompanyAISummary analysis={analysis} />
          )}
        </div>
      </section>

      <section aria-labelledby="checklist-heading" className="mt-10">
        <h2 className="text-lg font-semibold" id="checklist-heading">
          Decision Checklist
        </h2>
        <div className="mt-4">
          <DecisionChecklist
            disabled={isAnalyzing}
            onDraftChange={handleDraftChange}
          />
        </div>
      </section>

      <section aria-labelledby="journal-heading" className="mt-10">
        <h2 className="text-lg font-semibold" id="journal-heading">
          Journal Shortcut
        </h2>
        <PrimaryButton
          className="mt-4"
          disabled={
            isAnalyzing ||
            !isDecisionValid ||
            journalStatus === "saving"
          }
          onClick={async () => {
            if (!decisionDraft) {
              return;
            }
            const saved = await saveJournal({
              ticker: header.ticker,
              summary: confirmedSummary,
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
  onRetry: () => void;
  status: CompanyAnalysisState["status"];
}

function CompanySummaryPanel({
  analysis,
  onRetry,
  status,
}: CompanySummaryPanelProps) {
  return (
    <section aria-labelledby="company-summary-heading">
      <h2 className="text-lg font-semibold" id="company-summary-heading">
        AI Summary
      </h2>
      <div className="mt-4">
        {status === "loading" ? (
          <CompanySummaryLoadingView />
        ) : status === "error" ? (
          <ErrorView
            description="AI analysis could not be generated."
            onRetry={onRetry}
          />
        ) : hasNoAnalysis(analysis) ? (
          <EmptyView
            description="AI analysis unavailable."
            onRefresh={onRetry}
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

function getAnalysis(
  state: CompanyAnalysisState,
): CompanyAISummaryDTO {
  if (state.status === "idle" || state.status === "loaded") {
    return state.data;
  }
  return {
    summary: "",
    bullCase: [],
    risk: [],
    watchItems: [],
  };
}

function hasNoAnalysis(analysis: CompanyAISummaryDTO): boolean {
  return (
    !analysis.summary.trim() &&
    analysis.bullCase.length === 0 &&
    analysis.risk.length === 0 &&
    analysis.watchItems.length === 0
  );
}
