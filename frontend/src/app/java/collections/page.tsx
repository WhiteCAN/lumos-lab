"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { API_BASE_URL } from "@/constants/api";
import { requestJson } from "@/services/http";
import { BracesIcon, PlayIcon, TableIcon } from "lucide-react";

type CompareItem = {
  name: string;
  category: string;
  order: string;
  duplicate: string;
  mainUseCase: string;
  averageAccess: string;
  averageInsert: string;
  averageSearch: string;
};

type CompareResponse = {
  items: CompareItem[];
  recommendation: string;
  codeExample: string;
};

type DemoResponse = {
  collectionType: string;
  operation: string;
  finalState: string[];
  steps: string[];
  codeExample: string;
};

export default function JavaCollectionsPage() {
  const [compare, setCompare] = useState<CompareResponse | null>(null);
  const [demo, setDemo] = useState<DemoResponse | null>(null);
  const [collectionType, setCollectionType] = useState("HashSet");
  const [values, setValues] = useState("A, B, A, C");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestJson<CompareResponse>(`${API_BASE_URL}/api/java/collections/compare`, { method: "GET" }, "컬렉션 비교 조회 실패")
      .then(setCompare)
      .catch((caught) => setError(caught instanceof Error ? caught.message : "알 수 없는 오류"));
  }, []);

  async function runDemo() {
    setError(null);
    try {
      setDemo(await requestJson<DemoResponse>(`${API_BASE_URL}/api/java/collections/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionType,
          operation: "ADD",
          values: values.split(",").map((value) => value.trim()).filter(Boolean),
        }),
      }, "컬렉션 실습 실패"));
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
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Java 기초 / 컬렉션</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-lime-200 bg-lime-50/50 p-5 shadow-sm dark:border-lime-900/60 dark:bg-lime-950/20">
            <div className="flex items-start gap-3">
              <BracesIcon className="mt-1 size-6 text-lime-700 dark:text-lime-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Java Collection Framework</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  List, Set, Map, Queue는 이름보다 “순서, 중복, 조회 방식”으로 고르면 이해가 빨라집니다.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <TableIcon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">비교표 API 결과</h2>
            </div>
            <div className="overflow-auto">
              <table className="w-full min-w-[920px] border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left">
                    {["이름", "분류", "순서", "중복", "주요 상황", "조회", "삽입", "검색"].map((head) => <th key={head} className="p-3">{head}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {compare?.items.map((item) => (
                    <tr key={item.name} className="border-b">
                      <td className="p-3 font-semibold">{item.name}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3">{item.order}</td>
                      <td className="p-3">{item.duplicate}</td>
                      <td className="p-3">{item.mainUseCase}</td>
                      <td className="p-3 font-mono text-xs">{item.averageAccess}</td>
                      <td className="p-3 font-mono text-xs">{item.averageInsert}</td>
                      <td className="p-3 font-mono text-xs">{item.averageSearch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {compare ? <p className="mt-4 rounded-md border bg-sky-50/60 p-3 text-sm dark:bg-sky-950/20">{compare.recommendation}</p> : null}
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <h2 className="text-lg font-semibold">컬렉션 실습 API</h2>
              <label className="mt-4 block text-sm font-medium">컬렉션 타입</label>
              <select value={collectionType} onChange={(event) => setCollectionType(event.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3 text-sm">
                <option>ArrayList</option>
                <option>HashSet</option>
                <option>TreeSet</option>
                <option>ArrayDeque</option>
              </select>
              <label className="mt-4 block text-sm font-medium">값 목록</label>
              <input value={values} onChange={(event) => setValues(event.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3 font-mono text-sm" />
              <Button onClick={() => void runDemo()} className="mt-4 w-full"><PlayIcon />실습 실행</Button>
            </div>

            <section className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="border-b pb-3 text-lg font-semibold">실행 결과</h2>
              {demo ? (
                <div className="mt-4 grid gap-3">
                  <div className="flex flex-wrap gap-2">{demo.finalState.map((value, index) => <span key={`${value}-${index}`} className="rounded-md border bg-background px-2 py-1 font-mono text-xs">{value}</span>)}</div>
                  {demo.steps.map((step) => <p key={step} className="rounded-md border bg-white/75 p-3 text-sm dark:bg-background/45">{step}</p>)}
                  <pre className="overflow-auto rounded-lg border bg-zinc-950 p-4 text-xs leading-6 text-zinc-100"><code>{demo.codeExample}</code></pre>
                </div>
              ) : <p className="mt-4 text-sm text-muted-foreground">아직 실행 결과가 없습니다.</p>}
            </section>
          </section>

          {error ? <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
