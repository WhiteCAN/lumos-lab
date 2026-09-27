"use client";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  CableIcon,
  CheckCircle2Icon,
  FileCode2Icon,
  GaugeIcon,
  PlayIcon,
  ServerIcon,
} from "lucide-react";

import { getStudyPage } from "@/lib/study-pages";

const studyPage = getStudyPage("/grpc");

type GrpcExplainResponse = {
  concept: string;
  summary: string;
  transport: string;
  steps: string[];
  serverThread: string;
  handledAt: string;
};

const examples = ["grpc", "rest", "transactional", "비동기"];

export default function GrpcPage() {
  const [keyword, setKeyword] = useState("grpc");
  const [result, setResult] = useState<GrpcExplainResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(nextKeyword = keyword) {
    setLoading(true);
    setError(null);
    setKeyword(nextKeyword);

    try {
      const response = await fetch(`${API_BASE_URL}/api/concepts/grpc/explain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: nextKeyword }),
      });
      const body = (await response.json()) as ApiResponse<GrpcExplainResponse>;

      if (!response.ok || !body.success || body.data == null) {
        throw new Error(body.message ?? "gRPC 요청 실패");
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
                  <BreadcrumbPage>{studyPage.category} &gt; {studyPage.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-cyan-200 bg-cyan-50/50 p-5 shadow-sm dark:border-cyan-900/60 dark:bg-cyan-950/20">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-cyan-700 dark:text-cyan-200">
                  <CableIcon className="size-4" />
                  gRPC 호출 실험실
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">{studyPage.title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  브라우저는 Spring REST API를 호출하고, Spring은 내부 gRPC
                  클라이언트로 9090 포트의 gRPC 서버를 호출합니다. `proto` 계약,
                  stub 생성, 서버 구현, 클라이언트 호출 흐름을 디버깅하기 위한
                  페이지입니다.
                </p>
              </div>
              <div className="rounded-lg border bg-white/70 p-4 text-sm dark:bg-background/45">
                <p className="font-semibold">포트 구조</p>
                <p className="mt-1 text-muted-foreground">
                  REST 8080 · gRPC 9090
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <div className="grid gap-4">
              <section className="grid gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
                <h2 className="text-lg font-semibold">핵심 개념</h2>
                <ConceptLine
                  icon={<FileCode2Icon className="size-4" />}
                  title="Proto 계약"
                  description="요청과 응답 구조를 `.proto` 파일에 먼저 정의하고 Java 코드를 생성합니다."
                />
                <ConceptLine
                  icon={<GaugeIcon className="size-4" />}
                  title="빠른 직렬화"
                  description="JSON 문자열 대신 Protocol Buffers 바이너리 포맷으로 데이터를 주고받습니다."
                />
                <ConceptLine
                  icon={<ServerIcon className="size-4" />}
                  title="서버 간 통신"
                  description="브라우저 화면보다는 백엔드 서비스끼리 빠르게 통신할 때 자주 사용합니다."
                />
              </section>

              <section className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm">
                <label htmlFor="keyword" className="text-sm font-medium">
                  설명 요청 키워드
                </label>
                <input
                  id="keyword"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="grpc"
                />
                <Button disabled={loading} onClick={() => void run()}>
                  <PlayIcon />
                  {loading ? "gRPC 호출 중..." : "gRPC 호출"}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  {examples.map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      disabled={loading}
                      onClick={() => void run(example)}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
                {error ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                ) : null}
              </section>
            </div>

            <section className="grid gap-4">
              <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
                <div className="flex items-center justify-between gap-3 border-b pb-3">
                  <h2 className="text-lg font-semibold">응답 결과</h2>
                  <span className="rounded-md border bg-white/70 px-3 py-1 text-xs font-medium dark:bg-background/45">
                    {result?.transport ?? "대기 중"}
                  </span>
                </div>
                {result ? (
                  <div className="mt-4 grid gap-4">
                    <div className="rounded-lg border bg-white/70 p-4 dark:bg-background/45">
                      <p className="text-sm text-muted-foreground">Concept</p>
                      <h3 className="mt-2 text-2xl font-bold">{result.concept}</h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {result.summary}
                      </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <InfoCard title="서버 스레드" value={result.serverThread} />
                      <InfoCard
                        title="처리 시각"
                        value={new Date(result.handledAt).toLocaleString()}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex min-h-52 items-center justify-center rounded-lg border border-dashed bg-white/50 p-6 text-sm text-muted-foreground dark:bg-background/30">
                    왼쪽에서 키워드를 선택하고 gRPC 호출을 실행하세요.
                  </div>
                )}
              </section>

              <section className="rounded-lg border bg-card p-4 shadow-sm">
                <h2 className="text-lg font-semibold">호출 흐름</h2>
                {result ? (
                  <ol className="mt-3 grid gap-2">
                    {result.steps.map((step, index) => (
                      <li
                        key={`${step}-${index}`}
                        className="flex gap-2 rounded-md border bg-muted/30 p-3 text-sm leading-6"
                      >
                        <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-emerald-600" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="mt-3 rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                    실행 후 REST와 gRPC가 어떻게 이어지는지 단계별로 표시됩니다.
                  </div>
                )}
              </section>
            </section>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ConceptLine({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-white/70 p-3 dark:bg-background/45">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white/70 p-3 text-sm dark:bg-background/45">
      <p className="text-muted-foreground">{title}</p>
      <p className="mt-2 break-all font-mono">{value}</p>
    </div>
  );
}
