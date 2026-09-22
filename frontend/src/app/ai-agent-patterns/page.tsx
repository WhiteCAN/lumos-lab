import Link from "next/link";
import { BotIcon } from "lucide-react";
import { ComparisonTable, FlowSection, ReferencePage } from "@/components/reference-page";

import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/ai-agent-patterns");

const patterns = [
  { name: "Single-shot", title: "한 번 호출해 답하기", flow: "입력 → 모델 호출 → 결과", use: "분류, 정보 추출, 간단한 변환", caution: "호출 수가 적지만 검색·실행·재검토가 자동으로 생기지는 않습니다. 단일 LLM 호출을 자율 에이전트와 동일하게 보지는 않습니다." },
  { name: "ReAct loop", title: "행동하고 관찰하며 반복하기", flow: "목표 → 다음 행동 선택 → 도구 실행 → 결과 관찰 → 다음 행동 또는 종료", use: "검색 결과에 따라 다음 조회가 달라지는 조사", caution: "오류를 반복하거나 도구 호출이 늘 수 있습니다. 호출 횟수, 시간, 비용, 허용 도구와 종료 조건을 정합니다." },
  { name: "Planner-executor", title: "계획과 실행 나누기", flow: "목표 → 하위 작업 계획 → 각 작업 실행 → 결과 통합", use: "여러 자료를 조사해 비교 보고서 작성", caution: "계획이 틀리면 하위 결과도 어긋납니다. 독립적인 작업만 병렬화하고 의존성·실패·재계획을 다룹니다. 여러 에이전트가 반드시 필요한 것은 아닙니다." },
  { name: "Reflexive", title: "초안을 평가하고 다듬기", flow: "초안 생성 → 기준에 따라 비평 → 수정 → 종료 또는 재평가", use: "문서 품질 개선, 코드 초안 점검", caution: "자기 비평이 사실 확인을 대신하지 않습니다. 같은 오류를 유지할 수 있으므로 외부 근거·테스트·평가 기준과 반복 상한이 필요합니다." },
  { name: "Verifier-gated", title: "검증을 통과해야 진행하기", flow: "결과 또는 행동 제안 → 검증 → 통과 시 실행 / 실패 시 거절·수정", use: "스키마 준수, 권한 확인, 중요한 외부 동작 전 검증", caution: "검증 기준이 약하면 잘못된 결과도 통과합니다. 가능한 검사는 코드·정책 엔진으로 수행하고, 필요한 사용자 승인을 별도 조건으로 둡니다." },
];

export default function AiAgentPatternsPage() {
  return (
    <ReferencePage pageHref="/ai-agent-patterns" label="실행 흐름 · 비용 · 검증"
      description="한 번 답하기, 도구를 쓰며 반복하기, 계획과 실행 나누기, 스스로 다듬기, 검증 후 진행하기. 작업이 요구하는 흐름에 맞춰 패턴을 선택하고 필요한 경우 조합합니다."
      icon={BotIcon} colorClass="border-violet-200 bg-violet-50/50 dark:border-violet-900/60 dark:bg-violet-950/20">
      <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">이 분류를 읽는 방법</h2><p className="mt-3 text-sm leading-6">원문은 AI 시스템의 실행 방식을 다섯 가지로 묶어 설명합니다. 모든 프레임워크가 공유하는 공식 분류는 아니며, 패턴 이름보다 반복·계획·검증이 어느 지점에 들어가는지 보는 것이 중요합니다.</p></section>
      <section className="grid gap-4 lg:grid-cols-2" aria-label="다섯 가지 패턴">{patterns.map((pattern, index) => (
        <article key={pattern.name} className="rounded-lg border bg-card p-5 shadow-sm"><p className="text-sm font-medium text-violet-700 dark:text-violet-300">0{index + 1} · {pattern.name}</p><h2 className="mt-2 text-xl font-semibold">{pattern.title}</h2><p className="mt-4 rounded-lg border bg-muted/40 p-3 text-sm leading-6">{pattern.flow}</p><p className="mt-3 text-sm leading-6"><strong>적용 예시:</strong> {pattern.use}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{pattern.caution}</p></article>
      ))}</section>
      <ComparisonTable columns={["선택할 때 묻는 질문", "관리할 비용·위험"]} rows={[
        { topic: "Single-shot", values: ["현재 입력만으로 한 번에 답할 수 있는가?", "출력 형식, 정보 부족, 잘못된 답변"] },
        { topic: "ReAct", values: ["관찰 결과에 따라 다음 행동이 달라지는가?", "도구 실패와 무한 반복, 지연·호출 비용"] },
        { topic: "Planner-executor", values: ["작업을 분해하고 결과를 통합해야 하는가?", "계획 오류, 의존성, 하위 작업 간 결과 충돌"] },
        { topic: "Reflexive", values: ["명확한 기준으로 초안을 개선할 수 있는가?", "평가 편향, 품질 정체, 반복 비용"] },
        { topic: "Verifier-gated", values: ["통과 조건 없이 진행하면 문제가 생기는가?", "검증 누락, 잘못된 승인·거절, 승인 대기"] },
      ]} />
      <FlowSection title="조합 예시 · 근거 있는 보고서 초안" defaultPathLabel="검증 통과" steps={[
        { label: "조사 항목 계획", icon: "model" }, { label: "검색·관찰", icon: "search" }, { label: "결과 통합", icon: "document" },
        { label: "초안 개선", icon: "model" }, { label: "출처·형식 검증", icon: "verify" }, { label: "결과 제공", icon: "done" },
      ]} paths={[{ label: "검증 실패 → 수정", steps: [
        { label: "초안 생성", icon: "model" }, { label: "출처 검증 실패", icon: "verify", detail: "필수 근거 누락" }, { label: "검색 단계로 복귀", icon: "search" },
        { label: "근거를 반영해 수정", icon: "model" }, { label: "다시 검증", icon: "verify" }, { label: "통과하면 제공", icon: "done", detail: "계속 실패하면 중단·검토" },
      ] }]} colorClass="border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/20" />
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">Reflexive와 Verifier의 차이</h2><p className="mt-3 text-sm leading-6">비평은 결과를 더 좋게 만드는 피드백이고, 검증 게이트는 다음 단계로 넘어가도 되는지 결정하는 조건입니다. 문장 개선은 비평으로, 필수 필드 누락·권한 위반·실행 전 승인 여부는 검증 조건으로 다룰 수 있습니다.</p></article>
        <article className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">복잡도를 늘리기 전에</h2><p className="mt-3 text-sm leading-6">간단한 호출을 기준선으로 두고 성공률, 도구 오류, 지연, 비용을 측정합니다. 검색 누락에는 검색 개선을, 형식 오류에는 스키마 검증을 먼저 적용합니다. 평가 결과로 필요한 반복과 분해만 추가합니다.</p></article>
      </section>
      <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">출처와 함께 읽기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">원문의 다섯 패턴을 한국어로 재구성했습니다. 선택 질문·실패 조건·조합 예시는 학습용 보완이며, 특정 제품의 성능을 보장하지 않습니다.</p><ul className="mt-3 grid gap-2 text-sm"><li><a className="underline underline-offset-4" href="https://www.instagram.com/p/DdRObqoohGj/">원문 · GenAI.Works의 AI Agent Design Patterns</a></li><li><a className="underline underline-offset-4" href="https://www.anthropic.com/engineering/building-effective-agents">Anthropic · 워크플로와 에이전트 설계</a></li><li><Link className="underline underline-offset-4" href="/llm-app-structure">LLM 애플리케이션 구조</Link></li><li><Link className="underline underline-offset-4" href="/genai-project-structure">생성형 AI 프로젝트 구조</Link></li></ul></section>
    </ReferencePage>
  );
}
