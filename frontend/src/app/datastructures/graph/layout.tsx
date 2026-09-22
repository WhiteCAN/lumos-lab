import type { ReactNode } from "react";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/datastructures/graph");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
