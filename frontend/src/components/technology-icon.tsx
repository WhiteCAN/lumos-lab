import Image from "next/image";
import { BotIcon, BracesIcon, CheckCircle2Icon, CircleDotIcon, DatabaseIcon, FileTextIcon, GitBranchIcon, SearchIcon, ServerIcon, ShieldCheckIcon, UserRoundIcon } from "lucide-react";

const brands = {
  redis: "Redis", react: "React", spring: "Spring", docker: "Docker",
  apachekafka: "Apache Kafka", postgresql: "PostgreSQL", kubernetes: "Kubernetes", github: "GitHub",
};
export type BrandName = keyof typeof brands;
const roles = {
  user: [UserRoundIcon, "text-sky-600 dark:text-sky-300"],
  server: [ServerIcon, "text-blue-600 dark:text-blue-300"],
  database: [DatabaseIcon, "text-indigo-600 dark:text-indigo-300"],
  model: [BotIcon, "text-violet-600 dark:text-violet-300"],
  document: [FileTextIcon, "text-amber-600 dark:text-amber-300"],
  search: [SearchIcon, "text-cyan-700 dark:text-cyan-300"],
  verify: [ShieldCheckIcon, "text-emerald-600 dark:text-emerald-300"],
  branch: [GitBranchIcon, "text-purple-600 dark:text-purple-300"],
  code: [BracesIcon, "text-orange-600 dark:text-orange-300"],
  done: [CheckCircle2Icon, "text-emerald-600 dark:text-emerald-300"],
  step: [CircleDotIcon, "text-sky-600 dark:text-sky-300"],
} as const;
export type FlowIconName = BrandName | keyof typeof roles;

export function TechnologyIcon({ name, className = "" }: { name: FlowIconName; className?: string }) {
  if (name in brands) {
    return <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5 ${className}`}>
      <Image src={`/brands/${name}.svg`} alt={brands[name as BrandName]} width={24} height={24} unoptimized className="h-auto w-6 shrink-0" />
    </span>;
  }
  const [Icon, color] = roles[name as keyof typeof roles];
  return <span aria-hidden="true" className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background/80 ${color} ${className}`}><Icon className="size-5" /></span>;
}
