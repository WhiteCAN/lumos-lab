import type { Metadata } from "next";
import Link from "next/link";
import { BrainCircuitIcon } from "lucide-react";
import { ComparisonTable, FlowSection, ReferencePage } from "@/components/reference-page";

export const metadata: Metadata = {
  title: "Classic · Graph · Agentic RAG 비교 | Lumos Lab",
  description: "세 RAG 구조의 검색 방식, 실행 흐름과 선택 기준을 비교합니다.",
};

const architectures = [
  { name: "Classic RAG", title: "관련 문서를 찾아 답하기", description: "질문과 관련 있는 문서 조각을 검색하고, 그 근거를 모델에 전달하는 고정된 흐름입니다.", example: "사내 규정 조회, 제품 FAQ, 문서 기반 고객 지원", caution: "개별 문서 검색으로 풀리는 질문의 출발점입니다. 검색되지 않은 근거는 모델도 활용하기 어렵습니다." },
  { name: "Graph RAG", title: "연결된 관계를 따라 답하기", description: "사람·회사·사건 같은 개체와 관계를 검색에 활용합니다. 여러 문서에 흩어진 연결을 질문의 맥락으로 모읍니다.", example: "기업 간 거래 관계, 사건과 인물 연결, 공급망 영향 분석", caution: "관계가 답변에 필요할 때 검토합니다. 그래프 구축·갱신 비용과 잘못 추출된 관계를 관리해야 합니다." },
  { name: "Agentic RAG", title: "결과에 따라 다음 검색을 정하기", description: "에이전트가 필요한 검색이나 도구를 선택하고, 관찰한 결과에 따라 추가 조회 또는 답변을 결정합니다.", example: "여러 자료를 대조하는 조사, 문서와 업무 시스템을 함께 조회하는 지원", caution: "미리 고정하기 어려운 절차에 적합합니다. 반복 횟수·시간·비용과 허용 도구를 제한해야 합니다." },
];

export default function RagArchitectureComparisonPage() {
  return (
    <ReferencePage breadcrumb="RAG / 아키텍처 비교" label="검색 · 관계 · 도구 선택" title="Classic · Graph · Agentic RAG"
      description="관련 문서를 찾을 것인가, 관계를 연결할 것인가, 검색 절차를 상황에 따라 바꿀 것인가. 질문이 요구하는 작업을 기준으로 세 구조를 비교합니다."
      icon={BrainCircuitIcon} colorClass="border-teal-200 bg-teal-50/50 dark:border-teal-900/60 dark:bg-teal-950/20">
      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">핵심 · 필요한 복잡도만 추가하기</h2>
        <p className="mt-3 text-sm leading-6">원문은 단순성·응답 시간·비용을 먼저 살피라고 제안합니다. 세 방식은 발전 단계가 아닙니다. Graph RAG는 근거를 연결하는 방식에, Agentic RAG는 실행을 결정하는 방식에 초점이 있어 함께 사용할 수도 있습니다.</p>
      </section>
      <section className="grid gap-4 xl:grid-cols-3" aria-label="세 가지 RAG 구조">
        {architectures.map((item, index) => (
          <article key={item.name} className="rounded-lg border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-teal-700 dark:text-teal-300">0{index + 1} · {item.name}</p>
            <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm leading-6">{item.description}</p>
            <p className="mt-3 text-sm leading-6"><strong>적용 예시:</strong> {item.example}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.caution}</p>
          </article>
        ))}
      </section>
      <div className="grid gap-4 xl:grid-cols-3">
      <FlowSection orientation="vertical" title="Classic RAG · 고정된 검색 → 생성" steps={[
        { label: "질문", icon: "user" }, { label: "질문 임베딩", icon: "model" },
        { label: "유사 문서 검색", icon: "database", detail: "벡터 검색 예시" },
        { label: "근거 조각 전달", icon: "document" }, { label: "근거 기반 생성", icon: "model" },
        { label: "출처와 답변", icon: "done" },
      ]} />
      <FlowSection orientation="vertical" title="Graph RAG · 관계를 연결한 근거 검색" steps={[
        { label: "질문", icon: "user" }, { label: "대상 개체 연결", icon: "search" },
        { label: "관련 관계 탐색", icon: "branch" }, { label: "연결된 근거 수집", icon: "document" },
        { label: "관계와 근거로 생성", icon: "model" }, { label: "출처와 답변", icon: "done" },
      ]} colorClass="border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/20" />
      <FlowSection orientation="vertical" title="Agentic RAG · 관찰 결과에 따라 경로 선택" defaultPathLabel="근거 충분" steps={[
        { label: "질문", icon: "user" }, { label: "조회 방법 선택", icon: "model" },
        { label: "검색·도구 실행", icon: "search" }, { label: "근거 점검", icon: "verify" },
        { label: "출처와 답변", icon: "done" },
      ]} paths={[{ label: "추가 검색 필요", steps: [
        { label: "첫 검색 결과", icon: "document" }, { label: "근거 부족 판단", icon: "verify" },
        { label: "다른 검색·도구 선택", icon: "branch" }, { label: "추가 근거 조회", icon: "search" },
        { label: "다시 점검", icon: "verify" }, { label: "답변 또는 중단", icon: "done", detail: "반복·시간 상한 적용" },
      ] }]} colorClass="border-violet-200 bg-violet-50/40 dark:border-violet-900/60 dark:bg-violet-950/20" />
      </div>
      <p className="text-sm leading-6 text-muted-foreground">사전에 문서를 분할·임베딩해 색인을 준비합니다. 위 흐름은 대표적인 벡터 검색 예시이며, 고정된 RAG 파이프라인에도 키워드 검색·하이브리드 검색·재정렬을 적용할 수 있습니다.</p>
      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">그래프 준비와 질문 처리를 구분하기</h2>
        <p className="mt-3 text-sm leading-6">그래프 구축은 보통 질문 전에 수행합니다. 문서에서 개체·관계를 추출하고 원문 출처와 연결한 뒤, 질문 시 관련 대상을 찾아 탐색합니다. 위 그림은 개체 중심 검색 예시입니다.</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Microsoft GraphRAG는 이보다 구체적인 구현으로, 그래프 커뮤니티와 요약을 만들고 전체 자료의 주제를 다루는 전역 검색도 제공합니다. 모든 Graph RAG가 같은 색인·검색 절차를 따르지는 않습니다.</p>
      </section>
      <p className="text-sm leading-6 text-muted-foreground">도구는 벡터 검색, 그래프 검색, 권한이 있는 업무 API 등이 될 수 있습니다. 메모리는 선택 사항입니다. 자기 점검만으로 사실성이 보장되지는 않으므로 근거 검증과 종료 조건을 별도로 둡니다.</p>
      <ComparisonTable columns={["Classic RAG", "Graph RAG", "Agentic RAG"]} rows={[
        { topic: "핵심 질문", values: ["어떤 문서가 관련 있는가?", "어떤 대상들이 어떻게 연결되는가?", "지금 어떤 조회를 더 해야 하는가?"] },
        { topic: "사전 준비", values: ["문서 정제·분할·검색 색인", "개체·관계·출처 연결, 그래프 갱신", "검색 도구·권한·종료 조건 구성"] },
        { topic: "실행 흐름", values: ["검색 후 생성하는 고정 절차", "관계 탐색 또는 그래프 요약 검색", "결과에 따라 검색·도구 선택과 반복"] },
        { topic: "비용의 원인", values: ["검색량, 문맥 길이, 모델 호출", "그래프 구축·갱신, 탐색·요약", "가변적인 도구·모델 호출과 반복"] },
        { topic: "대표 실패", values: ["근거 누락, 부적절한 문서 조각", "관계 추출 오류, 오래된 연결", "잘못된 도구 선택, 반복·비용 증가"] },
      ]} />
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">같은 회사 자료도 질문에 따라 다릅니다</h2>
          <ul className="mt-3 space-y-3 text-sm leading-6">
            <li><strong>Classic:</strong> “출장비 한도는 얼마인가?” → 규정의 해당 조항 검색.</li>
            <li><strong>Graph:</strong> “이 공급사와 연결된 계열사 중 계약 영향을 받는 곳은?” → 거래·계열 관계와 계약 근거 연결.</li>
            <li><strong>Agentic:</strong> “계약과 최근 공지·재고를 조사해 대응안을 작성해줘.” → 조회 결과에 따라 필요한 도구를 추가 선택.</li>
          </ul>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">선택 순서</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6">
            <li>실제 질문과 정답 근거로 평가 세트를 만듭니다.</li>
            <li>고정된 검색·생성을 기준선으로 두고 근거 회수율, 답변 정확성, 지연과 비용을 측정합니다.</li>
            <li>문서 누락에는 분할·검색·재정렬을 먼저 개선합니다.</li>
            <li>관계 추론이 부족하면 그래프를, 유동적인 조회 절차가 필요하면 에이전트를 검토합니다.</li>
          </ol>
        </article>
      </section>
      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">출처와 함께 읽기</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Learnbay 게시물의 세 구조를 한국어로 재구성하고, 준비 단계·실패 조건·선택 예시를 보완했습니다. 원문의 사용 비율이나 속도 표현은 일반적인 성능 보장으로 인용하지 않았습니다. 모든 구조에서 문서 접근 권한과 답변 근거를 확인해야 합니다.</p>
        <ul className="mt-3 grid gap-2 text-sm">
          <li><a className="underline underline-offset-4" href="https://www.instagram.com/reels/Dab9yGpyxIq/">원문 · Learnbay의 Classic RAG vs Graph RAG vs Agentic RAG</a></li>
          <li><a className="underline underline-offset-4" href="https://microsoft.github.io/graphrag/">Microsoft · GraphRAG 공식 문서</a></li>
          <li><a className="underline underline-offset-4" href="https://docs.langchain.com/oss/python/deepagents/retrieval">LangChain · Retrieval 공식 문서</a></li>
          <li><Link className="underline underline-offset-4" href="/rag/concepts">함께 보기 · RAG 개요와 아키텍처 8가지</Link></li>
          <li><Link className="underline underline-offset-4" href="/ai-agent-patterns">함께 보기 · AI 에이전트 설계 패턴</Link></li>
          <li><Link className="underline underline-offset-4" href="/rag/ask">실습 · 문서에 질문하기</Link></li>
        </ul>
      </section>
    </ReferencePage>
  );
}
