import axios from "axios";

import type { ApiResponse } from "../types/api";
import type { SettingsDTO } from "../types/settings";

const settingsApiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000",
  timeout: 5_000,
});

export async function getSettings(): Promise<SettingsDTO> {
  const response =
    await settingsApiClient.get<ApiResponse<SettingsDTO>>("/api/v1/settings");
  return response.data.data;
}

export async function saveSettings(settings: SettingsDTO): Promise<void> {
  await settingsApiClient.put("/api/v1/settings", settings);
}
