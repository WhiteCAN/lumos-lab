import type { Metadata } from "next";
import Link from "next/link";
import { FolderTreeIcon } from "lucide-react";
import { CodeBlock, FlowSection, ReferencePage } from "@/components/reference-page";

export const metadata: Metadata = {
  title: "생성형 AI 프로젝트 구조 | Lumos Lab",
  description: "LLM 클라이언트, 프롬프트, RAG, 전처리, 추론과 평가의 책임을 분리하는 프로젝트 구조를 정리합니다.",
};

const modules = [
  ["config", "환경별 설정과 로깅", "model_config.yaml에는 모델 이름·호출 옵션을, logging_config.yaml에는 로그 수준·형식을 둡니다. API 키는 파일에 적지 않고 환경변수나 비밀 관리 도구로 주입하며 로그에서도 제외합니다."],
  ["data", "실행 중 생성되는 데이터", "cache/는 중간 결과, embeddings/는 임베딩 산출물, vector_db/는 로컬 검색 인덱스의 예시입니다. 외부 벡터 DB를 쓰면 로컬 폴더가 필요 없을 수 있습니다. 원문·청크·모델 버전과 갱신 기준을 함께 관리합니다."],
  ["core", "공통 모델 계약", "base_llm.py는 호출 입력·출력의 공통 계약, model_registry.py는 사용할 구현을 찾는 역할의 예시입니다. 여러 구현을 실제로 교체할 때 도입하고, 단일 공급자 앱에 추상 클래스나 레지스트리를 억지로 만들지 않습니다."],
  ["llm_clients", "모델 공급자별 어댑터", "openai_client.py, azure_client.py, bedrock_client.py 등에서 공급자별 인증·SDK·응답 차이를 처리합니다. 타임아웃과 제한된 재시도를 관리하고 결과를 공통 형식으로 변환합니다."],
  ["prompts", "프롬프트 템플릿과 조립", "역할·출력 형식·예시를 버전으로 관리합니다. 템플릿 변수와 응답 스키마를 함께 검증합니다."],
  ["rag", "수집·검색·근거 기반 답변 조율", "문서 저장과 검색, 컨텍스트 조립을 연결합니다. 단순 벡터 검색 호출과 전체 RAG 흐름은 구분합니다."],
  ["processing", "입력 정제와 청크 분할", "중복·불필요한 문자를 처리하고 문서를 검색 단위로 나눕니다. 원문 위치와 권한 메타데이터를 보존합니다."],
  ["inference", "모델 실행", "inference.py는 완성된 프롬프트와 생성 옵션을 받아 llm_clients를 통해 모델을 실행합니다. 검색과 근거 조립은 rag가 조율하고, HTTP 라우팅·인증은 별도 API 계층에서 처리하는 설계 예시입니다."],
  ["schemas", "데이터와 API 계약", "rag.py에는 질문·검색 근거·출처 포함 답변, inference.py에는 모델 실행 요청·응답의 필드와 타입을 정의할 수 있습니다. 스키마 검증은 형식 오류를 찾지만 답변의 사실성까지 보장하지는 않습니다."],
  ["evaluation", "검색 품질과 답변 품질 평가", "정답 근거 검색 여부와 답변의 근거 충실도를 별도로 측정합니다. 지연·비용·실패율도 기록합니다."],
  ["scripts", "반복 작업의 실행 도구", "run_setup.sh는 환경 준비, build_embeddings.py는 색인 구축, cleanup.py는 임시 데이터 정리의 예시입니다. 실제 처리 로직은 src를 재사용하고 삭제 범위·재실행 시 중복 처리를 명확히 합니다."],
  ["docs", "실행과 운영 지식", "README.md에는 목적·빠른 시작을, SETUP.md에는 환경변수 이름·설치·실행 절차를 적습니다. 데이터 준비, 평가 방법과 장애 대응도 코드 변경에 맞춰 갱신합니다."],
  ["루트 파일", "저장소와 실행 환경", ".gitignore는 비밀값·생성 데이터를 제외하고, requirements.txt는 Python 의존성을 명시합니다. Dockerfile은 이미지 빌드, docker-compose.yml은 앱과 저장소 등 여러 서비스의 실행 구성을 담당합니다."],
];

const tree = `genai-app/                     # 학습용 재구성 예시
├─ config/                     # 비밀값을 제외한 설정
├─ data/                       # cache/ · embeddings/ · vector_db/
├─ src/
│  ├─ core/                    # base_llm.py · model_registry.py
│  ├─ llm_clients/             # 모델 공급자 연동
│  ├─ prompts/                 # 버전 관리하는 템플릿
│  ├─ processing/              # 정제·청크 분할
│  ├─ rag/                     # 수집·검색·답변 조율
│  ├─ inference/               # 모델 실행·생성 옵션 처리
│  ├─ schemas/                 # 입력·출력 데이터 계약
│  └─ evaluation/              # 검색 지표·근거 충실도 평가
├─ tests/                      # 단위·통합·계약 테스트
├─ scripts/                    # 수집·인덱스 생성 등 작업
├─ docs/                       # 실행 방법과 설계 결정
├─ .env.example                # 환경변수 이름과 예시만
├─ .gitignore                  # 비밀값·생성 데이터 제외
├─ requirements.txt            # Python 의존성
├─ docker-compose.yml          # 필요할 때 여러 서비스 실행
└─ Dockerfile                  # 필요할 때 재현 가능한 실행 환경`;

export default function GenaiProjectStructurePage() {
  return (
    <ReferencePage breadcrumb="레퍼런스 / 생성형 AI 프로젝트 구조" label="GenAI · 책임과 변경 경계" title="생성형 AI 프로젝트 구조"
      description="모델 호출이 동작한 뒤에는 프롬프트, 검색, 전처리, API, 평가가 각자 바뀔 수 있어야 합니다. 폴더 이름보다 중요한 것은 책임의 경계와 데이터가 이동하는 흐름입니다."
      icon={FolderTreeIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
      <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">원문의 핵심: 바뀌는 이유에 따라 나누기</h2><p className="mt-3 text-sm leading-6">모델 공급자를 바꾸는 일, 문서를 나누는 기준을 바꾸는 일, 프롬프트를 개선하는 일은 서로 다른 변경입니다. 이를 한 파일에서 처리하면 작은 수정도 전체 흐름에 영향을 줍니다. 원문은 모델 연동·프롬프트·RAG·전처리·추론·평가·배포의 경계를 제안합니다.</p></section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="모듈별 책임">{modules.map(([name, title, text]) => (
        <article key={name} className="rounded-lg border bg-card p-4 shadow-sm"><p className="text-xs font-medium text-sky-700 dark:text-sky-300">{name}</p><h2 className="mt-2 text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>
      ))}</section>
      <CodeBlock title="폴더 지도 · 원문을 바탕으로 재구성한 예시" code={tree} />
      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">헷갈리는 경계 · 작업 순서와 모델 호출은 다릅니다</h2>
        <p className="mt-3 text-sm leading-6">rag/ingestion.py는 문서 읽기 → processing의 정제·분할 → 임베딩 → vector_store.py의 저장을 연결합니다. retriever.py는 질문에 맞는 근거를 찾고, answer.py는 검색 결과와 prompts/templates.py를 조합한 뒤 inference를 호출합니다. processing은 검색이나 답변 생성을 직접 맡지 않습니다.</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">이미지의 prompts/chains.py는 템플릿을 연결하는 예시입니다. 검색·재시도까지 포함한 전체 작업 흐름이라면 rag 또는 별도 조율 모듈에 두는 편이 책임이 명확합니다. 폴더 이름은 표준이 아니며, 아래 설명은 이미지의 역할 구분을 구체화한 설계 예시입니다.</p>
      </section>
      <FlowSection title="문서 등록 경로 · 질문 전에 준비" steps={[{ label: "문서 수집", icon: "document" }, { label: "정제·청크 분할", icon: "code" }, { label: "임베딩 생성", icon: "model" }, { label: "메타데이터와 검색 인덱스 저장", icon: "database" }]} colorClass="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20" />
      <FlowSection title="질문 처리 경로 · 사용자 요청마다 실행" steps={[{ label: "API 입력·권한 확인", icon: "verify" }, { label: "관련 근거 검색", icon: "search" }, { label: "프롬프트 조립", icon: "document" }, { label: "LLM 호출", icon: "model" }, { label: "출력 검증·근거와 응답", icon: "done" }]} colorClass="border-violet-200 bg-violet-50/40 dark:border-violet-900/60 dark:bg-violet-950/20" />
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">한 요청으로 따라가기 · 반품 규정 질문</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6">
            <li>API에서 사용자 권한을 확인하고 schemas로 question과 문서 범위를 검증합니다. 빈 질문은 모델 호출 전에 입력 오류로 반환합니다.</li>
            <li>retriever가 접근 가능한 문서에서 청크를 찾습니다. 각 근거에는 document_id, chunk_id, 원문 위치를 유지합니다.</li>
            <li>answer가 근거와 질문을 템플릿에 넣습니다. 문서 안의 지시는 실행 명령이 아닌 자료로 취급합니다.</li>
            <li>inference가 llm_clients를 호출하고, 결과를 answer와 sources 필드로 구성합니다. 근거가 없으면 답변 불가를 명시하며 출처를 만들어내지 않습니다.</li>
            <li>타임아웃·호출 제한은 오류로 구분합니다. 검색 결과 없음과 공급자 장애를 같은 정상 답변으로 감추지 않습니다.</li>
          </ol>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">평가 예시 · 검색 실패와 생성 실패 분리</h2>
          <p className="mt-3 text-sm leading-6">평가 질문의 정답 근거가 2개이고 상위 5개 검색 결과에 그중 1개가 있으면 Recall@5는 1/2입니다. 첫 관련 근거가 3위라면 그 질문의 reciprocal rank는 1/3이며, 여러 질문의 평균이 MRR입니다.</p>
          <p className="mt-3 text-sm leading-6">faithfulness는 답변의 주장이 제공된 근거로 뒷받침되는지를 평가합니다. 원문 자체가 오래되거나 틀릴 수 있으므로 사실 정확성과 동일하지 않습니다. 모델 기반 채점에는 오차가 있어 사람의 검토와 함께 사용합니다.</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">분할 기준·임베딩 모델을 바꾸면 호환되는 색인을 다시 준비하고 같은 평가 질문으로 비교합니다. 프롬프트·모델·데이터 버전, 지연과 비용도 기록해야 개선 원인을 추적할 수 있습니다.</p>
        </article>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">어디를 테스트할까?</h2><ul className="mt-3 grid gap-2 text-sm leading-6"><li>전처리: 빈 문서·중복·긴 문장에서 청크와 출처가 유지되는지 확인합니다.</li><li>모델 연동: 타임아웃, 제한 응답, 잘못된 출력 스키마를 가짜 클라이언트로 재현합니다.</li><li>RAG: 고정 질문으로 필요한 근거가 검색되는지, 없는 근거를 꾸며내지 않는지 평가합니다.</li><li>API: 입력 오류와 접근 불가 문서를 차단하고 실패 응답을 명확히 반환하는지 확인합니다.</li></ul></article>
        <article className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">작게 시작하는 기준</h2><ul className="mt-3 grid gap-2 text-sm leading-6"><li>처음에는 API, 모델 호출, 프롬프트, 테스트 정도의 경계로 시작할 수 있습니다.</li><li>외부 문서가 필요한 시점에 수집·전처리·검색 모듈을 추가합니다.</li><li>실제 데이터·캐시·벡터 인덱스와 비밀값은 소스 저장소에 넣지 않습니다.</li><li>Docker 파일만으로 재현성이 완성되지는 않습니다. 의존성·모델·프롬프트·인덱스 버전도 기록합니다.</li></ul></article>
      </section>
      <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">Lumos Lab에서 연결해서 보기</h2><p className="mt-3 text-sm leading-6">이 구조는 Python 기반 GenAI 앱을 이해하기 위한 예시이며, 현재 저장소의 폴더를 바꾸는 제안은 아닙니다. Lumos Lab의 frontend는 사용자 화면, backend는 API와 처리 흐름이라는 기존 경계를 유지합니다.</p><div className="mt-3 flex flex-wrap gap-4 text-sm"><Link className="underline underline-offset-4" href="/llm-app-structure">LLM 애플리케이션 구조</Link><Link className="underline underline-offset-4" href="/rag/concepts">RAG 개념과 아키텍처</Link><Link className="underline underline-offset-4" href="/project-structure">일반 프로젝트 구조</Link></div></section>
      <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">출처와 보완 범위</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">사용자가 제공한 gauravgoyalai의 “Generative AI Project Structure” 이미지에서 13개 영역과 대표 파일을 확인해 보완했습니다. 새로 공유된 릴스의 영상·음성·캡션은 확인하지 못했습니다. 요청 예시, 오류 처리, 평가 계산과 책임 경계 해설은 학습용 보완이며, 이 폴더 구성만으로 운영 준비가 완료되는 것은 아닙니다.</p><ul className="mt-3 grid gap-2 text-sm"><li><a className="underline underline-offset-4" href="https://www.instagram.com/reels/Ddp1kd8x8YL/">이번에 공유된 릴스 · 첨부 이미지 기준 보완</a></li><li><a className="underline underline-offset-4" href="https://www.instagram.com/reels/DcQvJsnJXYB/">기존 페이지에 등록된 출처</a></li></ul></section>
    </ReferencePage>
  );
}
