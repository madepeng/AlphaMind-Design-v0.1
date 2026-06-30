import { useEffect, useState } from "react";

import { getHealth } from "../api/healthApi";

type ConnectionState = "loading" | "connected" | "error";

export function App() {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("loading");

  useEffect(() => {
    let isActive = true;

    getHealth()
      .then(() => {
        if (isActive) {
          setConnectionState("connected");
        }
      })
      .catch(() => {
        if (isActive) {
          setConnectionState("error");
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <section className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
          AlphaMind OS
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          Investment Research Workspace
        </h1>
        <p className="mt-3 text-zinc-400">
          The project foundation is ready for focused, repeatable research.
        </p>

        <div
          aria-live="polite"
          className="mt-8 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3"
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${statusColor[connectionState]}`}
          />
          <span className="text-sm text-zinc-300">
            {statusLabel[connectionState]}
          </span>
        </div>
      </section>
    </main>
  );
}

const statusColor: Record<ConnectionState, string> = {
  loading: "animate-pulse bg-amber-400",
  connected: "bg-emerald-400",
  error: "bg-red-400",
};

const statusLabel: Record<ConnectionState, string> = {
  loading: "Connecting to the local backend…",
  connected: "Frontend and backend are connected.",
  error: "Backend unavailable. Start the FastAPI service and try again.",
};
