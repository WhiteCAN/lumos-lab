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
import type { LucideIcon } from "lucide-react";
import { CheckCircle2Icon } from "lucide-react";
import { TechnologyIcon, type BrandName } from "@/components/technology-icon";
export { FlowSection } from "@/components/flow-section";
import type { ReactNode } from "react";

type ReferencePageProps = {
  breadcrumb: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  brand?: BrandName;
  colorClass: string;
  children: ReactNode;
};

export function ReferencePage({
  breadcrumb,
  label,
  title,
  description,
  icon: Icon,
  brand,
  colorClass,
  children,
}: ReferencePageProps) {
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
                  <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className={`rounded-lg border p-5 shadow-sm ${colorClass}`}>
            <div className="flex items-start gap-3">
              {brand ? <TechnologyIcon name={brand} /> : <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-background/70 text-sky-700 dark:text-sky-300"><Icon className="size-6" /></span>}
              <div>
                <div className="inline-flex rounded-md border bg-white/75 px-3 py-1 text-sm font-medium dark:bg-background/45">
                  {label}
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">
                  {title}
                </h1>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </section>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function ConceptGrid({
  items,
}: {
  items: Array<{
    title: string;
    description: string;
    bullets: string[];
    colorClass: string;
    icon: LucideIcon;
  }>;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <article key={item.title} className={`rounded-lg border p-4 shadow-sm ${item.colorClass}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <span className="rounded-md border bg-white/75 p-2 dark:bg-background/45">
                <Icon className="size-5" />
              </span>
            </div>
            <ul className="mt-4 grid gap-2">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm leading-6">
                  <CheckCircle2Icon className="mt-1 size-4 shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </section>
  );
}

export function ComparisonTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<{ topic: string; values: string[] }>;
}) {
  const template = `150px repeat(${columns.length}, minmax(180px, 1fr))`;

  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="text-lg font-semibold">한눈에 비교</h2>
      <div className="mt-4 overflow-auto rounded-lg border">
        <div
          className="grid min-w-[760px] border-b bg-muted/60 text-sm font-semibold"
          style={{ gridTemplateColumns: template }}
        >
          <div className="border-r p-3">구분</div>
          {columns.map((column, index) => (
            <div key={column} className={index < columns.length - 1 ? "border-r p-3" : "p-3"}>
              {column}
            </div>
          ))}
        </div>
        {rows.map((row) => (
          <div
            key={row.topic}
            className="grid min-w-[760px] border-b text-sm last:border-b-0"
            style={{ gridTemplateColumns: template }}
          >
            <div className="border-r p-3 font-medium">{row.topic}</div>
            {row.values.map((value, index) => (
              <div key={`${row.topic}-${value}`} className={index < row.values.length - 1 ? "border-r p-3 leading-6" : "p-3 leading-6"}>
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <pre className="mt-4 overflow-auto rounded-lg border bg-background p-4 text-xs leading-6">
        <code>{code}</code>
      </pre>
    </section>
  );
}
