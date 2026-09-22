import Link from "next/link";
import { FolderTreeIcon } from "lucide-react";
import { CodeBlock, FlowSection, ReferencePage } from "@/components/reference-page";

import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/genai-project-structure");

const modules = [
  ["core / llm_clients", "설정·공통 계약과 모델 공급자 연동", "모델 호출, 타임아웃, 재시도, 응답 형식을 이 경계에서 관리합니다. 업무 규칙을 특정 공급자 SDK에 직접 결합하지 않습니다."],
  ["prompts", "프롬프트 템플릿과 조립", "역할·출력 형식·예시를 버전으로 관리합니다. 템플릿 변수와 응답 스키마를 함께 검증합니다."],
  ["rag", "수집·검색·근거 기반 답변 조율", "문서 저장과 검색, 컨텍스트 조립을 연결합니다. 단순 벡터 검색 호출과 전체 RAG 흐름은 구분합니다."],
  ["processing", "입력 정제와 청크 분할", "중복·불필요한 문자를 처리하고 문서를 검색 단위로 나눕니다. 원문 위치와 권한 메타데이터를 보존합니다."],
  ["inference / pipelines", "요청 진입점과 실행 흐름", "입력을 검증하고 검색·모델 호출을 연결합니다. API 처리와 긴 문서 수집 작업의 실행 경로는 분리할 수 있습니다."],
  ["evaluation", "검색 품질과 답변 품질 평가", "정답 근거 검색 여부와 답변의 근거 충실도를 별도로 측정합니다. 지연·비용·실패율도 기록합니다."],
];

const tree = `genai-app/                     # 학습용 재구성 예시
├─ config/                     # 비밀값을 제외한 설정
├─ src/
│  ├─ core/                    # 공통 설정·계약
│  ├─ llm_clients/             # 모델 공급자 연동
│  ├─ prompts/                 # 버전 관리하는 템플릿
│  ├─ processing/              # 정제·청크 분할
│  ├─ rag/                     # 수집·검색·답변 조율
│  ├─ inference/               # API 진입점·모델 실행
│  └─ pipelines/               # 여러 단계를 연결하는 흐름
├─ evaluation/                 # 평가 데이터와 지표 계산
├─ tests/                      # 단위·통합·계약 테스트
├─ scripts/                    # 수집·인덱스 생성 등 작업
├─ docs/                       # 실행 방법과 설계 결정
├─ .env.example                # 환경변수 이름과 예시만
└─ Dockerfile                  # 필요할 때 재현 가능한 실행 환경`;

export default function GenaiProjectStructurePage() {
  return (
    <ReferencePage pageHref="/genai-project-structure" label="GenAI · 책임과 변경 경계"
      description="모델 호출이 동작한 뒤에는 프롬프트, 검색, 전처리, API, 평가가 각자 바뀔 수 있어야 합니다. 폴더 이름보다 중요한 것은 책임의 경계와 데이터가 이동하는 흐름입니다."
      icon={FolderTreeIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
      <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">원문의 핵심: 바뀌는 이유에 따라 나누기</h2><p className="mt-3 text-sm leading-6">모델 공급자를 바꾸는 일, 문서를 나누는 기준을 바꾸는 일, 프롬프트를 개선하는 일은 서로 다른 변경입니다. 이를 한 파일에서 처리하면 작은 수정도 전체 흐름에 영향을 줍니다. 원문은 모델 연동·프롬프트·RAG·전처리·추론·평가·배포의 경계를 제안합니다.</p></section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="모듈별 책임">{modules.map(([name, title, text]) => (
        <article key={name} className="rounded-lg border bg-card p-4 shadow-sm"><p className="text-xs font-medium text-sky-700 dark:text-sky-300">{name}</p><h2 className="mt-2 text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>
      ))}</section>
      <CodeBlock title="폴더 지도 · 원문을 바탕으로 재구성한 예시" code={tree} />
      <FlowSection title="문서 등록 경로 · 질문 전에 준비" steps={[{ label: "문서 수집", icon: "document" }, { label: "정제·청크 분할", icon: "code" }, { label: "임베딩 생성", icon: "model" }, { label: "메타데이터와 검색 인덱스 저장", icon: "database" }]} colorClass="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20" />
      <FlowSection title="질문 처리 경로 · 사용자 요청마다 실행" steps={[{ label: "API 입력·권한 확인", icon: "verify" }, { label: "관련 근거 검색", icon: "search" }, { label: "프롬프트 조립", icon: "document" }, { label: "LLM 호출", icon: "model" }, { label: "출력 검증·근거와 응답", icon: "done" }]} colorClass="border-violet-200 bg-violet-50/40 dark:border-violet-900/60 dark:bg-violet-950/20" />
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">어디를 테스트할까?</h2><ul className="mt-3 grid gap-2 text-sm leading-6"><li>전처리: 빈 문서·중복·긴 문장에서 청크와 출처가 유지되는지 확인합니다.</li><li>모델 연동: 타임아웃, 제한 응답, 잘못된 출력 스키마를 가짜 클라이언트로 재현합니다.</li><li>RAG: 고정 질문으로 필요한 근거가 검색되는지, 없는 근거를 꾸며내지 않는지 평가합니다.</li><li>API: 입력 오류와 접근 불가 문서를 차단하고 실패 응답을 명확히 반환하는지 확인합니다.</li></ul></article>
        <article className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">작게 시작하는 기준</h2><ul className="mt-3 grid gap-2 text-sm leading-6"><li>처음에는 API, 모델 호출, 프롬프트, 테스트 정도의 경계로 시작할 수 있습니다.</li><li>외부 문서가 필요한 시점에 수집·전처리·검색 모듈을 추가합니다.</li><li>실제 데이터·캐시·벡터 인덱스와 비밀값은 소스 저장소에 넣지 않습니다.</li><li>Docker 파일만으로 재현성이 완성되지는 않습니다. 의존성·모델·프롬프트·인덱스 버전도 기록합니다.</li></ul></article>
      </section>
      <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">Lumos Lab에서 연결해서 보기</h2><p className="mt-3 text-sm leading-6">이 구조는 Python 기반 GenAI 앱을 이해하기 위한 예시이며, 현재 저장소의 폴더를 바꾸는 제안은 아닙니다. Lumos Lab의 frontend는 사용자 화면, backend는 API와 처리 흐름이라는 기존 경계를 유지합니다.</p><div className="mt-3 flex flex-wrap gap-4 text-sm"><Link className="underline underline-offset-4" href="/llm-app-structure">LLM 애플리케이션 구조</Link><Link className="underline underline-offset-4" href="/rag/concepts">RAG·CAG·MAG·GAG 비교</Link><Link className="underline underline-offset-4" href="/project-structure">프론트엔드·백엔드 프로젝트 구조</Link></div></section>
      <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">출처</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">게시물 캡션과 도표의 책임 구분을 한국어로 정리했습니다. 폴더 트리·검증 항목·Lumos Lab 연결 설명은 학습용 재구성입니다.</p><a className="mt-3 inline-block text-sm underline underline-offset-4" href="https://www.instagram.com/reels/DcQvJsnJXYB/">원문 · gauravgoyalai의 Generative AI Project Structure</a></section>
    </ReferencePage>
  );
}
