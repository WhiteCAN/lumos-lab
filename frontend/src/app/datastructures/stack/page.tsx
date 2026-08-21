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
  Layers3Icon,
  RotateCcwIcon,
} from "lucide-react";

type StackResponse = {
  values: number[];
  top: number | null;
  size: number;
  lastAction: string;
  steps: string[];
};

export default function StackPage() {
  const [value, setValue] = useState(10);
  const [stack, setStack] = useState<StackResponse>({
    values: [],
    top: null,
    size: 0,
    lastAction: "ready",
    steps: ["Stack page is ready. Try push, pop, peek, or refresh."],
  });
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const requestStack = useCallback(async (
    action: string,
    path: string,
    options: RequestInit,
  ) => {
    setLoadingAction(action);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, options);
      const body = (await response.json()) as ApiResponse<StackResponse>;

      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.message ?? "Stack API request failed");
      }

      setStack(body.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
    } finally {
      setLoadingAction(null);
    }
  }, []);

  async function loadStack() {
    await requestStack("current", "/api/datastructures/stack", {
      method: "GET",
    });
  }

  async function push(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await requestStack("push", "/api/datastructures/stack/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });
  }

  async function pop() {
    await requestStack("pop", "/api/datastructures/stack/pop", {
      method: "POST",
    });
  }

  async function peek() {
    await requestStack("peek", "/api/datastructures/stack/peek", {
      method: "POST",
    });
  }

  async function clear() {
    await requestStack("clear", "/api/datastructures/stack", {
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
                  <BreadcrumbPage>Data Structures / Stack</BreadcrumbPage>
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
                  <Layers3Icon className="size-4" />
                  Java Deque 기반 LIFO 구조
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                  Stack 실험실
                </h1>
              </div>
              <div className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                API: /api/datastructures/stack
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form
              onSubmit={push}
              className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="rounded-lg border bg-muted/30 p-3">
                <h2 className="text-sm font-semibold">Stack 개요</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Stack은 마지막에 넣은 값이 가장 먼저 나오는 LIFO 구조입니다.
                  브라우저 뒤로가기, 함수 호출 스택, undo 기능 같은 곳에서 자주
                  등장합니다.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <Metric label="Push" value="O(1)" />
                  <Metric label="Pop" value="O(1)" />
                  <Metric label="Peek" value="O(1)" />
                  <Metric label="Rule" value="LIFO" />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="stackValue" className="text-sm font-medium">
                  Push 값
                </label>
                <Input
                  id="stackValue"
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
                  Push
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loadingAction !== null}
                  onClick={pop}
                  className="w-full"
                >
                  <ArrowUpFromLineIcon />
                  Pop
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
                  onClick={loadStack}
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
                    Stack 상태
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    위쪽 값이 top입니다. push/pop을 누르며 변화를 따라가세요.
                  </p>
                </div>
                {stack ? (
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                      size {stack.size}
                    </span>
                    <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                      top {stack.top ?? "empty"}
                    </span>
                  </div>
                ) : null}
              </div>

              {stack ? (
                <div className="grid gap-4 xl:grid-cols-[260px_1fr]">
                  <StackView values={stack.values} />
                  <div className="grid gap-4">
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <h3 className="text-sm font-medium">마지막 동작</h3>
                      <p className="mt-2 font-mono text-sm">
                        {stack.lastAction}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-3 text-sm font-medium">단계 로그</h3>
                      <ol className="max-h-[340px] overflow-auto rounded-lg border bg-muted/40 p-3 font-mono text-sm">
                        {stack.steps.map((step, index) => (
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
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed bg-muted/40 p-8 text-center text-muted-foreground">
                  Stack 상태를 불러오는 중입니다.
                </div>
              )}
            </section>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function StackView({ values }: { values: number[] }) {
  if (values.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed bg-muted/40 p-6 text-sm text-muted-foreground">
        Stack is empty
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h3 className="mb-3 text-sm font-medium">Top to Bottom</h3>
      <div className="flex flex-col gap-2">
        {values.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex h-11 items-center justify-between rounded-md border bg-background px-3 font-mono text-sm shadow-sm"
          >
            <span>{item}</span>
            {index === 0 ? (
              <span className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
                top
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
