import Link from "next/link";
import { NetworkIcon } from "lucide-react";
import { ReferencePage, CodeBlock, FlowSection } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/agent-rag-mcp");
const cards = [
  [
    "Agent · 다음 행동",
    "목표와 현재 상태를 바탕으로 검색·도구 호출·종료를 선택하는 제어 역할입니다.",
    "이 페이지 API는 고정 정책입니다. 자연어 계획이나 LLM 추론을 실행하지 않습니다."
  ],
  [
    "RAG · 답변 근거",
    "문서를 검색해 관련 내용을 생성 입력에 보탭니다.",
    "검색 품질·근거 최신성·출처가 중요합니다. API는 cache·queue·rag 세 키워드의 고정 문서만 검색합니다."
  ],
  [
    "MCP · 연결 규약",
    "호스트 내부 클라이언트가 서버의 기능을 발견하고 호출하는 연결 구조입니다.",
    "Tools·Resources·Prompts를 구분합니다. MCP는 모델·벡터 DB가 아니며 모든 호출을 자동 승인하지 않습니다."
  ],
  [
    "검색과 실행 순서",
    "검색이 도구로 노출될 수도 있고 도구 결과를 다시 검색할 수도 있습니다.",
    "아래 흐름은 한 가지 예시입니다. RAG 뒤에 MCP가 항상 필수로 이어지는 규칙은 아닙니다."
  ],
  [
    "읽기와 쓰기",
    "조회 권한과 외부 상태를 바꾸는 작업의 승인을 따로 확인합니다.",
    "write-report는 승인해도 PREVIEW_ONLY입니다. 파일·DB·외부 서비스에 쓰지 않습니다."
  ],
  [
    "신뢰 경계",
    "검색 문서와 도구 결과는 출처가 있는 데이터로 취급합니다.",
    "자료 속 지시를 운영 권한으로 실행하지 않습니다. 실서비스는 서버 인증·최소 권한·감사·실행 시점 재검증이 필요합니다."
  ]
];
const scenarios = [
  "query=\"cache queue\" → 출처 2건. 알 수 없는 키워드 → sources=[]와 근거 없음 안내.",
  "read-metrics·toolAllowed=true → 고정 표본 반환. 실시간 관측 결과가 아닙니다.",
  "write-report·승인 없음 → APPROVAL_REQUIRED, 승인 있음 → PREVIEW_ONLY.",
  "toolAllowed=false는 userApproved=true보다 우선합니다. query는 1~80자, 알 수 없는 도구는 400."
];
const related = [["/ai-agent-lab","에이전트 반복 실습"],["/rag/project-structure","RAG 프로젝트 구조"],["/llm-app-structure","LLM 애플리케이션 구조"]];
export default function Page() {
  return <ReferencePage pageHref="/agent-rag-mcp" label="개념 · 흐름 · 실행 검증" description="Agent의 흐름 제어, RAG의 근거 검색, MCP의 도구 연결을 분리하고 검색 누락·도구 권한·쓰기 승인 경로를 실험합니다." icon={NetworkIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">

    <section className="grid gap-4 xl:grid-cols-3" aria-label="핵심 개념">{cards.map(([title, body, caution], index) => <article key={title} className="min-w-0 rounded-xl border bg-card p-5"><p className="text-sm font-medium text-sky-700 dark:text-sky-300">0{index + 1}</p><h2 className="mt-2 text-lg font-semibold [overflow-wrap:anywhere]">{title}</h2><p className="mt-3 text-sm leading-6">{body}</p><p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">{caution}</p></article>)}</section>
    <FlowSection title="대표 실행 흐름" steps={["질문과 정책 입력","고정 문서 검색","도구 허용 여부 확인","쓰기면 승인 여부 확인","결과·출처를 분리해 반환"]} />
    <CodeBlock language="java" title="Java 형태의 의사코드 · 분기 요약 (독립 컴파일 예제 아님)" code={"// 실습의 정책 순서: 승인=true라도 도구 금지를 우회할 수 없습니다.\nif (tool.equals(\"none\")) return SKIPPED;\nif (!toolAllowed) return DENIED;\nif (tool.equals(\"write-report\") && !userApproved)\n    return APPROVAL_REQUIRED;\nif (failTool) return TOOL_ERROR;\n// read-metrics: 고정 표본 조회\n// write-report: 문자열 미리보기만 생성, 외부 쓰기 없음"} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">입력을 바꿔 확인하기</h2><ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-6 [overflow-wrap:anywhere]">{scenarios.map(item => <li key={item}>{item}</li>)}</ol></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 이어서 보기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">원문에서 확인한 주제를 학습용으로 재구성했습니다. 코드·실패 실험·설계 주의점은 프로젝트에서 보완한 내용입니다.</p><ul className="mt-3 space-y-2 text-sm"><li><a className="underline" href="https://www.instagram.com/p/Dd4McJIIPdW/">Instagram 원문</a></li><li><a className="underline" href="https://modelcontextprotocol.io/docs/learn/architecture">공식 문서 · 세부 계약 확인</a></li>{related.map(([href, title]) => <li key={href}><Link className="underline" href={href}>{title}</Link></li>)}</ul></section>
  </ReferencePage>;
}
