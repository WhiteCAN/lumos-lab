import { BookPatternIndex } from "@/components/book-pattern-content";
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
import Link from "next/link";

import { getStudyPage, getStudyMetadata } from "@/lib/study-pages";

const studyPage = getStudyPage("/patterns");

const patternLinks = [
  {
    href: "/patterns/strategy",
    description: "할인 정책을 교체하며 전략 선택 흐름을 봅니다.",
  },
  {
    href: "/patterns/factory",
    description: "알림 채널에 따라 생성되는 객체가 달라지는 흐름을 봅니다.",
  },
  {
    href: "/patterns/observer",
    description: "Publisher 이벤트가 여러 Subscriber에게 전파되는 흐름을 봅니다.",
  },
  {
    href: "/patterns/decorator",
    description: "객체를 감싸며 기능이 추가되는 흐름을 봅니다.",
  },
  {
    href: "/patterns/command",
    description: "요청을 객체로 만들고 undo 하는 흐름을 봅니다.",
  },
];

export default function PatternsIndexPage() {
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
          <PageDebugLab href="/patterns" />
          <section className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/20">
            <h1 className="text-3xl font-bold tracking-tight">{studyPage.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              각 패턴은 별도 페이지와 별도 백엔드 API로 분리되어 있습니다.
              메뉴에서 원하는 패턴을 선택해 실행 흐름을 디버깅하세요.
            </p>
          </section>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {patternLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border bg-card p-4 shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
              >
                <h2 className="text-lg font-semibold">{getStudyPage(link.href).title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {link.description}
                </p>
              </Link>
            ))}
          </section>
          <BookPatternIndex />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const metadata = getStudyMetadata("/patterns");
