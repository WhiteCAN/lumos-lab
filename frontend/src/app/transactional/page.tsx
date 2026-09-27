"use client";

import { useState } from "react";
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
  AlertTriangleIcon,
  CheckCircle2Icon,
  DatabaseIcon,
  PlayIcon,
  RefreshCcwIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { getStudyPage } from "@/lib/study-pages";

const studyPage = getStudyPage("/transactional");

type TransactionalScenario =
  | "NORMAL_COMMIT"
  | "RUNTIME_EXCEPTION_ROLLBACK"
  | "CHECKED_EXCEPTION_DEFAULT_COMMIT"
  | "CHECKED_EXCEPTION_ROLLBACK_FOR";

type TransactionalLog = {
  id: number;
  scenario: string;
  message: string;
  createdAt: string;
};

type TransactionalResponse = {
  scenario: TransactionalScenario;
  result: string;
  beforeCount: number;
  afterCount: number;
  beforeLogs: TransactionalLog[];
  afterLogs: TransactionalLog[];
  steps: string[];
};

const scenarios: {
  id: TransactionalScenario;
  title: string;
  description: string;
  expected: string;
  tone: string;
}[] = [
  {
    id: "NORMAL_COMMIT",
    title: "정상 커밋",
    description: "저장 후 예외 없이 메서드가 끝납니다.",
    expected: "로그 +1",
    tone: "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20",
  },
  {
    id: "RUNTIME_EXCEPTION_ROLLBACK",
    title: "RuntimeException 롤백",
    description: "저장 후 런타임 예외를 던져 기본 롤백을 확인합니다.",
    expected: "로그 변화 없음",
    tone: "border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20",
  },
  {
    id: "CHECKED_EXCEPTION_DEFAULT_COMMIT",
    title: "Checked 예외 기본 커밋",
    description: "checked exception은 기본 롤백 대상이 아니라는 점을 확인합니다.",
    expected: "로그 +1",
    tone: "border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20",
  },
  {
    id: "CHECKED_EXCEPTION_ROLLBACK_FOR",
    title: "Checked 예외 rollbackFor",
    description: "rollbackFor를 걸면 checked exception도 롤백됩니다.",
    expected: "로그 변화 없음",
    tone: "border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20",
  },
];

export default function TransactionalPage() {
  const [label, setLabel] = useState("debug-run");
  const [result, setResult] = useState<TransactionalResponse | null>(null);
  const [logs, setLogs] = useState<TransactionalLog[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function parseResponse<T>(response: Response) {
    const body = (await response.json()) as ApiResponse<T>;
    if (!response.ok || !body.success || body.data == null) {
      throw new Error(body.message ?? "요청 실패");
    }
    return body.data;
  }

  async function runScenario(scenario: TransactionalScenario) {
    setLoading(scenario);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/concepts/transactional/run/${scenario}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ label }),
        },
      );
      const data = await parseResponse<TransactionalResponse>(response);
      setResult(data);
      setLogs(data.afterLogs);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  }

  async function refreshLogs() {
    setLoading("refresh");
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/concepts/transactional/logs`);
      setLogs(await parseResponse<TransactionalLog[]>(response));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  }

  async function clearLogs() {
    setLoading("clear");
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/concepts/transactional/logs`, {
        method: "DELETE",
      });
      setLogs(await parseResponse<TransactionalLog[]>(response));
      setResult(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  }

  const delta = result ? result.afterCount - result.beforeCount : 0;

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
          <section className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/20">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-200">
                  <ShieldCheckIcon className="size-4" />
                  Spring @Transactional 실험실
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">{studyPage.title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  H2 메모리 DB에 로그를 저장한 뒤 예외 종류별로 커밋되는지
                  롤백되는지 비교합니다. IntelliJ에서는 `TransactionalWorker`의
                  각 메서드에 브레이크포인트를 걸고 따라가면 흐름이 잘 보입니다.
                </p>
              </div>
              <div className="grid min-w-72 gap-2">
                <label htmlFor="label" className="text-sm font-medium">
                  테스트 라벨
                </label>
                <input
                  id="label"
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[430px_1fr]">
            <div className="grid gap-4">
              <section className="grid gap-3 rounded-lg border border-teal-200 bg-teal-50/50 p-4 shadow-sm dark:border-teal-900/60 dark:bg-teal-950/20">
                <h2 className="text-lg font-semibold">핵심 규칙</h2>
                <RuleLine
                  icon={<CheckCircle2Icon className="size-4" />}
                  title="기본 롤백"
                  description="RuntimeException과 Error는 기본적으로 롤백됩니다."
                />
                <RuleLine
                  icon={<AlertTriangleIcon className="size-4" />}
                  title="Checked Exception"
                  description="Exception 같은 checked exception은 기본 설정만으로는 커밋됩니다."
                />
                <RuleLine
                  icon={<RotateCcwIcon className="size-4" />}
                  title="rollbackFor"
                  description="@Transactional(rollbackFor = ...)로 checked exception도 롤백 대상에 넣을 수 있습니다."
                />
              </section>

              <section className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">시나리오 실행</h2>
                  <span className="rounded-md border px-2.5 py-1 text-xs text-muted-foreground">
                    현재 로그 {logs.length}개
                  </span>
                </div>
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    disabled={loading !== null}
                    onClick={() => void runScenario(scenario.id)}
                    className={`rounded-lg border p-3 text-left shadow-sm transition hover:translate-y-[-1px] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${scenario.tone}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{scenario.title}</span>
                      <span className="rounded-md border bg-white/70 px-2 py-1 text-xs font-medium dark:bg-background/45">
                        {scenario.expected}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {scenario.description}
                    </p>
                  </button>
                ))}
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading !== null}
                    onClick={() => void refreshLogs()}
                  >
                    <RefreshCcwIcon />
                    로그 새로고침
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={loading !== null}
                    onClick={() => void clearLogs()}
                  >
                    <DatabaseIcon />
                    로그 초기화
                  </Button>
                </div>
                {error ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                ) : null}
              </section>
            </div>

            <section className="grid gap-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <MetricCard title="실행 전" value={result ? result.beforeCount : logs.length} />
                <MetricCard title="실행 후" value={result ? result.afterCount : logs.length} />
                <MetricCard
                  title="변화량"
                  value={result ? delta : 0}
                  suffix={result ? result.result : "대기 중"}
                />
              </div>

              <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
                <div className="flex items-center justify-between gap-3 border-b pb-3">
                  <h2 className="text-lg font-semibold">실행 단계</h2>
                  <span className="rounded-md border bg-white/70 px-3 py-1 text-xs font-medium dark:bg-background/45">
                    {loading ? "실행 중..." : result?.scenario ?? "선택 대기"}
                  </span>
                </div>
                {result ? (
                  <ol className="mt-3 grid gap-2">
                    {result.steps.map((step, index) => (
                      <li
                        key={`${step}-${index}`}
                        className="rounded-md border bg-white/70 p-3 text-sm leading-6 dark:bg-background/45"
                      >
                        <span className="mr-2 font-mono text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="mt-3 flex min-h-40 items-center justify-center rounded-lg border border-dashed bg-white/50 p-6 text-sm text-muted-foreground dark:bg-background/30">
                    왼쪽에서 시나리오를 실행하면 단계가 표시됩니다.
                  </div>
                )}
              </section>

              <section className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b pb-3">
                  <h2 className="text-lg font-semibold">DB 저장 로그</h2>
                  <Button
                    type="button"
                    size="sm"
                    disabled={loading !== null}
                    onClick={() => void refreshLogs()}
                  >
                    <PlayIcon />
                    조회
                  </Button>
                </div>
                {logs.length > 0 ? (
                  <div className="mt-3 grid gap-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-lg border bg-muted/30 p-3 text-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            #{log.id} {log.scenario}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-2 leading-6">{log.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 flex min-h-40 items-center justify-center rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                    저장된 로그가 없습니다. 커밋되는 시나리오를 실행해보세요.
                  </div>
                )}
              </section>
            </section>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function RuleLine({
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

function MetricCard({
  title,
  value,
  suffix,
}: {
  title: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/30">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 min-h-5 text-xs text-muted-foreground">
        {suffix ?? "로그 개수"}
      </p>
    </div>
  );
}
