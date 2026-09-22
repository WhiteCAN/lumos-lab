import type { ReactNode } from "react";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/java/collections");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
