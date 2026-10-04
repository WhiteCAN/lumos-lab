import Link from "next/link";
import { BotIcon } from "lucide-react";
import { ReferencePage, CodeBlock, FlowSection } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/ai-agent-lab");
const cards = [
  [
    "Single-shot",
    "입력 초안을 그대로 반환하고 UNVERIFIED로 종료합니다.",
    "정답 여부를 판정하지 않습니다. 한 번 호출했다는 사실과 품질 보장은 다릅니다."
  ],
  [
    "Verifier-gated",
    "서버가 정수 합계와 초안을 비교하고 PASSED 또는 REJECTED를 반환합니다.",
    "거절한 초안을 자동으로 수정하지 않습니다. 검증 게이트와 피드백 루프는 다른 역할입니다."
  ],
  [
    "Reflexive의 제어 모형",
    "검증 실패 시 허용된 계산기로 초안을 수정하고 다시 검사합니다.",
    "LLM 자기 비평이 아닙니다. 정답이 확정된 합계 문제로 반복·중단 경계만 실습합니다."
  ],
  [
    "시도 상한",
    "maxAttempts는 최초 초안을 포함한 최대 초안 수입니다.",
    "1이면 수정하지 못합니다. 이 모형의 계산기는 한 번에 교정하므로 최대 2개 초안만 만듭니다."
  ],
  [
    "권한과 실패",
    "toolAllowed=false는 도구 금지, failTool=true는 계산 도구 실패를 주입합니다.",
    "실제 사용자 인증이나 외부 도구 장애가 아닙니다. 입력 플래그를 운영 권한으로 신뢰하면 안 됩니다."
  ],
  [
    "확장할 때",
    "ReAct는 관찰에 따라 다음 행동을 정하고 Planner-executor는 작업을 분해합니다.",
    "두 패턴은 기존 개념 페이지에서 다룹니다. 이 API가 다섯 패턴 전체를 구현하지는 않습니다."
  ]
];
const scenarios = [
  "values=[2,3], proposedTotal=4: single-shot → UNVERIFIED, verifier-gated → REJECTED.",
  "reflexive·maxAttempts=2·toolAllowed=true → candidate=5, attempts=2, PASSED.",
  "maxAttempts=1 → LIMIT_REACHED. 도구 금지 → TOOL_DENIED. 도구 오류 주입 → TOOL_ERROR.",
  "정답 초안은 첫 검사에서 종료합니다. 숫자 1~10개(-100~100), 초안 -1000~1000, 상한 1~5. 잘못된 패턴은 400."
];
const related = [["/ai-agent-patterns","다섯 가지 패턴 전체"],["/agent-rag-mcp","Agent·RAG·MCP 연결"]];
export default function Page() {
  return <ReferencePage pageHref="/ai-agent-lab" label="개념 · 흐름 · 실행 검증" description="동일한 합계 초안을 검사 없이 반환하거나, 거절하거나, 수정 후 재검증하는 세 가지 제어 흐름을 비교합니다." icon={BotIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">

    <section className="grid gap-4 xl:grid-cols-3" aria-label="핵심 개념">{cards.map(([title, body, caution], index) => <article key={title} className="min-w-0 rounded-xl border bg-card p-5"><p className="text-sm font-medium text-sky-700 dark:text-sky-300">0{index + 1}</p><h2 className="mt-2 text-lg font-semibold [overflow-wrap:anywhere]">{title}</h2><p className="mt-3 text-sm leading-6">{body}</p><p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">{caution}</p></article>)}</section>
    <FlowSection title="대표 실행 흐름" steps={["초안과 목표 입력","패턴에 따른 검사","수정 상한·권한 확인","허용되면 로컬 계산","재검증 또는 명시적 중단"]} />
    <CodeBlock title="Java 형태의 의사코드 · 분기 요약 (독립 컴파일 예제 아님)" code={"// 실제 서버의 분기 요약\nif (pattern.equals(\"single-shot\")) return UNVERIFIED;\nif (candidate == expectedSum) return PASSED;\nif (pattern.equals(\"verifier-gated\")) return REJECTED;\nif (maxAttempts == 1) return LIMIT_REACHED;\nif (!toolAllowed) return TOOL_DENIED;\nif (failTool) return TOOL_ERROR;\n// 로컬 계산기로 수정한 뒤 검증. 외부 모델 호출은 없습니다."} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">입력을 바꿔 확인하기</h2><ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-6 [overflow-wrap:anywhere]">{scenarios.map(item => <li key={item}>{item}</li>)}</ol></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 이어서 보기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">원문에서 확인한 주제를 학습용으로 재구성했습니다. 코드·실패 실험·설계 주의점은 프로젝트에서 보완한 내용입니다.</p><ul className="mt-3 space-y-2 text-sm"><li><a className="underline" href="https://www.instagram.com/reels/Dd5q-Zty7nP/">Instagram 원문</a></li><li><a className="underline" href="https://www.anthropic.com/engineering/building-effective-agents">공식 문서 · 세부 계약 확인</a></li>{related.map(([href, title]) => <li key={href}><Link className="underline" href={href}>{title}</Link></li>)}</ul></section>
  </ReferencePage>;
}
