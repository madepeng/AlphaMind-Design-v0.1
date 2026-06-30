import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getHome } from "../../api/homeApi";
import type { HomeDTO } from "../../types/home";
import { HomePage } from "./HomePage";

vi.mock("../../api/homeApi", () => ({
  getHome: vi.fn(),
}));

const mockHomeData: HomeDTO = {
  market: {
    nasdaq: 1.25,
    sp500: 0.82,
    sox: 2.41,
  },
  events: [
    {
      title: "Micron Earnings",
      summary: "Revenue beat expectations.",
    },
  ],
  summary:
    "Markets are broadly positive today, led by semiconductor strength after fresh earnings updates. Keep the current research plan, review chip exposure, and watch for follow-through.",
};

const mockedGetHome = vi.mocked(getHome);

afterEach(cleanup);

describe("HomePage", () => {
  beforeEach(() => {
    mockedGetHome.mockReset();
  });

  it("renders the loading skeleton", () => {
    mockedGetHome.mockReturnValue(new Promise(() => undefined));

    render(<HomePage />);

    expect(
      screen.getByLabelText("Loading Home dashboard"),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton")).not.toHaveLength(0);
  });

  it("renders the error state and retries", async () => {
    mockedGetHome
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockResolvedValueOnce(mockHomeData);

    render(<HomePage />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Retry" }),
    );

    expect(mockedGetHome).toHaveBeenCalledTimes(2);
    expect(await screen.findByText("Today's Market")).toBeInTheDocument();
  });

  it("renders empty events and an empty right panel", async () => {
    mockedGetHome.mockResolvedValue({
      ...mockHomeData,
      events: [],
      summary: "",
    });

    render(<HomePage />);

    expect(
      await screen.findByText("Today has no major market events."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("AI daily summary is unavailable."),
    ).toBeInTheDocument();
  });

  it("renders market, events, and the right panel summary", async () => {
    mockedGetHome.mockResolvedValue(mockHomeData);

    render(<HomePage />);

    expect(await screen.findByText("Nasdaq")).toBeInTheDocument();
    expect(screen.getByText("S&P500")).toBeInTheDocument();
    expect(screen.getByText("SOX")).toBeInTheDocument();
    expect(screen.getByText("Micron Earnings")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "AI Daily Summary" }),
    ).toBeInTheDocument();
    expect(screen.getByText(mockHomeData.summary)).toBeInTheDocument();
  });

  it("shows Coming Soon when an event is selected", async () => {
    mockedGetHome.mockResolvedValue(mockHomeData);

    render(<HomePage />);

    fireEvent.click(await screen.findByText("Micron Earnings"));

    expect(screen.getByRole("status")).toHaveTextContent("Coming Soon");
  });

  it("shows only Home as enabled in the Sidebar", async () => {
    mockedGetHome.mockResolvedValue(mockHomeData);

    render(<HomePage />);

    expect(
      await screen.findByRole("button", { name: "Home" }),
    ).toBeEnabled();
    expect(screen.getByRole("button", { name: "Watchlist" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Journal" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Settings" })).toBeDisabled();
  });
});
