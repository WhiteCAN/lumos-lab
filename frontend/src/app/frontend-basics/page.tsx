import { PageDebugLab } from "@/components/debug-lab";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
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
  BoxesIcon,
  BracesIcon,
  CheckCircle2Icon,
  Code2Icon,
  ComponentIcon,
  FileCode2Icon,
  GitBranchIcon,
  Layers3Icon,
  MousePointerClickIcon,
  RefreshCwIcon,
  RouteIcon,
  ServerIcon,
  SparklesIcon,
} from "lucide-react";

import { getStudyPage, getStudyMetadata } from "@/lib/study-pages";

const studyPage = getStudyPage("/frontend-basics");

const bridgeConcepts = [
  {
    title: "HTML을 알면 JSX부터 보면 됩니다",
    icon: FileCode2Icon,
    colorClass:
      "border-blue-200 bg-blue-50/60 dark:border-blue-900/60 dark:bg-blue-950/20",
    before: "<button onclick=\"save()\">저장</button>",
    after: "<button onClick={save}>저장</button>",
    notes: [
      "JSX는 HTML처럼 보이지만 JavaScript 안에서 쓰는 문법입니다.",
      "`class` 대신 `className`, `onclick` 대신 `onClick`처럼 React 규칙을 따릅니다.",
      "중괄호 `{}` 안에는 JavaScript 값을 넣습니다.",
    ],
  },
  {
    title: "CSS를 알면 Tailwind는 클래스 조합으로 보면 됩니다",
    icon: SparklesIcon,
    colorClass:
      "border-cyan-200 bg-cyan-50/60 dark:border-cyan-900/60 dark:bg-cyan-950/20",
    before: ".card { padding: 16px; border-radius: 8px; }",
    after: "<div className=\"rounded-lg border p-4\">",
    notes: [
      "기존 CSS 파일을 없애는 개념이 아니라, 자주 쓰는 CSS를 짧은 클래스명으로 조합합니다.",
      "이 프로젝트는 Tailwind CSS v4와 shadcn/ui 컴포넌트를 같이 씁니다.",
      "공통 UI는 `src/components/ui`, 화면별 배치는 `src/app`에서 다룹니다.",
    ],
  },
  {
    title: "JS를 알면 상태 변화와 렌더링을 보면 됩니다",
    icon: RefreshCwIcon,
    colorClass:
      "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    before: "count = count + 1; element.innerText = count;",
    after: "setCount((count) => count + 1);",
    notes: [
      "React는 DOM을 직접 바꾸기보다 상태를 바꾸고 화면을 다시 계산합니다.",
      "`useState`는 화면에 기억해야 할 값을 담습니다.",
      "상태가 바뀌면 컴포넌트 함수가 다시 실행되며 최신 화면이 만들어집니다.",
    ],
  },
];

const reactBasics = [
  {
    title: "컴포넌트",
    icon: ComponentIcon,
    description:
      "화면 조각을 함수로 분리합니다. 버튼, 카드, 입력 폼, 페이지 섹션을 컴포넌트로 나눕니다.",
    example: `function SaveButton() {
  return <button>저장</button>;
}`,
  },
  {
    title: "Props",
    icon: BoxesIcon,
    description:
      "부모 컴포넌트가 자식 컴포넌트에 값을 전달하는 방법입니다. Java 메서드 파라미터처럼 보면 편합니다.",
    example: `<UserCard name="민수" role="admin" />`,
  },
  {
    title: "State",
    icon: BracesIcon,
    description:
      "사용자 입력, 선택값, API 응답처럼 화면에서 바뀌는 값을 보관합니다.",
    example: `const [keyword, setKeyword] = useState("");`,
  },
  {
    title: "Event",
    icon: MousePointerClickIcon,
    description:
      "클릭, 입력, 제출 같은 사용자 행동을 함수로 연결합니다.",
    example: `<button onClick={handleSearch}>검색</button>`,
  },
];

const nextBasics = [
  {
    title: "App Router",
    icon: RouteIcon,
    description:
      "`src/app` 폴더 구조가 URL이 됩니다. `src/app/search/page.tsx`는 `/search` 화면입니다.",
    points: ["폴더가 URL 경로", "`page.tsx`가 화면", "`layout.tsx`가 공통 레이아웃"],
  },
  {
    title: "Server Component",
    icon: ServerIcon,
    description:
      "기본 컴포넌트입니다. 서버에서 먼저 렌더링되며 브라우저 JavaScript를 줄일 수 있습니다.",
    points: ["기본값", "비밀 환경변수 접근 가능", "클릭 상태 처리에는 맞지 않음"],
  },
  {
    title: "Client Component",
    icon: Code2Icon,
    description:
      "`use client`를 붙인 컴포넌트입니다. 클릭, 입력, 상태, 브라우저 API가 필요할 때 사용합니다.",
    points: ["`useState` 사용 가능", "`onClick` 사용 가능", "API 호출 결과를 화면에서 바로 확인하기 좋음"],
  },
];

const studyOrder = [
  "JSX 문법과 `className`, `{}` 표현식 익히기",
  "컴포넌트를 작게 나누고 props로 데이터 전달하기",
  "`useState`로 입력값과 선택값 관리하기",
  "`fetch()`로 Spring Boot API 호출하고 loading/error 상태 만들기",
  "Next.js `src/app` 라우팅과 `page.tsx` 구조 익히기",
  "Server Component와 Client Component 차이를 구분하기",
];

const projectMap = [
  {
    path: "src/app/page.tsx",
    label: "정렬 실험실 화면",
    reason: "Client Component, 입력 상태, API 호출, 결과 렌더링을 같이 볼 수 있습니다.",
  },
  {
    path: "src/components/app-sidebar.tsx",
    label: "사이드바 메뉴",
    reason: "배열 데이터로 메뉴를 만들고 컴포넌트에 전달하는 구조를 볼 수 있습니다.",
  },
  {
    path: "src/components/ui",
    label: "shadcn/ui 컴포넌트",
    reason: "버튼, 사이드바, 입력처럼 재사용 UI가 모이는 위치입니다.",
  },
  {
    path: "src/app/globals.css",
    label: "전역 스타일과 테마",
    reason: "라이트/다크 색상 토큰과 Tailwind 기본 설정을 확인할 수 있습니다.",
  },
];

export default function FrontendBasicsPage() {
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
          <PageDebugLab href="/frontend-basics" />
          <section className="overflow-hidden rounded-lg border border-sky-200 bg-card text-card-foreground shadow-sm dark:border-sky-900/60">
            <div className="border-b border-sky-200 bg-sky-50/70 p-5 dark:border-sky-900/60 dark:bg-sky-950/25">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex rounded-md border border-sky-200 bg-white px-3 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200">
                    HTML / CSS / JS 다음 단계
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{studyPage.title}</h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    이미 알고 있는 HTML, CSS, JavaScript를 React 컴포넌트,
                    상태 관리, Next.js 라우팅으로 연결해서 보는 학습 페이지입니다.
                    이 프로젝트의 실제 파일을 기준으로 어디를 보면 되는지도 함께
                    정리했습니다.
                  </p>
                </div>
                <div className="rounded-lg border border-indigo-200 bg-white p-4 text-sm text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/30 dark:text-indigo-200">
                  <p className="font-medium">핵심 관점</p>
                  <p className="mt-1 leading-6">
                    React는 화면을 컴포넌트와 상태로 관리하고, Next.js는 그
                    컴포넌트를 URL, 서버 렌더링, 빌드 구조와 연결합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 xl:grid-cols-3">
              {bridgeConcepts.map((concept) => {
                const Icon = concept.icon;

                return (
                  <article
                    key={concept.title}
                    className={`rounded-lg border p-4 shadow-sm ${concept.colorClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-md border bg-white p-2 dark:bg-background/45">
                        <Icon className="size-5 text-sky-700 dark:text-sky-300" />
                      </div>
                      <div>
                        <h2 className="font-semibold">{concept.title}</h2>
                        <div className="mt-3 grid gap-2 text-xs">
                          <CodeBlock label="기존 감각" value={concept.before} />
                          <CodeBlock label="React 감각" value={concept.after} />
                        </div>
                      </div>
                    </div>
                    <ul className="mt-4 grid gap-2">
                      {concept.notes.map((note) => (
                        <li key={note} className="flex gap-2 text-sm leading-6">
                          <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
            <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
              <div className="mb-4 flex items-center gap-2">
                <ComponentIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">React에서 먼저 볼 것</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {reactBasics.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-lg border bg-white/75 p-4 dark:bg-background/45"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-violet-700 dark:text-violet-300" />
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                      <pre className="mt-3 overflow-x-auto rounded-md border bg-background/80 p-3 text-xs">
                        <code>{item.example}</code>
                      </pre>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="mb-4 flex items-center gap-2">
                <RouteIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Next.js에서 먼저 볼 것</h2>
              </div>
              <div className="grid gap-3">
                {nextBasics.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-lg border bg-white/75 p-4 dark:bg-background/45"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-emerald-700 dark:text-emerald-300" />
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                      <ul className="mt-3 grid gap-2">
                        {item.points.map((point) => (
                          <li key={point} className="flex gap-2 text-sm">
                            <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <div className="mb-4 flex items-center gap-2">
                <GitBranchIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">추천 학습 순서</h2>
              </div>
              <ol className="grid gap-3">
                {studyOrder.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-6">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-600 text-xs font-semibold text-white dark:bg-amber-400 dark:text-amber-950">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-4 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20">
              <div className="mb-4 flex items-center gap-2">
                <Layers3Icon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">이 프로젝트에서 볼 파일</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {projectMap.map((item) => (
                  <article
                    key={item.path}
                    className="rounded-lg border bg-white/75 p-4 dark:bg-background/45"
                  >
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 font-mono text-xs text-rose-700 dark:text-rose-300">
                      {item.path}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {item.reason}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function CodeBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-white/75 p-3 dark:bg-background/45">
      <p className="mb-1 text-[11px] font-medium text-muted-foreground">
        {label}
      </p>
      <code className="font-mono text-xs">{value}</code>
    </div>
  );
}

export const metadata = getStudyMetadata("/frontend-basics");
