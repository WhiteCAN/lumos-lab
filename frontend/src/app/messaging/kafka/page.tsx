import { AppSidebar } from "@/components/app-sidebar";
import { FlowSection } from "@/components/flow-section";
import { TechnologyIcon } from "@/components/technology-icon";
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
  CheckCircle2Icon,
  DatabaseIcon,
  GitBranchIcon,
  NetworkIcon,
  RefreshCwIcon,
  RouteIcon,
  ServerIcon,
  Settings2Icon,
  ShuffleIcon,
} from "lucide-react";

const kafkaTerms = [
  {
    title: "Topic",
    icon: BoxesIcon,
    colorClass:
      "border-blue-200 bg-blue-50/60 dark:border-blue-900/60 dark:bg-blue-950/20",
    description:
      "메시지를 담는 논리적인 이름입니다. 예를 들면 `order-created`, `payment-approved` 같은 이벤트 통로입니다.",
  },
  {
    title: "Partition",
    icon: GitBranchIcon,
    colorClass:
      "border-cyan-200 bg-cyan-50/60 dark:border-cyan-900/60 dark:bg-cyan-950/20",
    description:
      "토픽을 여러 줄로 나눈 것입니다. Kafka의 병렬 처리와 순서 보장은 파티션 단위로 이해해야 합니다.",
  },
  {
    title: "Producer",
    icon: ServerIcon,
    colorClass:
      "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    description:
      "메시지를 Kafka에 넣는 애플리케이션입니다. key, partition, partitioner 설정에 따라 들어갈 파티션이 달라집니다.",
  },
  {
    title: "Consumer Group",
    icon: NetworkIcon,
    colorClass:
      "border-violet-200 bg-violet-50/60 dark:border-violet-900/60 dark:bg-violet-950/20",
    description:
      "여러 consumer가 하나의 팀처럼 토픽을 나눠 읽는 단위입니다. 같은 그룹 안에서는 한 파티션을 한 consumer만 읽습니다.",
  },
];

const partitionRules = [
  {
    title: "partition을 직접 지정",
    example: "partition = 2",
    result: "무조건 P2로 이동",
    detail:
      "테스트나 특수 라우팅에는 명확하지만, 운영에서는 특정 파티션만 뜨거워질 수 있습니다.",
    colorClass:
      "border-rose-200 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20",
  },
  {
    title: "key가 있음",
    example: "key = order-1004",
    result: "같은 key는 같은 파티션",
    detail:
      "주문 ID, 사용자 ID처럼 순서가 중요한 단위에 씁니다. 같은 key의 메시지는 한 파티션에 쌓여 순서를 지키기 쉽습니다.",
    colorClass:
      "border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20",
  },
  {
    title: "key가 없음",
    example: "key = null",
    result: "현대 Kafka 기본은 sticky에 가까움",
    detail:
      "예전에는 라운드로빈처럼 이해하는 경우가 많았지만, Kafka 2.4 이후 기본 producer는 배치 효율을 위해 한 파티션에 잠깐 붙어 있다가 옮기는 sticky partitioning을 사용합니다.",
    colorClass:
      "border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20",
  },
];

const configEffects = [
  {
    option: "key",
    value: "있음 / 없음",
    effect: "같은 key는 같은 파티션으로 가기 쉬워 순서를 지키기 좋습니다.",
  },
  {
    option: "partitioner.class",
    value: "기본 / 커스텀",
    effect: "producer가 파티션을 고르는 알고리즘을 바꿉니다.",
  },
  {
    option: "acks",
    value: "0 / 1 / all",
    effect:
      "`all`은 더 안전하지만 느릴 수 있고, `0`은 빠르지만 전송 성공 확인이 약합니다.",
  },
  {
    option: "retries",
    value: "재시도 횟수",
    effect: "일시 실패 때 다시 보내지만, 중복 가능성을 같이 생각해야 합니다.",
  },
  {
    option: "enable.idempotence",
    value: "true / false",
    effect: "producer 재시도 상황에서 중복 기록 위험을 줄이는 옵션입니다.",
  },
  {
    option: "batch.size / linger.ms",
    value: "배치 크기 / 대기 시간",
    effect: "조금 모아서 보내면 처리량은 좋아지고 지연은 늘 수 있습니다.",
  },
  {
    option: "group.id",
    value: "consumer 그룹 이름",
    effect: "같은 group.id끼리는 파티션을 나눠 읽고, 다른 group.id는 각자 따로 읽습니다.",
  },
  {
    option: "auto.offset.reset",
    value: "earliest / latest",
    effect: "처음 읽는 consumer가 오래된 메시지부터 볼지, 새 메시지부터 볼지 정합니다.",
  },
  {
    option: "enable.auto.commit",
    value: "true / false",
    effect: "offset 저장을 자동으로 할지 직접 제어할지 정합니다.",
  },
];

const consumerAssignments = [
  {
    title: "Consumer 1개",
    partitions: ["C1 -> P0", "C1 -> P1", "C1 -> P2"],
    point: "혼자 모든 파티션을 읽습니다.",
  },
  {
    title: "Consumer 2개",
    partitions: ["C1 -> P0, P2", "C2 -> P1"],
    point: "파티션을 나눠 맡습니다. consumer 수보다 파티션 수가 많으면 일부 consumer가 여러 파티션을 맡습니다.",
  },
  {
    title: "Consumer 4개",
    partitions: ["C1 -> P0", "C2 -> P1", "C3 -> P2", "C4 -> 대기"],
    point: "파티션이 3개면 같은 그룹 안에서 네 번째 consumer는 읽을 파티션이 없습니다.",
  },
];

export default function KafkaReferencePage() {
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
                  <BreadcrumbPage>Messaging / Kafka 기초</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="overflow-hidden rounded-lg border border-sky-200 bg-card text-card-foreground shadow-sm dark:border-sky-900/60">
            <div className="border-b border-sky-200 bg-sky-50/70 p-5 dark:border-sky-900/60 dark:bg-sky-950/25">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex rounded-md border border-sky-200 bg-white px-3 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200">
                    메시지 브로커 레퍼런스
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                    <TechnologyIcon name="apachekafka" className="mr-3 align-middle" />
                    Kafka는 메시지를 어떻게 나눠 담고 읽을까?
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    라운드로빈, 파티션, consumer group, offset, 설정 옵션이 실제
                    데이터 흐름을 어떻게 바꾸는지 그림처럼 볼 수 있게 정리한
                    페이지입니다.
                  </p>
                </div>
                <div className="rounded-lg border border-indigo-200 bg-white p-4 text-sm text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/30 dark:text-indigo-200">
                  <p className="font-medium">먼저 구분할 것</p>
                  <p className="mt-1 leading-6">
                    producer의 파티션 선택과 consumer group의 파티션 할당은 다른
                    이야기입니다. 둘 다 “나눠 가진다”처럼 보이지만 위치가 다릅니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 xl:grid-cols-4">
              {kafkaTerms.map((term) => {
                const Icon = term.icon;

                return (
                  <article
                    key={term.title}
                    className={`rounded-lg border p-4 shadow-sm ${term.colorClass}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="size-5 text-sky-700 dark:text-sky-300" />
                      <h2 className="font-semibold">{term.title}</h2>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {term.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <FlowSection title="메시지 한 건의 전달 흐름" steps={[
            { label: "Producer", icon: "server", detail: "이벤트와 키를 전달" },
            { label: "Topic · Partition", icon: "apachekafka", detail: "선택된 파티션 로그에 저장" },
            { label: "Consumer", icon: "server", detail: "할당된 파티션에서 읽고 처리" },
            { label: "Offset 커밋", icon: "done", detail: "처리 위치 기록 · 정책에 따라 시점 결정" },
          ]} />
          <section className="rounded-lg border border-cyan-200 bg-cyan-50/40 p-4 shadow-sm dark:border-cyan-900/60 dark:bg-cyan-950/20">
            <div className="mb-4 flex items-center gap-2">
              <RouteIcon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Producer에서 파티션으로 가는 흐름</h2>
            </div>
            <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
              <div className="rounded-lg border bg-white/75 p-4 dark:bg-background/45">
                <p className="text-sm font-semibold">Producer</p>
                <div className="mt-4 grid gap-2 text-sm">
                  <Message label="A" value="key=user-1" />
                  <Message label="B" value="key=user-2" />
                  <Message label="C" value="key=null" />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {["P0", "P1", "P2"].map((partition, index) => (
                  <div
                    key={partition}
                    className="rounded-lg border bg-white/75 p-4 dark:bg-background/45"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-semibold">{partition}</p>
                      <DatabaseIcon className="size-4 text-cyan-700 dark:text-cyan-300" />
                    </div>
                    <div className="grid gap-2">
                      {index === 0 ? <Message label="A" value="user-1 이벤트" /> : null}
                      {index === 1 ? <Message label="B" value="user-2 이벤트" /> : null}
                      {index === 2 ? <Message label="C" value="key 없는 이벤트 묶음" /> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            {partitionRules.map((rule) => (
              <article
                key={rule.title}
                className={`rounded-lg border p-4 shadow-sm ${rule.colorClass}`}
              >
                <div className="flex items-center gap-2">
                  <ShuffleIcon className="size-4 text-muted-foreground" />
                  <h2 className="font-semibold">{rule.title}</h2>
                </div>
                <div className="mt-4 rounded-md border bg-white/75 p-3 text-sm dark:bg-background/45">
                  <p className="font-mono text-xs text-muted-foreground">{rule.example}</p>
                  <div className="mt-2 flex items-center gap-2 font-medium">
                    <ArrowRightIcon className="size-4" />
                    <span>{rule.result}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {rule.detail}
                </p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
            <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
              <div className="mb-4 flex items-center gap-2">
                <Settings2Icon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">설정 옵션이 데이터 흐름에 주는 영향</h2>
              </div>
              <div className="overflow-hidden rounded-lg border bg-white/75 dark:bg-background/45">
                <div className="grid grid-cols-[170px_150px_1fr] border-b bg-muted/60 text-sm font-semibold">
                  <div className="border-r p-3">옵션</div>
                  <div className="border-r p-3">값</div>
                  <div className="p-3">흐름 변화</div>
                </div>
                {configEffects.map((item) => (
                  <div
                    key={item.option}
                    className="grid grid-cols-[170px_150px_1fr] border-b text-sm last:border-b-0"
                  >
                    <div className="border-r p-3 font-mono text-xs">{item.option}</div>
                    <div className="border-r p-3">{item.value}</div>
                    <div className="p-3 leading-6">{item.effect}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="mb-4 flex items-center gap-2">
                <RefreshCwIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Consumer Group이 나눠 읽는 방식</h2>
              </div>
              <div className="grid gap-3">
                {consumerAssignments.map((assignment) => (
                  <article
                    key={assignment.title}
                    className="rounded-lg border bg-white/75 p-4 dark:bg-background/45"
                  >
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <div className="mt-3 grid gap-2">
                      {assignment.partitions.map((item) => (
                        <div
                          key={item}
                          className="rounded-md border bg-background/70 px-3 py-2 font-mono text-xs"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {assignment.point}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2Icon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">디버깅할 때 보는 순서</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                "토픽 파티션 수를 먼저 확인합니다.",
                "producer가 key를 넣는지 확인합니다.",
                "consumer의 group.id가 같은지 다른지 확인합니다.",
                "offset commit 시점과 재처리 가능성을 확인합니다.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-lg border bg-white/75 p-4 text-sm leading-6 dark:bg-background/45"
                >
                  <span className="mb-3 flex size-6 items-center justify-center rounded-md bg-amber-600 text-xs font-semibold text-white dark:bg-amber-400 dark:text-amber-950">
                    {index + 1}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground shadow-sm">
            참고 문서:{" "}
            <a className="font-medium text-sky-700 underline dark:text-sky-300" href="https://kafka.apache.org/documentation/">
              Apache Kafka Documentation
            </a>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Message({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background/75 px-3 py-2">
      <span className="mr-2 inline-flex size-5 items-center justify-center rounded bg-sky-600 text-xs font-semibold text-white dark:bg-sky-400 dark:text-sky-950">
        {label}
      </span>
      <span className="text-xs">{value}</span>
    </div>
  );
}
