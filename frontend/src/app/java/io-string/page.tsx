"use client";

import { FormEvent, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { API_BASE_URL } from "@/constants/api";
import { requestJson } from "@/services/http";
import { FileTextIcon, PlayIcon, QuoteIcon, RefreshCcwIcon } from "lucide-react";

type ParseResponse = {
  scannerTokens: string[];
  stringTokenizerTokens: string[];
  splitTokens: string[];
  recommendation: string;
  codeExample: string;
};

type ConcatResponse = {
  stringBuilderResult: string;
  stringBufferResult: string;
  resultLength: number;
  observations: string[];
  codeExample: string;
};

export default function JavaIoStringPage() {
  const [text, setText] = useState("10, 20, -3, 44");
  const [delimiter, setDelimiter] = useState(",");
  const [word, setWord] = useState("java");
  const [repeatCount, setRepeatCount] = useState(5);
  const [parseResult, setParseResult] = useState<ParseResponse | null>(null);
  const [concatResult, setConcatResult] = useState<ConcatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function parse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      setParseResult(await requestJson<ParseResponse>(`${API_BASE_URL}/api/java/io-string/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, delimiter }),
      }, "문자열 파싱 실패"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    }
  }

  async function concat() {
    setError(null);
    try {
      setConcatResult(await requestJson<ConcatResponse>(`${API_BASE_URL}/api/java/io-string/concat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, repeatCount }),
      }, "문자열 조립 실패"));
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
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Java 기초 / 입출력 / 문자열</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-sky-200 bg-sky-50/50 p-5 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
            <div className="flex items-start gap-3">
              <FileTextIcon className="mt-1 size-6 text-sky-700 dark:text-sky-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Scanner, BufferedReader, StringTokenizer</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  콘솔 입력은 편한 도구와 빠른 도구가 다릅니다. 여기서는 같은 문자열을 여러 방식으로 파싱하고,
                  문자열 반복 조립은 StringBuilder/StringBuffer 결과를 비교합니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form onSubmit={parse} className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <h2 className="text-lg font-semibold">파싱 실습 API</h2>
              <label className="mt-4 block text-sm font-medium">입력 문자열</label>
              <textarea value={text} onChange={(event) => setText(event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-lg border bg-background p-3 font-mono text-sm" />
              <label className="mt-4 block text-sm font-medium">구분자</label>
              <input value={delimiter} onChange={(event) => setDelimiter(event.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3 font-mono text-sm" />
              <Button className="mt-4 w-full"><PlayIcon />파싱 실행</Button>
            </form>

            <ResultPanel title="파싱 결과">
              {parseResult ? (
                <div className="grid gap-3">
                  <TokenLine label="Scanner" values={parseResult.scannerTokens} />
                  <TokenLine label="StringTokenizer" values={parseResult.stringTokenizerTokens} />
                  <TokenLine label="split" values={parseResult.splitTokens} />
                  <p className="rounded-md border bg-white/75 p-3 text-sm dark:bg-background/45">{parseResult.recommendation}</p>
                  <CodeBlock code={parseResult.codeExample} />
                </div>
              ) : "아직 실행 결과가 없습니다."}
            </ResultPanel>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
              <h2 className="text-lg font-semibold">문자열 조립 실습 API</h2>
              <label className="mt-4 block text-sm font-medium">반복할 단어</label>
              <input value={word} onChange={(event) => setWord(event.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3 font-mono text-sm" />
              <label className="mt-4 block text-sm font-medium">반복 횟수</label>
              <input type="number" min={1} max={10000} value={repeatCount} onChange={(event) => setRepeatCount(Number(event.target.value))} className="mt-2 w-full rounded-lg border bg-background p-3 font-mono text-sm" />
              <Button type="button" onClick={() => void concat()} className="mt-4 w-full"><QuoteIcon />문자열 조립</Button>
            </div>

            <ResultPanel title="조립 결과">
              {concatResult ? (
                <div className="grid gap-3">
                  <p className="text-sm">결과 길이: <span className="font-mono font-semibold">{concatResult.resultLength}</span></p>
                  <p className="rounded-md border bg-white/75 p-3 font-mono text-xs dark:bg-background/45">{concatResult.stringBuilderResult}</p>
                  {concatResult.observations.map((item) => <p key={item} className="text-sm text-muted-foreground">{item}</p>)}
                  <CodeBlock code={concatResult.codeExample} />
                </div>
              ) : "아직 실행 결과가 없습니다."}
            </ResultPanel>
          </section>

          {error ? <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function TokenLine({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="rounded-lg border bg-white/75 p-3 dark:bg-background/45">
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value, index) => <span key={`${label}-${value}-${index}`} className="rounded-md border bg-background px-2 py-1 font-mono text-xs">{value}</span>)}
      </div>
    </div>
  );
}

function ResultPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <RefreshCcwIcon className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-4 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return <pre className="overflow-auto rounded-lg border bg-zinc-950 p-4 text-xs leading-6 text-zinc-100"><code>{code.trim()}</code></pre>;
}
