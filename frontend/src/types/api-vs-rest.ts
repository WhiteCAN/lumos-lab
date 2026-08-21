import type { LucideIcon } from "lucide-react";

export type ApiRestSection = {
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  colorClass: string;
};

export type HttpMethodGuide = {
  method: string;
  purpose: string;
  example: string;
  colorClass: string;
};

export type ApiRestComparison = {
  api: string;
  rest: string;
};

export type ApiStyleGuide = {
  name: string;
  summary: string;
  bestFor: string;
  watchOut: string;
  example: string;
  colorClass: string;
};
