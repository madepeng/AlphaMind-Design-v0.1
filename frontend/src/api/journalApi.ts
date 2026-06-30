import axios from "axios";

import type { ApiResponse } from "../types/api";
import type { JournalCreateDTO, JournalDTO } from "../types/journal";

interface ApiError {
  success: false;
  message: string;
}

const journalApiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000",
  timeout: 5_000,
});

export async function getJournals(): Promise<JournalDTO[]> {
  const response =
    await journalApiClient.get<ApiResponse<JournalDTO[]>>("/api/v1/journal");
  return response.data.data;
}

export async function getJournal(journalId: number): Promise<JournalDTO> {
  const response = await journalApiClient.get<ApiResponse<JournalDTO>>(
    `/api/v1/journal/${journalId}`,
  );
  return response.data.data;
}

export async function createJournal(
  journal: JournalCreateDTO,
): Promise<void> {
  try {
    await journalApiClient.post("/api/v1/journal", journal);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteJournal(journalId: number): Promise<void> {
  try {
    await journalApiClient.delete(`/api/v1/journal/${journalId}`);
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
