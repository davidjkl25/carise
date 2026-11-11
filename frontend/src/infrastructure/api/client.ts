import { publicEnv } from "@/infrastructure/config/env";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${publicEnv.apiUrl}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiError(response.status, `GET ${path} falló con estado ${response.status}`);
  }

  return (await response.json()) as T;
}
