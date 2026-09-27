import type { Metadata } from "next";
import Link from "next/link";
import { KeyRoundIcon } from "lucide-react";
import { CodeBlock, FlowSection, ReferencePage } from "@/components/reference-page";

export const metadata: Metadata = {
  title: "JWT · OAuth · OIDC | Lumos Lab",
  description: "JWT 토큰 형식, OAuth 권한 위임, OIDC 인증의 차이와 토큰 검증·로그인 흐름을 비교합니다.",
};

const concepts = [
  { title: "JWT · 데이터 형식", question: "토큰에 어떤 정보를 담을까?", text: "JSON 클레임을 표현하는 토큰 형식입니다. OAuth의 Access Token이나 OIDC의 ID Token에 쓰일 수 있지만, JWT 자체가 로그인 절차를 정하지는 않습니다.", example: "사용자 식별자 sub, 발급자 iss, 대상 aud, 만료 exp" },
  { title: "OAuth 2.0 · 권한 위임", question: "어떤 자원에 접근을 허용할까?", text: "사용자의 비밀번호를 외부 앱에 넘기지 않고 제한된 권한을 위임하는 프레임워크입니다. Access Token은 JWT일 수도, 의미를 직접 읽을 수 없는 opaque 토큰일 수도 있습니다.", example: "사진 앱에 내 드라이브 파일 읽기 권한 허용" },
  { title: "OIDC · 사용자 인증", question: "로그인한 사용자가 누구일까?", text: "OAuth 2.0 위에 사용자 인증을 정의한 계층입니다. openid scope를 요청하고 ID Token을 검증해 인증 결과를 확인합니다.", example: "Google 계정으로 로그인한 사용자의 신원 확인" },
];

export default function JwtOauthPage() {
  return <ReferencePage breadcrumb="백엔드 / JWT · OAuth · OIDC" label="토큰 형식과 인증·인가 구분" title="JWT · OAuth · OIDC" icon={KeyRoundIcon}
    description="JWT와 OAuth는 경쟁 기술이 아닙니다. 토큰의 형식, 접근 권한을 위임하는 절차, 사용자 인증을 서로 다른 역할로 구분하면 소셜 로그인 흐름을 이해하기 쉬워집니다."
    colorClass="border-violet-200 bg-violet-50/50 dark:border-violet-900/60 dark:bg-violet-950/20">
    <section className="grid gap-4 lg:grid-cols-3" aria-label="세 개념 비교">
      {concepts.map(item => <article key={item.title} className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">{item.title}</h2><p className="mt-2 font-medium text-violet-700 dark:text-violet-300">{item.question}</p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p><p className="mt-4 rounded-lg border bg-muted/30 p-3 text-sm leading-6">{item.example}</p>
      </article>)}
    </section>
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-xl font-semibold">서명된 JWT를 읽는 법</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">{[["Header", "서명 알고리즘과 키 식별 정보"], ["Payload", "사용자·발급자·대상·만료 등 클레임"], ["Signature", "변조 여부와 서명 키에 대한 검증"]].map(([title, text]) => <article key={title} className="rounded-lg border bg-muted/20 p-4"><h3 className="font-mono font-semibold">{title}</h3><p className="mt-2 text-sm leading-6">{text}</p></article>)}</div>
      <p className="mt-4 text-sm leading-7">흔히 쓰는 JWS Compact 형태는 Header.Payload.Signature의 세 부분입니다. Header와 Payload의 Base64URL 인코딩은 암호화가 아니므로 읽을 수 있습니다. JWT에는 암호화된 JWE 형태도 있어 모든 JWT가 세 부분인 것은 아닙니다.</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">디코딩 성공은 검증 성공이 아닙니다. 허용한 알고리즘과 신뢰하는 키로 서명을 확인하고 발급자·대상·만료 등을 검증해야 합니다. 권한과 리소스 소유자 확인도 별도로 수행합니다.</p>
    </section>
    <CodeBlock title="클레임 예시 · 실제 자격 증명이 아닌 설명용 데이터" code={'{\n  "sub": "user-123",\n  "iss": "https://issuer.example",\n  "aud": "photo-api",\n  "exp": 1893456000\n}'} />
    <div className="grid items-stretch gap-4 lg:grid-cols-2">
      <FlowSection orientation="vertical" title="OAuth · 외부 API 접근 권한 받기" steps={["사용자가 접근 권한 허용", "앱이 Authorization Code 수신", "Code와 PKCE verifier로 토큰 교환", "Access Token으로 외부 API 호출"]} />
      <FlowSection orientation="vertical" title="OIDC · 로그인 결과 확인하기" steps={["openid scope로 인증 요청", "제공자에서 사용자 인증", "Code 교환으로 ID Token 수신", "서명·iss·aud·exp 및 nonce 검증", "우리 서비스 세션 수립"]} />
    </div>
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-xl font-semibold">헷갈리기 쉬운 네 가지</h2>
      <div className="mt-4 space-y-3">{[
        ["ID Token을 API 호출에 쓰나요?", "ID Token은 클라이언트가 인증 결과를 확인하는 용도입니다. 보호된 API에 접근할 때는 그 API를 대상으로 발급된 Access Token을 사용합니다."],
        ["우리 서비스도 JWT를 발급해야 하나요?", "아닙니다. 제공자의 로그인 결과를 검증한 뒤 서버 세션을 만들 수도 있고 자체 토큰을 발급할 수도 있습니다. OAuth 사용이 자체 JWT 발급을 강제하지 않습니다."],
        ["JWT를 쓰면 로그아웃도 자동인가요?", "아닙니다. 클라이언트에서 지워도 이미 복사된 토큰은 만료 전까지 유효할 수 있습니다. 짧은 수명, 서버 측 폐기 정책, 리프레시 토큰 관리 등을 설계해야 합니다."],
        ["OAuth만으로 로그인 신원이 표준화되나요?", "OAuth는 권한 위임을 정의합니다. 표준 사용자 인증은 OIDC를 사용합니다. 제공자별 사용자 API를 이용하는 로그인은 그 제공자의 계약을 추가로 따라야 합니다."],
      ].map(([q, a]) => <details key={q} className="rounded-lg border p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-3 text-sm leading-7 text-muted-foreground">{a}</p></details>)}</div>
    </section>
    <section className="rounded-xl border bg-card p-5 text-sm leading-7">
      <h2 className="text-lg font-semibold">실습과 출처</h2>
      <p className="mt-2">원본의 JWT·OAuth 비교를 바탕으로 OIDC와 검증 조건을 보완한 개념 가이드입니다. <Link className="underline" href="/backend/security-auth">기존 인증 mock 실습</Link>에서 발급·만료·변조 흐름을 확인할 수 있습니다.</p>
      <ul className="mt-3 space-y-1">{[["원본 릴스", "https://www.instagram.com/reels/DdtgewXpPr7/"], ["JWT · RFC 7519", "https://www.rfc-editor.org/rfc/rfc7519"], ["OAuth 2.0 · RFC 6749", "https://www.rfc-editor.org/rfc/rfc6749"], ["OpenID Connect Core", "https://openid.net/specs/openid-connect-core-1_0.html"]].map(([label, href]) => <li key={href}><a className="underline underline-offset-4" href={href} target="_blank" rel="noreferrer">{label}</a></li>)}</ul>
    </section>
  </ReferencePage>;
}
