import type { FormEvent } from "react";

import { BaseCard } from "../../components/common/BaseCard";
import { EmptyView } from "../../components/common/EmptyView";
import { ErrorView } from "../../components/common/ErrorView";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { Toast } from "../../components/common/Toast";
import { Input } from "../../components/forms/Input";
import { Select } from "../../components/forms/Select";
import { AppLayout } from "../../components/layout/AppLayout";
import { useSettings } from "../../hooks/useSettings";
import { SettingsLoadingView } from "./SettingsLoadingView";

const emptyPanel = (
  <EmptyView onRefresh={() => undefined} showRefresh={false} />
);

export function SettingsPage() {
  const {
    form,
    loadStatus,
    retry,
    save,
    saveStatus,
    update,
  } = useSettings();

  if (loadStatus === "loading") {
    return (
      <AppLayout rightPanel={emptyPanel}>
        <SettingsLoadingView />
      </AppLayout>
    );
  }

  if (loadStatus === "error") {
    return (
      <AppLayout rightPanel={emptyPanel}>
        <ErrorView
          description="Settings could not be loaded."
          onRetry={retry}
        />
      </AppLayout>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void save();
  };

  return (
    <AppLayout rightPanel={emptyPanel}>
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">
          Local configuration
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Settings</h1>
      </header>

      <form className="mt-8" onSubmit={handleSubmit}>
        <BaseCard>
          <div className="space-y-6">
            <label
              className="block text-sm font-medium"
              htmlFor="openai-api-key"
            >
              OpenAI API Key
              <Input
                autoComplete="off"
                className="mt-2"
                id="openai-api-key"
                onChange={(event) =>
                  update("openaiApiKey", event.target.value)
                }
                type="password"
                value={form.openaiApiKey}
              />
            </label>

            <label
              className="block text-sm font-medium"
              htmlFor="openai-model"
            >
              OpenAI Model
              <Input
                className="mt-2"
                id="openai-model"
                onChange={(event) => update("model", event.target.value)}
                required
                value={form.model}
              />
            </label>

            <label className="block text-sm font-medium" htmlFor="theme">
              Theme
              <Select
                className="mt-2"
                disabled
                id="theme"
                value={form.theme}
              >
                <option value="dark">dark</option>
              </Select>
            </label>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <PrimaryButton
              disabled={saveStatus === "saving"}
              type="submit"
            >
              {saveStatus === "saving" ? "Saving..." : "Save Settings"}
            </PrimaryButton>
            {saveStatus === "success" ? (
              <p className="text-sm text-[#22C55E]" role="status">
                Settings Saved.
              </p>
            ) : null}
          </div>
        </BaseCard>
      </form>

      <section aria-labelledby="about-heading" className="mt-8">
        <h2 className="text-lg font-semibold" id="about-heading">
          About
        </h2>
        <BaseCard className="mt-4">
          <p className="text-sm font-medium">AlphaMind OS</p>
          <p className="mt-2 text-sm text-[#9CA3AF]">Version 1</p>
        </BaseCard>
      </section>

      {saveStatus === "error" ? (
        <Toast message="Failed to save settings." tone="error" />
      ) : null}
    </AppLayout>
  );
}
