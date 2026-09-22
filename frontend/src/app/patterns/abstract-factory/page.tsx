import { BookPatternPage } from "@/components/book-pattern-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/patterns/abstract-factory");
export default function Page() { return <BookPatternPage slug="abstract-factory" />; }
