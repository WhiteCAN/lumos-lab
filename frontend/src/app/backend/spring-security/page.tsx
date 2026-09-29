import { ShieldCheckIcon } from "lucide-react";
import { ReferencePage, FlowSection, CodeBlock } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/backend/spring-security");
export default function SpringSecurityPage() {
  return <ReferencePage pageHref="/backend/spring-security" label="Spring Security · JWT" brand="spring" icon={ShieldCheckIcon} colorClass="bg-emerald-50/50 dark:bg-emerald-950/20" description="JWT 형식 이해에서 한 단계 더 나아가, 필터 체인과 검증·권한·토큰 수명 관리의 경계를 정리합니다.">
    <FlowSection title="Bearer 요청의 논리적 처리 순서" steps={["요청·보안 필터 체인 선택", "Bearer 토큰 추출", "서명·클레임 검증", "Authentication 구성", "URL·메서드 권한 검사", "Controller 실행"]} />
    <p className="text-sm text-muted-foreground">설명을 위한 단계입니다. 모든 인증 필터가 매 요청에 실행되는 고정 목록은 아니며, 설정과 매칭된 체인에 따라 달라집니다.</p>
    <div className="grid gap-4 lg:grid-cols-3">{[
      ["인증 객체와 비밀번호", "Authentication은 신원·권한·인증 상태를 담습니다. 비밀번호 로그인은 PasswordEncoder.matches로 저장된 적응형 해시와 비교합니다. UserDetailsService는 사용자 조회 계약이며 JWT API마다 반드시 DB 조회가 필요한 것은 아닙니다."],
      ["JWT 검증", "Base64url 디코딩은 검증이 아닙니다. 신뢰한 키와 허용 알고리즘, 발급자·대상·유효 시간을 확인합니다. JWT 본문은 보통 암호화되지 않으므로 비밀번호나 민감정보를 넣지 않습니다."],
      ["역할과 세부 권한", "기본 hasRole(ADMIN)은 ROLE_ADMIN, hasAuthority는 지정한 문자열을 검사합니다. JWT scope의 기본 SCOPE_ 접두사와 사용자 정의 roles 클레임은 같지 않습니다. 변환 정책과 리소스 소유자 검사를 명시합니다."],
      ["CORS·CSRF·세션", "CORS는 브라우저의 교차 출처 응답 접근 정책이며 인증 대체물이 아닙니다. STATELESS나 JWT라는 이유만으로 CSRF가 사라지지 않습니다. 자동 전송되는 쿠키 등 자격증명과 엔드포인트별 위험에 맞춰 보호합니다."],
      ["갱신·로그아웃", "Refresh Token 회전은 이전 토큰 폐기와 재사용 탐지를 원자적으로 처리해야 합니다. 로그아웃 후 이미 발급한 Access Token을 언제까지 허용할지 결정합니다. 짧은 수명·폐기 목록 등은 저장소와 가용성 비용을 동반합니다."],
      ["오류·테스트·운영", "일반적인 Bearer API는 무효 인증 401, 인증 후 권한 부족 403을 구분합니다. 필터 오류는 MVC 예외 처리만으로 해결되지 않을 수 있습니다. mock 인증 권한 테스트와 실제 서명·만료·발급자 검증 테스트를 구분하고 토큰을 로그에 남기지 않습니다."],
    ].map(([title,text])=><article key={title} className="rounded-xl border bg-card p-5"><h2 className="font-semibold">{title}</h2><p className="mt-3 text-sm leading-7">{text}</p></article>)}</div>
    <CodeBlock title="Java · Resource Server 설정의 핵심 조각" code={`@Bean
SecurityFilterChain api(HttpSecurity http) throws Exception {
    return http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/public/**").permitAll()
            .requestMatchers("/reports/**").hasAuthority("SCOPE_reports.read")
            .anyRequest().authenticated())
        .oauth2ResourceServer(resource -> resource.jwt(Customizer.withDefaults()))
        .build();
}`} />
    <p className="text-sm leading-7">별도 보안 애플리케이션에서 사용하는 설명용 Java 조각입니다. Resource Server·JOSE 의존성, 신뢰 issuer/JWK 또는 JwtDecoder, audience 정책과 CSRF·CORS·세션 설정을 별도로 완성해야 합니다. 여기서는 CSRF 기본 보호를 해제하지 않습니다. 이 저장소에는 Spring Security 의존성과 위 필터 체인이 설치되어 있지 않습니다.</p>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-xl font-semibold">실제로 실행하는 범위</h2><p className="mt-3 text-sm leading-7">아래 API는 기존 Java HMAC 토큰 모형을 재사용합니다. <a className="underline" href="/backend/security-auth">인증 실습 화면</a>에서 USER 발급 → USER 허용 → ADMIN 거절 → 변조 → 만료를 비교하세요. login()·accessProtected()가 브레이크포인트입니다. 고정 실습 비밀번호와 직접 입력한 역할을 사용하며 실제 계정 인증·Spring Security 필터·OAuth 로그인·갱신 회전은 실행하지 않습니다. 이 모형의 인증 실패 응답은 HTTP 400이며 위의 운영 401/403 계약과 다릅니다.</p><p className="mt-3 text-sm leading-7">외부 로그인은 OAuth 권한 위임과 OIDC 신원 인증을 구분합니다. 실제 비밀번호·토큰을 실습 입력에 사용하지 마세요.</p></section>
    <div className="flex flex-wrap gap-4 text-sm underline"><a href="/backend/jwt-oauth">JWT·OAuth 개념</a><a href="/cors">CORS 실습</a><a href="https://www.instagram.com/p/DdwPP8tlou4/?img_index=6">15번 원문 · 1~18번 카드 주제 확인</a><a href="https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html">Spring Security JWT</a><a href="https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html">Spring Security CSRF</a></div>
  </ReferencePage>;
}
