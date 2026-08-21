import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AlertTriangleIcon, DatabaseIcon, KeyRoundIcon, LockKeyholeIcon, RefreshCwIcon, ServerIcon, TimerIcon } from "lucide-react";

const concepts = [
  ["Cache Aside", "애플리케이션이 캐시를 먼저 보고, 없으면 DB 조회 후 캐시에 저장합니다.", "조회 성능 개선에 가장 흔합니다."],
  ["TTL", "캐시 데이터가 살아있는 시간입니다.", "너무 길면 오래된 데이터, 너무 짧으면 캐시 효과 부족이 생깁니다."],
  ["Session Store", "로그인 세션을 Redis에 저장합니다.", "서버 여러 대가 같은 로그인 상태를 공유할 수 있습니다."],
  ["Distributed Lock", "여러 서버가 동시에 같은 작업을 하지 못하게 잠급니다.", "쿠폰 발급, 재고 차감처럼 경쟁 조건이 있는 곳에 씁니다."],
];

const flows = [
  ["조회 캐시", "API -> Redis GET -> miss면 DB 조회 -> Redis SET EX -> 응답"],
  ["캐시 무효화", "데이터 변경 API -> DB update -> Redis delete 또는 갱신"],
  ["세션", "로그인 성공 -> Redis에 session 저장 -> 다음 요청에서 session 조회"],
  ["분산락", "lock 획득 -> 재고 차감 -> lock 해제. 실패하면 대기하거나 재시도"],
];

export default function RedisCachePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Backend / Redis Cache</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <DatabaseIcon className="mt-1 size-6 text-emerald-700 dark:text-emerald-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Redis / 캐시 / 세션 / 분산락</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Redis는 빠른 key-value 저장소입니다. 캐시, 세션, 랭킹, pub/sub, 분산락에 자주 쓰지만,
                  모든 문제를 Redis로 풀면 데이터 정합성 문제가 생길 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-4">
            {concepts.map(([title, desc, use]) => (
              <article key={title} className="rounded-lg border border-sky-200 bg-sky-50/45 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
                <KeyRoundIcon className="size-5 text-sky-700 dark:text-sky-300" />
                <h2 className="mt-3 font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
                <p className="mt-3 rounded-md border bg-white/75 p-3 text-xs leading-5 dark:bg-background/45">{use}</p>
              </article>
            ))}
          </section>

          <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
            <div className="mb-4 flex items-center gap-2">
              <RefreshCwIcon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">대표 흐름</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {flows.map(([title, flow]) => (
                <div key={title} className="rounded-lg border bg-white/75 p-4 dark:bg-background/45">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 font-mono text-xs leading-6 text-muted-foreground">{flow}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <InfoCard icon={TimerIcon} title="TTL 설계" text="상품 목록처럼 조금 늦어도 되는 데이터는 TTL을 짧게 두고, 가격/재고처럼 민감한 데이터는 무효화 전략을 명확히 잡습니다." />
            <InfoCard icon={LockKeyholeIcon} title="분산락 주의" text="락 만료 시간, 락 소유자 확인, finally 해제를 같이 설계합니다. 락만 믿고 DB 제약을 빼면 위험합니다." />
            <InfoCard icon={AlertTriangleIcon} title="캐시 스탬피드" text="캐시가 동시에 만료되면 요청이 DB로 몰릴 수 있습니다. TTL jitter, mutex, background refresh를 검토합니다." />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof ServerIcon; title: string; text: string }) {
  return (
    <article className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-amber-700 dark:text-amber-300" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
    </article>
  );
}
