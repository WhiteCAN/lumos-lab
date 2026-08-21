"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { API_BASE_URL } from "@/constants/api";
import { requestJson } from "@/services/http";
import { GitBranchIcon, LockIcon, PlayIcon, WorkflowIcon } from "lucide-react";

type ConcurrencyResponse = {
  scenario: string;
  steps: string[];
  caution: string;
  codeExample: string;
};

export default function JavaConcurrencyPage() {
  const [scenario, setScenario] = useState("COMPLETABLE_FUTURE");
  const [taskCount, setTaskCount] = useState(3);
  const [result, setResult] = useState<ConcurrencyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    try {
      setResult(await requestJson<ConcurrencyResponse>(`${API_BASE_URL}/api/java/concurrency/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, taskCount }),
      }, "동시성 실습 실패"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Java 기초 / 동시성</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-cyan-200 bg-cyan-50/50 p-5 shadow-sm dark:border-cyan-900/60 dark:bg-cyan-950/20">
            <div className="flex items-start gap-3">
              <WorkflowIcon className="mt-1 size-6 text-cyan-700 dark:text-cyan-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Thread, Executor, CompletableFuture, synchronized</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  동시성은 “작업을 어떻게 나누고, 완료를 어떻게 모으고, 공유 자원을 어떻게 보호할지”가 핵심입니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
              <h2 className="text-lg font-semibold">동시성 흐름 API</h2>
              <label className="mt-4 block text-sm font-medium">시나리오</label>
              <select value={scenario} onChange={(event) => setScenario(event.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3 text-sm">
                <option value="COMPLETABLE_FUTURE">CompletableFuture</option>
                <option value="SYNCHRONIZED">synchronized</option>
              </select>
              <label className="mt-4 block text-sm font-medium">작업 개수</label>
              <input type="number" min={1} max={10} value={taskCount} onChange={(event) => setTaskCount(Number(event.target.value))} className="mt-2 w-full rounded-lg border bg-background p-3 font-mono text-sm" />
              <Button onClick={() => void run()} className="mt-4 w-full"><PlayIcon />흐름 확인</Button>
            </div>

            <section className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="border-b pb-3 text-lg font-semibold">결과</h2>
              {result ? (
                <div className="mt-4 grid gap-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    {result.steps.map((step, index) => (
                      <div key={`${step}-${index}`} className="rounded-lg border bg-white/75 p-3 text-sm dark:bg-background/45">
                        <span className="mr-2 font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                  <p className="rounded-md border border-amber-200 bg-amber-50/70 p-3 text-sm dark:border-amber-900/60 dark:bg-amber-950/20">
                    <LockIcon className="mr-2 inline size-4" />{result.caution}
                  </p>
                  <pre className="overflow-auto rounded-lg border bg-zinc-950 p-4 text-xs leading-6 text-zinc-100"><code>{result.codeExample.trim()}</code></pre>
                </div>
              ) : <p className="mt-4 text-sm text-muted-foreground">아직 실행 결과가 없습니다.</p>}
            </section>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["Thread", "직접 스레드를 만들 수 있지만 애플리케이션에서는 보통 Executor를 씁니다."],
              ["ExecutorService", "스레드 풀로 작업 제출과 스레드 생명주기를 분리합니다."],
              ["CompletableFuture", "비동기 작업 조합과 완료 수집을 표현하기 좋습니다."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <GitBranchIcon className="size-4 text-emerald-700 dark:text-emerald-300" />
                <h2 className="mt-3 font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </section>

          {error ? <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
