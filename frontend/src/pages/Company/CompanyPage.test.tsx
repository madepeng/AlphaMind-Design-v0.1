import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCompany } from "../../api/companyApi";
import { createJournal } from "../../api/journalApi";
import type { CompanyDTO } from "../../types/company";
import { CompanyPage } from "./CompanyPage";

vi.mock("../../api/companyApi", () => ({
  getCompany: vi.fn(),
}));

vi.mock("../../api/journalApi", () => ({
  createJournal: vi.fn(),
  deleteJournal: vi.fn(),
  getJournal: vi.fn(),
  getJournals: vi.fn(),
}));

const company: CompanyDTO = {
  header: {
    ticker: "NVDA",
    companyName: "NVIDIA",
    industry: "Semiconductor",
    marketCap: "3.8T",
    price: 185.23,
    changePercent: 1.82,
  },
  news: [
    {
      title: "NVIDIA expands its AI infrastructure platform",
      publishedAt: "2026-06-30",
      source: "Mock News",
    },
  ],
  aiSummary: {
    summary:
      "NVIDIA remains central to accelerated computing infrastructure. Cloud investment supports demand, while execution and competition remain important factors to monitor.",
    bullCase: ["Demand remains strong."],
    risk: ["Competition may increase."],
    watchItems: ["Next earnings report."],
  },
};

const mockedGetCompany = vi.mocked(getCompany);
const mockedCreateJournal = vi.mocked(createJournal);

function deferredSave() {
  let resolvePromise: () => void = () => undefined;
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });
  return { promise, resolve: resolvePromise };
}

function renderCompany() {
  return render(
    <MemoryRouter initialEntries={["/company/NVDA"]}>
      <Routes>
        <Route path="/company/:ticker" element={<CompanyPage />} />
        <Route path="/journal" element={<h1>Journal Page</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe("CompanyPage", () => {
  beforeEach(() => {
    mockedGetCompany.mockReset();
    mockedCreateJournal.mockReset();
  });

  it("renders the loading state", () => {
    mockedGetCompany.mockReturnValue(new Promise(() => undefined));

    renderCompany();

    expect(screen.getByLabelText("Loading Company")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Loading Company AI Summary"),
    ).toBeInTheDocument();
  });

  it("renders the error state and retries", async () => {
    mockedGetCompany
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockResolvedValueOnce(company);

    renderCompany();

    fireEvent.click(await screen.findByRole("button", { name: "Retry" }));

    expect(mockedGetCompany).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByRole("heading", { name: "NVIDIA" }),
    ).toBeInTheDocument();
  });

  it("renders empty News and AI states while keeping the checklist usable", async () => {
    mockedGetCompany.mockResolvedValue({
      ...company,
      news: [],
      aiSummary: {
        summary: "",
        bullCase: [],
        risk: [],
        watchItems: [],
      },
    });

    renderCompany();

    expect(await screen.findByText("No recent news.")).toBeInTheDocument();
    expect(screen.getAllByText("AI analysis unavailable.")).toHaveLength(2);
    expect(screen.getByLabelText("Question 1")).toBeEnabled();
  });

  it("renders Header, News, AI Summary, and Decision Checklist", async () => {
    mockedGetCompany.mockResolvedValue(company);

    renderCompany();

    expect(await screen.findByText("NVDA")).toBeInTheDocument();
    expect(screen.getByText("$185.23")).toBeInTheDocument();
    expect(screen.getByText("Semiconductor")).toBeInTheDocument();
    expect(screen.getByText("3.8T")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "NVIDIA expands its AI infrastructure platform",
      }),
    ).toHaveAttribute("href");
    expect(screen.getByText("Bull Case")).toBeInTheDocument();
    expect(screen.getByText("Risk")).toBeInTheDocument();
    expect(screen.getByText("Watch Items")).toBeInTheDocument();
    expect(screen.getByLabelText("Question 1")).toBeEnabled();
    expect(screen.getByLabelText("Question 5")).toBeEnabled();
  });

  it("saves the current checklist to Journal and navigates", async () => {
    mockedGetCompany.mockResolvedValue(company);
    const pending = deferredSave();
    mockedCreateJournal.mockReturnValue(pending.promise);

    renderCompany();

    await screen.findByLabelText("Question 1");
    for (let index = 1; index <= 4; index += 1) {
      fireEvent.change(screen.getByLabelText(`Question ${index}`), {
        target: { value: `Answer ${index}` },
      });
    }
    fireEvent.change(screen.getByLabelText("Question 5"), {
      target: { value: "Hold" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Journal" }));

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
    pending.resolve();

    expect(
      await screen.findByRole("heading", { name: "Journal Page" }),
    ).toBeInTheDocument();
    expect(mockedCreateJournal).toHaveBeenCalledWith({
      ticker: "NVDA",
      summary: null,
      reason: "Answer 1",
      bullCase: "Answer 2",
      risk: "Answer 3",
      exitPlan: "Answer 4",
      decision: "Hold",
      note: null,
    });
  });

  it("keeps Save Journal disabled until valid and shows save errors", async () => {
    mockedGetCompany.mockResolvedValue(company);
    mockedCreateJournal.mockRejectedValue(new Error("Unavailable"));

    renderCompany();

    const saveButton = await screen.findByRole("button", {
      name: "Save Journal",
    });
    expect(saveButton).toBeDisabled();
    for (let index = 1; index <= 4; index += 1) {
      fireEvent.change(screen.getByLabelText(`Question ${index}`), {
        target: { value: `Answer ${index}` },
      });
    }
    fireEvent.click(saveButton);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to save journal.",
    );
  });
});
