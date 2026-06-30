import axios from "axios";

import type { ApiResponse } from "../types/api";
import type { WatchlistItemDTO } from "../types/watchlist";

interface ApiError {
  success: false;
  message: string;
}

const watchlistApiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000",
  timeout: 5_000,
});

export async function getWatchlist(): Promise<WatchlistItemDTO[]> {
  const response =
    await watchlistApiClient.get<ApiResponse<WatchlistItemDTO[]>>(
      "/api/v1/watchlist",
    );
  return response.data.data;
}

export async function addWatchlistItem(ticker: string): Promise<void> {
  try {
    await watchlistApiClient.post("/api/v1/watchlist", { ticker });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteWatchlistItem(ticker: string): Promise<void> {
  try {
    await watchlistApiClient.delete(
      `/api/v1/watchlist/${encodeURIComponent(ticker)}`,
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error) && error.response?.data.message) {
    return error.response.data.message;
  }
  return "Something went wrong.";
}
