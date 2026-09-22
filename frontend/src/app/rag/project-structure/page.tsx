import Link from "next/link";
import { FolderTreeIcon } from "lucide-react";
import { ReferencePage, CodeBlock, FlowSection, ComparisonTable } from "@/components/reference-page";

import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/rag/project-structure");

const tree = `rag-project/                  # 원문을 바탕으로 재구성한 Python 예시
├─ README.md                   # 목적·설치·실행 방법
├─ requirements.txt            # Python 의존성
├─ .env.example                # 값이 없는 환경변수 예시 (보완)
├─ .gitignore                  # 실제 .env·로그·생성 파일 제외
├─ config.yaml                 # 모델·분할·검색 설정 (비밀값 제외)
├─ src/
│  ├─ ingestion/loader.py      # 원문 읽기·표준화
│  ├─ chunking/chunker.py      # 검색 단위로 분할
│  ├─ embeddings/embedder.py   # 문서·질문 벡터화
│  ├─ vectorstore/vector_store.py # 저장·검색 제공자 연동
│  ├─ retrieval/retriever.py   # 필터·검색·근거 선택
│  ├─ prompts/prompt_templates.py # 질문과 근거 조립
│  ├─ llm/llm_client.py        # 생성 모델 호출
│  ├─ api/routes.py            # 요청·응답 경계
│  └─ utils/helpers.py         # 작은 공통 도구
├─ tests/test_app.py           # 테스트와 품질 확인
├─ logs/app.log               # 실행 중 생성, 커밋 제외
└─ main.py                    # 앱 구성과 실행 진입점`;

const modules = [
  ["ingestion", "원문 → 표준 문서", "PDF·CSV·웹 문서 등을 읽고 텍스트와 문서 ID·출처·버전을 보존합니다. 읽기 실패와 중복 수집을 다룹니다."],
  ["chunking", "문서 → 청크", "검색에 적합한 길이로 분할합니다. 청크 ID·원문 위치·접근 권한을 함께 보존해 답변 출처와 권한 필터에 사용합니다."],
  ["embeddings", "텍스트 → 벡터", "문서와 질문을 호환되는 임베딩 공간에 표현합니다. 모델·차원·전처리 버전을 기록하고 변경 시 재색인을 검토합니다."],
  ["vectorstore", "벡터·메타데이터 ↔ 저장소", "저장·갱신·삭제·유사도 조회를 감쌉니다. Chroma·Pinecone 같은 제공자와 FAISS 같은 검색 라이브러리는 운영 책임이 다릅니다."],
  ["retrieval", "질문 → 선택한 근거", "권한 필터와 검색 조건을 적용해 관련 청크를 고릅니다. 필요하면 하이브리드 검색·재정렬을 추가하고 근거 부족을 구분합니다."],
  ["prompts", "질문·근거 → 모델 입력", "템플릿과 출력 형식을 관리합니다. 검색 문서는 신뢰된 명령이 아닌 참고 자료로 구분하고 문맥 길이 예산을 적용합니다."],
  ["llm", "모델 입력 → 생성 결과", "공급자 API 호출·타임아웃·재시도·응답 형식을 관리합니다. 생성 성공과 답변의 사실성은 별도로 평가합니다."],
  ["api / main / utils", "외부 요청과 모듈 연결", "API는 입력 검증·인증·오류 응답을, main은 구성과 실행을 담당합니다. utils에 검색·업무 규칙까지 몰아넣지 않습니다."],
];

export default function RagProjectStructurePage() {
  return <ReferencePage pageHref="/rag/project-structure" label="폴더 책임 · 색인 준비 · 질문 처리"
    description="문서를 검색 가능한 근거로 만드는 과정과 질문에 답하는 과정을 분리하고, 각 모듈이 주고받는 데이터를 기준으로 구조를 읽습니다."
    icon={FolderTreeIcon} colorClass="border-teal-200 bg-teal-50/50 dark:border-teal-900/60 dark:bg-teal-950/20">
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">폴더 이름보다 책임과 경계</h2><p className="mt-2 text-sm leading-6">원문은 Python RAG 앱의 폴더 구성 예시입니다. 정해진 표준이나 모든 프로젝트에 필요한 최소 구조는 아닙니다. 작은 앱은 파일 몇 개로 시작하고, 교체·테스트·운영할 책임이 달라질 때 나눌 수 있습니다. 이 페이지는 구조를 설명하며 Lumos Lab의 Java·Next.js 폴더를 변경하지 않습니다.</p></section>
    <CodeBlock title="폴더 지도 · 실제 저장소 구조와 구분되는 학습 예시" code={tree} />
    <p className="text-sm leading-6 text-muted-foreground">원문의 .env는 비밀값을 담는 로컬 설정입니다. 예시 트리에는 공유 가능한 .env.example을 표시했습니다. 실제 비밀값과 실행 로그는 Git에 넣지 않습니다. 반복되는 __init__.py 표기는 간략히 생략했습니다.</p>
    <section className="grid gap-4 lg:grid-cols-2" aria-label="RAG 모듈별 책임">{modules.map(([name,contract,body])=><article key={name} className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">{name}</h2><p className="mt-1 text-sm font-medium text-teal-700 dark:text-teal-300">{contract}</p><p className="mt-3 text-sm leading-6">{body}</p></article>)}</section>
    <section><h2 className="mb-3 text-xl font-semibold">색인 준비와 질문 처리는 다른 실행 경로</h2><div className="grid gap-4 xl:grid-cols-2">
      <FlowSection orientation="vertical" title="색인 · 문서가 추가·변경될 때" steps={[{label:"원문 수집",icon:"document",detail:"ingestion"},{label:"청크와 메타데이터 생성",icon:"branch",detail:"chunking"},{label:"문서 임베딩",icon:"model",detail:"embeddings"},{label:"벡터·청크 연결 저장",icon:"database",detail:"vectorstore"},{label:"색인 버전·완료 기록",icon:"verify",detail:"운영 보완 단계"}]} />
      <FlowSection orientation="vertical" title="질문 · 사용자 요청이 들어올 때" steps={[{label:"질문·권한 확인",icon:"user",detail:"api"},{label:"질문 임베딩·근거 검색",icon:"search",detail:"embeddings + retrieval"},{label:"질문과 근거 조립",icon:"document",detail:"prompts"},{label:"답변 생성",icon:"model",detail:"llm"},{label:"출처와 함께 응답",icon:"done",detail:"api"}]} />
    </div><p className="mt-3 text-sm leading-6 text-muted-foreground">위 질문 흐름은 벡터 기반 RAG 예시입니다. 매 질문마다 전체 문서를 다시 임베딩하지 않습니다. 근거가 부족하면 추가 조회나 답변 보류를 선택하고, 검색된 자료가 곧 정답이라고 가정하지 않습니다.</p></section>
    <ComparisonTable columns={["확인할 계약", "테스트·운영 포인트"]} rows={[
      {topic:"문서 → 청크",values:["문서 ID, 청크 ID, 위치, 버전, 권한","중복·빈 문서·분할 경계와 출처 보존"]},
      {topic:"임베딩 → 저장소",values:["모델·차원·색인 버전, 청크 연결","모델 변경, 삭제 반영, 실패 후 재실행"]},
      {topic:"검색 → 프롬프트",values:["관련 청크, 점수, 출처, 권한 필터","정답 근거 회수 여부와 문맥 길이 제한"]},
      {topic:"모델 → API",values:["답변, 인용, 실패·근거 부족 상태","근거 충실도, 응답 형식, 지연·비용"]},
    ]} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">폴더를 나눈 뒤에도 필요한 설계</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6"><li>문서 삭제·수정 시 오래된 청크가 검색되지 않도록 색인 갱신 규칙을 정합니다.</li><li>긴 색인 작업은 질문 요청과 실행 자원을 분리할 수 있습니다.</li><li>검색 평가와 답변 평가를 나누고 실제 질문·정답 근거로 회귀를 확인합니다.</li><li>로그에는 추적에 필요한 정보만 남기고 원문·질문·개인정보의 보관 범위를 정합니다.</li></ul></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 함께 읽기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">softwaredeveloper_077의 RAG Project Structure Example을 재구성했습니다. 메타데이터·권한·버전·평가 기준과 두 실행 경로는 학습용 보완입니다.</p><ul className="mt-3 space-y-2 text-sm"><li><a className="underline" href="https://www.instagram.com/reels/DdUEInPyVVE/">원문 · RAG Project Structure Example</a></li><li><a className="underline" href="https://docs.langchain.com/oss/python/deepagents/retrieval">LangChain · Retrieval 구성 요소</a></li><li><Link className="underline" href="/genai-project-structure">생성형 AI 프로젝트 구조</Link></li><li><Link className="underline" href="/rag/architecture-comparison">RAG 구조 비교: Classic·Graph·Agentic</Link></li><li><Link className="underline" href="/rag/documents">RAG 문서 등록</Link></li><li><Link className="underline" href="/rag/ask">RAG 질문·답변</Link></li></ul></section>
  </ReferencePage>;
}
