import { BookPatternPage } from "@/components/book-pattern-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/patterns/template-method");
export default function Page() { return <BookPatternPage slug="template-method" />; }
