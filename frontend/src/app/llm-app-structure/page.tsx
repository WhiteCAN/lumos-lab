import {
  CodeBlock,
  ComparisonTable,
  ConceptGrid,
  FlowSection,
  ReferencePage,
} from "@/components/reference-page";
import {
  BotIcon,
  BrainCircuitIcon,
  DatabaseIcon,
  MessageSquareTextIcon,
  PlugIcon,
  ShieldCheckIcon,
} from "lucide-react";

const cards = [
  {
    title: "Prompt",
    description: "모델에게 역할, 목표, 제약, 출력 형식을 알려주는 입력입니다.",
    bullets: ["system/developer/user 메시지", "few-shot 예시", "출력 형식 지정"],
    colorClass: "border-blue-200 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20",
    icon: MessageSquareTextIcon,
  },
  {
    title: "RAG",
    description: "질문과 관련된 외부 문서를 찾아 컨텍스트로 넣는 구조입니다.",
    bullets: ["문서 chunking", "embedding과 vector search", "citation과 근거"],
    colorClass: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    icon: DatabaseIcon,
  },
  {
    title: "Agent",
    description: "모델이 목표를 위해 도구 호출, 관찰, 다음 행동 선택을 반복하는 구조입니다.",
    bullets: ["tool calling", "plan-act-observe loop", "권한과 중단 조건 필요"],
    colorClass: "border-violet-200 bg-violet-50/50 dark:border-violet-900/60 dark:bg-violet-950/20",
    icon: BotIcon,
  },
];

const rows = [
  { topic: "Prompt", values: ["모델 입력 설계", "작업 지시, 출력 형식", "답변 스타일과 정확도"] },
  { topic: "Tool Calling", values: ["외부 기능 호출", "검색, DB, 메일, 캘린더", "행동 가능한 앱"] },
  { topic: "RAG", values: ["외부 지식 주입", "문서 검색 Q&A", "최신성, 출처"] },
  { topic: "Memory", values: ["사용자/작업 기억", "선호, 프로젝트 상태", "개인화, 연속성"] },
  { topic: "Guardrail", values: ["안전 경계", "권한, 개인정보, 금칙 정책", "서비스 신뢰성"] },
];

const code = `User question
  -> classify intent
  -> retrieve documents when knowledge is needed
  -> call tools when action is needed
  -> generate answer with citations
  -> validate output and permissions
  -> return response`;

export default function LlmAppStructurePage() {
  return (
    <ReferencePage
      breadcrumb="Reference / LLM App Structure"
      label="AI 앱 구조"
      title="LLM 애플리케이션 구조"
      description="Prompt, Tool Calling, RAG, Memory, Agent, Guardrail을 한 페이지에서 연결합니다. 지금 프로젝트의 RAG mock은 이 구조 중 검색과 컨텍스트 조립 단계를 학습하기 위한 작은 버전입니다."
      icon={BrainCircuitIcon}
      colorClass="border-violet-200 bg-violet-50/50 dark:border-violet-900/60 dark:bg-violet-950/20"
    >
      <ConceptGrid items={cards} />
      <ComparisonTable columns={["역할", "예시", "좋아지는 점"]} rows={rows} />
      <FlowSection
        title="LLM 앱 요청 처리 흐름"
        steps={["질문 수신", "의도 분류", "RAG 검색", "Tool 호출", "답변 생성", "검증", "응답"]}
        colorClass="border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/20"
      />
      <section className="grid gap-4 xl:grid-cols-3">
        {[
          { title: "Tool Calling", text: "모델이 직접 계산하거나 행동하지 않고, 정해진 스키마로 외부 도구를 호출하게 만드는 방식입니다.", icon: PlugIcon },
          { title: "Memory", text: "대화 이력 전체를 무작정 넣는 것이 아니라, 재사용 가치가 있는 정보를 선별해 저장하는 구조가 필요합니다.", icon: BrainCircuitIcon },
          { title: "Guardrail", text: "민감 정보, 권한, 비용, 허용된 도구 범위를 요청 처리 전후로 검사합니다.", icon: ShieldCheckIcon },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-lg border bg-card p-4 shadow-sm">
              <Icon className="size-5 text-muted-foreground" />
              <h2 className="mt-3 font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          );
        })}
      </section>
      <CodeBlock title="전체 흐름 의사코드" code={code} />
    </ReferencePage>
  );
}
