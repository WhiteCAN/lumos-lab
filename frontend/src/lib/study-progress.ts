export const PROGRESS_KEY = "lumos-lab.study-progress.v1";

export function parseProgress(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string"))] : [];
  } catch { return []; }
}
