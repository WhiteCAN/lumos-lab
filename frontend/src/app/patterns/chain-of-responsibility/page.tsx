import { BookPatternPage } from "@/components/book-pattern-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/patterns/chain-of-responsibility");
export default function Page() { return <BookPatternPage slug="chain-of-responsibility" />; }
