import axios from "axios";

import type { ApiResponse } from "../types/api";
import type { HomeDTO } from "../types/home";

const homeApiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000",
  timeout: 5_000,
});

export async function getHome(): Promise<HomeDTO> {
  const response =
    await homeApiClient.get<ApiResponse<HomeDTO>>("/api/v1/home");

  return response.data.data;
}
