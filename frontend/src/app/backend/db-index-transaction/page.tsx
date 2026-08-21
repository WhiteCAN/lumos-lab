import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DatabaseZapIcon, GitCompareArrowsIcon, LockKeyholeIcon, SearchIcon } from "lucide-react";

const indexes = [
  ["B-Tree Index", "범위 검색과 정렬에 강한 일반적인 인덱스입니다.", "where created_at between ... order by created_at"],
  ["Hash Index", "동등 비교에 강하지만 범위 검색에는 약합니다.", "where token = ?"],
  ["Composite Index", "여러 컬럼을 묶은 인덱스입니다. 선두 컬럼 순서가 중요합니다.", "index(user_id, created_at)"],
  ["Covering Index", "쿼리에 필요한 컬럼을 인덱스만으로 읽는 전략입니다.", "select status where user_id = ?"],
];

const isolations = [
  ["READ UNCOMMITTED", "커밋되지 않은 데이터까지 읽을 수 있습니다.", "dirty read 가능"],
  ["READ COMMITTED", "커밋된 데이터만 읽습니다.", "일반적인 기본값으로 자주 사용"],
  ["REPEATABLE READ", "같은 트랜잭션 안에서 같은 row 조회 결과를 유지합니다.", "MySQL InnoDB 기본값"],
  ["SERIALIZABLE", "가장 강하지만 동시성이 가장 낮아질 수 있습니다.", "정합성이 매우 중요한 좁은 구간"],
];

export default function DbIndexTransactionPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>DB 실습 / 인덱스 / 격리수준</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/20">
            <div className="flex items-start gap-3">
              <DatabaseZapIcon className="mt-1 size-6 text-indigo-700 dark:text-indigo-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">DB Index / Transaction Isolation</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  인덱스는 조회 속도를 올리지만 쓰기 비용과 저장 공간을 늘립니다. 격리수준은 정합성과 동시성의 균형을 정하는 옵션입니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="mb-4 flex items-center gap-2">
                <SearchIcon className="size-4" />
                <h2 className="text-lg font-semibold">인덱스 선택 기준</h2>
              </div>
              <div className="grid gap-3">
                {indexes.map(([title, desc, example]) => (
                  <div key={title} className="rounded-lg border bg-white/75 p-3 dark:bg-background/45">
                    <p className="font-semibold">{title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                    <p className="mt-2 rounded-md border bg-background p-2 font-mono text-xs">{example}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <div className="mb-4 flex items-center gap-2">
                <LockKeyholeIcon className="size-4" />
                <h2 className="text-lg font-semibold">트랜잭션 격리수준</h2>
              </div>
              <div className="grid gap-3">
                {isolations.map(([title, desc, example]) => (
                  <div key={title} className="rounded-lg border bg-white/75 p-3 dark:bg-background/45">
                    <p className="font-semibold">{title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                    <p className="mt-2 rounded-md border bg-background p-2 text-xs">{example}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="rounded-lg border border-sky-200 bg-sky-50/40 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
            <div className="mb-3 flex items-center gap-2">
              <GitCompareArrowsIcon className="size-4" />
              <h2 className="text-lg font-semibold">실무 판단 순서</h2>
            </div>
            <ol className="grid gap-2 text-sm leading-6">
              <li className="rounded-md border bg-white/75 p-3 dark:bg-background/45">1. 느린 쿼리를 먼저 로그와 실행 계획으로 확인합니다.</li>
              <li className="rounded-md border bg-white/75 p-3 dark:bg-background/45">2. where, join, order by에 자주 쓰는 컬럼을 기준으로 인덱스를 설계합니다.</li>
              <li className="rounded-md border bg-white/75 p-3 dark:bg-background/45">3. 트랜잭션 범위를 짧게 잡고, 필요한 구간만 더 강한 격리나 락을 검토합니다.</li>
              <li className="rounded-md border bg-white/75 p-3 dark:bg-background/45">4. 인덱스 추가 후 조회뿐 아니라 insert/update/delete 비용도 같이 봅니다.</li>
            </ol>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
