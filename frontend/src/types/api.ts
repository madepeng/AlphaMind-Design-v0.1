export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface HealthDTO {
  status: "ok";
  app: "AlphaMind OS";
}
