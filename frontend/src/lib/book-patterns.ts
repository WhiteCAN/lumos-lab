import first from "./book-chapters-01-08.json";
import second from "./book-chapters-09-16.json";
import third from "./book-chapters-17-23.json";

export type BookChapter = {
  chapter: number; slug: string; title: string; summary: string; sourceDir: string;
  roles: { name: string; role: string }[]; flow: string[]; pitfalls: string[];
  exerciseNotes: string[]; adaptation: string; inputHelp: string; breakpoint: string;
  request: { text: string; count: number; value: number; seed: number; fail: boolean };
};
export const bookChapters: BookChapter[] = [...first, ...second, ...third];
export function bookHref(slug: string) { return `/patterns/${slug === "factory-method" ? "factory" : slug}`; }
export function getBookChapter(slug: string) {
  const chapter = bookChapters.find(item => item.slug === slug);
  if (!chapter) throw new Error(`등록되지 않은 책 패턴: ${slug}`);
  return chapter;
}
