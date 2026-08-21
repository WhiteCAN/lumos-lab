import type { LucideIcon } from "lucide-react";

export type ProtocolIntro = {
  name: string;
  fullName: string;
  summary: string;
  keyPoints: string[];
  colorClass: string;
  icon: LucideIcon;
};

export type ProtocolComparison = {
  feature: string;
  tcp: string;
  udp: string;
};

export type ProtocolUseCase = {
  protocol: "TCP" | "UDP";
  items: string[];
};

export type HeaderFieldGroup = {
  title: string;
  fields: string[];
  colorClass: string;
};
