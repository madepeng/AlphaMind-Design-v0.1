import axios from "axios";

import type { ApiResponse } from "../types/api";
import type { CompanyDTO } from "../types/company";

const companyApiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000",
  timeout: 5_000,
});

export async function getCompany(ticker: string): Promise<CompanyDTO> {
  const response = await companyApiClient.get<ApiResponse<CompanyDTO>>(
    `/api/v1/company/${encodeURIComponent(ticker)}`,
  );
  return response.data.data;
}
