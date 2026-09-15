import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
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

const ragArchitectures = [
  { name: "Naive RAG", summary: "질문에 맞는 문서를 한 번 검색해 답변의 근거로 전달하는 기본 구조입니다.", flow: ["질문", "관련 문서 검색", "컨텍스트 구성", "생성"], example: "제품 매뉴얼에서 반품 기간을 찾는 FAQ", caution: "잘못된 문서나 빠진 근거를 자동으로 교정하지 않습니다. 키워드 검색도 가능하며 벡터 DB가 필수는 아닙니다." },
  { name: "Advanced RAG", summary: "검색 전후를 개선해 더 적절한 근거가 모델에 들어가도록 합니다.", flow: ["질문 재작성", "키워드+벡터 검색", "재순위화", "생성"], example: "약어·동의어 때문에 관련 규정을 놓치는 사내 검색", caution: "재작성으로 질문 의도가 바뀌거나 reranker 비용이 늘 수 있습니다. chunk와 메타데이터 품질부터 측정합니다." },
  { name: "Modular RAG", summary: "질문 처리·검색·순위 조정·생성을 교체 가능한 구성 요소로 나누는 설계 관점입니다.", flow: ["질문 처리 모듈", "검색 모듈", "후처리 모듈", "생성 모듈"], example: "같은 생성기를 유지하면서 검색 엔진을 비교하는 시스템", caution: "특정 검색 알고리즘이나 품질 보증이 아닙니다. 다른 RAG 기법과 조합하며, 실제 교체 필요에 맞춰 책임을 나눕니다." },
  { name: "Graph RAG", summary: "엔티티와 관계를 활용해 연결된 근거를 찾습니다. 위의 GAG 설명과 이어지는 개념입니다.", flow: ["질문", "관련 엔티티·관계 탐색", "근거 문서 수집", "생성"], example: "같은 공급업체에 의존하는 제품들과 장애 영향 범위 찾기", caution: "그래프 추출 오류와 구축 비용을 고려합니다. Microsoft GraphRAG는 커뮤니티 요약도 활용하므로 모든 Graph RAG를 단순 그래프 탐색으로 보면 안 됩니다." },
  { name: "Corrective RAG · CRAG", summary: "검색 결과의 품질을 평가하고 부족하면 검색 근거를 보완합니다.", flow: ["검색", "관련성 평가", "부족하면 보완 검색", "근거 정제·생성"], example: "검색된 매뉴얼이 질문과 무관할 때 다른 근거를 찾기", caution: "원 논문은 검색 평가기의 신뢰도에 따라 행동을 선택하고 웹 검색·지식 정제를 사용합니다. 단순 재검색 루프는 아이디어를 응용한 구현입니다." },
  { name: "Self-RAG", summary: "검색 필요성과 생성 내용의 근거·품질을 모델이 평가하도록 학습하는 기법입니다.", flow: ["검색 필요 판단", "필요 시 검색", "생성·비평", "계속 생성 또는 재검색"], example: "문장을 생성하며 근거가 충분한지 점검해야 하는 답변", caution: "원 논문은 reflection token을 학습한 모델을 사용합니다. 일반 LLM에게 스스로 검토하라는 프롬프트를 주는 것과 동일하지 않으며 자기평가가 사실성을 보장하지도 않습니다." },
  { name: "Adaptive RAG", summary: "질문의 특성과 난이도에 따라 검색 경로와 투입 비용을 선택합니다.", flow: ["질문 분류", "검색 없음 / 단일 / 반복 검색", "선택 경로 실행", "생성"], example: "간단한 상식 질문과 여러 문서를 연결해야 하는 질문을 함께 처리", caution: "릴스는 검색 종류 선택을 강조하지만 Adaptive-RAG 논문은 질문 복잡도에 따른 검색 전략 선택을 다룹니다. 라우터 오판과 분류 비용을 평가합니다." },
  { name: "Agentic RAG", summary: "에이전트가 목표를 나누고 검색 도구를 선택하며 근거 수집을 반복하는 접근입니다.", flow: ["계획", "검색 도구 선택", "결과 관찰·재계획", "근거 종합"], example: "여러 문서·데이터 소스를 조회해 원인을 비교하는 조사 작업", caution: "반복 횟수·토큰·시간 예산과 종료 조건을 정합니다. 검색 자료의 지시를 신뢰하지 않고 도구 권한을 제한합니다. 장기 메모리는 선택 사항입니다." },
];

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
                  다만 무엇을 붙이는지가 다릅니다. 이어서 RAG 아키텍처 8가지의
                  동작과 선택 기준을 살펴봅니다.
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

          <section id="rag-architectures" className="grid gap-4 scroll-mt-4">
            <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-5 dark:border-sky-900/60 dark:bg-sky-950/20">
              <h2 className="text-2xl font-bold">RAG 아키텍처 8가지</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">같은 단계의 표준 분류나 성능 순위가 아닙니다. 검색 개선, 모듈 구성, 그래프 활용, 평가·제어 전략이 섞인 학습용 지도입니다. Modular 구조 안에 Advanced 검색과 Corrective 평가를 함께 둘 수도 있습니다.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {ragArchitectures.map((item, index) => (
                <article key={item.name} className="rounded-lg border bg-card p-5 shadow-sm">
                  <h3 className="text-lg font-semibold">{index + 1}. {item.name}</h3>
                  <p className="mt-3 text-sm leading-6">{item.summary}</p>
                  <Flow values={item.flow} />
                  <p className="mt-4 text-sm leading-6"><span className="font-semibold">적용 예시 · </span>{item.example}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground"><span className="font-semibold">주의할 점 · </span>{item.caution}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">어디부터 개선할까?</h2>
            <ol className="mt-3 grid list-decimal gap-2 pl-5 text-sm leading-6">
              <li>질문·정답·근거 문서로 평가 세트를 만들고 기본 RAG의 검색 재현율과 답변 근거 일치도를 측정합니다.</li>
              <li>문서를 못 찾으면 chunk·메타데이터·하이브리드 검색을, 엉뚱한 문서가 앞서면 reranking을 점검합니다.</li>
              <li>검색 실패를 감지해야 하면 Corrective, 질문별 비용 차이가 크면 Adaptive 접근을 검토합니다.</li>
              <li>관계 연결이 핵심이면 Graph, 여러 단계의 도구 선택이 필요하면 Agentic 접근을 평가합니다.</li>
              <li>정확도와 함께 p95 지연 시간, 검색·모델 호출 횟수, 토큰 비용을 비교합니다. 근거가 없을 때 답변을 보류하는지도 확인합니다.</li>
            </ol>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">어떤 구조든 문서 접근 권한, 최신성, 출처 연결과 검색 자료의 프롬프트 주입 방어가 필요합니다. 복잡한 구조가 자동으로 더 나은 답변을 만들지는 않습니다.</p>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 text-sm leading-6 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
            <div className="flex gap-2">
              <ServerIcon className="mt-1 size-4 shrink-0 text-amber-700 dark:text-amber-300" />
              <p>
                현재 실험실은 키워드 기반 검색과 mock 답변으로 기본 흐름을 학습합니다.
                <Link className="mx-1 underline underline-offset-4" href="/rag/documents">문서 등록</Link> →
                <Link className="mx-1 underline underline-offset-4" href="/rag/vector-search">검색</Link> →
                <Link className="mx-1 underline underline-offset-4" href="/rag/ask">질문하기</Link>에서 확인할 수 있습니다.
                위의 8가지 아키텍처와 실제 LLM 연동은 개념 설명입니다.
              </p>
            </div>
          </section>
          <section className="rounded-lg border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">출처와 원 논문</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">gauravgoyalai 릴스의 도식과 설명을 한국어로 재구성했습니다. 논문 이름이 붙은 기법은 원 자료를 함께 확인하세요.</p>
            <ul className="mt-3 grid gap-2 text-sm">
              {[
                ["원본 릴스 · 8 RAG Architectures", "https://www.instagram.com/reels/Dc568T-szp-/"],
                ["Corrective RAG 논문", "https://arxiv.org/abs/2401.15884"],
                ["Self-RAG 논문", "https://arxiv.org/abs/2310.11511"],
                ["Adaptive-RAG 논문", "https://aclanthology.org/2024.naacl-long.389/"],
                ["Microsoft GraphRAG 문서", "https://microsoft.github.io/graphrag/"],
              ].map(([label, href]) => <li key={href}><a className="underline underline-offset-4" href={href} target="_blank" rel="noreferrer">{label}</a></li>)}
            </ul>
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
