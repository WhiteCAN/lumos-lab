import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { aiConcepts } from "@/constants/ai-concepts";
import type { AiConcept } from "@/types/ai-concepts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  CheckCircle2Icon,
  LightbulbIcon,
  SparklesIcon,
} from "lucide-react";

const conceptColors = [
  "border-sky-200 bg-sky-50/70 dark:border-sky-900/70 dark:bg-sky-950/30",
  "border-violet-200 bg-violet-50/70 dark:border-violet-900/70 dark:bg-violet-950/30",
  "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/70 dark:bg-emerald-950/30",
  "border-amber-200 bg-amber-50/70 dark:border-amber-900/70 dark:bg-amber-950/30",
  "border-rose-200 bg-rose-50/70 dark:border-rose-900/70 dark:bg-rose-950/30",
  "border-cyan-200 bg-cyan-50/70 dark:border-cyan-900/70 dark:bg-cyan-950/30",
  "border-indigo-200 bg-indigo-50/70 dark:border-indigo-900/70 dark:bg-indigo-950/30",
  "border-lime-200 bg-lime-50/70 dark:border-lime-900/70 dark:bg-lime-950/30",
  "border-orange-200 bg-orange-50/70 dark:border-orange-900/70 dark:bg-orange-950/30",
];

const conceptBadges = [
  "bg-sky-600 text-white dark:bg-sky-400 dark:text-sky-950",
  "bg-violet-600 text-white dark:bg-violet-400 dark:text-violet-950",
  "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950",
  "bg-amber-500 text-white dark:bg-amber-300 dark:text-amber-950",
  "bg-rose-600 text-white dark:bg-rose-400 dark:text-rose-950",
  "bg-cyan-600 text-white dark:bg-cyan-400 dark:text-cyan-950",
  "bg-indigo-600 text-white dark:bg-indigo-400 dark:text-indigo-950",
  "bg-lime-600 text-white dark:bg-lime-300 dark:text-lime-950",
  "bg-orange-600 text-white dark:bg-orange-400 dark:text-orange-950",
];

export default function AiConceptsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Reference / AI Concepts 2026</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="overflow-hidden rounded-lg border border-sky-200 bg-card text-card-foreground shadow-sm dark:border-sky-900/60">
            <div className="border-b border-sky-200 bg-sky-50/80 p-5 dark:border-sky-900/60 dark:bg-sky-950/30">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex rounded-md border border-sky-200 bg-white px-3 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-200">
                    AI 실전 가이드 · 2026
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                    2026 AI 핵심 개념 9가지
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    이미지 내용을 웹페이지로 재구성한 정적 참고 페이지입니다.
                    AI 프로젝트를 만들거나 공부할 때 자주 등장하는 개념을 한
                    화면에서 빠르게 훑어볼 수 있게 정리했습니다.
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-white p-4 text-sm text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-200">
                  <p className="font-medium text-foreground">핵심 흐름</p>
                  <p className="mt-1">도구 연결 · 비용 관리 · 품질 평가 · 운영 안정성</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {aiConcepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  colorClass={conceptColors[(concept.id - 1) % conceptColors.length]}
                  badgeClass={conceptBadges[(concept.id - 1) % conceptBadges.length]}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <div className="flex items-center gap-2">
                <LightbulbIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">이 9가지를 왜 알아야 할까?</h2>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <ReasonCard
                  title="AI가 앱 기능이 아니라 운영 시스템이 됨"
                  description="모델 호출만 알면 부족하고, 비용, 평가, 로그, 안전장치까지 함께 봐야 합니다."
                />
                <ReasonCard
                  title="에이전트는 도구 연결이 핵심"
                  description="Model Context Protocol, AI Gateway, Multi-Agent Systems 구조를 이해하면 더 복잡한 자동화를 설계할 수 있습니다."
                />
                <ReasonCard
                  title="품질은 감이 아니라 측정"
                  description="Evals와 Observability가 있어야 모델과 프롬프트 변경의 효과를 비교할 수 있습니다."
                />
                <ReasonCard
                  title="안전과 비용이 실무의 승부처"
                  description="Guardrails와 Inference Cost Economics를 모르면 서비스가 커질수록 운영이 어려워집니다."
                />
              </div>
            </div>

            <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-5 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
              <div className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">학습 순서 추천</h2>
              </div>
              <ol className="mt-4 grid gap-3">
                {[
                  "Agentic Loop",
                  "Model Context Protocol",
                  "AI Gateway",
                  "Inference Cost Economics",
                  "Evals & Observability",
                  "Guardrails",
                  "Subagents & Multi-Agent Systems",
                  "The Bitter Lesson",
                ].map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="leading-6">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  이 개념들을 이해하면 AI 프로젝트 설계가 달라집니다
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  단순히 모델을 호출하는 단계에서 벗어나, 도구 연결, 품질 측정,
                  비용 최적화, 안전한 운영까지 생각하는 구조로 확장할 수 있습니다.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm font-medium">
                <CheckCircle2Icon className="size-4" />
                저장해두고 반복해서 보기
              </div>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ConceptCard({
  concept,
  colorClass,
  badgeClass,
}: {
  concept: AiConcept;
  colorClass: string;
  badgeClass: string;
}) {
  const Icon = concept.icon;

  return (
    <article className={`flex min-h-80 flex-col gap-4 rounded-lg border p-4 shadow-sm ${colorClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${badgeClass}`}>
            {concept.id}
          </span>
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              {concept.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {concept.subtitle}
            </p>
          </div>
        </div>
        <Icon className="size-5 shrink-0 text-muted-foreground" />
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        {concept.summary}
      </p>

      <div>
        <h3 className="mb-2 text-sm font-medium">흐름</h3>
        <div className="flex flex-wrap gap-2">
          {concept.flow.map((item, index) => (
            <span
              key={`${concept.id}-${item}`}
              className="rounded-md border bg-white/70 px-2 py-1 font-mono text-xs dark:bg-background/50"
            >
              {index + 1}. {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto grid gap-3 rounded-lg border bg-white/65 p-3 dark:bg-background/45">
        <InfoLine title="실무 예시" value={concept.practicalUse} />
        <InfoLine title="기억할 점" value={concept.keyPoint} />
      </div>
    </article>
  );
}

function InfoLine({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground">{title}</h3>
      <p className="mt-1 text-sm leading-6">{value}</p>
    </div>
  );
}

function ReasonCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-white/70 p-4 dark:bg-background/45">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
