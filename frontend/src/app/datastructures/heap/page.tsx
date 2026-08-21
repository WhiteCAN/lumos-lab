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
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  EyeIcon,
  RotateCcwIcon,
  TriangleIcon,
} from "lucide-react";

type HeapType = "MIN" | "MAX";

type HeapResponse = {
  type: HeapType;
  heapOrder: number[];
  priorityOrder: number[];
  root: number | null;
  size: number;
  lastAction: string;
  steps: string[];
};

export default function HeapPage() {
  const [value, setValue] = useState(10);
  const [heapType, setHeapType] = useState<HeapType>("MIN");
  const [heap, setHeap] = useState<HeapResponse>({
    type: "MIN",
    heapOrder: [],
    priorityOrder: [],
    root: null,
    size: 0,
    lastAction: "ready",
    steps: ["Heap page is ready. Choose min/max heap and try offer."],
  });
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const requestHeap = useCallback(async (
    action: string,
    path: string,
    options: RequestInit,
  ) => {
    setLoadingAction(action);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, options);
      const body = (await response.json()) as ApiResponse<HeapResponse>;

      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.message ?? "Heap API request failed");
      }

      setHeap(body.data);
      setHeapType(body.data.type);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
    } finally {
      setLoadingAction(null);
    }
  }, []);

  async function loadHeap(nextType = heapType) {
    await requestHeap("current", `/api/datastructures/heap?type=${nextType}`, {
      method: "GET",
    });
  }

  async function offer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await requestHeap("offer", "/api/datastructures/heap/offer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: heapType, value }),
    });
  }

  async function poll() {
    await requestHeap("poll", "/api/datastructures/heap/poll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: heapType }),
    });
  }

  async function peek() {
    await requestHeap("peek", "/api/datastructures/heap/peek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: heapType }),
    });
  }

  async function clear() {
    await requestHeap("clear", "/api/datastructures/heap", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: heapType }),
    });
  }

  async function changeHeapType(nextType: HeapType) {
    setHeapType(nextType);
    await loadHeap(nextType);
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
                  <BreadcrumbPage>Data Structures / Heap</BreadcrumbPage>
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
                  <TriangleIcon className="size-4" />
                  Java PriorityQueue 기반 우선순위 구조
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                  Heap / PriorityQueue 실험실
                </h1>
              </div>
              <div className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                API: /api/datastructures/heap
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form
              onSubmit={offer}
              className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="rounded-lg border bg-muted/30 p-3">
                <h2 className="text-sm font-semibold">Heap 개요</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Heap은 루트에 가장 높은 우선순위 값을 유지하는 구조입니다.
                  최소 힙은 작은 값이 먼저, 최대 힙은 큰 값이 먼저 나옵니다.
                  작업 스케줄링, Top-K, 다익스트라 알고리즘에서 자주 등장합니다.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <Metric label="Offer" value="O(log n)" />
                  <Metric label="Poll" value="O(log n)" />
                  <Metric label="Peek" value="O(1)" />
                  <Metric label="Use" value="Priority" />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="heapType" className="text-sm font-medium">
                  Heap 타입
                </label>
                <select
                  id="heapType"
                  value={heapType}
                  onChange={(event) =>
                    void changeHeapType(event.target.value as HeapType)
                  }
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="MIN">MIN heap</option>
                  <option value="MAX">MAX heap</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="heapValue" className="text-sm font-medium">
                  Offer 값
                </label>
                <Input
                  id="heapValue"
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
                  <ArrowDownToLineIcon />
                  Offer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingAction !== null}
                  onClick={poll}
                  className="w-full"
                >
                  <ArrowUpFromLineIcon />
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
                  onClick={() => void loadHeap()}
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
                    Heap 상태
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    heapOrder는 내부 배열 순서이고, priorityOrder는 poll되는
                    순서입니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                    type {heap.type}
                  </span>
                  <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                    size {heap.size}
                  </span>
                  <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                    root {heap.root ?? "empty"}
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                <HeapView values={heap.heapOrder} />
                <ArrayView title="Priority Order" values={heap.priorityOrder} />
                <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h3 className="text-sm font-medium">마지막 동작</h3>
                    <p className="mt-2 font-mono text-sm">{heap.lastAction}</p>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-medium">단계 로그</h3>
                    <ol className="max-h-[300px] overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-sm">
                      {heap.steps.map((step, index) => (
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

function HeapView({ values }: { values: number[] }) {
  if (values.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed bg-muted/40 p-6 text-sm text-muted-foreground">
        Heap is empty
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h3 className="mb-3 text-sm font-medium">Internal Heap Order</h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex h-12 items-center justify-between rounded-md border bg-background px-3 font-mono text-sm shadow-sm"
          >
            <span>index {index}</span>
            <span className="font-semibold">{item}</span>
            {index === 0 ? (
              <span className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
                root
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrayView({ title, values }: { title: string; values: number[] }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      {values.length === 0 ? (
        <p className="text-sm text-muted-foreground">No values</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="flex h-9 min-w-9 items-center justify-center rounded-md bg-primary px-2.5 text-sm font-medium text-primary-foreground"
            >
              {value}
            </span>
          ))}
        </div>
      )}
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
