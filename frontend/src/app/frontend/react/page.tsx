import { AppSidebar } from "@/components/app-sidebar";
import { TechnologyIcon } from "@/components/technology-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BoxesIcon, BracesIcon, CheckCircle2Icon, ComponentIcon, FileCode2Icon, MousePointerClickIcon, RefreshCwIcon } from "lucide-react";

const concepts = [
  {
    title: "JSX",
    icon: FileCode2Icon,
    text: "HTML처럼 보이지만 JavaScript 안에서 UI를 표현하는 문법입니다.",
    code: `<button className="primary" onClick={save}>저장</button>`,
  },
  {
    title: "Component",
    icon: ComponentIcon,
    text: "화면 조각을 함수로 나눈 것입니다. 이름은 대문자로 시작합니다.",
    code: `function UserCard() {\n  return <div>사용자</div>;\n}`,
  },
  {
    title: "Props",
    icon: BoxesIcon,
    text: "부모가 자식 컴포넌트에 넘기는 값입니다. HTML attribute처럼 보이지만 JS 값도 전달합니다.",
    code: `<UserCard name="민수" age={20} />`,
  },
  {
    title: "State",
    icon: BracesIcon,
    text: "화면에서 바뀌는 값을 기억합니다. state가 바뀌면 컴포넌트가 다시 렌더링됩니다.",
    code: `const [count, setCount] = useState(0);`,
  },
  {
    title: "Event",
    icon: MousePointerClickIcon,
    text: "클릭, 입력, 제출 같은 사용자 행동을 함수로 연결합니다.",
    code: `<input value={keyword} onChange={handleChange} />`,
  },
  {
    title: "Effect",
    icon: RefreshCwIcon,
    text: "렌더링 이후 외부 시스템과 동기화할 때 씁니다. API 호출, 구독, 타이머가 대표 예시입니다.",
    code: `useEffect(() => {\n  fetchData();\n}, []);`,
  },
];

const mentalModel = [
  "DOM을 직접 조작하기보다 state를 바꿉니다.",
  "컴포넌트는 props를 입력으로 받아 JSX를 반환하는 함수처럼 봅니다.",
  "리스트 렌더링에는 안정적인 key가 필요합니다.",
  "부모 state가 바뀌면 자식도 다시 렌더링될 수 있습니다.",
  "복잡한 화면은 컴포넌트와 상태 위치를 나누는 게 핵심입니다.",
];

export default function ReactBasicsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Frontend / React 기초</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-sky-200 bg-sky-50/50 p-5 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight"><TechnologyIcon name="react" />React 기초</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              HTML, CSS, JavaScript를 알고 있다면 React는 컴포넌트, props, state,
              event, effect 순서로 보면 이해하기 쉽습니다.
            </p>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            {concepts.map((concept) => {
              const Icon = concept.icon;
              return (
                <article key={concept.title} className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-violet-700 dark:text-violet-300" />
                    <h2 className="font-semibold">{concept.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{concept.text}</p>
                  <pre className="mt-3 overflow-x-auto rounded-md border bg-white/75 p-3 text-xs dark:bg-background/45"><code>{concept.code}</code></pre>
                </article>
              );
            })}
          </section>

          <section className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <h2 className="text-lg font-semibold">React 사고방식</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {mentalModel.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6">
                  <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
