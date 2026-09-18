import { AppSidebar } from "@/components/app-sidebar";
import { FlowSection } from "@/components/flow-section";
import { ThemeToggle } from "@/components/theme-toggle";
import type { ReactNode } from "react";
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
  ArrowRightIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  DatabaseIcon,
  NetworkIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SendIcon,
  ServerIcon,
  ShieldCheckIcon,
  SirenIcon,
  WorkflowIcon,
} from "lucide-react";

const sagaSteps = [
  {
    service: "Order Service",
    action: "주문을 PENDING으로 저장",
    event: "OrderCreated 발행",
  },
  {
    service: "Payment Service",
    action: "결제 승인 시도",
    event: "PaymentApproved 또는 PaymentFailed 발행",
  },
  {
    service: "Stock Service",
    action: "재고 차감 시도",
    event: "StockReserved 또는 StockFailed 발행",
  },
  {
    service: "Order Service",
    action: "주문 승인 또는 취소",
    event: "OrderApproved 또는 OrderCanceled",
  },
];

const comparisonRows = [
  {
    topic: "목적",
    saga: "여러 서비스에 걸친 업무 흐름을 맞춤",
    outbox: "DB 저장과 메시지 발행 사이의 틈을 막음",
  },
  {
    topic: "핵심 질문",
    saga: "중간 단계가 실패하면 어떻게 보상할까?",
    outbox: "DB는 커밋됐는데 메시지 발행 전 서버가 죽으면?",
  },
  {
    topic: "주요 구성",
    saga: "로컬 트랜잭션, 이벤트/커맨드, 보상 트랜잭션",
    outbox: "업무 테이블, outbox 테이블, relay/publisher",
  },
  {
    topic: "Kafka와의 관계",
    saga: "서비스 간 이벤트 전달 통로로 Kafka를 자주 사용",
    outbox: "outbox에 쌓은 이벤트를 Kafka로 안정적으로 발행",
  },
];

const outboxSteps = [
  "주문 저장과 outbox 이벤트 저장을 같은 DB 트랜잭션으로 처리합니다.",
  "트랜잭션이 커밋되면 outbox row도 같이 남습니다.",
  "별도 relay가 outbox row를 읽어서 Kafka로 발행합니다.",
  "발행이 끝나면 published 상태로 바꾸거나 삭제합니다.",
  "consumer는 중복 메시지에 대비해 idempotent하게 처리합니다.",
];

const patternWarnings = [
  {
    title: "Saga는 자동 롤백이 아닙니다",
    icon: RotateCcwIcon,
    description:
      "이미 끝난 로컬 트랜잭션은 DB rollback으로 되돌릴 수 없습니다. 취소 주문, 환불, 재고 복구 같은 보상 작업을 직접 설계해야 합니다.",
  },
  {
    title: "Outbox는 중복 발행 가능성을 남깁니다",
    icon: RefreshCwIcon,
    description:
      "relay가 Kafka 발행 직후 죽으면 재시작 후 같은 메시지를 다시 보낼 수 있습니다. 그래서 consumer 쪽 중복 처리 방지가 중요합니다.",
  },
  {
    title: "둘은 경쟁 관계가 아닙니다",
    icon: WorkflowIcon,
    description:
      "Saga가 전체 업무 흐름을 다루고, Outbox는 각 서비스가 이벤트를 안정적으로 발행하게 돕습니다. 보통 같이 씁니다.",
  },
];

const failureScenarios = [
  {
    title: "메시지는 처리했는데 offset commit 전에 컨슈머가 죽음",
    situation:
      "결제 승인 이벤트를 받아 DB에 `paid` 상태로 저장했습니다. 그런데 offset을 Kafka에 commit하기 전에 서버가 강제 종료됩니다.",
    result:
      "재시작하면 Kafka는 아직 처리 안 된 메시지로 보고 같은 메시지를 다시 전달할 수 있습니다.",
    defense:
      "consumer 처리 로직을 idempotent하게 만들고, `processed_message` 테이블에 messageId를 저장해서 이미 처리한 메시지는 건너뜁니다.",
    colorClass:
      "border-rose-200 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20",
  },
  {
    title: "offset을 먼저 commit하고 DB 저장 전에 서버가 죽음",
    situation:
      "consumer가 메시지를 받자마자 offset을 commit했습니다. 그 다음 DB 저장을 하려는 순간 서버가 종료됩니다.",
    result:
      "Kafka는 이미 읽은 메시지로 보기 때문에 재전달하지 않을 수 있고, DB에는 반영되지 않아 데이터 손실처럼 보입니다.",
    defense:
      "업무 처리가 성공한 뒤 offset을 commit합니다. 자동 commit보다 수동 commit을 검토하고, 실패 시 재처리되도록 둡니다.",
    colorClass:
      "border-orange-200 bg-orange-50/45 dark:border-orange-900/60 dark:bg-orange-950/20",
  },
  {
    title: "처리 중 계속 실패해서 같은 메시지만 반복됨",
    situation:
      "재고 차감 이벤트가 들어왔지만 상품 ID가 잘못되어 처리할 때마다 예외가 납니다.",
    result:
      "무한 retry가 걸리면 뒤 메시지 처리도 막히고 consumer lag이 계속 쌓입니다.",
    defense:
      "retry 횟수와 backoff를 제한하고, 계속 실패한 메시지는 DLQ로 보내 원인 분석 대상으로 분리합니다.",
    colorClass:
      "border-amber-200 bg-amber-50/45 dark:border-amber-900/60 dark:bg-amber-950/20",
  },
  {
    title: "Outbox relay가 Kafka 발행 직후 죽음",
    situation:
      "relay가 outbox 이벤트를 Kafka로 보냈습니다. 그런데 outbox row를 `published`로 바꾸기 전에 죽었습니다.",
    result:
      "재시작 후 같은 outbox 이벤트를 다시 발행할 수 있습니다.",
    defense:
      "이벤트에 고유 eventId를 넣고 consumer가 eventId 기준으로 중복 처리를 방지합니다. Outbox는 적어도 한 번 발행될 수 있다고 보고 설계합니다.",
    colorClass:
      "border-violet-200 bg-violet-50/40 dark:border-violet-900/60 dark:bg-violet-950/20",
  },
];

const defensiveDesigns = [
  {
    title: "Idempotent Consumer",
    icon: ShieldCheckIcon,
    summary: "같은 메시지를 여러 번 받아도 결과가 한 번 처리한 것과 같게 만듭니다.",
    example:
      "`processed_message(message_id)`에 먼저 기록하고, 이미 있으면 주문/결제 로직을 다시 실행하지 않습니다.",
  },
  {
    title: "수동 offset commit",
    icon: CheckCircle2Icon,
    summary: "업무 처리와 DB 저장이 끝난 뒤 offset을 commit합니다.",
    example:
      "자동 commit이 편하긴 하지만, 장애 상황을 공부할 때는 처리 성공 뒤 commit하는 흐름을 디버깅하는 것이 좋습니다.",
  },
  {
    title: "Retry + Backoff",
    icon: RefreshCwIcon,
    summary: "바로 재시도하지 않고 잠깐 기다렸다가 제한된 횟수만 다시 시도합니다.",
    example:
      "DB 일시 장애 같은 문제는 1초, 3초, 10초처럼 간격을 늘려 재시도하면 회복될 수 있습니다.",
  },
  {
    title: "DLQ",
    icon: SirenIcon,
    summary: "계속 실패하는 메시지를 별도 토픽이나 테이블로 격리합니다.",
    example:
      "`order-events.DLQ`에 원본 payload, 실패 이유, stack trace, 발생 시간을 함께 남깁니다.",
  },
];

const reliabilityChecklist = [
  "이벤트마다 `eventId` 또는 `messageId`를 넣습니다.",
  "업무 기준 중복 키를 정합니다. 예: `paymentId`, `orderId + eventType`.",
  "consumer DB 작업과 `processed_message` 기록을 같은 트랜잭션으로 묶습니다.",
  "성공 후 offset commit, 실패 시 retry 또는 DLQ 이동 기준을 정합니다.",
  "같은 key의 순서가 중요하면 Kafka message key를 안정적으로 지정합니다.",
  "consumer는 언제든 죽고 다시 살아날 수 있다고 가정합니다.",
];

export default function SagaOutboxPage() {
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
                  <BreadcrumbPage>Messaging / Saga & Outbox</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <FlowSection title="Outbox 전달 흐름 · 저장과 발행의 경계" steps={[
            { label: "주문 요청", icon: "user" },
            { label: "주문 + Outbox 커밋", icon: "database", detail: "같은 DB 트랜잭션" },
            { label: "Relay 발행", icon: "server", detail: "커밋된 이벤트를 전달" },
            { label: "Kafka", icon: "apachekafka" },
            { label: "Consumer 처리", icon: "verify", detail: "중복 이벤트는 멱등하게 처리" },
          ]} />
          <section className="overflow-hidden rounded-lg border border-violet-200 bg-card text-card-foreground shadow-sm dark:border-violet-900/60">
            <div className="border-b border-violet-200 bg-violet-50/70 p-5 dark:border-violet-900/60 dark:bg-violet-950/25">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex rounded-md border border-violet-200 bg-white px-3 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-200">
                    분산 트랜잭션 패턴
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                    Saga와 메시지 Outbox 패턴
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    Kafka 같은 메시지 브로커를 쓰는 서비스에서 주문, 결제, 재고처럼
                    여러 서비스에 걸친 작업을 어떻게 안전하게 이어갈지 정리한
                    레퍼런스입니다.
                  </p>
                </div>
                <div className="rounded-lg border border-rose-200 bg-white p-4 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200">
                  <p className="font-medium">핵심 문제</p>
                  <p className="mt-1 leading-6">
                    DB 저장과 Kafka 발행은 하나의 로컬 DB 트랜잭션으로 묶이지
                    않습니다. 이 틈을 설계로 메워야 합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-blue-200 bg-blue-50/35 p-4 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex rounded-md border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
                  시스템 구조 이미지
                </div>
                <h2 className="mt-3 text-xl font-semibold">
                  Kafka + Saga + Outbox 설계 청사진
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  주문 생성부터 outbox 저장, Kafka 발행, 각 컨슈머 처리, 실패 메시지
                  격리까지 한 장으로 따라갈 수 있는 구조도입니다.
                </p>
              </div>
              <div className="rounded-lg border border-sky-200 bg-white px-4 py-3 text-xs leading-5 text-sky-800 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-200">
                실선은 정상 흐름, 점선은 장애 대응 흐름입니다.
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border bg-white/85 p-4 dark:bg-background/45">
              <div className="min-w-[1040px]">
                <div className="grid grid-cols-[1fr_1fr_1.05fr_1fr] gap-4">
                  <BlueprintZone
                    title="요청 진입"
                    colorClass="border-sky-200 bg-sky-50/70 dark:border-sky-900/60 dark:bg-sky-950/30"
                  >
                    <BlueprintNode
                      icon={ServerIcon}
                      title="Client / API"
                      detail="POST /orders"
                      tone="sky"
                    />
                    <BlueprintArrow label="HTTP 요청" />
                    <BlueprintNode
                      icon={ServerIcon}
                      title="Order Service"
                      detail="주문 PENDING 저장"
                      tone="sky"
                    />
                    <BlueprintNote>
                      주문 저장과 이벤트 기록은 같은 DB 트랜잭션으로 묶습니다.
                    </BlueprintNote>
                  </BlueprintZone>

                  <BlueprintZone
                    title="로컬 트랜잭션"
                    colorClass="border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/30"
                  >
                    <BlueprintNode
                      icon={DatabaseIcon}
                      title="orders"
                      detail="업무 데이터"
                      tone="emerald"
                    />
                    <BlueprintArrow label="같이 commit" />
                    <BlueprintNode
                      icon={ClipboardListIcon}
                      title="outbox_events"
                      detail="eventId, payload, status"
                      tone="emerald"
                    />
                    <BlueprintNote>
                      DB commit 성공 시에만 발행할 이벤트가 남습니다.
                    </BlueprintNote>
                  </BlueprintZone>

                  <BlueprintZone
                    title="메시지 발행"
                    colorClass="border-violet-200 bg-violet-50/70 dark:border-violet-900/60 dark:bg-violet-950/30"
                  >
                    <BlueprintNode
                      icon={SendIcon}
                      title="Outbox Relay"
                      detail="미발행 row 조회"
                      tone="violet"
                    />
                    <BlueprintArrow label="publish" />
                    <BlueprintNode
                      icon={NetworkIcon}
                      title="Kafka Topic"
                      detail="order-events"
                      tone="violet"
                    />
                    <BlueprintNote>
                      relay 장애 시 같은 이벤트가 다시 발행될 수 있습니다.
                    </BlueprintNote>
                  </BlueprintZone>

                  <BlueprintZone
                    title="컨슈머 처리"
                    colorClass="border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/30"
                  >
                    <BlueprintNode
                      icon={ServerIcon}
                      title="Payment Consumer"
                      detail="결제 승인 / 실패"
                      tone="amber"
                    />
                    <BlueprintNode
                      icon={ServerIcon}
                      title="Stock Consumer"
                      detail="재고 차감 / 복구"
                      tone="amber"
                    />
                    <BlueprintNode
                      icon={CheckCircle2Icon}
                      title="processed_message"
                      detail="messageId 중복 방지"
                      tone="amber"
                    />
                  </BlueprintZone>
                </div>

                <div className="mt-4 grid grid-cols-[1.05fr_0.95fr_1fr] gap-4">
                  <BlueprintZone
                    title="실패 격리"
                    colorClass="border-rose-200 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/30"
                  >
                    <BlueprintNode
                      icon={RefreshCwIcon}
                      title="Retry + Backoff"
                      detail="일시 오류 재시도"
                      tone="rose"
                    />
                    <BlueprintArrow label="반복 실패" dotted />
                    <BlueprintNode
                      icon={SirenIcon}
                      title="DLQ"
                      detail="원본 payload + 실패 이유"
                      tone="rose"
                    />
                  </BlueprintZone>

                  <BlueprintZone
                    title="Saga 상태"
                    colorClass="border-cyan-200 bg-cyan-50/70 dark:border-cyan-900/60 dark:bg-cyan-950/30"
                  >
                    <BlueprintNode
                      icon={WorkflowIcon}
                      title="Saga State"
                      detail="PENDING -> APPROVED / CANCELED"
                      tone="cyan"
                    />
                    <BlueprintArrow label="실패 이벤트" dotted />
                    <BlueprintNode
                      icon={RotateCcwIcon}
                      title="Compensation"
                      detail="환불, 재고 복구, 주문 취소"
                      tone="cyan"
                    />
                  </BlueprintZone>

                  <BlueprintZone
                    title="관측과 운영"
                    colorClass="border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/30"
                  >
                    <BlueprintNode
                      icon={ClipboardListIcon}
                      title="Logs / Metrics"
                      detail="consumer lag, 실패율"
                      tone="slate"
                    />
                    <BlueprintNode
                      icon={AlertTriangleIcon}
                      title="Alert"
                      detail="DLQ 증가, relay 지연"
                      tone="slate"
                    />
                    <BlueprintNote>
                      장애를 없애기보다 빠르게 발견하고 재처리 가능하게 만듭니다.
                    </BlueprintNote>
                  </BlueprintZone>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-sky-200 bg-sky-50/40 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
            <div className="mb-4 flex items-center gap-2">
              <NetworkIcon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Saga 흐름 예시</h2>
            </div>
            <div className="grid gap-3 xl:grid-cols-4">
              {sagaSteps.map((step, index) => (
                <div key={step.service} className="flex gap-3 xl:block">
                  <article className="h-full rounded-lg border bg-white/75 p-4 dark:bg-background/45">
                    <span className="mb-3 flex size-7 items-center justify-center rounded-md bg-sky-600 text-xs font-semibold text-white dark:bg-sky-400 dark:text-sky-950">
                      {index + 1}
                    </span>
                    <h3 className="font-semibold">{step.service}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.action}
                    </p>
                    <div className="mt-3 rounded-md border bg-background/75 px-3 py-2 text-xs">
                      {step.event}
                    </div>
                  </article>
                  {index < sagaSteps.length - 1 ? (
                    <ArrowRightIcon className="mt-8 hidden size-5 text-muted-foreground xl:block" />
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="mb-4 flex items-center gap-2">
                <DatabaseIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Outbox 패턴 그림</h2>
              </div>
              <div className="grid gap-3">
                <FlowBox icon={ServerIcon} title="Service" text="업무 데이터 저장 요청" />
                <FlowArrow />
                <FlowBox icon={DatabaseIcon} title="DB Transaction" text="order 테이블 + outbox 테이블 같이 저장" />
                <FlowArrow />
                <FlowBox icon={ClipboardListIcon} title="Outbox Table" text="아직 발행되지 않은 이벤트 대기" />
                <FlowArrow />
                <FlowBox icon={SendIcon} title="Message Relay" text="outbox 이벤트를 Kafka로 발행" />
                <FlowArrow />
                <FlowBox icon={NetworkIcon} title="Kafka" text="다른 서비스가 이벤트 소비" />
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2Icon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Outbox 처리 순서</h2>
              </div>
              <ol className="grid gap-3">
                {outboxSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-6">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-600 text-xs font-semibold text-white dark:bg-amber-400 dark:text-amber-950">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="rounded-lg border border-cyan-200 bg-cyan-50/40 p-4 shadow-sm dark:border-cyan-900/60 dark:bg-cyan-950/20">
            <div className="mb-4 flex items-center gap-2">
              <WorkflowIcon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Saga와 Outbox 차이</h2>
            </div>
            <div className="overflow-hidden rounded-lg border bg-white/75 dark:bg-background/45">
              <div className="grid grid-cols-[150px_1fr_1fr] border-b bg-muted/60 text-sm font-semibold">
                <div className="border-r p-3">구분</div>
                <div className="border-r p-3">Saga</div>
                <div className="p-3">Outbox</div>
              </div>
              {comparisonRows.map((row) => (
                <div
                  key={row.topic}
                  className="grid grid-cols-[150px_1fr_1fr] border-b text-sm last:border-b-0"
                >
                  <div className="border-r p-3 font-medium">{row.topic}</div>
                  <div className="border-r p-3 leading-6">{row.saga}</div>
                  <div className="p-3 leading-6">{row.outbox}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-rose-200 bg-rose-50/35 p-4 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangleIcon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">
                장애 상황별로 메시지가 어떻게 되는가
              </h2>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {failureScenarios.map((scenario) => (
                <article
                  key={scenario.title}
                  className={`rounded-lg border p-4 shadow-sm ${scenario.colorClass}`}
                >
                  <h3 className="font-semibold">{scenario.title}</h3>
                  <div className="mt-4 grid gap-3 text-sm leading-6">
                    <FailureLine label="상황" value={scenario.situation} />
                    <FailureLine label="결과" value={scenario.result} />
                    <FailureLine label="방지" value={scenario.defense} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">중복과 유실을 줄이는 설계 방법</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {defensiveDesigns.map((design) => {
                  const Icon = design.icon;

                  return (
                    <article
                      key={design.title}
                      className="rounded-lg border bg-white/75 p-4 dark:bg-background/45"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-emerald-700 dark:text-emerald-300" />
                        <h3 className="font-semibold">{design.title}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {design.summary}
                      </p>
                      <div className="mt-3 rounded-md border bg-background/75 p-3 text-xs leading-5">
                        {design.example}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-sky-200 bg-sky-50/40 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardListIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">설계 체크리스트</h2>
              </div>
              <ul className="grid gap-3">
                {reliabilityChecklist.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6">
                    <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-sky-700 dark:text-sky-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            {patternWarnings.map((warning) => {
              const Icon = warning.icon;

              return (
                <article
                  key={warning.title}
                  className="rounded-lg border border-rose-200 bg-rose-50/40 p-4 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-rose-700 dark:text-rose-300" />
                    <h2 className="font-semibold">{warning.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {warning.description}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="rounded-lg border border-orange-200 bg-orange-50/45 p-4 text-sm leading-6 shadow-sm dark:border-orange-900/60 dark:bg-orange-950/20">
            <div className="flex gap-2">
              <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-orange-700 dark:text-orange-300" />
              <p>
                처음 구현할 때는 Kafka까지 바로 붙이기보다, 주문 생성 API에서
                `orders`와 `outbox_events`를 같은 트랜잭션으로 저장하는 작은
                실험실부터 만들면 디버깅하기 좋습니다.
              </p>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground shadow-sm">
            참고 문서:{" "}
            <a className="font-medium text-sky-700 underline dark:text-sky-300" href="https://microservices.io/patterns/data/saga.html">
              Saga pattern
            </a>
            {" / "}
            <a className="font-medium text-sky-700 underline dark:text-sky-300" href="https://microservices.io/patterns/data/transactional-outbox.html">
              Transactional Outbox pattern
            </a>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function FlowBox({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ServerIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border bg-white/75 p-4 dark:bg-background/45">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-emerald-700 dark:text-emerald-300" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center">
      <ArrowRightIcon className="size-5 rotate-90 text-muted-foreground" />
    </div>
  );
}

function FailureLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-white/75 p-3 dark:bg-background/45">
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}

function BlueprintZone({
  title,
  colorClass,
  children,
}: {
  title: string;
  colorClass: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-lg border p-4 ${colorClass}`}>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function BlueprintNode({
  icon: Icon,
  title,
  detail,
  tone,
}: {
  icon: typeof ServerIcon;
  title: string;
  detail: string;
  tone: "sky" | "emerald" | "violet" | "amber" | "rose" | "cyan" | "slate";
}) {
  const toneClass = {
    sky: "text-sky-700 dark:text-sky-300",
    emerald: "text-emerald-700 dark:text-emerald-300",
    violet: "text-violet-700 dark:text-violet-300",
    amber: "text-amber-700 dark:text-amber-300",
    rose: "text-rose-700 dark:text-rose-300",
    cyan: "text-cyan-700 dark:text-cyan-300",
    slate: "text-slate-700 dark:text-slate-300",
  }[tone];

  return (
    <div className="rounded-lg border bg-white/85 p-3 shadow-sm dark:bg-background/55">
      <div className="flex items-center gap-2">
        <Icon className={`size-4 ${toneClass}`} />
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="mt-2 rounded-md border bg-background/70 px-2 py-1.5 font-mono text-xs text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function BlueprintArrow({
  label,
  dotted = false,
}: {
  label: string;
  dotted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
      <div
        className={`h-px flex-1 border-t ${dotted ? "border-dashed" : "border-solid"}`}
      />
      <span className="shrink-0 rounded-md border bg-white px-2 py-1 dark:bg-background/60">
        {label}
      </span>
      <ArrowRightIcon className="size-4 shrink-0" />
    </div>
  );
}

function BlueprintNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-yellow-200 bg-yellow-50/90 p-3 text-xs leading-5 text-yellow-900 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-100">
      {children}
    </div>
  );
}
