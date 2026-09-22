import { BookPatternPage } from "@/components/book-pattern-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/patterns/visitor");
export default function Page() { return <BookPatternPage slug="visitor" />; }
