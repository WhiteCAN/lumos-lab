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
import { AlertTriangleIcon, ArrowRightIcon, BarChart3Icon, PlayIcon, SearchIcon } from "lucide-react";

import { getStudyPage } from "@/lib/study-pages";

const studyPage = getStudyPage("/rag/vector-search");

type RagSearchHit = {
  documentId: number;
  title: string;
  source: string;
  chunkIndex: number;
  chunk: string;
  score: number;
  matchedKeywords: string[];
};

type RagSearchResponse = {
  query: string;
  topK: number;
  queryKeywords: string[];
  hits: RagSearchHit[];
  steps: string[];
};

export default function RagVectorSearchPage() {
  const [query, setQuery] = useState("RAG에서 chunk와 embedding은 왜 필요해?");
  const [topK, setTopK] = useState(3);
  const [result, setResult] = useState<RagSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await requestJson<RagSearchResponse>(
        `${API_BASE_URL}/api/rag/vector-search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, topK }),
        },
        "벡터 검색 실패",
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
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>{studyPage.category} &gt; {studyPage.title}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-violet-200 bg-violet-50/50 p-5 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
            <div className="flex items-start gap-3">
              <SearchIcon className="mt-1 size-6 text-violet-700 dark:text-violet-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{studyPage.title}</h1>
                <p className="mt-2"><span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-950 dark:bg-amber-950 dark:text-amber-200">모의 실습</span></p>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  실제 embedding 대신 keyword 겹침 점수로 topK chunk를 찾습니다.
                  브레이크포인트를 걸면 query → keyword → chunk score → topK 선택 흐름을 따라갈 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form onSubmit={search} className="rounded-lg border border-sky-200 bg-sky-50/40 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3Icon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">검색 입력</h2>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-1 text-sm">
                  query
                  <textarea
                    className="min-h-28 rounded-md border bg-background p-3 text-sm leading-6"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  topK
                  <Input type="number" min={1} max={8} value={topK} onChange={(event) => setTopK(Number(event.target.value))} />
                </label>
                <Button type="submit" disabled={loading}>
                  <PlayIcon className="size-4" />
                  검색 실행
                </Button>
              </div>
            </form>

            <section className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <h2 className="text-lg font-semibold">검색 파이프라인</h2>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {["질문", "keyword 추출", "chunk score 계산", "topK 선택", "context 후보"].map((step, index, steps) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="rounded-lg border bg-white/75 px-3 py-2 text-sm dark:bg-background/45">{step}</span>
                    {index < steps.length - 1 ? <ArrowRightIcon className="size-4 text-muted-foreground" /> : null}
                  </div>
                ))}
              </div>
              {result ? (
                <div className="mt-4">
                  <p className="text-sm font-medium">query keywords</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.queryKeywords.map((keyword) => (
                      <span key={keyword} className="rounded-md border bg-white/75 px-2 py-1 text-xs dark:bg-background/45">{keyword}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </section>

          {error ? <ErrorBox message={error} /> : null}

          <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <section className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">TopK 검색 결과</h2>
                <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">{result?.hits.length ?? 0} hits</span>
              </div>
              <div className="grid gap-3">
                {result?.hits.map((hit) => (
                  <article key={`${hit.documentId}-${hit.chunkIndex}`} className="rounded-lg border p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">{hit.title}</h3>
                      <span className="rounded-md border bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/30 dark:text-sky-200">
                        score {hit.score}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{hit.source} / chunk {hit.chunkIndex}</p>
                    <p className="mt-3 text-sm leading-6">{hit.chunk}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {hit.matchedKeywords.map((keyword) => (
                        <span key={keyword} className="rounded-md border bg-muted/50 px-2 py-1 text-xs">{keyword}</span>
                      ))}
                    </div>
                  </article>
                )) ?? <p className="text-sm text-muted-foreground">아직 검색 결과가 없습니다.</p>}
              </div>
            </section>

            <section className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <h2 className="text-lg font-semibold">Steps</h2>
              <ol className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground">
                {(result?.steps ?? ["검색을 실행하면 백엔드 단계 로그가 표시됩니다."]).map((step, index) => (
                  <li key={step}>{index + 1}. {step}</li>
                ))}
              </ol>
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
