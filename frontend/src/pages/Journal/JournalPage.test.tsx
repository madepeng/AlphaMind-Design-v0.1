import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteJournal,
  getJournal,
  getJournals,
} from "../../api/journalApi";
import type { JournalDTO } from "../../types/journal";
import { JournalPage } from "./JournalPage";

vi.mock("../../api/journalApi", () => ({
  createJournal: vi.fn(),
  deleteJournal: vi.fn(),
  getJournal: vi.fn(),
  getJournals: vi.fn(),
}));

const journal: JournalDTO = {
  id: 1,
  ticker: "NVDA",
  summary: null,
  reason: "Review earnings.",
  bullCase: "Demand remains strong.",
  risk: "Competition may increase.",
  exitPlan: "Reassess after the next report.",
  decision: "Hold",
  note: null,
  createdAt: "2026-06-30T12:00:00",
  updatedAt: "2026-06-30T12:00:00",
};

const appleJournal: JournalDTO = {
  ...journal,
  id: 2,
  ticker: "AAPL",
  decision: "Watch",
  createdAt: "2026-06-29T12:00:00",
};

const mockedDeleteJournal = vi.mocked(deleteJournal);
const mockedGetJournal = vi.mocked(getJournal);
const mockedGetJournals = vi.mocked(getJournals);

function renderJournal() {
  return render(
    <MemoryRouter initialEntries={["/journal"]}>
      <Routes>
        <Route path="/journal" element={<JournalPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe("JournalPage", () => {
  beforeEach(() => {
    mockedDeleteJournal.mockReset();
    mockedGetJournal.mockReset();
    mockedGetJournals.mockReset();
  });

  it("renders Loading", () => {
    mockedGetJournals.mockReturnValue(new Promise(() => undefined));

    renderJournal();

    expect(screen.getByLabelText("Loading Journal")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Loading Journal Detail"),
    ).toBeInTheDocument();
  });

  it("renders Error and retries", async () => {
    mockedGetJournals
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockResolvedValueOnce([]);

    renderJournal();

    const retryButtons = await screen.findAllByRole("button", {
      name: "Retry",
    });
    fireEvent.click(retryButtons[0]);

    expect(await screen.findAllByText("No Journal Yet.")).toHaveLength(2);
    expect(mockedGetJournals).toHaveBeenCalledTimes(2);
  });

  it("renders Empty without implementing Refresh", async () => {
    mockedGetJournals.mockResolvedValue([]);

    renderJournal();

    expect(await screen.findAllByText("No Journal Yet.")).toHaveLength(2);
    expect(screen.getAllByText("Start your first research.")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: "Refresh" })).not.toBeInTheDocument();
  });

  it("renders List, Detail, company name, and empty Summary", async () => {
    mockedGetJournals.mockResolvedValue([journal]);
    mockedGetJournal.mockResolvedValue(journal);

    renderJournal();

    expect(await screen.findByRole("heading", { name: "Journal" })).toBeInTheDocument();
    expect(screen.getByText("NVIDIA")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "NVDA · NVIDIA" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("No AI Summary Yet.")).toHaveLength(2);
    expect(screen.getByText("Review earnings.")).toBeInTheDocument();
    expect(screen.getByText("Demand remains strong.")).toBeInTheDocument();
    expect(screen.getByText("No note.")).toBeInTheDocument();
  });

  it("searches by ticker and date in real time", async () => {
    mockedGetJournals.mockResolvedValue([journal, appleJournal]);
    mockedGetJournal.mockResolvedValue(journal);

    renderJournal();
    await screen.findByText("NVIDIA");

    fireEvent.change(screen.getByLabelText("Search Journal"), {
      target: { value: "AAPL" },
    });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /NVIDIA/ })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search Journal"), {
      target: { value: "2026-06-30" },
    });
    expect(screen.getByText("NVIDIA")).toBeInTheDocument();
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });

  it("confirms and deletes a Journal", async () => {
    mockedGetJournals
      .mockResolvedValueOnce([journal])
      .mockResolvedValueOnce([]);
    mockedGetJournal.mockResolvedValue(journal);
    mockedDeleteJournal.mockResolvedValue();

    renderJournal();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Delete NVDA journal",
      }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Delete this journal?",
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));

    expect(await screen.findAllByText("No Journal Yet.")).toHaveLength(2);
    expect(mockedDeleteJournal).toHaveBeenCalledWith(1);
  });
});
