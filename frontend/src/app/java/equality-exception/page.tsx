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
import { AlertTriangleIcon, GitCompareArrowsIcon, PlayIcon } from "lucide-react";

type EqualityResponse = {
  scenario: string;
  results: { expression: string; value: boolean; reason: string }[];
  warning: string;
  codeExample: string;
};

type ExceptionResponse = {
  kind: string;
  steps: string[];
  whenToUse: string;
  codeExample: string;
};

export default function EqualityExceptionPage() {
  const [equalityScenario, setEqualityScenario] = useState("STRING");
  const [exceptionScenario, setExceptionScenario] = useState("CHECKED");
  const [equality, setEquality] = useState<EqualityResponse | null>(null);
  const [exceptionResult, setExceptionResult] = useState<ExceptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runEquality() {
    setError(null);
    try {
      setEquality(await requestJson<EqualityResponse>(`${API_BASE_URL}/api/java/equality/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: equalityScenario }),
      }, "비교 실습 실패"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    }
  }

  async function runException() {
    setError(null);
    try {
      setExceptionResult(await requestJson<ExceptionResponse>(`${API_BASE_URL}/api/java/exception/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: exceptionScenario }),
      }, "예외 실습 실패"));
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
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Java 기초 / 비교 / 예외</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-fuchsia-200 bg-fuchsia-50/50 p-5 shadow-sm dark:border-fuchsia-900/60 dark:bg-fuchsia-950/20">
            <h1 className="text-3xl font-bold tracking-tight">==, equals, hashCode / 예외 처리</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              자바에서 많이 헷갈리는 비교 기준과 예외 종류를 API 결과로 확인합니다.
            </p>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-lg border border-sky-200 bg-sky-50/40 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
              <div className="flex items-center gap-2">
                <GitCompareArrowsIcon className="size-4" />
                <h2 className="text-lg font-semibold">비교 실습 API</h2>
              </div>
              <select value={equalityScenario} onChange={(event) => setEqualityScenario(event.target.value)} className="mt-4 w-full rounded-lg border bg-background p-3 text-sm">
                <option value="STRING">String 비교</option>
                <option value="OBJECT">객체 비교</option>
              </select>
              <Button onClick={() => void runEquality()} className="mt-4 w-full"><PlayIcon />비교 실행</Button>
              {equality ? (
                <div className="mt-4 grid gap-3">
                  {equality.results.map((result) => (
                    <div key={result.expression} className="rounded-lg border bg-white/75 p-3 dark:bg-background/45">
                      <p className="font-mono text-sm">{result.expression} = <span className={result.value ? "text-emerald-600" : "text-rose-600"}>{String(result.value)}</span></p>
                      <p className="mt-2 text-sm text-muted-foreground">{result.reason}</p>
                    </div>
                  ))}
                  <p className="rounded-md border bg-amber-50/70 p-3 text-sm dark:bg-amber-950/20">{equality.warning}</p>
                  <pre className="overflow-auto rounded-lg border bg-zinc-950 p-4 text-xs leading-6 text-zinc-100"><code>{equality.codeExample.trim()}</code></pre>
                </div>
              ) : null}
            </article>

            <article className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="size-4" />
                <h2 className="text-lg font-semibold">예외 실습 API</h2>
              </div>
              <select value={exceptionScenario} onChange={(event) => setExceptionScenario(event.target.value)} className="mt-4 w-full rounded-lg border bg-background p-3 text-sm">
                <option value="CHECKED">Checked Exception</option>
                <option value="UNCHECKED">Unchecked Exception</option>
              </select>
              <Button onClick={() => void runException()} className="mt-4 w-full"><PlayIcon />예외 실행</Button>
              {exceptionResult ? (
                <div className="mt-4 grid gap-3">
                  {exceptionResult.steps.map((step) => <p key={step} className="rounded-lg border bg-white/75 p-3 text-sm dark:bg-background/45">{step}</p>)}
                  <p className="rounded-md border bg-emerald-50/70 p-3 text-sm dark:bg-emerald-950/20">{exceptionResult.whenToUse}</p>
                  <pre className="overflow-auto rounded-lg border bg-zinc-950 p-4 text-xs leading-6 text-zinc-100"><code>{exceptionResult.codeExample.trim()}</code></pre>
                </div>
              ) : null}
            </article>
          </section>

          {error ? <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
