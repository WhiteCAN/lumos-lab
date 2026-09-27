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
  ChartNoAxesColumnIncreasingIcon,
  DicesIcon,
  InfoIcon,
  PlayIcon,
} from "lucide-react";

import { getStudyPage } from "@/lib/study-pages";

const studyPage = getStudyPage("/");

type SortType = "BUBBLE" | "SELECTION" | "INSERTION" | "QUICK" | "MERGE" | "HEAP";

type SortResponse = {
  type: SortType;
  original: number[];
  sorted: number[];
  steps: string[];
  elapsedNanos: number;
};

type SortGuide = {
  name: string;
  summary: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: string;
  recommended: string;
  avoid: string;
  example: string;
};

const sortTypes: SortType[] = [
  "QUICK",
  "MERGE",
  "HEAP",
  "INSERTION",
  "SELECTION",
  "BUBBLE",
];
const sortGuides: Record<SortType, SortGuide> = {
  QUICK: {
    name: "Quick Sort",
    summary: "pivot을 기준으로 작은 값과 큰 값을 나누며 재귀적으로 정렬합니다.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n^2)",
    space: "O(log n)",
    stable: "불안정",
    recommended: "평균 성능이 중요하고 메모리 사용을 크게 늘리고 싶지 않을 때",
    avoid: "pivot 선택이 계속 나쁘게 나올 수 있는 이미 편향된 데이터",
    example: "일반적인 숫자 목록 정렬, 빠른 평균 성능이 필요한 서버 내부 처리",
  },
  MERGE: {
    name: "Merge Sort",
    summary: "배열을 반으로 나눈 뒤 정렬된 두 배열을 병합합니다.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    stable: "안정",
    recommended: "최악의 경우에도 일정한 성능이 필요하거나 안정 정렬이 필요할 때",
    avoid: "추가 메모리 사용을 최대한 줄여야 할 때",
    example: "이름순 정렬 후 같은 이름끼리 기존 순서를 유지해야 하는 데이터",
  },
  HEAP: {
    name: "Heap Sort",
    summary: "최대 힙을 만들고 가장 큰 값을 뒤로 보내며 정렬합니다.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
    stable: "불안정",
    recommended: "추가 메모리를 거의 쓰지 않으면서 최악 성능도 보장하고 싶을 때",
    avoid: "같은 값의 기존 순서를 유지해야 하거나 캐시 친화성이 중요한 경우",
    example: "제한된 메모리 환경에서 큰 숫자 배열을 정렬하는 경우",
  },
  INSERTION: {
    name: "Insertion Sort",
    summary: "앞쪽의 정렬된 영역에 새 값을 알맞은 위치로 끼워 넣습니다.",
    best: "O(n)",
    average: "O(n^2)",
    worst: "O(n^2)",
    space: "O(1)",
    stable: "안정",
    recommended: "데이터가 작거나 거의 정렬된 상태일 때",
    avoid: "무작위로 섞인 큰 배열",
    example: "사용자가 입력한 작은 목록, 거의 정렬된 데이터에 새 값 몇 개를 추가한 경우",
  },
  SELECTION: {
    name: "Selection Sort",
    summary: "남은 값 중 가장 작은 값을 찾아 앞자리와 교환합니다.",
    best: "O(n^2)",
    average: "O(n^2)",
    worst: "O(n^2)",
    space: "O(1)",
    stable: "불안정",
    recommended: "교환 횟수를 줄이는 원리를 학습하거나 아주 작은 데이터를 다룰 때",
    avoid: "실무 성능이 중요한 대부분의 큰 데이터",
    example: "정렬 개념 학습, 최솟값 탐색 과정을 디버깅하는 연습",
  },
  BUBBLE: {
    name: "Bubble Sort",
    summary: "인접한 두 값을 비교하고 큰 값을 뒤로 밀어냅니다.",
    best: "O(n)",
    average: "O(n^2)",
    worst: "O(n^2)",
    space: "O(1)",
    stable: "안정",
    recommended: "정렬의 기본 비교/교환 과정을 처음 디버깅할 때",
    avoid: "성능이 필요한 실제 서비스 코드",
    example: "반복문, swap, 인접 비교를 눈으로 익히는 학습용 예제",
  },
};

export default function Home() {
  const [numbersText, setNumbersText] = useState("7, 3, 9, 1, 5");
  const [randomCount, setRandomCount] = useState(10);
  const [sortType, setSortType] = useState<SortType>("QUICK");
  const [result, setResult] = useState<SortResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const selectedGuide = sortGuides[sortType];

  const parsedNumbers = useMemo(() => {
    return numbersText
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value));
  }, [numbersText]);

  function generateRandomNumbers() {
    const count = Math.min(Math.max(randomCount, 1), 100);
    const numbers = Array.from({ length: count }, () =>
      Math.floor(Math.random() * 201) - 100,
    );

    setRandomCount(count);
    setNumbersText(numbers.join(", "));
    setResult(null);
    setError(null);
  }

  async function runSort(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/algorithms/sort`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: sortType,
          numbers: parsedNumbers,
        }),
      });

      const body = (await response.json()) as ApiResponse<SortResponse>;

      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.message ?? "API request failed");
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
          <section className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <ChartNoAxesColumnIncreasingIcon className="size-4" />
                  Spring Boot Strategy Pattern
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight">{studyPage.title}</h1>
              </div>
              <div className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                API: POST /api/algorithms/sort
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form
              onSubmit={runSort}
              className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="grid gap-2">
                <label htmlFor="sortType" className="text-sm font-medium">
                  정렬 알고리즘
                </label>
                <select
                  id="sortType"
                  value={sortType}
                  onChange={(event) =>
                    setSortType(event.target.value as SortType)
                  }
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {sortTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <SortGuidePanel guide={selectedGuide} />

              <div className="grid gap-2">
                <label htmlFor="randomCount" className="text-sm font-medium">
                  랜덤 배열 개수
                </label>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input
                    id="randomCount"
                    type="number"
                    min={1}
                    max={100}
                    value={randomCount}
                    onChange={(event) =>
                      setRandomCount(Number(event.target.value))
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomNumbers}
                  >
                    <DicesIcon />
                    -100~100 생성
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="numbers" className="text-sm font-medium">
                  숫자 배열
                </label>
                <textarea
                  id="numbers"
                  value={numbersText}
                  onChange={(event) => setNumbersText(event.target.value)}
                  rows={7}
                  className="min-h-32 resize-none rounded-lg border border-input bg-background p-3 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="7, 3, 9, 1, 5"
                />
                <p className="text-xs text-muted-foreground">
                  현재 파싱 결과 {parsedNumbers.length}개: [
                  {parsedNumbers.join(", ")}]
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading || parsedNumbers.length === 0}
              >
                <PlayIcon />
                {loading ? "실행 중..." : "정렬 API 호출"}
              </Button>

              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
            </form>

            <section className="flex min-h-[520px] flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    실행 결과
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Spring Boot 응답 JSON을 화면용으로 렌더링합니다.
                  </p>
                </div>
                {result ? (
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                      {(result.elapsedNanos / 1_000_000).toFixed(3)} ms
                    </span>
                    <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                      평균 {sortGuides[result.type].average}
                    </span>
                  </div>
                ) : null}
              </div>

              {result ? (
                <div className="grid gap-4">
                  <SortSummaryPanel guide={sortGuides[result.type]} />

                  <div className="grid gap-3 lg:grid-cols-2">
                    <ArrayPanel title="Original" values={result.original} />
                    <ArrayPanel title="Sorted" values={result.sorted} />
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-medium">단계 로그</h3>
                    <ol className="max-h-[340px] overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-sm">
                      {result.steps.map((step, index) => (
                        <li
                          key={`${step}-${index}`}
                          className="border-b py-2 last:border-b-0"
                        >
                          <span className="mr-3 text-muted-foreground">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed bg-muted/40 p-8 text-center text-muted-foreground">
                  왼쪽에서 값을 입력하고 API를 호출하면 결과가 여기에 표시됩니다.
                </div>
              )}
            </section>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function SortGuidePanel({ guide }: { guide: SortGuide }) {
  return (
    <section className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-start gap-2">
        <InfoIcon className="mt-0.5 size-4 text-muted-foreground" />
        <div className="grid gap-3">
          <div>
            <h3 className="text-sm font-semibold">{guide.name}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {guide.summary}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            <Metric label="Best" value={guide.best} />
            <Metric label="Average" value={guide.average} />
            <Metric label="Worst" value={guide.worst} />
            <Metric label="Space" value={guide.space} />
            <Metric label="Stable" value={guide.stable} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SortSummaryPanel({ guide }: { guide: SortGuide }) {
  return (
    <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 lg:grid-cols-3">
      <GuideBlock title="추천 상황" value={guide.recommended} />
      <GuideBlock title="피할 상황" value={guide.avoid} />
      <GuideBlock title="사용 예시" value={guide.example} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background px-2 py-1.5">
      <span className="block text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function GuideBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}

function ArrayPanel({ title, values }: { title: string; values: number[] }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <span
            key={`${title}-${value}-${index}`}
            className="flex h-9 min-w-9 items-center justify-center rounded-md bg-primary px-2.5 text-sm font-medium text-primary-foreground"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
