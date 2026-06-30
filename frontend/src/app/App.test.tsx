import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";

vi.mock("../pages/Home/HomePage", () => ({
  HomePage: () => <h1>Home Dashboard</h1>,
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
});
