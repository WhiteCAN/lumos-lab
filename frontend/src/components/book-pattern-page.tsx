import { BookOpenIcon } from "lucide-react";
import { ReferencePage } from "@/components/reference-page";
import { BookPatternContent } from "@/components/book-pattern-content";
import { bookHref, getBookChapter } from "@/lib/book-patterns";

export function BookPatternPage({ slug }: { slug: string }) {
  const chapter = getBookChapter(slug);
  return <ReferencePage pageHref={bookHref(slug)} label={`책 예제 · ${chapter.chapter}장`} description={chapter.summary} icon={BookOpenIcon} colorClass="border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/20"><BookPatternContent slug={slug} withLab={false} /></ReferencePage>;
}
