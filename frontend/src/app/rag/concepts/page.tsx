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
  BrainCircuitIcon,
  CheckCircle2Icon,
  ClockIcon,
  DatabaseIcon,
  GitBranchIcon,
  MemoryStickIcon,
  NetworkIcon,
  SearchIcon,
  ServerIcon,
} from "lucide-react";

const generationTypes = [
  {
    shortName: "RAG",
    fullName: "Retrieval-Augmented Generation",
    korean: "검색 증강 생성",
    icon: SearchIcon,
    colorClass:
      "border-blue-200 bg-blue-50/60 dark:border-blue-900/60 dark:bg-blue-950/20",
    summary:
      "질문이 들어올 때 벡터 DB나 검색 엔진에서 관련 문서를 찾아 LLM 컨텍스트에 넣고 답변합니다.",
    flow: ["질문", "임베딩", "검색", "문서 조각 주입", "답변 생성"],
    goodFor: [
      "문서가 많고 자주 바뀌는 지식",
      "출처와 근거를 함께 보여줘야 하는 Q&A",
      "사내 문서, 매뉴얼, FAQ 검색",
    ],
    watchOut: [
      "검색 품질이 낮으면 답변도 흔들립니다.",
      "chunking, embedding, reranking 설계가 필요합니다.",
      "검색 단계 때문에 지연 시간이 늘 수 있습니다.",
    ],
  },
  {
    shortName: "CAG",
    fullName: "Cache-Augmented Generation",
    korean: "캐시 증강 생성",
    icon: ClockIcon,
    colorClass:
      "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    summary:
      "관련 지식을 미리 긴 컨텍스트나 KV cache에 올려두고, 질문 시 검색 단계를 줄여 빠르게 답변합니다.",
    flow: ["문서 사전 로드", "컨텍스트/KV 캐시", "질문", "캐시 기반 답변"],
    goodFor: [
      "문서 범위가 작고 안정적인 지식",
      "반복 질문이 많고 지연 시간이 중요한 서비스",
      "제품 정책, 고정 매뉴얼, 시험 범위처럼 범위가 명확한 데이터",
    ],
    watchOut: [
      "지식이 자주 바뀌면 캐시 갱신 전략이 필요합니다.",
      "전체 지식이 모델 컨텍스트에 들어갈 수 있어야 유리합니다.",
      "첫 캐시 생성 비용은 클 수 있습니다.",
    ],
  },
  {
    shortName: "MAG",
    fullName: "Memory-Augmented Generation",
    korean: "메모리 증강 생성",
    icon: MemoryStickIcon,
    colorClass:
      "border-violet-200 bg-violet-50/60 dark:border-violet-900/60 dark:bg-violet-950/20",
    summary:
      "대화 이력, 사용자 선호, 장기 기억, 작업 상태 같은 지속 메모리를 저장하고 다음 답변에 활용합니다.",
    flow: ["대화/행동 기록", "메모리 저장", "관련 기억 검색", "개인화 답변"],
    goodFor: [
      "사용자별 개인화 비서",
      "장기 프로젝트 컨텍스트 유지",
      "이전 대화와 결정 사항을 기억해야 하는 업무 도구",
    ],
    watchOut: [
      "잘못 저장한 기억이 계속 영향을 줄 수 있습니다.",
      "개인정보, 삭제 요청, 보존 기간 설계가 중요합니다.",
      "단기 대화 기록과 장기 기억을 구분해야 합니다.",
    ],
  },
  {
    shortName: "GAG",
    fullName: "Graph-Augmented Generation",
    korean: "그래프 증강 생성",
    icon: GitBranchIcon,
    colorClass:
      "border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20",
    summary:
      "문서 조각만 찾는 대신 엔티티와 관계를 그래프로 구성해 관계 추론, 연결 질문, 전체 요약에 활용합니다.",
    flow: ["문서 수집", "엔티티/관계 추출", "지식 그래프", "그래프 탐색", "답변 생성"],
    goodFor: [
      "사람, 조직, 상품, 사건 사이 관계가 중요한 데이터",
      "단순 키워드 검색보다 연결 관계가 중요한 질문",
      "복잡한 문서 묶음의 전체 구조 요약",
    ],
    watchOut: [
      "GAG보다 GraphRAG라는 이름이 더 자주 쓰입니다.",
      "그래프 생성과 정제 비용이 큽니다.",
      "엔티티 추출이 틀리면 관계 추론도 틀어집니다.",
    ],
  },
];

const comparisonRows = [
  {
    topic: "핵심 자원",
    rag: "벡터 DB / 검색 인덱스",
    cag: "긴 컨텍스트 / KV cache",
    mag: "사용자/작업 메모리",
    gag: "지식 그래프",
  },
  {
    topic: "질문 시 동작",
    rag: "관련 문서 검색",
    cag: "미리 올린 지식 사용",
    mag: "관련 기억 불러오기",
    gag: "노드와 관계 탐색",
  },
  {
    topic: "장점",
    rag: "최신 문서와 출처 연결",
    cag: "낮은 지연과 단순한 추론 경로",
    mag: "개인화와 장기 맥락",
    gag: "관계 추론과 전체 구조 이해",
  },
  {
    topic: "주의점",
    rag: "검색 품질과 chunk 설계",
    cag: "지식 범위와 캐시 갱신",
    mag: "기억 오염과 개인정보",
    gag: "그래프 구축 비용과 정확도",
  },
];

const selectionGuide = [
  {
    title: "문서가 많고 계속 바뀐다",
    answer: "RAG",
    reason: "새 문서를 인덱싱하고 질문마다 관련 조각을 검색하는 구조가 맞습니다.",
  },
  {
    title: "범위가 작고 거의 안 바뀐다",
    answer: "CAG",
    reason: "검색 파이프라인보다 미리 컨텍스트를 올려두는 쪽이 단순하고 빠를 수 있습니다.",
  },
  {
    title: "사용자별 맥락을 기억해야 한다",
    answer: "MAG",
    reason: "대화 기록, 선호, 작업 상태 같은 장기 기억 저장소가 필요합니다.",
  },
  {
    title: "관계와 연결이 핵심이다",
    answer: "GAG / GraphRAG",
    reason: "문서 조각보다 엔티티와 관계를 따라가는 그래프 탐색이 더 잘 맞습니다.",
  },
];

export default function RagConceptsPage() {
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
                  <BreadcrumbPage>RAG / Concepts</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-sky-200 bg-sky-50/50 p-5 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
            <div className="flex items-start gap-3">
              <BrainCircuitIcon className="mt-1 size-6 text-sky-700 dark:text-sky-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  RAG, CAG, MAG, GAG 정리
                </h1>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
                  모두 LLM이 혼자 가진 파라미터 지식만 쓰지 않고 외부 지식,
                  캐시, 기억, 그래프를 붙여 답변 품질을 높이는 방식입니다.
                  다만 무엇을 붙이는지가 다릅니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-4">
            {generationTypes.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.shortName}
                  className={`rounded-lg border p-4 shadow-sm ${item.colorClass}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-5 text-sky-700 dark:text-sky-300" />
                    <h2 className="text-lg font-semibold">{item.shortName}</h2>
                  </div>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {item.fullName}
                  </p>
                  <p className="mt-3 rounded-md border bg-white/75 p-2 text-xs font-semibold dark:bg-background/45">
                    {item.korean}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.summary}
                  </p>
                  <Flow values={item.flow} />
                </article>
              );
            })}
          </section>

          <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
            <div className="mb-4 flex items-center gap-2">
              <DatabaseIcon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">한눈에 비교</h2>
            </div>
            <div className="overflow-hidden rounded-lg border bg-white/75 dark:bg-background/45">
              <div className="grid grid-cols-[130px_repeat(4,1fr)] border-b bg-muted/60 text-sm font-semibold">
                <div className="border-r p-3">구분</div>
                <div className="border-r p-3">RAG</div>
                <div className="border-r p-3">CAG</div>
                <div className="border-r p-3">MAG</div>
                <div className="p-3">GAG</div>
              </div>
              {comparisonRows.map((row) => (
                <div
                  key={row.topic}
                  className="grid grid-cols-[130px_repeat(4,1fr)] border-b text-sm last:border-b-0"
                >
                  <div className="border-r p-3 font-medium">{row.topic}</div>
                  <div className="border-r p-3 leading-6">{row.rag}</div>
                  <div className="border-r p-3 leading-6">{row.cag}</div>
                  <div className="border-r p-3 leading-6">{row.mag}</div>
                  <div className="p-3 leading-6">{row.gag}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-4">
            {generationTypes.map((item) => (
              <article key={item.fullName} className="rounded-lg border bg-card p-4 shadow-sm">
                <h2 className="font-semibold">{item.shortName} 사용 예시</h2>
                <div className="mt-4">
                  <p className="text-sm font-medium">잘 맞는 상황</p>
                  <ul className="mt-2 grid gap-2">
                    {item.goodFor.map((value) => (
                      <li key={value} className="flex gap-2 text-sm leading-6">
                        <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium">주의할 점</p>
                  <ul className="mt-2 grid gap-2">
                    {item.watchOut.map((value) => (
                      <li key={value} className="flex gap-2 text-sm leading-6">
                        <ArrowRightIcon className="mt-1 size-4 shrink-0 text-amber-600 dark:text-amber-300" />
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="mb-4 flex items-center gap-2">
              <NetworkIcon className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">선택 기준</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {selectionGuide.map((item) => (
                <article
                  key={item.title}
                  className="rounded-lg border bg-white/75 p-4 dark:bg-background/45"
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-3 inline-flex rounded-md border bg-background px-2 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300">
                    {item.answer}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.reason}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 text-sm leading-6 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
            <div className="flex gap-2">
              <ServerIcon className="mt-1 size-4 shrink-0 text-amber-700 dark:text-amber-300" />
              <p>
                이 프로젝트에서 다음에 구현한다면 순서는 `RAG 기본 페이지` → `문서 등록 mock`
                → `벡터 검색 mock` → `질문하기 mock`이 좋습니다. CAG, MAG, GAG는
                그 다음 확장 개념으로 붙이면 됩니다.
              </p>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Flow({ values }: { values: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} className="flex items-center gap-2">
          <span className="rounded-md border bg-white/75 px-2 py-1 text-xs dark:bg-background/45">
            {value}
          </span>
          {index < values.length - 1 ? (
            <ArrowRightIcon className="size-3 text-muted-foreground" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
