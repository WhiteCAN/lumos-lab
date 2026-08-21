"use client";

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
import { PlayIcon, Undo2Icon } from "lucide-react";

type CommandResponse = {
  title: string;
  status: string;
  history: string[];
  steps: string[];
  elapsedNanos: number;
};

export default function CommandPatternPage() {
  const [action, setAction] = useState("off");
  const [result, setResult] = useState<CommandResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/patterns/command/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const body = (await response.json()) as ApiResponse<CommandResponse>;
      if (!response.ok || !body.success || body.data == null) {
        throw new Error(body.message ?? "Command API request failed");
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
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Patterns / Command</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>
        <main className="grid gap-4 p-4 xl:grid-cols-[420px_1fr]">
          <section className="rounded-lg border border-violet-200 bg-violet-50/50 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
            <div className="flex items-center gap-2 text-sm font-medium text-violet-700 dark:text-violet-200">
              <Undo2Icon className="size-4" />
              Command Pattern
            </div>
            <h1 className="mt-3 text-3xl font-bold">커맨드 패턴 실험실</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              전등 켜기/끄기 요청을 Command 객체로 만들고 RemoteControl이 실행 및 undo를 처리합니다.
            </p>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-2 text-sm font-medium">
                액션
                <Input value={action} onChange={(event) => setAction(event.target.value)} placeholder="on, off, 끄기" />
              </label>
              <Button disabled={loading} onClick={() => void run()}>
                <PlayIcon />
                {loading ? "실행 중..." : "Command API 호출"}
              </Button>
              {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
            </div>
          </section>
          <section className="rounded-lg border bg-card p-4 shadow-sm">
            {result ? (
              <>
                <h2 className="text-xl font-semibold">{result.title}</h2>
                <p className="mt-3 rounded-lg border bg-muted/30 p-3 font-semibold">현재 전등 상태: {result.status}</p>
                <div className="mt-3 flex flex-wrap gap-2">{result.history.map((item) => <span key={item} className="rounded-md border bg-muted/40 px-2 py-1 font-mono text-xs">{item}</span>)}</div>
                <ol className="mt-4 max-h-[360px] overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-sm">{result.steps.map((step, index) => <li key={`${step}-${index}`} className="border-b py-2 last:border-b-0">{String(index + 1).padStart(2, "0")} {step}</li>)}</ol>
              </>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center text-muted-foreground">실행 결과가 여기에 표시됩니다.</div>
            )}
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
