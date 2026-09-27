"use client";

import { BookPatternContent } from "@/components/book-pattern-content";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { API_BASE_URL } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { GitBranchIcon, PlayIcon } from "lucide-react";

import { getStudyPage } from "@/lib/study-pages";

const studyPage = getStudyPage("/patterns/strategy");

type StrategyResponse = {
  title: string;
  selectedStrategy: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  steps: string[];
  elapsedNanos: number;
};

export default function StrategyPatternPage() {
  const [grade, setGrade] = useState("gold");
  const [amount, setAmount] = useState(10000);
  const [result, setResult] = useState<StrategyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/patterns/strategy/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, amount }),
      });
      const body = (await response.json()) as ApiResponse<StrategyResponse>;
      if (!response.ok || !body.success || body.data == null) {
        throw new Error(body.message ?? "Strategy API request failed");
      }
      setResult(body.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>{studyPage.category} &gt; {studyPage.title}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>
        <main className="grid gap-4 p-4 xl:grid-cols-[420px_1fr]">
          <section className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-200">
              <GitBranchIcon className="size-4" />
              Strategy Pattern
            </div>
            <h1 className="mt-3 text-3xl font-bold">{studyPage.title}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              고객 등급에 따라 할인 전략 객체를 선택합니다. 정렬/검색 코드와 별개인 독립 예제입니다.
            </p>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-2 text-sm font-medium">
                고객 등급
                <Input value={grade} onChange={(event) => setGrade(event.target.value)} placeholder="basic, gold, vip" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                주문 금액
                <Input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
              </label>
              <Button disabled={loading} onClick={() => void run()}>
                <PlayIcon />
                {loading ? "실행 중..." : "Strategy API 호출"}
              </Button>
              {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
            </div>
          </section>
          <ResultPanel result={result} />
          <BookPatternContent slug="strategy" />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ResultPanel({ result }: { result: StrategyResponse | null }) {
  if (!result) {
    return <section className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed bg-muted/40 p-8 text-muted-foreground">실행 결과가 여기에 표시됩니다.</section>;
  }
  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="text-xl font-semibold">{result.title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Metric title="선택 전략" value={result.selectedStrategy} />
        <Metric title="할인 금액" value={`${result.discountAmount}원`} />
        <Metric title="최종 금액" value={`${result.finalAmount}원`} />
      </div>
      <ol className="mt-4 max-h-[360px] overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-sm">
        {result.steps.map((step, index) => <li key={`${step}-${index}`} className="border-b py-2 last:border-b-0">{String(index + 1).padStart(2, "0")} {step}</li>)}
      </ol>
    </section>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return <div className="rounded-lg border bg-muted/30 p-3"><p className="text-sm text-muted-foreground">{title}</p><p className="mt-2 font-semibold">{value}</p></div>;
}
