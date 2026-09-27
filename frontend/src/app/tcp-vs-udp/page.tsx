import { PageDebugLab } from "@/components/debug-lab";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  headerFields,
  protocolComparisons,
  protocolIntros,
  protocolUseCases,
  tcpBenefits,
  tcpHandshake,
  tcpUdpAnalogy,
  tcpUdpSummary,
  udpBenefits,
  udpFlow,
} from "@/constants/tcp-vs-udp";
import type {
  HeaderFieldGroup,
  ProtocolIntro,
  ProtocolUseCase,
} from "@/types/tcp-vs-udp";
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
  CheckCircle2Icon,
  LightbulbIcon,
  NetworkIcon,
  PackageCheckIcon,
  ZapIcon,
} from "lucide-react";

import { getStudyPage, getStudyMetadata } from "@/lib/study-pages";

const studyPage = getStudyPage("/tcp-vs-udp");

export default function TcpVsUdpPage() {
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
          <PageDebugLab href="/tcp-vs-udp" />
          <section className="overflow-hidden rounded-lg border border-blue-200 bg-card text-card-foreground shadow-sm dark:border-blue-900/60">
            <div className="border-b border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900/60 dark:bg-blue-950/25">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex rounded-md border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
                    네트워킹 개념 노트
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{studyPage.title}</h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    이미지 내용을 웹페이지로 재구성한 정적 참고 페이지입니다.
                    TCP와 UDP의 차이, 동작 방식, 사용 사례, 헤더 구조, 기억할
                    포인트를 한 화면에서 볼 수 있게 정리했습니다.
                  </p>
                </div>
                <div className="rounded-lg border border-indigo-200 bg-white p-4 text-sm text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/30 dark:text-indigo-200">
                  <p className="font-medium">핵심 한 줄</p>
                  <p className="mt-1">{tcpUdpSummary}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 xl:grid-cols-2">
              {protocolIntros.map((protocol) => (
                <ProtocolIntroCard key={protocol.name} protocol={protocol} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
            <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
              <div className="mb-4 flex items-center gap-2">
                <NetworkIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">TCP와 UDP 비교</h2>
              </div>
              <div className="overflow-hidden rounded-lg border bg-white/70 dark:bg-background/45">
                <div className="grid grid-cols-[1fr_1fr_1fr] border-b bg-muted/60 text-sm font-semibold">
                  <div className="border-r p-3 text-center">항목</div>
                  <div className="border-r p-3 text-center">TCP</div>
                  <div className="p-3 text-center">UDP</div>
                </div>
                {protocolComparisons.map((item) => (
                  <div
                    key={item.feature}
                    className="grid grid-cols-[1fr_1fr_1fr] border-b text-sm last:border-b-0"
                  >
                    <div className="border-r p-3 font-medium">{item.feature}</div>
                    <div className="border-r p-3">{item.tcp}</div>
                    <div className="p-3">{item.udp}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <div className="mb-4 flex items-center gap-2">
                <LightbulbIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">빠른 선택 기준</h2>
              </div>
              <div className="grid gap-3">
                <TipCard
                  title="신뢰성이 중요하면 TCP"
                  description="데이터가 반드시 도착해야 하고 순서가 중요하다면 TCP를 사용합니다."
                  icon={<PackageCheckIcon className="size-4" />}
                />
                <TipCard
                  title="속도가 중요하면 UDP"
                  description="일부 손실보다 지연 시간이 더 문제라면 UDP가 적합합니다."
                  icon={<ZapIcon className="size-4" />}
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <FlowCard title="TCP 동작 방식: 3-Way Handshake" items={tcpHandshake} />
            <FlowCard title="UDP 동작 방식" items={udpFlow} />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <UseCaseCard useCase={protocolUseCases[0]} />
            <UseCaseCard useCase={protocolUseCases[1]} />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-lg border border-sky-200 bg-sky-50/40 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
              <h2 className="text-lg font-semibold">비유로 이해하기</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {tcpUdpAnalogy.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className={`rounded-lg border p-4 ${item.colorClass}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="size-4" />
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50/40 p-4 shadow-sm dark:border-orange-900/60 dark:bg-orange-950/20">
              <h2 className="text-lg font-semibold">헤더 구조 요약</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {headerFields.map((group) => (
                  <HeaderCard key={group.title} group={group} />
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <BenefitCard title="TCP 장점" items={tcpBenefits} tone="blue" />
            <BenefitCard title="UDP 장점" items={udpBenefits} tone="emerald" />
          </section>

          <section className="rounded-lg border border-rose-200 bg-rose-50/40 p-5 text-center shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20">
            <p className="text-sm font-semibold">
              프로토콜은 서로 다른 길을 선택하지만 목표는 같습니다.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              결국 목적은 애플리케이션끼리 연결하고 데이터를 주고받는 것입니다.
              신뢰성이 우선이면 TCP, 속도와 가벼움이 우선이면 UDP를 떠올리면 됩니다.
            </p>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ProtocolIntroCard({ protocol }: { protocol: ProtocolIntro }) {
  const Icon = protocol.icon;

  return (
    <article className={`rounded-lg border p-4 shadow-sm ${protocol.colorClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{protocol.name}</h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {protocol.fullName}
          </p>
        </div>
        <span className="rounded-md border bg-white/70 p-2 dark:bg-background/45">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {protocol.summary}
      </p>
      <ul className="mt-4 grid gap-2">
        {protocol.keyPoints.map((point) => (
          <li key={point} className="flex gap-2 text-sm">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
            <span className="leading-6">{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function FlowCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-cyan-200 bg-cyan-50/40 p-4 shadow-sm dark:border-cyan-900/60 dark:bg-cyan-950/20">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-3">
            <div className="flex min-h-20 min-w-36 flex-col items-center justify-center gap-2 rounded-lg border bg-white/75 p-3 text-center dark:bg-background/45">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <span className="text-sm leading-5">{item}</span>
            </div>
            {index < items.length - 1 ? (
              <ArrowRightIcon className="size-4 text-muted-foreground" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function UseCaseCard({ useCase }: { useCase: ProtocolUseCase }) {
  const isTcp = useCase.protocol === "TCP";
  return (
    <div
      className={`rounded-lg border p-4 shadow-sm ${
        isTcp
          ? "border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20"
          : "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20"
      }`}
    >
      <h2 className="text-lg font-semibold">{useCase.protocol} 사용 사례</h2>
      <ul className="mt-4 grid gap-2">
        {useCase.items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HeaderCard({ group }: { group: HeaderFieldGroup }) {
  return (
    <div className={`rounded-lg border p-4 ${group.colorClass}`}>
      <h3 className="font-semibold">{group.title}</h3>
      <div className="mt-3 grid gap-2">
        {group.fields.map((field) => (
          <span
            key={field}
            className="rounded-md border bg-white/70 px-2 py-1.5 font-mono text-xs dark:bg-background/45"
          >
            {field}
          </span>
        ))}
      </div>
    </div>
  );
}

function BenefitCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "blue" | "emerald";
}) {
  const toneClass =
    tone === "blue"
      ? "border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20"
      : "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20";

  return (
    <div className={`rounded-lg border p-4 shadow-sm ${toneClass}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TipCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-white/70 p-4 dark:bg-background/45">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export const metadata = getStudyMetadata("/tcp-vs-udp");
