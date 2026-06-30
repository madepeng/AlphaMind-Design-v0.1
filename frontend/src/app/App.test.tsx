import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";

vi.mock("../pages/Company/CompanyPage", () => ({
  CompanyPage: () => <h1>Company Page</h1>,
}));

vi.mock("../pages/Home/HomePage", () => ({
  HomePage: () => <h1>Home Dashboard</h1>,
}));

vi.mock("../pages/Watchlist/WatchlistPage", () => ({
  WatchlistPage: () => <h1>Watchlist Page</h1>,
}));

afterEach(cleanup);

describe("App", () => {
  it("uses Home as the default page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Home Dashboard" }),
    ).toBeInTheDocument();
  });

  it("routes to Watchlist", () => {
    render(
      <MemoryRouter initialEntries={["/watchlist"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Watchlist Page" }),
    ).toBeInTheDocument();
  });

  it("routes to Company", () => {
    render(
      <MemoryRouter initialEntries={["/company/NVDA"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Company Page" }),
    ).toBeInTheDocument();
  });
});
