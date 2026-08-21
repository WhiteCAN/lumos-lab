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
  DicesIcon,
  InfoIcon,
  PlayIcon,
  SearchIcon,
} from "lucide-react";

type SearchType = "LINEAR" | "BINARY";

type SearchResponse = {
  type: SearchType;
  original: number[];
  searchedArray: number[];
  target: number;
  found: boolean;
  index: number;
  comparisons: number;
  steps: string[];
  elapsedNanos: number;
};

type SearchGuide = {
  name: string;
  summary: string;
  time: string;
  space: string;
  requirement: string;
  recommended: string;
  example: string;
};

const searchTypes: SearchType[] = ["LINEAR", "BINARY"];

const searchGuides: Record<SearchType, SearchGuide> = {
  LINEAR: {
    name: "Linear Search",
    summary: "앞에서부터 끝까지 하나씩 비교하면서 target을 찾습니다.",
    time: "O(n)",
    space: "O(1)",
    requirement: "정렬 필요 없음",
    recommended: "데이터가 작거나 정렬되어 있지 않을 때",
    example: "사용자가 입력한 작은 목록에서 특정 값 찾기",
  },
  BINARY: {
    name: "Binary Search",
    summary: "정렬된 배열의 가운데 값을 기준으로 탐색 범위를 절반씩 줄입니다.",
    time: "O(log n)",
    space: "O(1)",
    requirement: "정렬된 배열 필요",
    recommended: "정렬된 큰 데이터에서 빠르게 찾고 싶을 때",
    example: "사전, 정렬된 ID 목록, 점수 범위 탐색",
  },
};

export default function SearchPage() {
  const [numbersText, setNumbersText] = useState("7, 3, 9, 1, 5, 11, -2");
  const [randomCount, setRandomCount] = useState(12);
  const [target, setTarget] = useState(5);
  const [searchType, setSearchType] = useState<SearchType>("LINEAR");
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedNumbers = useMemo(() => {
    return numbersText
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value));
  }, [numbersText]);

  const selectedGuide = searchGuides[searchType];

  function generateRandomNumbers() {
    const count = Math.min(Math.max(randomCount, 1), 100);
    const numbers = Array.from({ length: count }, () =>
      Math.floor(Math.random() * 201) - 100,
    );
    const randomTarget = numbers[Math.floor(Math.random() * numbers.length)] ?? 0;

    setRandomCount(count);
    setNumbersText(numbers.join(", "));
    setTarget(randomTarget);
    setResult(null);
    setError(null);
  }

  async function runSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/algorithms/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: searchType,
          numbers: parsedNumbers,
          target,
        }),
      });
      const body = (await response.json()) as ApiResponse<SearchResponse>;

      if (!response.ok || !body.success || body.data == null) {
        throw new Error(body.message ?? "Search API request failed");
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
                  <BreadcrumbPage>Algorithms / Search Lab</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-sky-200 bg-sky-50/50 p-5 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-sky-700 dark:text-sky-200">
                  <SearchIcon className="size-4" />
                  Spring Boot Strategy Pattern
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">
                  검색 알고리즘 실험실
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Linear Search와 Binary Search를 같은 API 형태로 호출하고,
                  비교 횟수와 탐색 단계를 확인합니다. Binary Search는 내부에서
                  배열을 정렬한 뒤 정렬된 배열 기준 index를 반환합니다.
                </p>
              </div>
              <div className="rounded-lg border bg-white/70 p-4 text-sm dark:bg-background/45">
                <p className="font-semibold">API</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  POST /api/algorithms/search
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form
              onSubmit={runSearch}
              className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="grid gap-2">
                <label htmlFor="searchType" className="text-sm font-medium">
                  검색 알고리즘
                </label>
                <select
                  id="searchType"
                  value={searchType}
                  onChange={(event) =>
                    setSearchType(event.target.value as SearchType)
                  }
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {searchTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <SearchGuidePanel guide={selectedGuide} />

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
                <label htmlFor="target" className="text-sm font-medium">
                  찾을 값
                </label>
                <Input
                  id="target"
                  type="number"
                  value={target}
                  onChange={(event) => setTarget(Number(event.target.value))}
                />
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
                {loading ? "실행 중..." : "검색 API 호출"}
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
                    탐색 성공 여부, index, 비교 횟수, 단계 로그를 확인합니다.
                  </p>
                </div>
                {result ? (
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                      {(result.elapsedNanos / 1_000_000).toFixed(3)} ms
                    </span>
                    <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                      비교 {result.comparisons}회
                    </span>
                  </div>
                ) : null}
              </div>

              {result ? (
                <div className="grid gap-4">
                  <div
                    className={`rounded-lg border p-4 ${
                      result.found
                        ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                        : "border-rose-200 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Target</p>
                        <h3 className="mt-1 text-3xl font-bold">
                          {result.target}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {result.found ? "찾음" : "못 찾음"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          index {result.index}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <ArrayPanel
                      title="Original"
                      values={result.original}
                      target={result.target}
                      highlightIndex={result.type === "LINEAR" ? result.index : -1}
                    />
                    <ArrayPanel
                      title={result.type === "BINARY" ? "Sorted for Binary Search" : "Searched Array"}
                      values={result.searchedArray}
                      target={result.target}
                      highlightIndex={result.index}
                    />
                  </div>

                  <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 lg:grid-cols-3">
                    <GuideBlock
                      title="알고리즘"
                      value={searchGuides[result.type].name}
                    />
                    <GuideBlock
                      title="추천 상황"
                      value={searchGuides[result.type].recommended}
                    />
                    <GuideBlock
                      title="사용 예시"
                      value={searchGuides[result.type].example}
                    />
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

function SearchGuidePanel({ guide }: { guide: SearchGuide }) {
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
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Metric label="Time" value={guide.time} />
            <Metric label="Space" value={guide.space} />
            <Metric label="Requirement" value={guide.requirement} />
          </div>
        </div>
      </div>
    </section>
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

function ArrayPanel({
  title,
  values,
  target,
  highlightIndex,
}: {
  title: string;
  values: number[];
  target: number;
  highlightIndex: number;
}) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => {
          const highlighted = index === highlightIndex && value === target;
          return (
            <span
              key={`${title}-${value}-${index}`}
              className={`flex h-9 min-w-9 items-center justify-center rounded-md px-2.5 text-sm font-medium ${
                highlighted
                  ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {value}
            </span>
          );
        })}
      </div>
    </div>
  );
}
