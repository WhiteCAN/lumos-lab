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
import { CoffeeIcon, PlayIcon } from "lucide-react";

import { getStudyPage } from "@/lib/study-pages";

const studyPage = getStudyPage("/patterns/decorator");

type DecoratorResponse = {
  title: string;
  result: string;
  cost: number;
  decorators: string[];
  steps: string[];
  elapsedNanos: number;
};

export default function DecoratorPatternPage() {
  const [option, setOption] = useState("shot");
  const [result, setResult] = useState<DecoratorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/patterns/decorator/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option }),
      });
      const body = (await response.json()) as ApiResponse<DecoratorResponse>;
      if (!response.ok || !body.success || body.data == null) {
        throw new Error(body.message ?? "Decorator API request failed");
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
          <section className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-200">
              <CoffeeIcon className="size-4" />
              Decorator Pattern
            </div>
            <h1 className="mt-3 text-3xl font-bold">{studyPage.title}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Americano 객체를 Milk, Shot 데코레이터로 감싸 기능과 가격을 추가합니다.
            </p>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-2 text-sm font-medium">
                옵션
                <Input value={option} onChange={(event) => setOption(event.target.value)} placeholder="milk, shot" />
              </label>
              <Button disabled={loading} onClick={() => void run()}>
                <PlayIcon />
                {loading ? "실행 중..." : "Decorator API 호출"}
              </Button>
              {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
            </div>
          </section>
          <section className="rounded-lg border bg-card p-4 shadow-sm">
            {result ? (
              <>
                <h2 className="text-xl font-semibold">{result.title}</h2>
                <p className="mt-3 rounded-lg border bg-muted/30 p-3 font-semibold">{result.result} = {result.cost}원</p>
                <div className="mt-3 flex flex-wrap gap-2">{result.decorators.map((item) => <span key={item} className="rounded-md border bg-muted/40 px-2 py-1 font-mono text-xs">{item}</span>)}</div>
                <ol className="mt-4 max-h-[360px] overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-sm">{result.steps.map((step, index) => <li key={`${step}-${index}`} className="border-b py-2 last:border-b-0">{String(index + 1).padStart(2, "0")} {step}</li>)}</ol>
              </>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center text-muted-foreground">실행 결과가 여기에 표시됩니다.</div>
            )}
          </section>
          <BookPatternContent slug="decorator" />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
