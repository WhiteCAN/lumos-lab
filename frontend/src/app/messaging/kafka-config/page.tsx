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
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  DatabaseIcon,
  RefreshCwIcon,
  Settings2Icon,
  ShieldCheckIcon,
  ShuffleIcon,
} from "lucide-react";

const producerOptions = [
  ["key", "같은 key는 같은 파티션으로 가기 쉬워 순서 보장 단위가 됩니다."],
  ["partitioner.class", "파티션 선택 알고리즘을 바꿉니다. 기본은 key/hash와 sticky 배치 전략을 이해해야 합니다."],
  ["acks", "`all`은 안전성 우선, `1`은 leader 응답 기준, `0`은 확인 없이 전송합니다."],
  ["enable.idempotence", "재시도 중복 기록 위험을 줄입니다. 중요한 이벤트는 켜는 방향으로 봅니다."],
  ["retries", "일시 오류 때 다시 보냅니다. 순서와 중복 가능성을 같이 봐야 합니다."],
  ["batch.size", "한 번에 묶어 보내는 크기입니다. 처리량은 좋아질 수 있지만 지연이 생길 수 있습니다."],
  ["linger.ms", "배치를 만들기 위해 기다리는 시간입니다. 값이 커지면 처리량과 지연 사이를 조절합니다."],
  ["compression.type", "네트워크 사용량을 줄이지만 CPU를 더 씁니다. `gzip`, `snappy`, `lz4`, `zstd` 등을 검토합니다."],
];

const consumerOptions = [
  ["group.id", "같은 그룹의 consumer는 파티션을 나눠 읽습니다. 다른 그룹은 같은 메시지를 각자 읽습니다."],
  ["auto.offset.reset", "처음 시작 위치입니다. `earliest`는 처음부터, `latest`는 새 메시지부터 봅니다."],
  ["enable.auto.commit", "offset commit 자동 여부입니다. 장애 학습에는 수동 commit 흐름이 이해하기 좋습니다."],
  ["max.poll.records", "한 번 poll에서 가져올 최대 메시지 수입니다. 처리 시간이 긴 consumer에서 중요합니다."],
  ["max.poll.interval.ms", "poll 사이 허용 시간입니다. 처리 시간이 너무 길면 리밸런싱이 발생할 수 있습니다."],
  ["session.timeout.ms", "consumer가 죽었다고 판단하는 시간입니다."],
  ["heartbeat.interval.ms", "consumer가 살아있음을 group coordinator에 알리는 주기입니다."],
  ["isolation.level", "트랜잭션 producer를 쓸 때 commit된 메시지만 읽을지 결정합니다."],
];

const scenarios = [
  {
    title: "순서가 중요한 주문 이벤트",
    icon: ShuffleIcon,
    colorClass:
      "border-blue-200 bg-blue-50/60 dark:border-blue-900/60 dark:bg-blue-950/20",
    settings: ["key = orderId", "enable.idempotence = true", "acks = all"],
    reason: "같은 주문의 생성, 결제, 취소 이벤트가 같은 파티션에 들어가야 순서를 추적하기 쉽습니다.",
  },
  {
    title: "처리량이 중요한 로그 이벤트",
    icon: ClockIcon,
    colorClass:
      "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    settings: ["batch.size 증가", "linger.ms 소폭 증가", "compression.type 사용"],
    reason: "개별 메시지 지연보다 전체 처리량과 네트워크 효율이 중요합니다.",
  },
  {
    title: "중복이 민감한 결제 이벤트",
    icon: ShieldCheckIcon,
    colorClass:
      "border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20",
    settings: ["eventId 포함", "idempotent consumer", "수동 offset commit"],
    reason: "Kafka 설정만으로 끝나지 않고 consumer DB 설계까지 함께 봐야 합니다.",
  },
];

export default function KafkaConfigPage() {
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
                  <BreadcrumbPage>Messaging / Kafka 설정 옵션</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-sky-200 bg-sky-50/50 p-5 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
            <div className="flex items-start gap-3">
              <Settings2Icon className="mt-1 size-6 text-sky-700 dark:text-sky-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Kafka 설정 옵션 레퍼런스</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Kafka 옵션은 성능 스위치가 아니라 메시지가 어디로 가고, 언제 재처리되고,
                  어디까지 안전해지는지를 바꾸는 설계값입니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <OptionTable title="Producer 옵션" icon={DatabaseIcon} rows={producerOptions} />
            <OptionTable title="Consumer 옵션" icon={RefreshCwIcon} rows={consumerOptions} />
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <article key={scenario.title} className={`rounded-lg border p-4 shadow-sm ${scenario.colorClass}`}>
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <h2 className="font-semibold">{scenario.title}</h2>
                  </div>
                  <ul className="mt-4 grid gap-2">
                    {scenario.settings.map((setting) => (
                      <li key={setting} className="flex gap-2 text-sm">
                        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                        <span>{setting}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{scenario.reason}</p>
                </article>
              );
            })}
          </section>

          <section className="rounded-lg border border-rose-200 bg-rose-50/40 p-4 text-sm leading-6 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20">
            <div className="flex gap-2">
              <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-rose-700 dark:text-rose-300" />
              <p>
                Kafka는 기본적으로 at-least-once 상황을 자주 만납니다. 중요한 데이터는
                producer 설정, consumer commit, DB 중복 방지 키를 같이 설계해야 합니다.
              </p>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function OptionTable({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: typeof DatabaseIcon;
  rows: string[][];
}) {
  return (
    <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white/75 dark:bg-background/45">
        {rows.map(([option, effect]) => (
          <div key={option} className="grid grid-cols-[180px_1fr] border-b text-sm last:border-b-0">
            <div className="border-r p-3 font-mono text-xs">{option}</div>
            <div className="p-3 leading-6">{effect}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
