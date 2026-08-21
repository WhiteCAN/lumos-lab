import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  apiRestComparisons,
  apiRestSections,
  apiStyles,
  httpMethods,
  realLifeExample,
  restBenefits,
  restFlow,
  summaryLine,
} from "@/constants/api-vs-rest";
import type {
  ApiRestSection,
  ApiStyleGuide,
  HttpMethodGuide,
} from "@/types/api-vs-rest";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  LightbulbIcon,
  RocketIcon,
  ShieldCheckIcon,
} from "lucide-react";

export default function ApiVsRestPage() {
  const ExampleIcon = realLifeExample.icon;

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
                  <BreadcrumbPage>Reference / API vs REST API</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="overflow-hidden rounded-lg border border-blue-200 bg-card text-card-foreground shadow-sm dark:border-blue-900/60">
            <div className="border-b border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900/60 dark:bg-blue-950/25">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex rounded-md border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
                    네트워크 개념 노트
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                    API vs REST API
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    이미지 내용을 웹페이지로 재구성한 정적 참고 페이지입니다.
                    API와 REST API의 차이, REST 동작 방식, HTTP 메서드, 실생활
                    예시를 한 번에 볼 수 있게 정리했습니다.
                  </p>
                </div>
                <div className="rounded-lg border border-indigo-200 bg-white p-4 text-sm text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/30 dark:text-indigo-200">
                  <p className="font-medium">핵심 한 줄</p>
                  <p className="mt-1">{summaryLine}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 xl:grid-cols-3">
              {apiRestSections.map((section) => (
                <ConceptCard key={section.title} section={section} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
            <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
              <div className="mb-4 flex items-center gap-2">
                <LightbulbIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">API와 REST API 차이</h2>
              </div>
              <div className="overflow-hidden rounded-lg border bg-white/70 dark:bg-background/45">
                <div className="grid grid-cols-2 border-b bg-muted/60 text-sm font-semibold">
                  <div className="border-r p-3 text-center">API</div>
                  <div className="p-3 text-center">REST API</div>
                </div>
                {apiRestComparisons.map((item) => (
                  <div
                    key={`${item.api}-${item.rest}`}
                    className="grid grid-cols-2 border-b text-sm last:border-b-0"
                  >
                    <div className="border-r p-3">{item.api}</div>
                    <div className="p-3">{item.rest}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="mb-4 flex items-center gap-2">
                <RocketIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">REST API 장점</h2>
              </div>
              <ul className="grid gap-3">
                {restBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2 text-sm leading-6">
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-lg border border-cyan-200 bg-cyan-50/30 p-4 shadow-sm dark:border-cyan-900/60 dark:bg-cyan-950/20">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                REST API, gRPC, FastAPI는 어떻게 다를까?
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                REST와 gRPC는 API 통신 스타일에 가깝고, FastAPI는 Python으로
                API를 만드는 프레임워크입니다. 서로 같은 층위의 개념이 아니므로
                용도를 구분해서 보면 이해하기 쉽습니다.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {apiStyles.map((style) => (
                <ApiStyleCard key={style.name} style={style} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-sky-200 bg-sky-50/40 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
              <h2 className="text-lg font-semibold">REST API 동작 흐름</h2>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {restFlow.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="flex min-w-32 flex-col items-center gap-2 rounded-lg border bg-white/75 p-3 text-center dark:bg-background/45">
                        <Icon className="size-5 text-sky-700 dark:text-sky-300" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {index < restFlow.length - 1 ? (
                        <ArrowRightIcon className="size-4 text-muted-foreground" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <h2 className="text-lg font-semibold">주요 HTTP 메서드</h2>
              <div className="mt-4 grid gap-3">
                {httpMethods.map((method) => (
                  <MethodCard key={method.method} method={method} />
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="rounded-lg border border-orange-200 bg-orange-50/40 p-4 shadow-sm dark:border-orange-900/60 dark:bg-orange-950/20">
              <div className="flex items-center gap-2">
                <ExampleIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">{realLifeExample.title}</h2>
              </div>
              <ol className="mt-4 grid gap-3">
                {realLifeExample.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-semibold text-white dark:bg-orange-400 dark:text-orange-950">
                      {index + 1}
                    </span>
                    <span className="leading-6">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-4 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">중요 메모</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                대부분의 현대 웹 애플리케이션은 프론트엔드와 백엔드 통신에 REST
                API를 사용합니다. 하지만 WebSocket, GraphQL, gRPC처럼 REST가
                아닌 API 방식도 존재합니다.
              </p>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ConceptCard({ section }: { section: ApiRestSection }) {
  const Icon = section.icon;

  return (
    <article className={`rounded-lg border p-4 shadow-sm ${section.colorClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {section.description}
          </p>
        </div>
        <span className="rounded-md border bg-white/70 p-2 dark:bg-background/45">
          <Icon className="size-5" />
        </span>
      </div>
      <ul className="mt-4 grid gap-2">
        {section.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-sm">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
            <span className="leading-6">{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function MethodCard({ method }: { method: HttpMethodGuide }) {
  return (
    <div className={`grid gap-2 rounded-lg border p-3 sm:grid-cols-[90px_1fr] ${method.colorClass}`}>
      <div className="font-mono text-sm font-bold">{method.method}</div>
      <div>
        <p className="text-sm font-medium">{method.purpose}</p>
        <p className="mt-1 font-mono text-xs opacity-80">{method.example}</p>
      </div>
    </div>
  );
}

function ApiStyleCard({ style }: { style: ApiStyleGuide }) {
  return (
    <article className={`rounded-lg border p-4 shadow-sm ${style.colorClass}`}>
      <h3 className="text-base font-semibold">{style.name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {style.summary}
      </p>
      <div className="mt-4 grid gap-3 rounded-lg border bg-white/70 p-3 dark:bg-background/45">
        <InfoBlock title="잘 맞는 곳" value={style.bestFor} />
        <InfoBlock title="주의할 점" value={style.watchOut} />
        <InfoBlock title="예시" value={style.example} mono />
      </div>
    </article>
  );
}

function InfoBlock({
  title,
  value,
  mono = false,
}: {
  title: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground">{title}</h4>
      <p className={`mt-1 text-sm leading-6 ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </p>
    </div>
  );
}
