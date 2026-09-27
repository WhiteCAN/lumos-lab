import type { StudyPage } from "./study-pages";

function normalize(value: string) {
  return value.normalize("NFKC").toLowerCase().trim().replace(/\s+/g, " ");
}

function compact(value: string) {
  return normalize(value).replace(/\s/g, "");
}

export function searchStudyPages(query: string, pages: readonly StudyPage[]): StudyPage[] {
  const normalized = normalize(query);
  if (!normalized) return [];
  const terms = normalized.split(" ");
  const matches = (fields: string[]) => {
    const values = fields.map(compact);
    return terms.every((term) => values.some((value) => value.includes(term)));
  };
  const ranked = pages.flatMap((page) => {
    const title = [page.title];
    const keywords = [...title, ...page.aliases, ...page.keywords];
    const all = [...keywords, page.description];
    if (!matches(all)) return [];
    const score = compact(page.title) === compact(query) ? 0
      : matches(title) ? 1 : matches(keywords) ? 2 : 3;
    return [{ page, score }];
  }).sort((a, b) => a.score - b.score);
  const seen = new Set<string>();
  return ranked.filter(({ page }) => {
    if (seen.has(page.href)) return false;
    seen.add(page.href);
    return true;
  }).map(({ page }) => page);
}
