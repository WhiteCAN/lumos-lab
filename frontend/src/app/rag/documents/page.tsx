"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { API_BASE_URL } from "@/constants/api";
import { requestJson } from "@/services/http";
import { AlertTriangleIcon, DatabaseIcon, FileTextIcon, PlayIcon, RotateCcwIcon } from "lucide-react";

import { getStudyPage } from "@/lib/study-pages";

const studyPage = getStudyPage("/rag/documents");

type RagDocument = {
  id: number;
  title: string;
  source: string;
  content: string;
  chunks: string[];
  keywords: string[];
  createdAt: string;
  steps: string[];
};

export default function RagDocumentsPage() {
  const [title, setTitle] = useState("Spring AI RAG 메모");
  const [source, setSource] = useState("study-note://spring-ai");
  const [content, setContent] = useState(
    "Spring AI는 ChatClient, EmbeddingModel, VectorStore 같은 추상화를 제공합니다. RAG 구현에서는 문서를 chunk로 나누고 embedding을 만든 뒤 vector store에 저장합니다. 질문이 들어오면 관련 chunk를 검색해서 prompt context에 넣습니다.",
  );
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [selected, setSelected] = useState<RagDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function loadDocuments() {
    try {
      const data = await requestJson<RagDocument[]>(
        `${API_BASE_URL}/api/rag/documents`,
        {},
        "문서 목록 조회 실패",
      );
      setDocuments(data);
      setSelected((current) => current ?? data[0] ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDocuments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function addDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("add");
    setError(null);
    try {
      const data = await requestJson<RagDocument>(
        `${API_BASE_URL}/api/rag/documents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, source, content }),
        },
        "문서 등록 실패",
      );
      setDocuments((current) => [...current, data]);
      setSelected(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    } finally {
      setLoading(null);
    }
  }

  async function resetDocuments() {
    setLoading("reset");
    setError(null);
    try {
      const data = await requestJson<RagDocument[]>(
        `${API_BASE_URL}/api/rag/documents`,
        { method: "DELETE" },
        "문서 초기화 실패",
      );
      setDocuments(data);
      setSelected(data[0] ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    } finally {
      setLoading(null);
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
          <section className="rounded-lg border border-sky-200 bg-sky-50/50 p-5 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
            <div className="flex items-start gap-3">
              <FileTextIcon className="mt-1 size-6 text-sky-700 dark:text-sky-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{studyPage.title}</h1>
                <p className="mt-2"><span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-950 dark:bg-amber-950 dark:text-amber-200">모의 실습</span></p>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  문서를 입력하면 백엔드가 chunk와 keyword를 만들고 인메모리에 저장합니다.
                  실제 구현의 document loader, splitter, embedding 저장 단계를 단순화한 화면입니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form onSubmit={addDocument} className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="mb-4 flex items-center gap-2">
                <DatabaseIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">문서 입력</h2>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-1 text-sm">
                  title
                  <Input value={title} onChange={(event) => setTitle(event.target.value)} />
                </label>
                <label className="grid gap-1 text-sm">
                  source
                  <Input value={source} onChange={(event) => setSource(event.target.value)} />
                </label>
                <label className="grid gap-1 text-sm">
                  content
                  <textarea
                    className="min-h-40 rounded-md border bg-background p-3 text-sm leading-6"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={loading === "add"}>
                    <PlayIcon className="size-4" />
                    문서 등록
                  </Button>
                  <Button type="button" variant="outline" onClick={resetDocuments} disabled={loading === "reset"}>
                    <RotateCcwIcon className="size-4" />
                    seed 초기화
                  </Button>
                </div>
              </div>
            </form>

            <section className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">등록된 문서</h2>
                <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">{documents.length}개</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {documents.map((document) => (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() => setSelected(document)}
                    className="rounded-lg border bg-background p-4 text-left shadow-sm transition hover:border-sky-300"
                  >
                    <p className="font-semibold">{document.title}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{document.source}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{document.content}</p>
                  </button>
                ))}
              </div>
            </section>
          </section>

          {error ? <ErrorBox message={error} /> : null}

          {selected ? (
            <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
              <section className="rounded-lg border border-blue-200 bg-blue-50/40 p-4 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
                <h2 className="text-lg font-semibold">Chunk 결과</h2>
                <div className="mt-4 grid gap-3">
                  {selected.chunks.map((chunk, index) => (
                    <div key={`${selected.id}-${index}`} className="rounded-lg border bg-white/75 p-4 text-sm leading-6 dark:bg-background/45">
                      <span className="mb-2 inline-flex rounded-md border bg-background px-2 py-1 text-xs font-semibold">
                        chunk {index + 1}
                      </span>
                      <p>{chunk}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
                <h2 className="text-lg font-semibold">Keyword / Steps</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-md border bg-white/75 px-2 py-1 text-xs dark:bg-background/45">
                      {keyword}
                    </span>
                  ))}
                </div>
                <ol className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground">
                  {selected.steps.map((step, index) => (
                    <li key={step}>{index + 1}. {step}</li>
                  ))}
                </ol>
              </section>
            </section>
          ) : null}
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
