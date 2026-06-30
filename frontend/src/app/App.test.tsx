import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";

vi.mock("../api/healthApi", () => ({
  getHealth: vi.fn(() =>
    Promise.resolve({ status: "ok", app: "AlphaMind OS" }),
  ),
}));

describe("App", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows a successful backend connection", async () => {
    render(<App />);

    expect(
      await screen.findByText("Frontend and backend are connected."),
    ).toBeInTheDocument();
  });
});
