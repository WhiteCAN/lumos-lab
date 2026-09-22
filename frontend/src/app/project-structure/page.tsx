import { PageDebugLab } from "@/components/debug-lab";
import type { ReactNode } from "react";
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
  bestPractices,
  backendStructure,
  benefits,
  folderGuides,
  frontendStructure,
} from "@/constants/project-structure";
import type {
  FolderGuide,
  StructureItem,
  StructureSection,
} from "@/types/project-structure";
import {
  CheckCircle2Icon,
  Code2Icon,
  FolderIcon,
  FolderTreeIcon,
  LightbulbIcon,
  RocketIcon,
  ServerIcon,
  SparklesIcon,
  TrophyIcon,
} from "lucide-react";

import { getStudyPage, getStudyMetadata } from "@/lib/study-pages";

const studyPage = getStudyPage("/project-structure");

export default function ProjectStructurePage() {
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
          <PageDebugLab href="/project-structure" />
          <section className="rounded-lg border border-blue-200 bg-blue-50/60 p-5 text-card-foreground shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FolderTreeIcon className="size-4" />
                  이미지 내용을 웹페이지로 옮긴 일반 폴더 구조 가이드
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">{studyPage.title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  특정 프로젝트 설명이 아니라, 새 프로젝트를 만들 때 참고하는
                  일반적인 구조 예시입니다. React, Next.js, Vue 같은 프론트엔드와
                  Node.js, Express 같은 백엔드 구조를 기준으로 정리했습니다.
                </p>
              </div>
              <div className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
                Organized · Scalable · Developer Friendly
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <StructureCard
              icon={<FolderTreeIcon className="size-4" />}
              section={frontendStructure}
              accentClass="border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20"
              badgeClass="bg-blue-600 text-white dark:bg-blue-400 dark:text-blue-950"
            />
            <StructureCard
              icon={<ServerIcon className="size-4" />}
              section={backendStructure}
              accentClass="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20"
              badgeClass="bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950"
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
              <div className="mb-4 flex items-center gap-2">
                <LightbulbIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">빠른 설명</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {folderGuides.map((guide) => (
                  <FolderGuideCard key={guide.name} guide={guide} />
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
              <div className="mb-4 flex items-center gap-2">
                <SparklesIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">좋은 구조 기준</h2>
              </div>
              <Checklist items={bestPractices} />
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <InfoPanel
              icon={<Code2Icon className="size-4" />}
              title="폴더를 나누는 이유"
              items={[
                "화면, API, 상태, 유틸의 책임을 분리합니다.",
                "파일이 많아져도 어디에 둘지 고민하는 시간을 줄입니다.",
                "협업할 때 개발자마다 다른 방식으로 파일을 만들 가능성을 줄입니다.",
              ]}
            />
            <InfoPanel
              icon={<RocketIcon className="size-4" />}
              title="프로 팁"
              items={[
                "처음에는 작게 시작하고, 기능이 커질 때 features로 분리합니다.",
                "프론트와 백엔드는 각자 README를 따로 둡니다.",
                "API 라우트, 서비스, 검증 로직을 한 파일에 몰아넣지 않습니다.",
              ]}
            />
            <InfoPanel
              icon={<TrophyIcon className="size-4" />}
              title="장점"
              items={benefits}
            />
          </section>

          <section className="rounded-lg border bg-card p-5 text-center shadow-sm">
            <p className="text-sm font-semibold">
              좋은 폴더 구조 = 읽기 쉬운 코드 = 유지보수하기 쉬운 프로젝트
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              다음 프로젝트를 시작할 때 이 페이지를 열어두고 필요한 폴더부터
              체크하면서 만들면 됩니다.
            </p>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function StructureCard({
  icon,
  section,
  accentClass,
  badgeClass,
}: {
  icon: ReactNode;
  section: StructureSection;
  accentClass: string;
  badgeClass: string;
}) {
  return (
    <div className={`rounded-lg border p-4 shadow-sm ${accentClass}`}>
      <div className="mb-4 flex items-center justify-between gap-3 border-b pb-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className={`rounded-md p-1.5 ${badgeClass}`}>{icon}</span>
            {section.subtitle}
          </div>
          <h2 className="mt-1 text-lg font-semibold">{section.title}</h2>
        </div>
      </div>
      <div className="space-y-2">
        {section.items.map((item) => (
          <TreeItem key={item.name} item={item} depth={0} />
        ))}
      </div>
    </div>
  );
}

function TreeItem({ item, depth }: { item: StructureItem; depth: number }) {
  return (
    <div>
      <div
        className="grid gap-2 rounded-md border bg-white/70 px-3 py-2 text-sm md:grid-cols-[1fr_1.3fr] dark:bg-background/45"
        style={{ marginLeft: `${depth * 18}px` }}
      >
        <div className="flex min-w-0 items-center gap-2 font-mono font-medium">
          <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{item.name}</span>
        </div>
        <p className="text-muted-foreground">{item.description}</p>
      </div>
      {item.children ? (
        <div className="mt-2 space-y-2">
          {item.children.map((child) => (
            <TreeItem
              key={`${item.name}-${child.name}`}
              item={child}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FolderGuideCard({ guide }: { guide: FolderGuide }) {
  return (
    <div className="rounded-lg border bg-white/70 p-3 dark:bg-background/45">
      <h3 className="font-mono text-sm font-semibold">{guide.name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {guide.purpose}
      </p>
      <p className="mt-2 rounded-md border bg-white px-2 py-1.5 font-mono text-xs dark:bg-background/60">
        {guide.examples}
      </p>
    </div>
  );
}

function InfoPanel({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-cyan-200 bg-cyan-50/40 p-4 shadow-sm dark:border-cyan-900/60 dark:bg-cyan-950/20">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <Checklist items={items} />
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-6">
          <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export const metadata = getStudyMetadata("/project-structure");
