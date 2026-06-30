import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCompany } from "../../api/companyApi";
import type { CompanyDTO } from "../../types/company";
import { CompanyPage } from "./CompanyPage";

vi.mock("../../api/companyApi", () => ({
  getCompany: vi.fn(),
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

function renderCompany() {
  return render(
    <MemoryRouter initialEntries={["/company/NVDA"]}>
      <Routes>
        <Route path="/company/:ticker" element={<CompanyPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe("CompanyPage", () => {
  beforeEach(() => {
    mockedGetCompany.mockReset();
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

  it("keeps checklist values local and shows Coming Soon for Save Journal", async () => {
    mockedGetCompany.mockResolvedValue(company);

    renderCompany();

    const question = await screen.findByLabelText("Question 1");
    fireEvent.change(question, { target: { value: "Review earnings" } });
    fireEvent.change(screen.getByLabelText("Question 5"), {
      target: { value: "Watch" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Journal" }));

    expect(question).toHaveValue("Review earnings");
    expect(screen.getByLabelText("Question 5")).toHaveValue("Watch");
    expect(screen.getByRole("status")).toHaveTextContent("Coming Soon");
  });
});
