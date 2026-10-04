import Link from "next/link";
import { ServerIcon } from "lucide-react";
import { ReferencePage, CodeBlock, FlowSection } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/backend/fastapi");
const cards = [
  [
    "라우트와 스키마",
    "경로·HTTP 메서드·Pydantic 입력·응답 모델을 함께 정의합니다.",
    "입력 스키마와 ORM 모델을 분리합니다. response_model로 공개할 응답 필드를 정합니다."
  ],
  [
    "입력과 업무 규칙",
    "필드 타입·범위를 먼저 제한하고 업무 상태 규칙을 별도로 검사합니다.",
    "아래 Python 예시의 잘못된 입력은 기본 422입니다. 위 Java 실습의 입력 오류는 400입니다."
  ],
  [
    "인증과 권한",
    "토큰 파싱·서명·만료 검증과 업무별 접근 권한은 다른 검사입니다.",
    "예시에 인증은 포함하지 않습니다. JWT 문자열을 디코딩한 것만으로 신뢰하지 않습니다."
  ],
  [
    "CRUD와 트랜잭션",
    "라우터·서비스·저장 접근 책임과 커밋·롤백 경계를 정합니다.",
    "아래 예제는 계산만 하며 SQLAlchemy·DB 쓰기를 실행하지 않습니다."
  ],
  [
    "테스트",
    "정상 입력과 누락·범위·타입 오류를 HTTP 수준에서 확인합니다.",
    "TestClient는 네트워크 포트를 열지 않고 앱을 호출할 수 있습니다. 실제 DB 연동은 별도 테스트합니다."
  ],
  [
    "배포와 운영",
    "의존성·기동 명령·환경변수·헬스 체크·로그를 명확히 합니다.",
    "Docker 포장과 서비스 가용성은 별개입니다. 비밀값은 이미지·예제 코드에 넣지 않습니다."
  ]
];
const scenarios = [
  "위 API에서 values=[3], parameter=1200 → Java 가격 계산 결과 3600.",
  "수량 0 또는 101, 단가 -1 또는 10001 → Java 실습 400.",
  "Python 예시는 FastAPI·Pydantic·httpx가 있는 별도 환경에서 실행합니다. 이 저장소 서버는 Spring Boot입니다.",
  "캡션에서 소개한 5쪽 치트시트의 주제를 정리했습니다. 영상 속 전체 페이지나 배포·인증 기능을 구현했다고 주장하지 않습니다."
];
const related = [["/fastapi-project-structure","폴더 구조와 책임"],["/backend/jwt-oauth","JWT·OAuth·OIDC"],["/testing-basics","테스트 기초"]];
export default function Page() {
  return <ReferencePage pageHref="/backend/fastapi" label="개념 · 흐름 · 실행 검증" description="원문 캡션의 라우팅·Pydantic·인증·CRUD·테스트·배포 범위를 학습 지도로 정리하고 가격 계산 계약을 비교합니다." icon={ServerIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">

    <p className="text-sm"><a className="underline" href="/examples/fastapi_quote.py" download>Python 예시 다운로드 · python fastapi_quote.py로 성공·실패 테스트</a></p>
    <section className="grid gap-4 xl:grid-cols-3" aria-label="핵심 개념">{cards.map(([title, body, caution], index) => <article key={title} className="min-w-0 rounded-xl border bg-card p-5"><p className="text-sm font-medium text-sky-700 dark:text-sky-300">0{index + 1}</p><h2 className="mt-2 text-lg font-semibold [overflow-wrap:anywhere]">{title}</h2><p className="mt-3 text-sm leading-6">{body}</p><p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">{caution}</p></article>)}</section>
    <FlowSection title="대표 실행 흐름" steps={["HTTP 입력","Pydantic 필드 검증","가격 계산 함수","응답 모델","TestClient로 성공·실패 확인"]} />
    <CodeBlock language="python" title="Python · 독립 실행 예시" code={"# 별도 Python 학습 예시: 웹의 실행 버튼은 Java API를 호출합니다.\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel, conint\nfrom fastapi.testclient import TestClient\n\napp = FastAPI()\nclass QuoteRequest(BaseModel):\n    quantity: conint(strict=True, ge=1, le=100)\n    unit_price: conint(strict=True, ge=0, le=10000)\nclass QuoteResponse(BaseModel):\n    total: int\n\n@app.post(\"/quote\", response_model=QuoteResponse)\ndef quote(body: QuoteRequest):\n    return {\"total\": body.quantity * body.unit_price}\n\nwith TestClient(app) as client:\n    assert client.post(\"/quote\", json={\"quantity\": 3, \"unit_price\": 1200}).json() == {\"total\": 3600}\n    assert client.post(\"/quote\", json={\"quantity\": 0, \"unit_price\": 1200}).status_code == 422\n    assert client.post(\"/quote\", json={\"quantity\": \"3\", \"unit_price\": 1200}).status_code == 422"} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">입력을 바꿔 확인하기</h2><ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-6 [overflow-wrap:anywhere]">{scenarios.map(item => <li key={item}>{item}</li>)}</ol></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 이어서 보기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">원문에서 확인한 주제를 학습용으로 재구성했습니다. 코드·실패 실험·설계 주의점은 프로젝트에서 보완한 내용입니다.</p><ul className="mt-3 space-y-2 text-sm"><li><a className="underline" href="https://www.instagram.com/reels/Dd7u8xByGpm/">Instagram 원문</a></li><li><a className="underline" href="https://fastapi.tiangolo.com/tutorial/testing/">공식 문서 · 세부 계약 확인</a></li>{related.map(([href, title]) => <li key={href}><Link className="underline" href={href}>{title}</Link></li>)}</ul></section>
  </ReferencePage>;
}
