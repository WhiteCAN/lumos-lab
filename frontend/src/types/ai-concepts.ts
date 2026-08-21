import type { LucideIcon } from "lucide-react";

export type AiConcept = {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  flow: string[];
  practicalUse: string;
  keyPoint: string;
  icon: LucideIcon;
};
