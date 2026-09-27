import Link from "next/link";
import { DebugLab } from "@/components/debug-lab";
import { FlowSection } from "@/components/flow-section";
import { bookChapters, bookHref, getBookChapter } from "@/lib/book-patterns";
import snippets from "@/lib/book-source-snippets.json";

export function BookPatternContent({ slug, withLab = true }: { slug: string; withLab?: boolean }) {
  const chapter = getBookChapter(slug);
  const index = bookChapters.indexOf(chapter);
  const neighbors = bookChapters.filter((_, i) => i === index - 1 || i === index + 1);
  const sources = (snippets as Record<string, { path: string; code: string }[]>)[slug] ?? [];
  return <section className="grid min-w-0 gap-4 [overflow-wrap:anywhere]" aria-label="책 예제 학습">
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">Java 언어로 배우는 디자인 패턴 입문 3판 · {chapter.chapter}장</p>
      <h2 className="mt-2 text-2xl font-semibold">{chapter.title} · 책 예제</h2>
      <p className="mt-3 text-sm leading-7">{chapter.summary}</p>
      <p className="mt-3 font-mono text-xs text-muted-foreground">원본: cd1/{chapter.sourceDir}</p>
    </div>
    {withLab && <DebugLab lab={{ title: `${chapter.chapter}장 책 예제 API 실행`, endpoint: `/api/patterns/book/${slug}`, initial: chapter.request, breakpoint: `pattern/book/BookChapters${chapter.chapter <= 8 ? "01To08" : chapter.chapter <= 16 ? "09To16" : "17To23"}.java → ${chapter.breakpoint}`, note: chapter.inputHelp }} />}
    <section className="rounded-xl border bg-card p-5">
      <h3 className="text-lg font-semibold">원본 클래스와 역할</h3>
      <dl className="mt-3 grid gap-3 md:grid-cols-2">{chapter.roles.map(item => <div key={item.name} className="min-w-0 rounded-lg border p-3"><dt className="font-mono text-sm font-semibold">{item.name}</dt><dd className="mt-2 text-sm leading-6 text-muted-foreground">{item.role}</dd></div>)}</dl>
    </section>
    <FlowSection title="객체가 협력하는 순서" orientation="vertical" steps={chapter.flow} />
    <section className="min-w-0 rounded-xl border bg-card p-5"><h3 className="text-lg font-semibold">원본 Main 진입점 읽기</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">아래 코드는 원본 기본 예제입니다. 위 API는 웹에서 디버깅할 수 있게 별도로 각색한 구현을 실행합니다.</p>{sources.map(source => <details key={source.path} className="mt-3 min-w-0 rounded-lg border p-3"><summary className="cursor-pointer break-all font-mono text-xs">{source.path}</summary><pre className="mt-3 max-h-96 overflow-auto rounded bg-muted p-3 text-xs"><code>{source.code}</code></pre></details>)}</section>
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <section className="min-w-0 rounded-xl border bg-card p-5"><h3 className="text-lg font-semibold">연습문제·해답에서 비교할 점</h3><ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-7">{chapter.exerciseNotes.map(note => <li key={note}>{note}</li>)}</ul></section>
      <section className="min-w-0 rounded-xl border bg-card p-5"><h3 className="text-lg font-semibold">적용할 때 주의할 점</h3><ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-7">{chapter.pitfalls.map(note => <li key={note}>{note}</li>)}</ul></section>
    </div>
    <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 dark:border-amber-900 dark:bg-amber-950/20"><h3 className="font-semibold">원본과 API 실습의 차이</h3><p className="mt-3 text-sm leading-7">{chapter.adaptation}</p><p className="mt-3 text-sm leading-7 text-muted-foreground">기본 예제의 협력 구조를 학습용 Java API로 옮겼습니다. 모든 Q/A 프로그램을 실행하는 것은 아닙니다. 원본 코드: Hiroshi Yuki © 2001, 2004, 2021 · MIT License. 프로젝트의 docs/third-party/design-patterns-MIT.txt에 고지를 보존했습니다.</p></section>
    <nav className="flex flex-wrap gap-4 rounded-xl border p-4 text-sm" aria-label="책의 다른 장"><Link href="/patterns#book" className="underline underline-offset-4">책 전체 목차</Link>{neighbors.map(item => <Link key={item.slug} href={bookHref(item.slug)} className="underline underline-offset-4">{item.chapter}장 · {item.title}</Link>)}</nav>
  </section>;
}

export function BookPatternIndex() {
  return <section id="book" className="rounded-xl border bg-card p-5 [overflow-wrap:anywhere]">
    <h2 className="text-xl font-semibold">책 예제로 배우는 디자인 패턴 · 23장</h2>
    <p className="mt-3 text-sm leading-7 text-muted-foreground">제공된 3판 예제 코드를 기준으로 클래스 역할, 호출 흐름, 연습문제의 차이와 API 실습을 정리했습니다. 각 장에서 입력을 바꾸고 IntelliJ로 실제 Java 로직을 따라갈 수 있습니다.</p>
    <ol className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{bookChapters.map(chapter => <li key={chapter.slug}><Link href={bookHref(chapter.slug)} className="block h-full rounded-lg border p-4 hover:bg-muted"><span className="text-xs text-muted-foreground">{chapter.chapter}장</span><h3 className="mt-1 font-semibold">{chapter.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{chapter.summary}</p></Link></li>)}</ol>
  </section>;
}
