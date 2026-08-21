import {
  BarChart3Icon,
  BrainCircuitIcon,
  CoinsIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  NetworkIcon,
  RouteIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from "lucide-react";
import type { AiConcept } from "@/types/ai-concepts";

export const aiConcepts: AiConcept[] = [
  {
    id: 1,
    title: "Agentic Loop",
    subtitle: "계획 → 실행 → 관찰 → 반성의 반복",
    summary:
      "AI가 한 번 답하고 끝나는 것이 아니라, 목표를 세우고 도구를 실행한 뒤 결과를 관찰하며 다음 행동을 조정하는 구조입니다.",
    flow: ["Plan", "Act", "Observe", "Reflect"],
    practicalUse: "코딩 에이전트, 자동 리서치, 업무 자동화 워크플로우",
    keyPoint: "반복 루프가 있어야 긴 작업을 스스로 보정할 수 있습니다.",
    icon: GitPullRequestIcon,
  },
  {
    id: 2,
    title: "Model Context Protocol",
    subtitle: "하나의 인터페이스로 여러 도구 연결",
    summary:
      "Model Context Protocol은 AI가 외부 도구, 파일, 데이터베이스, 브라우저 같은 자원을 일관된 방식으로 사용할 수 있게 해주는 연결 규격입니다.",
    flow: ["AI Agent", "MCP", "Tools · DB · Browser"],
    practicalUse: "Gmail, GitHub, DB, 사내 시스템을 AI와 연결",
    keyPoint: "AI에게 도구 사용 능력을 표준화해서 붙이는 방식입니다.",
    icon: NetworkIcon,
  },
  {
    id: 3,
    title: "Subagents & Multi-Agent Systems",
    subtitle: "역할을 나눠 복잡한 작업 처리",
    summary:
      "하나의 에이전트가 모든 일을 하지 않고, 분석 담당, 검색 담당, 작성 담당처럼 역할을 나누어 협업하게 만드는 구조입니다.",
    flow: ["Orchestrator", "Analysis Agent", "Search Agent", "Writing Agent"],
    practicalUse: "리서치 보고서, 복잡한 코드 분석, 멀티스텝 자동화",
    keyPoint: "역할 분담이 명확할수록 복잡한 작업을 안정적으로 처리합니다.",
    icon: GitBranchIcon,
  },
  {
    id: 4,
    title: "AI Gateway",
    subtitle: "여러 모델을 한 곳에서 관리",
    summary:
      "애플리케이션이 모델마다 직접 붙지 않고, 중간 게이트웨이를 통해 GPT, Claude, Gemini, Llama 같은 모델을 선택하고 관리하는 방식입니다.",
    flow: ["Apps", "AI Gateway", "Multiple Models"],
    practicalUse: "모델 라우팅, 인증/권한, 모니터링, 정책 제한",
    keyPoint: "모델 교체와 운영 정책을 애플리케이션 코드 밖에서 관리할 수 있습니다.",
    icon: RouteIcon,
  },
  {
    id: 5,
    title: "Inference Cost Economics",
    subtitle: "토큰, 캐시, 비용 구조를 이해해야 절약 가능",
    summary:
      "AI 비용은 요청 수만이 아니라 입력/출력 토큰, 캐시 적중, 모델 가격, 재시도 횟수에 따라 달라집니다.",
    flow: ["Input Tokens", "Cache Hit/Miss", "Total Cost"],
    practicalUse: "비용 최적화, 프롬프트 압축, 캐시 전략, 모델 선택",
    keyPoint: "성능만큼 비용 구조를 이해해야 운영 가능한 AI 서비스를 만들 수 있습니다.",
    icon: CoinsIcon,
  },
  {
    id: 6,
    title: "Evals",
    subtitle: "측정하지 못하면 개선도 어렵다",
    summary:
      "Evals는 AI 응답을 테스트 케이스와 기준으로 평가하는 체계입니다. 정확도, 안전성, 형식 준수, 비용 등을 반복 측정합니다.",
    flow: ["Eval Dataset", "Model Output", "Rubric", "Analysis"],
    practicalUse: "모델 변경 전후 품질 비교, 회귀 테스트, 프롬프트 개선",
    keyPoint: "감으로 좋아졌다고 판단하지 말고 지표로 확인해야 합니다.",
    icon: ScaleIcon,
  },
  {
    id: 7,
    title: "Guardrails",
    subtitle: "브랜드와 안전을 지키는 보호 장치",
    summary:
      "AI가 위험한 입력을 거르거나, 정책에 어긋나는 출력을 막고, 권한이 필요한 행동을 제한하는 안전 장치입니다.",
    flow: ["Input Filter", "Output Filter", "Policy · Permission", "Safe Output"],
    practicalUse: "개인정보 보호, 금칙어 처리, 권한 확인, 정책 준수",
    keyPoint: "AI 기능은 잘 답하는 것만큼 잘 막는 것도 중요합니다.",
    icon: ShieldCheckIcon,
  },
  {
    id: 8,
    title: "Observability",
    subtitle: "로그, 트레이스, 지표로 흐름 추적",
    summary:
      "AI 요청이 어떤 프롬프트와 도구를 거쳐 어떤 응답을 만들었는지 추적하고, 문제 원인을 분석하는 운영 체계입니다.",
    flow: ["Request", "Trace", "Logs", "Metrics", "Dashboard"],
    practicalUse: "장애 분석, 품질 모니터링, 비용 추적, 사용자 문제 재현",
    keyPoint: "운영 환경에서는 응답 하나보다 전체 흐름을 볼 수 있어야 합니다.",
    icon: BarChart3Icon,
  },
  {
    id: 9,
    title: "The Bitter Lesson",
    subtitle: "규칙만으로는 금방 한계가 온다",
    summary:
      "복잡한 규칙을 계속 쌓기보다, 모델 성능 향상과 학습 가능한 시스템을 활용하는 접근이 장기적으로 더 강하다는 관점입니다.",
    flow: ["Handcrafted Rules", "Limit Reached", "Learning-Based Adaptation"],
    practicalUse: "검색, 추천, 자연어 처리, 에이전트 성능 개선",
    keyPoint: "유연함과 학습 능력이 장기 경쟁력이 됩니다.",
    icon: BrainCircuitIcon,
  },
];
