import Link from "next/link";
import { FolderTreeIcon } from "lucide-react";
import { ReferencePage, CodeBlock, ComparisonTable, FlowSection } from "@/components/reference-page";

import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/fastapi-project-structure");
const tree = `fastapi_project/             # 원문 기반 학습 예시
├─ app/
│  ├─ __init__.py
│  ├─ main.py                 # 앱 생성·라우터 등록
│  ├─ core/
│  │  ├─ config.py            # 환경별 설정
│  │  └─ security.py          # 인증 관련 도구
│  ├─ api/
│  │  ├─ deps.py              # 세션·현재 사용자 등 의존성
│  │  └─ v1/endpoints/
│  │     ├─ auth.py
│  │     ├─ users.py
│  │     └─ products.py
│  ├─ db/
│  │  ├─ session.py           # 엔진·세션 구성
│  │  └─ base.py              # ORM 공통 기반
│  ├─ models/                 # ORM 저장 모델
│  │  ├─ user.py
│  │  └─ product.py
│  ├─ schemas/                # Pydantic 요청·응답 모델
│  │  ├─ user.py
│  │  └─ product.py
│  ├─ services/
│  │  ├─ user_service.py
│  │  └─ product_service.py
│  └─ utils/helpers.py
├─ tests/
│  ├─ test_users.py
│  └─ test_products.py
├─ .env.example               # 값 없는 설정 예시 (보완)
├─ .gitignore
├─ requirements.txt
└─ README.md`;
const modules = [
  ["app / main.py", "조립과 시작", "FastAPI 앱을 생성하고 APIRouter를 등록합니다. 앱 수명에 필요한 자원과 공통 처리를 연결합니다."],
  ["core", "설정과 인증 기반", "설정 읽기와 토큰·암호 처리 같은 공통 기능을 둡니다. 비밀값은 코드에 넣지 않고, 업무별 접근 권한은 해당 처리 경계에서도 확인합니다."],
  ["api / deps", "HTTP 경계와 의존성", "라우터는 경로·입력·상태 코드·응답 계약을 정의합니다. Depends로 세션이나 현재 사용자를 제공합니다. 요청 처리에 업무 규칙을 과도하게 쌓지 않습니다."],
  ["db", "연결과 세션 수명", "엔진·세션 생성과 정리를 구성합니다. 세션 종료와 트랜잭션 커밋은 다른 책임이므로 성공·실패 시점을 명시합니다."],
  ["models", "저장 모델", "SQLAlchemy를 사용한다면 테이블·열·관계 매핑을 둡니다. FastAPI가 특정 ORM을 필수로 요구하는 것은 아닙니다."],
  ["schemas", "외부 데이터 계약", "Pydantic으로 요청과 응답 필드를 선언합니다. 저장 모델을 그대로 공개하지 않고 비밀번호 해시 같은 내부 필드를 응답에서 제외합니다."],
  ["services", "업무 처리", "가격·상태 전이·중복 검사 같은 업무 규칙과 작업 순서를 관리합니다. 필요할 때 저장 접근을 별도 모듈로 나눌 수 있습니다."],
  ["utils / tests", "작은 공통 도구와 검증", "utils에는 책임이 명확한 작은 함수를 둡니다. tests에서는 업무 규칙과 실제 HTTP·DB 연동을 서로 다른 수준에서 확인합니다."],
];

export default function FastApiProjectStructurePage() {
  return <ReferencePage pageHref="/fastapi-project-structure" label="폴더 책임 · 데이터 계약 · 요청 흐름" description="라우터는 HTTP 계약을, 서비스는 업무 규칙을, 스키마는 외부 데이터 형태를 맡도록 책임을 나누는 Python 백엔드 예시입니다." icon={FolderTreeIcon} colorClass="border-teal-200 bg-teal-50/50 dark:border-teal-900/60 dark:bg-teal-950/20">
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">구조는 필요에 맞춰 나눕니다</h2><p className="mt-2 text-sm leading-6">Smart Coder Hacker의 구조를 학습용으로 재구성했습니다. FastAPI의 필수 폴더 규칙은 아니며 작은 앱은 더 단순하게 시작할 수 있습니다. 원문의 실제 .env 대신 공유 가능한 .env.example을 표시했습니다. 반복되는 패키지 초기화 파일은 일부 생략했습니다.</p></section>
    <CodeBlock title="폴더 지도 · SQLAlchemy와 Pydantic을 구분한 예시" code={tree} />
    <section className="grid gap-4 lg:grid-cols-2" aria-label="FastAPI 모듈별 책임">{modules.map(([name,role,body])=><article key={name} className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">{name}</h2><p className="mt-1 text-sm font-medium text-teal-700 dark:text-teal-300">{role}</p><p className="mt-3 text-sm leading-6">{body}</p></article>)}</section>
    <ComparisonTable columns={["책임", "사용자 생성 예시"]} rows={[
      {topic:"요청 스키마",values:["입력 형태·타입·필드 제약","UserCreate: 이메일, 입력 비밀번호"]},
      {topic:"서비스",values:["업무 규칙·작업 순서","가입 허용 여부, 중복 처리, 비밀번호 해싱"]},
      {topic:"ORM 모델",values:["저장 구조와 DB 매핑","User: ID, 이메일, password_hash"]},
      {topic:"응답 스키마",values:["공개할 응답 필드","UserRead: ID, 이메일 (비밀번호 제외)"]},
    ]} />
    <section><h2 className="mb-3 text-xl font-semibold">요청이 통과하는 경계</h2><div className="grid gap-4 xl:grid-cols-2">
      <FlowSection orientation="vertical" title="정상 입력 · 사용자 생성 예시" steps={[{label:"HTTP 요청",icon:"user"},{label:"입력·인증 의존성 확인",icon:"verify"},{label:"라우터 → 서비스",icon:"server"},{label:"업무 검사·DB 저장",icon:"database"},{label:"공개 스키마로 응답",icon:"done"}]} />
      <FlowSection orientation="vertical" title="입력 검증 실패 · 형식 오류 예시" steps={[{label:"HTTP 요청",icon:"user"},{label:"요청 스키마 검증 실패",icon:"verify"},{label:"엔드포인트 함수 미실행",icon:"branch"},{label:"검증 오류 응답",icon:"document",detail:"기본 처리에서 422"}]} />
    </div><p className="mt-3 text-sm leading-6 text-muted-foreground">개념 흐름이며 의존성 실행과 검증 전체의 엄격한 순서를 나타내지는 않습니다. 입력 오류라도 일부 의존성이 실행될 수 있으므로 의존성에 업무 쓰기 작업을 넣지 않도록 주의합니다. 응답 검증 실패는 요청 입력 오류와 다른 서버 측 문제입니다.</p></section>
    <section className="grid gap-4 lg:grid-cols-2"><article className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">세션 주입과 트랜잭션</h2><p className="mt-3 text-sm leading-6">yield 의존성은 자원 제공 후 정리 코드를 실행하는 데 활용합니다. close만 호출한다고 업무 처리가 커밋되는 것은 아닙니다. 커밋·롤백 책임과 예외 전파를 정하고 테스트에서도 실패 시 변경이 남지 않는지 확인합니다.</p></article><article className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">async def만으로 비동기가 되지는 않습니다</h2><p className="mt-3 text-sm leading-6">비동기 엔드포인트에서 동기 DB 드라이버나 블로킹 함수를 직접 호출하면 이벤트 루프를 막을 수 있습니다. 사용하는 라이브러리의 I/O 방식에 맞춰 동기·비동기 실행 방식을 선택합니다.</p></article></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">테스트할 계약</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6"><li>필수 입력 누락·잘못된 형식과 인증·권한 실패의 응답을 구분합니다.</li><li>동시 요청의 중복은 애플리케이션 조회뿐 아니라 DB 제약으로도 다룹니다.</li><li>응답에 비밀번호·해시·내부 관리 필드가 포함되지 않는지 확인합니다.</li><li>테스트용 의존성·DB를 사용하고 각 테스트의 데이터를 격리합니다.</li></ul></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 함께 읽기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">원문의 폴더별 역할을 한국어로 정리하고 모델·스키마 구분, 세션 수명과 실패 경로를 보완했습니다. 이 페이지는 학습 자료이며 저장소의 Spring Boot 백엔드를 FastAPI로 변경하지 않습니다.</p><ul className="mt-3 space-y-2 text-sm"><li><a className="underline" href="https://www.instagram.com/reels/DdaXb-hPTT6/">원문 · Python FastAPI Backend Structure</a></li><li><a className="underline" href="https://fastapi.tiangolo.com/tutorial/bigger-applications/">FastAPI · 여러 파일과 APIRouter</a></li><li><a className="underline" href="https://fastapi.tiangolo.com/tutorial/response-model/">FastAPI · 응답 모델</a></li><li><a className="underline" href="https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/">FastAPI · yield 의존성</a></li><li><a className="underline" href="https://fastapi.tiangolo.com/async/">FastAPI · 동시성과 async</a></li><li><Link className="underline" href="/dto-entity-vo">DTO·Entity·VO 비교</Link></li><li><Link className="underline" href="/rag/project-structure">RAG 프로젝트 구조</Link></li></ul></section>
  </ReferencePage>;
}
