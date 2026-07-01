import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getSettings, saveSettings } from "../../api/settingsApi";
import { SettingsPage } from "./SettingsPage";

vi.mock("../../api/settingsApi", () => ({
  getSettings: vi.fn(),
  saveSettings: vi.fn(),
}));

const settings = {
  openaiApiKey: "sk-saved",
  model: "gpt-5.5",
  theme: "dark" as const,
};

const mockedGetSettings = vi.mocked(getSettings);
const mockedSaveSettings = vi.mocked(saveSettings);

function renderSettings() {
  return render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>,
  );
}

function deferredSave() {
  let resolvePromise: () => void = () => undefined;
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });
  return { promise, resolve: resolvePromise };
}

afterEach(cleanup);

describe("SettingsPage", () => {
  beforeEach(() => {
    mockedGetSettings.mockReset();
    mockedSaveSettings.mockReset();
  });

  it("renders the loading state", () => {
    mockedGetSettings.mockReturnValue(new Promise(() => undefined));

    renderSettings();

    expect(screen.getByLabelText("Loading Settings")).toBeInTheDocument();
  });

  it("loads and displays Settings", async () => {
    mockedGetSettings.mockResolvedValue(settings);

    renderSettings();

    expect(
      await screen.findByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("OpenAI API Key")).toHaveValue("sk-saved");
    expect(screen.getByLabelText("OpenAI API Key")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByLabelText("OpenAI Model")).toHaveValue("gpt-5.5");
    expect(screen.getByLabelText("Theme")).toHaveValue("dark");
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
  });

  it("saves edited Settings and shows success", async () => {
    mockedGetSettings.mockResolvedValue(settings);
    const pending = deferredSave();
    mockedSaveSettings.mockReturnValue(pending.promise);
    renderSettings();

    fireEvent.change(await screen.findByLabelText("OpenAI Model"), {
      target: { value: "gpt-5.4-mini" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Settings" }));

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
    pending.resolve();

    expect(await screen.findByText("Settings Saved.")).toBeInTheDocument();
    expect(mockedSaveSettings).toHaveBeenCalledWith({
      ...settings,
      model: "gpt-5.4-mini",
    });
  });

  it("retries a load error", async () => {
    mockedGetSettings
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockResolvedValueOnce(settings);
    renderSettings();

    fireEvent.click(await screen.findByRole("button", { name: "Retry" }));

    expect(mockedGetSettings).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  it("shows a save error and keeps the form usable", async () => {
    mockedGetSettings.mockResolvedValue(settings);
    mockedSaveSettings.mockRejectedValue(new Error("Unavailable"));
    renderSettings();

    fireEvent.click(
      await screen.findByRole("button", { name: "Save Settings" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to save settings.",
    );
    expect(screen.getByLabelText("OpenAI Model")).toBeEnabled();
  });
});
