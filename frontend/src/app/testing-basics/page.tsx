import {
  CodeBlock,
  ComparisonTable,
  ConceptGrid,
  FlowSection,
  ReferencePage,
} from "@/components/reference-page";
import {
  BeakerIcon,
  CheckCircle2Icon,
  Layers3Icon,
  ListChecksIcon,
  MicroscopeIcon,
} from "lucide-react";

import { getStudyMetadata } from "@/lib/study-pages";

const cards = [
  {
    title: "Unit Test",
    description: "작은 함수나 서비스 하나를 빠르게 검증합니다.",
    bullets: ["Spring Context 없이 빠름", "입출력과 예외를 확인", "RagService 같은 순수 로직에 적합"],
    colorClass: "border-blue-200 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20",
    icon: MicroscopeIcon,
  },
  {
    title: "Integration Test",
    description: "여러 Bean, DB, HTTP 계층이 함께 동작하는지 확인합니다.",
    bullets: ["SpringBootTest 사용 가능", "느리지만 실제에 가까움", "Controller + Service 흐름 검증"],
    colorClass: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    icon: Layers3Icon,
  },
  {
    title: "E2E / UI Test",
    description: "브라우저에서 사용자의 실제 흐름을 검증합니다.",
    bullets: ["버튼 클릭과 화면 결과 확인", "비용이 커서 핵심 플로우 위주", "Playwright 같은 도구 사용"],
    colorClass: "border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20",
    icon: BeakerIcon,
  },
];

const rows = [
  { topic: "Given", values: ["테스트 준비", "입력 데이터와 mock 상태 구성", "문서 3개 등록"] },
  { topic: "When", values: ["실행", "검증할 메서드나 API 호출", "vectorSearch(query, topK)"] },
  { topic: "Then", values: ["기대 결과 확인", "값, 예외, 상태 변화 검증", "score 높은 hit가 먼저 나오는지 확인"] },
];

const code = `@Test
void searchReturnsTopKChunks() {
    RagService service = new RagService();

    RagSearchResponse response = service.search(
            new RagSearchRequest("벡터 검색 embedding", 2)
    );

    assertThat(response.hits()).hasSize(2);
    assertThat(response.hits().getFirst().score()).isGreaterThan(0);
}`;

export default function TestingBasicsPage() {
  return (
    <ReferencePage pageHref="/testing-basics"
      label="테스트 기초"
      description="테스트는 코드를 고정하는 안전장치이자 학습용 디버깅 도구입니다. 작은 서비스 테스트부터 시작해 Controller와 UI 흐름으로 넓혀가면 좋습니다."
      icon={ListChecksIcon}
      colorClass="border-blue-200 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20"
    >
      <ConceptGrid items={cards} />
      <ComparisonTable columns={["의미", "하는 일", "예시"]} rows={rows} />
      <FlowSection
        title="테스트 작성 순서"
        steps={["작은 로직 선택", "정상 케이스", "경계값", "예외 케이스", "리팩터링", "반복 실행"]}
        colorClass="border-violet-200 bg-violet-50/40 dark:border-violet-900/60 dark:bg-violet-950/20"
      />
      <section className="grid gap-4 xl:grid-cols-3">
        {[
          "처음에는 빠른 단위 테스트로 서비스 로직을 고정합니다.",
          "DB나 HTTP가 중요해지는 순간 통합 테스트를 추가합니다.",
          "테스트 이름은 구현이 아니라 기대 동작을 설명하게 씁니다.",
        ].map((text) => (
          <article key={text} className="rounded-lg border bg-card p-4 text-sm leading-6 shadow-sm">
            <CheckCircle2Icon className="mb-3 size-5 text-emerald-600 dark:text-emerald-300" />
            {text}
          </article>
        ))}
      </section>
      <CodeBlock title="RAG 서비스 테스트 예시" code={code} />
    </ReferencePage>
  );
}

export const metadata = getStudyMetadata("/testing-basics");
