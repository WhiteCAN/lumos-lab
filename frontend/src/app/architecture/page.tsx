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
  CheckCircle2Icon,
  CompassIcon,
  FolderTreeIcon,
  HexagonIcon,
  Layers3Icon,
  LightbulbIcon,
  PackageIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { getStudyPage, getStudyMetadata } from "@/lib/study-pages";

const studyPage = getStudyPage("/architecture");

const architectureCards = [
  {
    title: "헥사고날 아키텍처",
    subtitle: "Ports & Adapters",
    icon: HexagonIcon,
    colorClass:
      "border-cyan-200 bg-cyan-50/60 dark:border-cyan-900/60 dark:bg-cyan-950/20",
    summary:
      "도메인과 애플리케이션 코어를 가운데 두고, 외부 기술은 어댑터로 분리하는 구조입니다.",
    bullets: [
      "Controller, DB, 외부 API는 바깥쪽 어댑터로 둡니다.",
      "코어는 인터페이스인 Port에만 의존합니다.",
      "DB나 메시지 큐를 바꿔도 핵심 로직 변경을 줄입니다.",
    ],
    example:
      "주문 생성 로직은 PaymentPort를 호출하고, 실제 Toss/KakaoPay 구현은 Adapter가 담당합니다.",
  },
  {
    title: "클린 아키텍처",
    subtitle: "Dependency Rule",
    icon: Layers3Icon,
    colorClass:
      "border-violet-200 bg-violet-50/60 dark:border-violet-900/60 dark:bg-violet-950/20",
    summary:
      "안쪽 정책이 바깥 기술에 의존하지 않도록 계층 방향을 통제하는 구조입니다.",
    bullets: [
      "Entity와 Use Case가 중심입니다.",
      "Controller, DB, UI는 바깥 세부사항입니다.",
      "의존성은 항상 안쪽으로 향해야 합니다.",
    ],
    example:
      "CreateOrderUseCase는 Spring MVC나 JPA를 몰라도 실행될 수 있게 설계합니다.",
  },
  {
    title: "DDD",
    subtitle: "Domain-Driven Design",
    icon: BoxesIcon,
    colorClass:
      "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    summary:
      "비즈니스 도메인을 코드의 중심 언어와 모델로 삼는 설계 방법입니다.",
    bullets: [
      "Entity, Value Object, Aggregate, Repository를 사용합니다.",
      "팀이 쓰는 업무 용어를 코드에도 반영합니다.",
      "복잡한 비즈니스 규칙이 있는 서비스에 잘 맞습니다.",
    ],
    example:
      "Order.cancel() 안에 취소 가능 상태, 환불 정책, 재고 복구 같은 규칙을 모읍니다.",
  },
];

const comparisonRows = [
  {
    topic: "중심 질문",
    hexagonal: "외부 기술을 어떻게 분리할까?",
    clean: "의존성 방향을 어떻게 지킬까?",
    ddd: "비즈니스 모델을 어떻게 코드로 표현할까?",
  },
  {
    topic: "주요 단어",
    hexagonal: "Port, Adapter, Inbound, Outbound",
    clean: "Entity, Use Case, Interface Adapter",
    ddd: "Entity, Value Object, Aggregate, Bounded Context",
  },
  {
    topic: "잘 맞는 상황",
    hexagonal: "DB, API, 메시지 큐 교체 가능성이 큰 서비스",
    clean: "테스트와 유지보수성이 중요한 애플리케이션",
    ddd: "업무 규칙이 복잡하고 도메인 언어가 중요한 서비스",
  },
  {
    topic: "주의할 점",
    hexagonal: "작은 기능에는 인터페이스가 과해질 수 있음",
    clean: "계층을 너무 잘게 나누면 파일 탐색 비용 증가",
    ddd: "CRUD 중심 앱에 무리하게 적용하면 복잡도만 증가",
  },
];

const flowSteps = [
  "Controller가 요청 DTO를 받습니다.",
  "Application Service 또는 Use Case를 호출합니다.",
  "Use Case는 Domain 모델에 비즈니스 규칙을 위임합니다.",
  "Repository Port를 통해 저장소 작업을 요청합니다.",
  "Persistence Adapter가 JPA Repository로 실제 DB를 처리합니다.",
  "응답 DTO로 변환해서 Controller가 반환합니다.",
];

const separateFolderStructures = [
  {
    title: "헥사고날 아키텍처만 적용",
    point: "Port와 Adapter 구분이 가장 중요합니다.",
    colorClass:
      "border-cyan-200 bg-cyan-50/50 dark:border-cyan-900/60 dark:bg-cyan-950/20",
    tree: `com.lumos.lab.order
  domain
    Order.java
    OrderStatus.java
  application
    port
      in
        CreateOrderCommand.java
        CreateOrderPort.java
      out
        LoadOrderPort.java
        SaveOrderPort.java
        PaymentPort.java
    service
      CreateOrderService.java
  adapter
    in
      web
        OrderController.java
        OrderWebMapper.java
    out
      persistence
        OrderJpaEntity.java
        OrderJpaRepository.java
        OrderPersistenceAdapter.java
      payment
        PaymentGatewayAdapter.java`,
    notes: [
      "in port는 외부에서 코어로 들어오는 사용 사례입니다.",
      "out port는 코어가 외부 저장소나 API에 요청하는 인터페이스입니다.",
      "adapter는 web, persistence, payment처럼 기술별로 나눕니다.",
    ],
  },
  {
    title: "클린 아키텍처만 적용",
    point: "안쪽 계층이 바깥 계층을 모르게 하는 것이 핵심입니다.",
    colorClass:
      "border-violet-200 bg-violet-50/50 dark:border-violet-900/60 dark:bg-violet-950/20",
    tree: `com.lumos.lab.order
  enterprise
    entity
      Order.java
      OrderItem.java
      Money.java
  application
    usecase
      CreateOrderUseCase.java
      GetOrderUseCase.java
    gateway
      OrderGateway.java
      PaymentGateway.java
  interfaceadapter
    controller
      OrderController.java
    presenter
      OrderPresenter.java
      OrderViewModel.java
    gateway
      JpaOrderGateway.java
      ExternalPaymentGateway.java
  framework
    jpa
      OrderJpaEntity.java
      SpringDataOrderRepository.java
    config
      OrderConfig.java`,
    notes: [
      "Entity와 Use Case는 Spring MVC, JPA 같은 세부 기술을 모르게 둡니다.",
      "Gateway 인터페이스를 통해 바깥 구현체를 호출합니다.",
      "Presenter나 ViewModel을 두면 응답 표현 방식을 Use Case와 분리할 수 있습니다.",
    ],
  },
  {
    title: "DDD 중심 구조",
    point: "도메인 모델과 업무 용어를 코드 중심에 둡니다.",
    colorClass:
      "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    tree: `com.lumos.lab.order
  domain
    model
      Order.java
      OrderLine.java
      OrderStatus.java
      Money.java
    repository
      OrderRepository.java
    service
      OrderPolicy.java
      OrderPricingService.java
  application
    OrderCommandService.java
    OrderQueryService.java
    command
      CreateOrderCommand.java
      CancelOrderCommand.java
    dto
      OrderDetail.java
  infrastructure
    persistence
      OrderJpaEntity.java
      OrderJpaRepository.java
      OrderRepositoryImpl.java
  presentation
    OrderController.java
    OrderRequest.java
    OrderResponse.java`,
    notes: [
      "domain/model에 Entity, Value Object, Aggregate를 둡니다.",
      "domain/repository는 인터페이스, infrastructure는 구현체로 둡니다.",
      "복잡한 규칙은 Application Service보다 Domain 객체나 Domain Service에 둡니다.",
    ],
  },
];

const folderTree = `com.lumos.lab.order
  application
    port
      in
        CreateOrderUseCase.java
      out
        OrderRepositoryPort.java
        PaymentPort.java
    service
      CreateOrderService.java
  domain
    Order.java
    OrderItem.java
    OrderStatus.java
    Money.java
  adapter
    in
      web
        OrderController.java
        CreateOrderRequest.java
        OrderResponse.java
    out
      persistence
        OrderJpaEntity.java
        OrderJpaRepository.java
        OrderPersistenceAdapter.java
      payment
        TossPaymentAdapter.java
  config
    OrderBeanConfig.java`;

const packageRules = [
  {
    name: "domain",
    description:
      "순수 비즈니스 규칙을 둡니다. 가능하면 Spring, JPA, HTTP를 모르게 유지합니다.",
  },
  {
    name: "application",
    description:
      "사용자의 목적을 실행합니다. 트랜잭션 경계와 Port 인터페이스를 이곳에 둡니다.",
  },
  {
    name: "adapter.in.web",
    description:
      "REST Controller와 요청/응답 DTO를 둡니다. 외부 요청을 애플리케이션 명령으로 변환합니다.",
  },
  {
    name: "adapter.out.persistence",
    description:
      "JPA Entity, Spring Data Repository, DB 변환 로직을 둡니다.",
  },
  {
    name: "adapter.out.payment",
    description:
      "외부 결제 API처럼 바깥 시스템과 연결되는 구현체를 둡니다.",
  },
];

const usageExamples = [
  {
    title: "작은 CRUD 관리자",
    recommendation: "단순 계층형 구조",
    reason:
      "도메인 규칙보다 입력, 조회, 수정 화면이 중심이면 Controller-Service-Repository로 충분합니다.",
  },
  {
    title: "결제/주문 서비스",
    recommendation: "DDD + 헥사고날",
    reason:
      "주문 상태, 결제 실패, 재고 차감, 환불 규칙이 많고 외부 결제사가 바뀔 수 있습니다.",
  },
  {
    title: "AI/RAG 파이프라인",
    recommendation: "클린 아키텍처 + Port",
    reason:
      "Vector DB, LLM Provider, 문서 저장소를 바꿔가며 실험하기 좋습니다.",
  },
];

export default function ArchitecturePage() {
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
          <PageDebugLab href="/architecture" />
          <section className="overflow-hidden rounded-lg border border-indigo-200 bg-card shadow-sm dark:border-indigo-900/60">
            <div className="border-b border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/25">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200">
                    <CompassIcon className="size-4" />
                    설계 참고 노트
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{studyPage.title}</h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    세 개념은 서로 경쟁하는 선택지가 아니라 함께 섞어 쓰는 경우가
                    많습니다. 이 페이지는 개요, 사용 예시, Spring Boot 프로젝트
                    폴더 구조를 빠르게 참고하기 위한 정적 가이드입니다.
                  </p>
                </div>
                <div className="rounded-lg border border-sky-200 bg-white p-4 text-sm dark:border-sky-900/70 dark:bg-sky-950/30">
                  <p className="font-medium text-sky-700 dark:text-sky-200">
                    핵심 한 줄
                  </p>
                  <p className="mt-1 max-w-md text-muted-foreground">
                    DDD로 도메인을 잘 만들고, 클린 아키텍처로 의존성 방향을
                    지키며, 헥사고날로 외부 기술을 어댑터로 분리합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 xl:grid-cols-3">
              {architectureCards.map((card) => (
                <ArchitectureCard key={card.title} card={card} />
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
            <div className="mb-4 flex items-center gap-2">
              <LightbulbIcon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">한눈에 비교</h2>
            </div>
            <div className="overflow-hidden rounded-lg border bg-white/75 dark:bg-background/45">
              <div className="grid grid-cols-[130px_repeat(3,1fr)] border-b bg-muted/60 text-sm font-semibold">
                <div className="border-r p-3">구분</div>
                <div className="border-r p-3">헥사고날</div>
                <div className="border-r p-3">클린 아키텍처</div>
                <div className="p-3">DDD</div>
              </div>
              {comparisonRows.map((row) => (
                <div
                  key={row.topic}
                  className="grid grid-cols-[130px_repeat(3,1fr)] border-b text-sm last:border-b-0"
                >
                  <div className="border-r p-3 font-medium">{row.topic}</div>
                  <div className="border-r p-3 leading-6">{row.hexagonal}</div>
                  <div className="border-r p-3 leading-6">{row.clean}</div>
                  <div className="p-3 leading-6">{row.ddd}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_430px]">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="mb-4 flex items-center gap-2">
                <ArrowRightIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">요청 처리 흐름 예시</h2>
              </div>
              <div className="grid gap-3">
                {flowSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white dark:bg-emerald-400 dark:text-emerald-950">
                      {index + 1}
                    </span>
                    <div className="flex-1 rounded-lg border bg-white/75 p-3 text-sm leading-6 dark:bg-background/45">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-4 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">언제 쓰면 좋을까?</h2>
              </div>
              <div className="grid gap-3">
                {usageExamples.map((example) => (
                  <article
                    key={example.title}
                    className="rounded-lg border bg-white/75 p-3 dark:bg-background/45"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{example.title}</h3>
                      <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                        {example.recommendation}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {example.reason}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-fuchsia-200 bg-fuchsia-50/30 p-4 shadow-sm dark:border-fuchsia-900/60 dark:bg-fuchsia-950/20">
            <div className="mb-4 flex items-center gap-2">
              <FolderTreeIcon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">각각 따로 보는 폴더 구조</h2>
            </div>
            <p className="mb-4 text-sm leading-6 text-muted-foreground">
              아래 구조들은 서로 완전히 같은 뜻이 아닙니다. 실제 프로젝트에서는
              하나만 선택할 수도 있고, 필요한 부분만 섞어서 사용할 수도 있습니다.
            </p>
            <div className="grid gap-4 xl:grid-cols-3">
              {separateFolderStructures.map((structure) => (
                <FolderStructureCard
                  key={structure.title}
                  structure={structure}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[520px_1fr]">
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/30">
              <div className="mb-4 flex items-center gap-2">
                <FolderTreeIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Spring Boot 폴더 구조 예시</h2>
              </div>
              <pre className="overflow-auto rounded-lg border bg-white/80 p-4 text-xs leading-6 dark:bg-background/45">
                <code>{folderTree}</code>
              </pre>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-4 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
              <div className="mb-4 flex items-center gap-2">
                <PackageIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">패키지별 역할</h2>
              </div>
              <div className="grid gap-3">
                {packageRules.map((rule) => (
                  <div
                    key={rule.name}
                    className="rounded-lg border bg-white/75 p-3 dark:bg-background/45"
                  >
                    <h3 className="font-mono text-sm font-bold">{rule.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {rule.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-teal-200 bg-teal-50/40 p-4 shadow-sm dark:border-teal-900/60 dark:bg-teal-950/20">
            <h2 className="text-lg font-semibold">프로젝트에 적용할 때의 기준</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                "처음부터 완벽한 구조보다 변경 가능성이 큰 외부 기술부터 분리합니다.",
                "비즈니스 규칙이 빈약하면 DDD 용어를 억지로 늘리지 않습니다.",
                "Use Case는 화면 이름이 아니라 사용자의 목적 단위로 나눕니다.",
                "Entity를 API 응답으로 직접 내보내지 않고 DTO로 변환합니다.",
              ].map((rule) => (
                <div
                  key={rule}
                  className="flex gap-2 rounded-lg border bg-white/75 p-3 text-sm leading-6 dark:bg-background/45"
                >
                  <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-teal-700 dark:text-teal-300" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ArchitectureCard({
  card,
}: {
  card: (typeof architectureCards)[number];
}) {
  const Icon = card.icon;

  return (
    <article className={`rounded-lg border p-4 shadow-sm ${card.colorClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {card.subtitle}
          </p>
          <h2 className="mt-1 text-lg font-semibold">{card.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {card.summary}
          </p>
        </div>
        <span className="rounded-md border bg-white/70 p-2 dark:bg-background/45">
          <Icon className="size-5" />
        </span>
      </div>
      <ul className="mt-4 grid gap-2">
        {card.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-sm leading-6">
            <CheckCircle2Icon className="mt-1 size-4 shrink-0" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-lg border bg-white/70 p-3 text-sm leading-6 dark:bg-background/45">
        <p className="font-medium">사용 예시</p>
        <p className="mt-1 text-muted-foreground">{card.example}</p>
      </div>
    </article>
  );
}

function FolderStructureCard({
  structure,
}: {
  structure: (typeof separateFolderStructures)[number];
}) {
  return (
    <article className={`rounded-lg border p-4 shadow-sm ${structure.colorClass}`}>
      <h3 className="text-lg font-semibold">{structure.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {structure.point}
      </p>
      <pre className="mt-4 max-h-[520px] overflow-auto rounded-lg border bg-white/80 p-3 text-xs leading-6 dark:bg-background/45">
        <code>{structure.tree}</code>
      </pre>
      <ul className="mt-4 grid gap-2">
        {structure.notes.map((note) => (
          <li key={note} className="flex gap-2 text-sm leading-6">
            <CheckCircle2Icon className="mt-1 size-4 shrink-0" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export const metadata = getStudyMetadata("/architecture");
