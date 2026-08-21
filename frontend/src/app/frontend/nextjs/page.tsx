import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowRightIcon, CheckCircle2Icon, Code2Icon, FileCode2Icon, FolderTreeIcon, RouteIcon, ServerIcon } from "lucide-react";

const routes = [
  ["src/app/page.tsx", "/"],
  ["src/app/search/page.tsx", "/search"],
  ["src/app/frontend/nextjs/page.tsx", "/frontend/nextjs"],
  ["src/app/layout.tsx", "전체 공통 레이아웃"],
];

const concepts = [
  {
    title: "App Router",
    text: "`src/app` 폴더 구조가 URL 구조가 됩니다.",
    icon: RouteIcon,
  },
  {
    title: "page.tsx",
    text: "해당 URL에서 실제로 렌더링되는 화면 컴포넌트입니다.",
    icon: FileCode2Icon,
  },
  {
    title: "layout.tsx",
    text: "여러 페이지가 공유하는 UI입니다. root layout은 `html`, `body`를 포함합니다.",
    icon: FolderTreeIcon,
  },
  {
    title: "Server Component",
    text: "기본값입니다. 서버에서 렌더링되고 클라이언트 JS를 줄일 수 있습니다.",
    icon: ServerIcon,
  },
  {
    title: "Client Component",
    text: "`use client`를 붙입니다. 클릭, state, 브라우저 API가 필요할 때 씁니다.",
    icon: Code2Icon,
  },
];

const whenClient = [
  "useState, useEffect 같은 React Hook을 쓸 때",
  "onClick, onChange 같은 이벤트가 필요할 때",
  "localStorage, window 같은 브라우저 API를 쓸 때",
  "사용자 입력값으로 즉시 화면을 바꿔야 할 때",
];

export default function NextJsBasicsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Frontend / Next.js 기초</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-blue-200 bg-blue-50/50 p-5 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
            <h1 className="text-3xl font-bold tracking-tight">Next.js 기초</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Next.js는 React 앱에 라우팅, 서버 렌더링, 빌드 최적화, API 연동 구조를 얹은 프레임워크입니다.
              이 프로젝트는 App Router 기준으로 구성되어 있습니다.
            </p>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-cyan-200 bg-cyan-50/40 p-4 shadow-sm dark:border-cyan-900/60 dark:bg-cyan-950/20">
              <h2 className="text-lg font-semibold">파일이 URL이 되는 방식</h2>
              <div className="mt-4 overflow-hidden rounded-lg border bg-white/75 dark:bg-background/45">
                {routes.map(([file, url]) => (
                  <div key={file} className="grid grid-cols-[1fr_180px] border-b text-sm last:border-b-0">
                    <div className="border-r p-3 font-mono text-xs">{file}</div>
                    <div className="p-3">{url}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {concepts.map((concept) => {
                const Icon = concept.icon;

                return (
                <article key={concept.title} className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-violet-700 dark:text-violet-300" />
                    <h2 className="font-semibold">{concept.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{concept.text}</p>
                </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <h2 className="text-lg font-semibold">언제 `use client`를 붙일까?</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {whenClient.map((item, index) => (
                <div key={item} className="flex items-center gap-2 rounded-lg border bg-white/75 px-3 py-2 text-sm dark:bg-background/45">
                  <span>{index + 1}. {item}</span>
                  {index < whenClient.length - 1 ? <ArrowRightIcon className="size-4 text-muted-foreground" /> : null}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 text-sm leading-6 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
            <div className="flex gap-2">
              <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-amber-700 dark:text-amber-300" />
              <p>현재 프로젝트의 실험실 화면은 버튼 클릭과 API 호출이 많으므로 대부분 Client Component로 작성되어 있습니다.</p>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
