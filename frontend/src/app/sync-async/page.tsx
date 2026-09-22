"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { API_BASE_URL } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  CheckCircle2Icon,
  ClockIcon,
  GitCompareArrowsIcon,
  PlayIcon,
  RefreshCcwIcon,
  ZapIcon,
} from "lucide-react";

import { getStudyPage } from "@/lib/study-pages";

const studyPage = getStudyPage("/sync-async");

type TaskResult = {
  taskNumber: number;
  delayMillis: number;
  message: string;
};

type TaskResponse = {
  mode: "SYNC" | "ASYNC";
  delaysMillis: number[];
  results: TaskResult[];
  steps: string[];
  elapsedMillis: number;
};

const defaultDelays = "1000, 1000, 1000";

export default function SyncAsyncPage() {
  const [delaysText, setDelaysText] = useState(defaultDelays);
  const [syncResult, setSyncResult] = useState<TaskResponse | null>(null);
  const [asyncResult, setAsyncResult] = useState<TaskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMode, setLoadingMode] = useState<"SYNC" | "ASYNC" | null>(null);

  const delays = useMemo(() => {
    return delaysText
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value))
      .map((value) => Math.min(Math.max(value, 100), 3000));
  }, [delaysText]);

  async function run(mode: "SYNC" | "ASYNC") {
    setLoadingMode(mode);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/concepts/sync-async/${mode.toLowerCase()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ delaysMillis: delays }),
        },
      );
      const body = (await response.json()) as ApiResponse<TaskResponse>;

      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.message ?? `${mode} request failed`);
      }

      if (mode === "SYNC") {
        setSyncResult(body.data);
      } else {
        setAsyncResult(body.data);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
    } finally {
      setLoadingMode(null);
    }
  }

  async function runBoth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSyncResult(null);
    setAsyncResult(null);
    await run("SYNC");
    await run("ASYNC");
  }

  function reset() {
    setDelaysText(defaultDelays);
    setSyncResult(null);
    setAsyncResult(null);
    setError(null);
  }

  const expectedSync = delays.reduce((sum, delay) => sum + delay, 0);
  const expectedAsync = delays.length > 0 ? Math.max(...delays) : 0;

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
                  <BreadcrumbPage>{studyPage.category} &gt; {studyPage.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-blue-200 bg-blue-50/50 p-5 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-200">
                  <GitCompareArrowsIcon className="size-4" />
                  실행 방식 비교 실험실
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">{studyPage.title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  같은 작업 목록을 백엔드에서 순차 실행과 병렬 실행으로 돌려보고,
                  실제 걸린 시간을 비교합니다. IntelliJ에서
                  `SyncAsyncService.runSync`와 `runAsync`에 브레이크포인트를 걸어
                  흐름을 따라가면 좋습니다.
                </p>
              </div>
              <div className="rounded-lg border bg-white/70 p-4 text-sm dark:bg-background/45">
                <p className="font-semibold">예상 시간</p>
                <p className="mt-1 text-muted-foreground">
                  동기 약 {expectedSync}ms · 비동기 약 {expectedAsync}ms
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form
              onSubmit={runBoth}
              className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="grid gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
                <h2 className="text-lg font-semibold">개념 요약</h2>
                <ConceptLine
                  icon={<ClockIcon className="size-4" />}
                  title="동기"
                  description="앞 작업이 끝나야 다음 작업을 시작합니다. 흐름은 단순하지만 전체 시간이 길어질 수 있습니다."
                />
                <ConceptLine
                  icon={<ZapIcon className="size-4" />}
                  title="비동기"
                  description="여러 작업을 먼저 시작하고 완료 결과를 나중에 모읍니다. 독립적인 작업이면 전체 시간이 줄어듭니다."
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="delays" className="text-sm font-medium">
                  작업 딜레이 목록(ms)
                </label>
                <textarea
                  id="delays"
                  value={delaysText}
                  onChange={(event) => setDelaysText(event.target.value)}
                  rows={4}
                  className="resize-none rounded-lg border border-input bg-background p-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="1000, 1000, 1000"
                />
                <p className="text-xs text-muted-foreground">
                  100~3000ms 사이로 보정됩니다. 현재 작업: [{delays.join(", ")}]
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingMode !== null || delays.length === 0}
                  onClick={() => void run("SYNC")}
                >
                  <ClockIcon />
                  동기 실행
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingMode !== null || delays.length === 0}
                  onClick={() => void run("ASYNC")}
                >
                  <ZapIcon />
                  비동기 실행
                </Button>
                <Button
                  type="submit"
                  disabled={loadingMode !== null || delays.length === 0}
                  className="sm:col-span-2"
                >
                  <PlayIcon />
                  {loadingMode ? `${loadingMode} 실행 중...` : "둘 다 실행해서 비교"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={loadingMode !== null}
                  onClick={reset}
                  className="sm:col-span-2"
                >
                  <RefreshCcwIcon />
                  초기화
                </Button>
              </div>

              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
            </form>

            <section className="grid gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <ResultCard title="동기 실행 결과" result={syncResult} tone="blue" />
                <ResultCard title="비동기 실행 결과" result={asyncResult} tone="emerald" />
              </div>

              <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
                <h2 className="text-lg font-semibold">읽는 법</h2>
                <ul className="mt-3 grid gap-2 text-sm leading-6">
                  <li className="flex gap-2">
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
                    동기는 작업 시간이 거의 합산됩니다.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
                    비동기는 독립적인 작업이면 가장 오래 걸린 작업 시간에 가까워집니다.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
                    모든 작업이 비동기에 적합한 것은 아닙니다. 앞 작업 결과가
                    다음 작업 입력이면 순차 흐름이 필요합니다.
                  </li>
                </ul>
              </div>
            </section>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ConceptLine({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-white/70 p-3 dark:bg-background/45">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ResultCard({
  title,
  result,
  tone,
}: {
  title: string;
  result: TaskResponse | null;
  tone: "blue" | "emerald";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20"
      : "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20";

  return (
    <div className={`rounded-lg border p-4 shadow-sm ${toneClass}`}>
      <div className="flex items-center justify-between gap-3 border-b pb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="rounded-md border bg-white/70 px-3 py-1.5 text-sm font-medium dark:bg-background/45">
          {result ? `${result.elapsedMillis}ms` : "대기 중"}
        </span>
      </div>

      {result ? (
        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            {result.results.map((task) => (
              <div
                key={`${result.mode}-${task.taskNumber}`}
                className="flex items-center justify-between rounded-md border bg-white/70 px-3 py-2 text-sm dark:bg-background/45"
              >
                <span>작업 {task.taskNumber}</span>
                <span className="font-mono">{task.delayMillis}ms</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">단계 로그</h3>
            <ol className="max-h-60 overflow-auto rounded-lg border bg-white/70 p-3 font-mono text-xs dark:bg-background/45">
              {result.steps.map((step, index) => (
                <li key={`${result.mode}-${step}-${index}`} className="border-b py-2 last:border-b-0">
                  <span className="mr-2 text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex min-h-56 items-center justify-center rounded-lg border border-dashed bg-white/50 p-6 text-sm text-muted-foreground dark:bg-background/30">
          아직 실행 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
