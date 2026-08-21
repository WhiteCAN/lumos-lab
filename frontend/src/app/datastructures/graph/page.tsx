"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { API_BASE_URL } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  CheckCircle2Icon,
  GitBranchIcon,
  ListTreeIcon,
  PlayIcon,
  RefreshCcwIcon,
  RouteIcon,
} from "lucide-react";

type TraversalType = "BFS" | "DFS";

type GraphEdge = {
  from: string;
  to: string;
};

type GraphTraversalResponse = {
  type: TraversalType;
  start: string;
  directed: boolean;
  adjacencyList: Record<string, string[]>;
  visitedOrder: string[];
  visitedCount: number;
  steps: string[];
  elapsedNanos: number;
};

const sampleEdges = "A-B, A-C, B-D, B-E, C-F, E-G, F-G";

const traversalGuides: Record<TraversalType, {
  name: string;
  structure: string;
  summary: string;
  bestFor: string;
}> = {
  BFS: {
    name: "Breadth First Search",
    structure: "Queue",
    summary: "시작 노드에서 가까운 노드부터 층별로 탐색합니다.",
    bestFor: "최단 거리, 단계 수가 중요한 탐색",
  },
  DFS: {
    name: "Depth First Search",
    structure: "Stack",
    summary: "한 경로를 깊게 들어간 뒤 더 갈 곳이 없으면 되돌아옵니다.",
    bestFor: "경로 존재 여부, 백트래킹, 재귀 구조 탐색",
  },
};

export default function GraphPage() {
  const [type, setType] = useState<TraversalType>("BFS");
  const [start, setStart] = useState("A");
  const [directed, setDirected] = useState(false);
  const [edgesText, setEdgesText] = useState(sampleEdges);
  const [result, setResult] = useState<GraphTraversalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const edges = useMemo(() => parseEdges(edgesText), [edgesText]);
  const nodes = useMemo(() => {
    return Array.from(
      new Set(edges.flatMap((edge) => [edge.from, edge.to])),
    ).sort();
  }, [edges]);
  const guide = traversalGuides[type];

  function loadSample() {
    setEdgesText(sampleEdges);
    setStart("A");
    setDirected(false);
    setResult(null);
    setError(null);
  }

  async function runTraversal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/datastructures/graph/traverse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            start,
            directed,
            edges,
          }),
        },
      );
      const body = (await response.json()) as ApiResponse<GraphTraversalResponse>;

      if (!response.ok || !body.success || body.data == null) {
        throw new Error(body.message ?? "Graph traversal API request failed");
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
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Structures / Graph</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-purple-200 bg-purple-50/50 p-5 shadow-sm dark:border-purple-900/60 dark:bg-purple-950/20">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-200">
                  <GitBranchIcon className="size-4" />
                  Graph Traversal
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">
                  그래프 BFS / DFS 실험실
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  간선을 입력하고 시작 노드를 정하면 백엔드에서 BFS 또는 DFS로
                  그래프를 순회합니다. BFS는 Queue, DFS는 Stack을 사용하므로
                  Stack/Queue 실험실과 이어서 디버깅하기 좋습니다.
                </p>
              </div>
              <div className="rounded-lg border bg-white/70 p-4 text-sm dark:bg-background/45">
                <p className="font-semibold">API</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  POST /api/datastructures/graph/traverse
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[430px_1fr]">
            <form
              onSubmit={runTraversal}
              className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="grid gap-2">
                <label htmlFor="type" className="text-sm font-medium">
                  탐색 방식
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(event) => setType(event.target.value as TraversalType)}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="BFS">BFS</option>
                  <option value="DFS">DFS</option>
                </select>
              </div>

              <section className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-start gap-2">
                  <ListTreeIcon className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <h2 className="text-sm font-semibold">{guide.name}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {guide.summary}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <Metric label="사용 구조" value={guide.structure} />
                      <Metric label="추천 상황" value={guide.bestFor} />
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid gap-2">
                <label htmlFor="start" className="text-sm font-medium">
                  시작 노드
                </label>
                <Input
                  id="start"
                  value={start}
                  onChange={(event) => setStart(event.target.value)}
                  placeholder="A"
                />
              </div>

              <label className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={directed}
                  onChange={(event) => setDirected(event.target.checked)}
                  className="size-4"
                />
                방향 그래프로 실행
              </label>

              <div className="grid gap-2">
                <label htmlFor="edges" className="text-sm font-medium">
                  간선 목록
                </label>
                <textarea
                  id="edges"
                  value={edgesText}
                  onChange={(event) => setEdgesText(event.target.value)}
                  rows={7}
                  className="min-h-32 resize-none rounded-lg border border-input bg-background p-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="A-B, A-C, B-D"
                />
                <p className="text-xs text-muted-foreground">
                  쉼표 또는 줄바꿈으로 구분합니다. 현재 노드: [{nodes.join(", ")}]
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={loadSample}
                >
                  <RefreshCcwIcon />
                  샘플 복원
                </Button>
                <Button
                  type="submit"
                  disabled={loading || edges.length === 0 || start.trim() === ""}
                >
                  <PlayIcon />
                  {loading ? "실행 중..." : "탐색 실행"}
                </Button>
              </div>

              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
            </form>

            <section className="grid gap-4">
              {result ? (
                <>
                  <section className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                      <div>
                        <h2 className="text-xl font-semibold">방문 순서</h2>
                        <p className="text-sm text-muted-foreground">
                          {result.type} · 시작 {result.start} · 방문 {result.visitedCount}개
                        </p>
                      </div>
                      <span className="rounded-md border bg-white/70 px-3 py-2 text-sm font-medium dark:bg-background/45">
                        {(result.elapsedNanos / 1_000_000).toFixed(3)} ms
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {result.visitedOrder.map((node, index) => (
                        <div key={`${node}-${index}`} className="flex items-center gap-2">
                          <span className="flex size-10 items-center justify-center rounded-md bg-emerald-600 text-sm font-bold text-white dark:bg-emerald-400 dark:text-emerald-950">
                            {node}
                          </span>
                          {index < result.visitedOrder.length - 1 ? (
                            <RouteIcon className="size-4 text-muted-foreground" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
                    <AdjacencyPanel adjacencyList={result.adjacencyList} />
                    <StepsPanel steps={result.steps} />
                  </section>
                </>
              ) : (
                <section className="flex min-h-[520px] items-center justify-center rounded-lg border border-dashed bg-muted/40 p-8 text-center text-muted-foreground">
                  왼쪽에서 그래프를 입력하고 탐색을 실행하면 결과가 여기에 표시됩니다.
                </section>
              )}

              <section className="rounded-lg border border-sky-200 bg-sky-50/40 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
                <h2 className="text-lg font-semibold">읽는 법</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <GuideLine text="BFS는 Queue를 사용해 가까운 노드부터 방문합니다." />
                  <GuideLine text="DFS는 Stack을 사용해 한 경로를 깊게 탐색합니다." />
                  <GuideLine text="무방향 그래프는 A-B 입력 시 B-A도 자동 연결합니다." />
                  <GuideLine text="방향 그래프는 입력한 방향 그대로만 이동합니다." />
                </div>
              </section>
            </section>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function parseEdges(text: string): GraphEdge[] {
  return text
    .split(/[\n,]+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [from, to] = chunk.split(/[-\s>]+/).map((value) => value.trim());
      return { from, to };
    })
    .filter((edge) => edge.from && edge.to);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background px-2 py-1.5">
      <span className="block text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function AdjacencyPanel({
  adjacencyList,
}: {
  adjacencyList: Record<string, string[]>;
}) {
  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="text-lg font-semibold">인접 리스트</h2>
      <div className="mt-3 grid gap-2">
        {Object.entries(adjacencyList).map(([node, neighbors]) => (
          <div
            key={node}
            className="grid grid-cols-[52px_1fr] items-center gap-2 rounded-md border bg-muted/30 p-2 text-sm"
          >
            <span className="rounded-md bg-primary px-2 py-1 text-center font-bold text-primary-foreground">
              {node}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {neighbors.length > 0 ? neighbors.join(", ") : "연결 없음"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StepsPanel({ steps }: { steps: string[] }) {
  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="text-lg font-semibold">단계 로그</h2>
      <ol className="mt-3 max-h-[420px] overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-sm">
        {steps.map((step, index) => (
          <li key={`${step}-${index}`} className="border-b py-2 last:border-b-0">
            <span className="mr-3 text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}

function GuideLine({ text }: { text: string }) {
  return (
    <div className="flex gap-2 rounded-lg border bg-white/70 p-3 text-sm leading-6 dark:bg-background/45">
      <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-sky-700 dark:text-sky-300" />
      <span>{text}</span>
    </div>
  );
}
