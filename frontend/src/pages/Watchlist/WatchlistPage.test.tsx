import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  addWatchlistItem,
  deleteWatchlistItem,
  getWatchlist,
} from "../../api/watchlistApi";
import type { WatchlistItemDTO } from "../../types/watchlist";
import { WatchlistPage } from "./WatchlistPage";

vi.mock("../../api/watchlistApi", () => ({
  addWatchlistItem: vi.fn(),
  deleteWatchlistItem: vi.fn(),
  getWatchlist: vi.fn(),
}));

const companies: WatchlistItemDTO[] = [
  {
    ticker: "NVDA",
    companyName: "NVIDIA",
    price: 185.2,
    change: 2.13,
  },
  {
    ticker: "AAPL",
    companyName: "Apple",
    price: 213.32,
    change: 0.84,
  },
];

const mockedAdd = vi.mocked(addWatchlistItem);
const mockedDelete = vi.mocked(deleteWatchlistItem);
const mockedGet = vi.mocked(getWatchlist);

function renderWatchlist() {
  return render(
    <MemoryRouter initialEntries={["/watchlist"]}>
      <Routes>
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route
          path="/company/:ticker"
          element={<h1>Company destination</h1>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe("WatchlistPage", () => {
  beforeEach(() => {
    mockedAdd.mockReset();
    mockedDelete.mockReset();
    mockedGet.mockReset();
  });

  it("renders the loading state", () => {
    mockedGet.mockReturnValue(new Promise(() => undefined));

    renderWatchlist();

    expect(screen.getByLabelText("Loading Watchlist")).toBeInTheDocument();
  });

  it("renders the empty state", async () => {
    mockedGet.mockResolvedValue([]);

    renderWatchlist();

    expect(await screen.findByText("Add your first company.")).toBeInTheDocument();
  });

  it("renders the error state and retries", async () => {
    mockedGet
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockResolvedValueOnce(companies);

    renderWatchlist();

    fireEvent.click(await screen.findByRole("button", { name: "Retry" }));

    expect(mockedGet).toHaveBeenCalledTimes(2);
    expect(await screen.findByText("NVIDIA")).toBeInTheDocument();
  });

  it("adds a ticker through the Search Dialog and refreshes", async () => {
    mockedGet
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([companies[0]]);
    mockedAdd.mockResolvedValue();

    renderWatchlist();

    fireEvent.click(await screen.findByRole("button", { name: "Add Company" }));
    fireEvent.change(screen.getByLabelText("Ticker"), {
      target: { value: "nvda" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(mockedAdd).toHaveBeenCalledWith("nvda"));
    expect(await screen.findByText("NVIDIA")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows an API error from Add", async () => {
    mockedGet.mockResolvedValue([]);
    mockedAdd.mockRejectedValue(new Error("Already Exists"));

    renderWatchlist();

    fireEvent.click(await screen.findByRole("button", { name: "Add Company" }));
    fireEvent.change(screen.getByLabelText("Ticker"), {
      target: { value: "NVDA" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Already Exists");
  });

  it("deletes immediately and refreshes", async () => {
    mockedGet
      .mockResolvedValueOnce(companies)
      .mockResolvedValueOnce([companies[1]]);
    mockedDelete.mockResolvedValue();

    renderWatchlist();

    fireEvent.click(
      await screen.findByRole("button", { name: "Delete NVDA" }),
    );

    await waitFor(() => expect(mockedDelete).toHaveBeenCalledWith("NVDA"));
    await waitFor(() =>
      expect(screen.queryByText("NVIDIA")).not.toBeInTheDocument(),
    );
  });

  it("filters locally and enters Company on selection", async () => {
    mockedGet.mockResolvedValue(companies);

    renderWatchlist();

    fireEvent.change(
      await screen.findByPlaceholderText("Search ticker or company name"),
      { target: { value: "apple" } },
    );

    expect(screen.queryByText("NVIDIA")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("AAPL"));
    expect(
      screen.getByRole("heading", { name: "Company destination" }),
    ).toBeInTheDocument();
  });
});
