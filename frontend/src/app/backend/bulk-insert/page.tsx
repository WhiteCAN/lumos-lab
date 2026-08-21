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
import { DatabaseIcon, PlayIcon, RouteIcon, TimerIcon } from "lucide-react";

type SimulationResponse = {
  mode: string;
  rowCount: number;
  batchSize: number;
  roundTrips: number;
  transactionCount: number;
  steps: string[];
  recommendation: string;
  codeExample: string;
};

type RunResponse = {
  mode: string;
  insertedRows: number;
  batchSize: number;
  elapsedMillis: number;
  steps: string[];
  codeExample: string;
};

export default function BulkInsertPage() {
  const [mode, setMode] = useState("BATCH_INSERT");
  const [rowCount, setRowCount] = useState(1000);
  const [batchSize, setBatchSize] = useState(100);
  const [simulation, setSimulation] = useState<SimulationResponse | null>(null);
  const [runResult, setRunResult] = useState<RunResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function simulate() {
    setError(null);
    try {
      setSimulation(await requestJson<SimulationResponse>(`${API_BASE_URL}/api/database/bulk-insert/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, rowCount, batchSize }),
      }, "벌크 인서트 시뮬레이션 실패"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    }
  }

  async function run() {
    setError(null);
    try {
      setRunResult(await requestJson<RunResponse>(`${API_BASE_URL}/api/database/bulk-insert/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, rowCount: Math.min(rowCount, 5000), batchSize: Math.min(batchSize, 1000) }),
      }, "벌크 인서트 실행 실패"));
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
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>DB 실습 / 벌크 인서트</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-rose-200 bg-rose-50/50 p-5 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20">
            <div className="flex items-start gap-3">
              <DatabaseIcon className="mt-1 size-6 text-rose-700 dark:text-rose-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Bulk Insert 실습</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  단건 insert, JDBC batch insert, DB 전용 bulk 적재는 DB 왕복 횟수와 트랜잭션 범위가 다릅니다.
                  먼저 시뮬레이션으로 감을 잡고, 실제 실행으로 현재 DB에서 시간을 확인합니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <div className="rounded-lg border border-sky-200 bg-sky-50/40 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
              <h2 className="text-lg font-semibold">입력값</h2>
              <label className="mt-4 block text-sm font-medium">모드</label>
              <select value={mode} onChange={(event) => setMode(event.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3 text-sm">
                <option value="SINGLE_INSERT">SINGLE_INSERT</option>
                <option value="BATCH_INSERT">BATCH_INSERT</option>
                <option value="BULK_INSERT">BULK_INSERT</option>
              </select>
              <label className="mt-4 block text-sm font-medium">rowCount</label>
              <input type="number" min={1} max={100000} value={rowCount} onChange={(event) => setRowCount(Number(event.target.value))} className="mt-2 w-full rounded-lg border bg-background p-3 font-mono text-sm" />
              <label className="mt-4 block text-sm font-medium">batchSize</label>
              <input type="number" min={1} max={5000} value={batchSize} onChange={(event) => setBatchSize(Number(event.target.value))} className="mt-2 w-full rounded-lg border bg-background p-3 font-mono text-sm" />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button onClick={() => void simulate()} variant="outline"><RouteIcon />시뮬레이션</Button>
                <Button onClick={() => void run()}><PlayIcon />실제 실행</Button>
              </div>
            </div>

            <section className="grid gap-4">
              <ResultCard title="시뮬레이션 결과" result={simulation} />
              <ResultCard title="실제 실행 결과" result={runResult} />
            </section>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["단건 insert", "루프마다 DB 왕복이 생겨 디버깅은 쉽지만 대량 처리에는 불리합니다."],
              ["batch insert", "여러 row를 묶어서 보내 왕복 횟수를 줄입니다. 애플리케이션에서 가장 먼저 적용하기 좋습니다."],
              ["bulk load", "COPY/LOAD DATA 같은 DB 전용 기능입니다. 빠르지만 DB 종속성과 운영 권한을 확인해야 합니다."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <TimerIcon className="size-4 text-emerald-700 dark:text-emerald-300" />
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

function ResultCard({ title, result }: { title: string; result: SimulationResponse | RunResponse | null }) {
  return (
    <article className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="border-b pb-3 text-lg font-semibold">{title}</h2>
      {result ? (
        <div className="mt-4 grid gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <Metric label="mode" value={result.mode} />
            <Metric label="rows" value={"rowCount" in result ? result.rowCount : result.insertedRows} />
            <Metric label={"roundTrips" in result ? "roundTrips" : "elapsed"} value={"roundTrips" in result ? result.roundTrips : `${result.elapsedMillis}ms`} />
          </div>
          {"transactionCount" in result ? <Metric label="transactionCount" value={result.transactionCount} /> : null}
          {result.steps.map((step) => <p key={step} className="rounded-md border bg-white/75 p-3 text-sm dark:bg-background/45">{step}</p>)}
          {"recommendation" in result ? <p className="rounded-md border bg-amber-50/70 p-3 text-sm dark:bg-amber-950/20">{result.recommendation}</p> : null}
          <pre className="overflow-auto rounded-lg border bg-zinc-950 p-4 text-xs leading-6 text-zinc-100"><code>{result.codeExample.trim()}</code></pre>
        </div>
      ) : <p className="mt-4 text-sm text-muted-foreground">아직 실행 결과가 없습니다.</p>}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-white/75 p-3 dark:bg-background/45">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}
