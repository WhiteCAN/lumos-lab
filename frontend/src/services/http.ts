import type { ApiResponse } from "@/types/api";

export async function requestJson<T>(
  url: string,
  options: RequestInit,
  fallbackMessage: string,
) {
  const response = await fetch(url, options);
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.message ?? fallbackMessage);
  }

  return body.data;
}
