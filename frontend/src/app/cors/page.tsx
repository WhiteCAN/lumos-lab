import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { ReferencePage, ComparisonTable, FlowSection, CodeBlock } from "@/components/reference-page";
import { getStudyMetadata, getStudyPage } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/cors");
const sections = [
  [
    "Origin은 스킴·호스트·포트의 조합입니다",
    "http://localhost:3000과 http://localhost:8080은 포트가 달라 교차 출처입니다. 경로만 다른 두 URL은 같은 출처입니다. 동일 출처 정책이 제한하는 응답 접근을 서버가 CORS 헤더로 허용하면 브라우저 JavaScript에서 읽을 수 있습니다."
  ],
  [
    "모든 요청에 OPTIONS가 붙지는 않습니다",
    "CORS 안전 목록의 메서드·헤더·Content-Type 조건을 만족하면 사전 요청 없이 실제 요청이 전송될 수 있습니다. JSON Content-Type이나 Authorization 헤더 같은 조건은 보통 사전 요청을 유발합니다. 캐시된 사전 요청 결과를 재사용할 수도 있습니다."
  ],
  [
    "사전 요청과 실제 응답을 모두 확인합니다",
    "브라우저가 Origin, Access-Control-Request-Method, 필요하면 Access-Control-Request-Headers를 담은 OPTIONS를 보냅니다. 서버의 허용 조건을 확인한 뒤 실제 요청을 보냅니다. 실제 응답에도 필요한 CORS 헤더가 있어야 JavaScript에 응답이 공개됩니다."
  ],
  [
    "쿠키를 사용하는 요청",
    "교차 출처 fetch에 credentials: include를 지정해도 서버의 Access-Control-Allow-Credentials: true와 정확한 Access-Control-Allow-Origin 값이 필요합니다. 이 경우 Origin에 *를 쓸 수 없습니다. 쿠키의 SameSite·Secure와 브라우저의 서드파티 쿠키 정책도 별도로 적용됩니다."
  ],
  [
    "CORS는 인증이나 CSRF 방어를 대체하지 않습니다",
    "CORS는 주로 브라우저의 응답 읽기 정책입니다. 사전 요청 없는 요청은 서버에 도달한 뒤 응답만 차단될 수 있으며, curl·서버 간 통신은 브라우저와 같은 제한을 받지 않습니다. 인증·권한 검사·CSRF 방어를 별도로 설계해야 합니다."
  ],
  [
    "오류를 진단하는 순서",
    "개발자 도구 Network에서 OPTIONS 실패인지 실제 응답의 헤더 누락인지 확인합니다. 리다이렉트·401·500 응답이나 프록시에서도 헤더가 누락될 수 있습니다. mode: no-cors는 응답을 읽을 수 없는 opaque 응답을 만들 수 있어 해결책이 아닙니다. 동적으로 출처를 허용하면 검증된 목록을 사용하고 Vary: Origin으로 캐시를 구분합니다."
  ]
];
const steps = [
  "브라우저가 출처·요청 조건 판단",
  "필요하면 OPTIONS로 허용 범위 확인",
  "통과 후 실제 요청 전송",
  "실제 응답 헤더 검사 후 JS에 공개"
];
const rows = [
  {
    "topic": "예시",
    "values": [
      "안전 목록 조건의 GET",
      "application/json POST·Authorization 사용"
    ]
  },
  {
    "topic": "서버 도달",
    "values": [
      "실제 요청이 먼저 도달할 수 있음",
      "사전 요청 실패 시 실제 요청 미전송"
    ]
  },
  {
    "topic": "응답 공개",
    "values": [
      "응답의 CORS 헤더 필요",
      "OPTIONS와 실제 응답 모두 올바른 헤더 필요"
    ]
  }
];
const codes = [
  {
    "title": "HTTP 예시 · JSON POST의 사전 요청과 실제 응답",
    "code": "OPTIONS /api/items HTTP/1.1\nOrigin: https://app.example.com\nAccess-Control-Request-Method: POST\nAccess-Control-Request-Headers: content-type\n\nHTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: POST\nAccess-Control-Allow-Headers: Content-Type\nVary: Origin\n\n# 이후 실제 POST 응답에도 아래 헤더가 필요합니다.\nHTTP/1.1 200 OK\nContent-Type: application/json\nAccess-Control-Allow-Origin: https://app.example.com\nVary: Origin\n\n{\"ok\": true}"
  }
];
const refs = [
  [
    "MDN · CORS 요청·응답과 인증 정보",
    "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS"
  ]
];
const related = [
  "/rest-api-design",
  "/backend/security-auth",
  "/frontend-basics"
];

export default function Page() {
  return (
<ReferencePage pageHref="/cors" label="개념 · 흐름 · 선택 기준" description="브라우저가 교차 출처 응답을 공개하는 조건과 OPTIONS 사전 요청을 이해합니다." icon={BookOpenIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        {sections.map(([title, body]) => (
          <section key={title} className="min-w-0 rounded-xl border bg-card p-5 [overflow-wrap:anywhere]">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>
      <FlowSection title="핵심 흐름" orientation="vertical" steps={steps} />
      <ComparisonTable columns={[
  "사전 요청 없는 경우",
  "사전 요청이 필요한 경우"
]} rows={rows} />
      {codes.map(({ title, code }) => <CodeBlock key={title} title={title} code={code} />)}
      <section className="rounded-xl border bg-card p-5 [overflow-wrap:anywhere]">
        <h2 className="text-lg font-semibold">출처와 함께 읽기</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">원문 이미지와 캡션을 한국어로 재구성하고 아래 공식 문서로 조건과 주의점을 보완했습니다. 예제와 흐름은 학습용으로 작성했으며 실제 서비스 호출을 수행하지 않습니다.</p>
        <a href="https://www.instagram.com/reels/DcWByIxNQ8H/" className="mt-3 inline-block text-sm underline underline-offset-4">Instagram 원문</a>
        <ul className="mt-3 grid gap-2 text-sm">{refs.map(([title, href]) => <li key={href}><a href={href} className="underline underline-offset-4">{title}</a></li>)}</ul>
        <div className="mt-5 flex flex-wrap gap-3 border-t pt-4 text-sm">{related.map(href => <Link key={href} href={href} className="underline underline-offset-4">{getStudyPage(href).title}</Link>)}</div>
      </section>
    </ReferencePage>
  );
}
