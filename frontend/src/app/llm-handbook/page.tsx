import { BotIcon } from "lucide-react";
import { ReferencePage, FlowSection, CodeBlock } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/llm-handbook");
const topics = [
  ["모델과 토큰", "문자열을 모델이 사용하는 토큰 ID로 바꿉니다. 토큰 수는 언어·토크나이저에 따라 달라지므로 단어 수와 고정 비율로 환산하지 않습니다.", "/ai-concepts"],
  ["Transformer", "Attention은 문맥의 다른 위치를 참고해 표현을 갱신합니다. 원 논문의 encoder-decoder 구조와 decoder-only 생성 모델을 구분합니다.", "/ai-concepts"],
  ["임베딩과 문맥", "입력 토큰 임베딩과 문서 검색 임베딩은 용도가 다릅니다. 문맥 창은 입력·생성에 쓰는 길이 제약이며 임베딩 차원과 다릅니다.", "/rag/vector-search"],
  ["사전 학습", "대규모 데이터로 예측 손실을 줄여 가중치를 학습합니다. 데이터 품질·중복·라이선스·평가 오염을 함께 관리합니다.", "/ai-concepts"],
  ["SFT·LoRA·QLoRA", "SFT는 지시와 답변 예시로 학습합니다. LoRA는 저랭크 업데이트를 학습하고 QLoRA는 양자화된 기반 모델을 활용합니다. 필요한 VRAM은 모델 크기만으로 결정되지 않습니다.", "/llm-app-structure"],
  ["RLHF·PPO·DPO", "선호 데이터를 사용하는 정렬 방법입니다. 대표 RLHF는 보상 모델과 강화 학습을 사용하며 DPO는 선호 쌍으로 직접 목적함수를 최적화합니다. 어느 쪽도 진실성·안전을 보장하지 않습니다.", "/ai-concepts"],
  ["프롬프트와 디코딩", "목표·입력 경계·출력 형식·예시를 명시합니다. temperature는 후보 분포의 집중도를, top-p·top-k는 후보 선택 범위를 조절합니다. 낮은 온도가 사실 정확성을 보장하지 않습니다.", "/llm-app-structure"],
  ["RAG와 벡터 검색", "질문에 필요한 자료를 검색해 답변 근거로 제공합니다. 청킹·검색·재정렬·인용을 따로 평가하며 검색했다고 항상 정답을 만드는 것은 아닙니다.", "/rag/concepts"],
  ["Agent와 도구", "모델이 제안한 도구 호출을 애플리케이션이 검증·실행합니다. 실행 횟수·시간·권한을 제한하고 외부 자료의 지시를 권한으로 취급하지 않습니다.", "/ai-agent-patterns"],
  ["평가와 보안", "업무별 고정 평가셋에서 정확성·근거·거절·도구 성공·비용을 측정합니다. 프롬프트 주입은 문자열 필터만으로 해결되지 않으며 비밀 분리와 도구 권한 통제가 필요합니다.", "/rag/ask"],
  ["추론 최적화", "양자화·KV cache·배칭은 서로 다른 자원을 줄입니다. 지연·처리량·메모리·품질을 함께 측정하고 최대 문맥·동시 요청에서 확인합니다.", "/llm-app-structure"],
  ["프로젝트와 학습 순서", "작은 문서 검색 → 근거 답변 → 평가셋 → 제한된 도구 실행 순서로 확장합니다. 공개 가중치가 곧 무제한 사용 라이선스를 뜻하지 않습니다. 취업 기간·연봉·AGI 시점은 보장할 수 없습니다.", "/genai-project-structure"],
];
export default function LlmHandbookPage() {
  return <ReferencePage pageHref="/llm-handbook" label="LLM 학습 지도" icon={BotIcon} colorClass="bg-violet-50/50 dark:bg-violet-950/20" description="20장 원문의 큰 주제를 학습 질문으로 재구성했습니다. 상세 RAG·에이전트 문서를 연결하고 확률 계산 한 부분을 실제 Java API로 실험합니다.">
    <FlowSection title="생성 모델의 개념적 경로" steps={["입력·토큰화", "Transformer 계산", "후보 logits", "디코딩·출력"]} />
    <div className="grid gap-4 lg:grid-cols-3">{topics.map(([title,text,href])=><article key={title} className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-7">{text}</p><a className="mt-3 inline-block text-sm underline" href={href}>관련 상세 페이지</a></article>)}</div>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-xl font-semibold">Temperature 실습 · 모델을 호출하지 않는 수학 계산</h2><p className="mt-3 text-sm leading-7">logits=[2,1,0]에 temperature=1과 0.5를 비교하세요. 온도를 낮추면 높은 점수의 확률이 더 집중됩니다. 같은 점수 [1,1,1]은 온도를 바꿔도 균등합니다. 0은 이 실습에서 400이며 일부 서비스의 temperature=0 특별 동작과는 다릅니다. 출력 확률은 다음 후보 선택용 분포이고 답변이 사실일 확률이 아닙니다.</p></section>
    <CodeBlock title="Java · 수치적으로 안정적인 softmax" code={`double max = Collections.max(logits);
var weights = logits.stream()
    .map(v -> Math.exp((v - max) / temperature)).toList();
double sum = weights.stream().mapToDouble(Double::doubleValue).sum();
var probabilities = weights.stream().map(v -> v / sum).toList();`} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-xl font-semibold">원문의 수치·일반화 보완</h2><p className="mt-3 text-sm leading-7">확인되지 않은 모델 파라미터 추정, GPU 비용·연봉, 고정 학습 기간, 미래 예측은 기준값으로 싣지 않았습니다. DPO가 항상 우월하다거나 RAG가 환각을 없앤다는 주장도 일반화하지 않습니다. 오래된 프레임워크 import 예제를 현재 실행 코드로 재사용하지 않습니다.</p><div className="mt-4 flex flex-wrap gap-4 text-sm underline"><a href="https://www.instagram.com/p/DdjbVVblt_Y/">9번 원문 · 20장 도표 확인</a><a href="https://arxiv.org/abs/1706.03762">Transformer 논문</a><a href="https://arxiv.org/abs/2305.18290">DPO 논문</a><a href="https://arxiv.org/abs/2005.11401">RAG 논문</a></div></section>
  </ReferencePage>;
}
