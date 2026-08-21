"use client";

import { FormEvent, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { API_BASE_URL } from "@/constants/api";
import { requestJson } from "@/services/http";
import { AlertTriangleIcon, BotIcon, FileSearchIcon, MessageCircleQuestionIcon, PlayIcon, QuoteIcon } from "lucide-react";

type RagCitation = {
  documentId: number;
  title: string;
  source: string;
  chunkIndex: number;
  quote: string;
};

type RagSearchHit = {
  documentId: number;
  title: string;
  source: string;
  chunkIndex: number;
  chunk: string;
  score: number;
  matchedKeywords: string[];
};

type RagAnswerResponse = {
  question: string;
  answer: string;
  citations: RagCitation[];
  retrieval: {
    query: string;
    topK: number;
    queryKeywords: string[];
    hits: RagSearchHit[];
    steps: string[];
  };
  steps: string[];
};

export default function RagAskPage() {
  const [question, setQuestion] = useState("RAG에서 벡터 검색은 어떤 역할을 해?");
  const [topK, setTopK] = useState(3);
  const [result, setResult] = useState<RagAnswerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await requestJson<RagAnswerResponse>(
        `${API_BASE_URL}/api/rag/ask`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, topK }),
        },
        "질문하기 실패",
      );
      setResult(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
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
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>RAG / 질문하기</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <MessageCircleQuestionIcon className="mt-1 size-6 text-emerald-700 dark:text-emerald-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">RAG 질문하기 mock</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  질문을 보내면 백엔드가 먼저 검색을 수행하고, 검색된 chunk를 근거로 mock 답변과 citation을 만듭니다.
                  실제 LLM 호출 직전까지의 서버 흐름을 디버깅하기 좋은 페이지입니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form onSubmit={ask} className="rounded-lg border border-blue-200 bg-blue-50/40 p-4 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
              <div className="mb-4 flex items-center gap-2">
                <BotIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">질문 입력</h2>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-1 text-sm">
                  question
                  <textarea
                    className="min-h-32 rounded-md border bg-background p-3 text-sm leading-6"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  retrieval topK
                  <Input type="number" min={1} max={8} value={topK} onChange={(event) => setTopK(Number(event.target.value))} />
                </label>
                <Button type="submit" disabled={loading}>
                  <PlayIcon className="size-4" />
                  질문 실행
                </Button>
              </div>
            </form>

            <section className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BotIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Mock 답변</h2>
              </div>
              {result ? (
                <p className="rounded-lg border bg-background p-4 text-sm leading-7">{result.answer}</p>
              ) : (
                <p className="text-sm text-muted-foreground">질문을 실행하면 답변이 표시됩니다.</p>
              )}
            </section>
          </section>

          {error ? <ErrorBox message={error} /> : null}

          <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
            <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileSearchIcon className="size-4 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">검색 컨텍스트</h2>
                </div>
                <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">{result?.retrieval.hits.length ?? 0} chunks</span>
              </div>
              <div className="grid gap-3">
                {result?.retrieval.hits.map((hit) => (
                  <article key={`${hit.documentId}-${hit.chunkIndex}`} className="rounded-lg border bg-white/75 p-4 shadow-sm dark:bg-background/45">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">{hit.title}</h3>
                      <span className="rounded-md border bg-background px-2 py-1 text-xs">score {hit.score}</span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{hit.source} / chunk {hit.chunkIndex}</p>
                    <p className="mt-3 text-sm leading-6">{hit.chunk}</p>
                  </article>
                )) ?? <p className="text-sm text-muted-foreground">아직 검색 컨텍스트가 없습니다.</p>}
              </div>
            </section>

            <section className="grid gap-4">
              <section className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
                <div className="mb-4 flex items-center gap-2">
                  <QuoteIcon className="size-4 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Citations</h2>
                </div>
                <div className="grid gap-3">
                  {result?.citations.map((citation) => (
                    <article key={`${citation.documentId}-${citation.chunkIndex}`} className="rounded-lg border bg-white/75 p-3 text-sm leading-6 dark:bg-background/45">
                      <p className="font-semibold">{citation.title}</p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">{citation.source}</p>
                      <p className="mt-2 text-muted-foreground">{citation.quote}</p>
                    </article>
                  )) ?? <p className="text-sm text-muted-foreground">답변 근거가 여기에 표시됩니다.</p>}
                </div>
              </section>

              <section className="rounded-lg border bg-card p-4 shadow-sm">
                <h2 className="text-lg font-semibold">Steps</h2>
                <ol className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground">
                  {(result?.steps ?? ["질문을 실행하면 서버 단계 로그가 표시됩니다."]).map((step, index) => (
                    <li key={step}>{index + 1}. {step}</li>
                  ))}
                </ol>
              </section>
            </section>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <section className="rounded-lg border border-rose-200 bg-rose-50/40 p-4 text-sm leading-6 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20">
      <div className="flex gap-2">
        <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-rose-700 dark:text-rose-300" />
        <p>{message}</p>
      </div>
    </section>
  );
}
