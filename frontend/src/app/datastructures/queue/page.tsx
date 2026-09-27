"use client";

import { FormEvent, useCallback, useState } from "react";
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
  ArrowRightFromLineIcon,
  ArrowRightToLineIcon,
  EyeIcon,
  ListStartIcon,
  RotateCcwIcon,
} from "lucide-react";

import { getStudyPage } from "@/lib/study-pages";

const studyPage = getStudyPage("/datastructures/queue");

type QueueResponse = {
  values: number[];
  front: number | null;
  rear: number | null;
  size: number;
  lastAction: string;
  steps: string[];
};

export default function QueuePage() {
  const [value, setValue] = useState(10);
  const [queue, setQueue] = useState<QueueResponse>({
    values: [],
    front: null,
    rear: null,
    size: 0,
    lastAction: "ready",
    steps: ["Queue page is ready. Try offer, poll, peek, or refresh."],
  });
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const requestQueue = useCallback(async (
    action: string,
    path: string,
    options: RequestInit,
  ) => {
    setLoadingAction(action);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, options);
      const body = (await response.json()) as ApiResponse<QueueResponse>;

      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.message ?? "Queue API request failed");
      }

      setQueue(body.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
    } finally {
      setLoadingAction(null);
    }
  }, []);

  async function loadQueue() {
    await requestQueue("current", "/api/datastructures/queue", {
      method: "GET",
    });
  }

  async function offer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await requestQueue("offer", "/api/datastructures/queue/offer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });
  }

  async function poll() {
    await requestQueue("poll", "/api/datastructures/queue/poll", {
      method: "POST",
    });
  }

  async function peek() {
    await requestQueue("peek", "/api/datastructures/queue/peek", {
      method: "POST",
    });
  }

  async function clear() {
    await requestQueue("clear", "/api/datastructures/queue", {
      method: "DELETE",
    });
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
                  <ListStartIcon className="size-4" />
                  Java Deque 기반 FIFO 구조
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight">{studyPage.title}</h1>
              </div>
              <div className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                API: /api/datastructures/queue
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form
              onSubmit={offer}
              className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="rounded-lg border bg-muted/30 p-3">
                <h2 className="text-sm font-semibold">Queue 개요</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Queue는 먼저 넣은 값이 가장 먼저 나오는 FIFO 구조입니다.
                  작업 대기열, 메시지 처리, 프린터 큐처럼 순서 보장이 중요한
                  곳에서 자주 사용됩니다.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <Metric label="Offer" value="O(1)" />
                  <Metric label="Poll" value="O(1)" />
                  <Metric label="Peek" value="O(1)" />
                  <Metric label="Rule" value="FIFO" />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="queueValue" className="text-sm font-medium">
                  Offer 값
                </label>
                <Input
                  id="queueValue"
                  type="number"
                  value={value}
                  onChange={(event) => setValue(Number(event.target.value))}
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="submit"
                  disabled={loadingAction !== null}
                  className="w-full"
                >
                  <ArrowRightToLineIcon />
                  Offer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingAction !== null}
                  onClick={poll}
                  className="w-full"
                >
                  <ArrowRightFromLineIcon />
                  Poll
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingAction !== null}
                  onClick={peek}
                  className="w-full"
                >
                  <EyeIcon />
                  Peek
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingAction !== null}
                  onClick={loadQueue}
                  className="w-full"
                >
                  <RotateCcwIcon />
                  Refresh
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={loadingAction !== null}
                  onClick={clear}
                  className="w-full"
                >
                  <RotateCcwIcon />
                  Clear
                </Button>
              </div>

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
                    Queue 상태
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    왼쪽이 front, 오른쪽이 rear입니다. poll은 front부터
                    제거합니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                    size {queue.size}
                  </span>
                  <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                    front {queue.front ?? "empty"}
                  </span>
                  <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                    rear {queue.rear ?? "empty"}
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                <QueueView values={queue.values} />
                <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h3 className="text-sm font-medium">마지막 동작</h3>
                    <p className="mt-2 font-mono text-sm">
                      {queue.lastAction}
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-medium">단계 로그</h3>
                    <ol className="max-h-[300px] overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-sm">
                      {queue.steps.map((step, index) => (
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
              </div>
            </section>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function QueueView({ values }: { values: number[] }) {
  if (values.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed bg-muted/40 p-6 text-sm text-muted-foreground">
        Queue is empty
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h3 className="mb-3 text-sm font-medium">Front to Rear</h3>
      <div className="flex flex-wrap items-center gap-2">
        {values.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex h-12 min-w-16 items-center justify-center rounded-md border bg-background px-3 font-mono text-sm shadow-sm"
          >
            <span>{item}</span>
            {index === 0 ? (
              <span className="ml-2 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
                front
              </span>
            ) : null}
            {index === values.length - 1 ? (
              <span className="ml-2 rounded-md bg-muted px-2 py-1 text-xs">
                rear
              </span>
            ) : null}
          </div>
        ))}
      </div>
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
