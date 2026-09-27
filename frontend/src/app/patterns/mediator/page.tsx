import { BookPatternPage } from "@/components/book-pattern-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/patterns/mediator");
export default function Page() { return <BookPatternPage slug="mediator" />; }
