import axios from "axios";

import type { ApiResponse, HealthDTO } from "../types/api";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000",
  timeout: 5_000,
});

export async function getHealth(): Promise<HealthDTO> {
  const response =
    await apiClient.get<ApiResponse<HealthDTO>>("/api/v1/health");

  return response.data.data;
}
