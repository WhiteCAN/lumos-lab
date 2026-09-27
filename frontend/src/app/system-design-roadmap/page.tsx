import Link from "next/link";
import { RouteIcon } from "lucide-react";
import { FlowSection, ReferencePage } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/system-design-roadmap");

const stages = [
  {
    title: "01 · 요구사항과 아키텍처",
    description: "누가 어떤 요청을 보내는지, 응답 시간과 데이터 정확성이 어느 정도 필요한지부터 정합니다. 처음부터 모든 서비스를 나누기보다 한 요청이 통과하는 경계와 데이터의 주인을 설명하세요.",
    question: "사진 조회가 느릴 때 API, DB, 파일 전송 중 어디를 먼저 측정할까요?",
    links: [["/architecture", "아키텍처와 DDD"], ["/spring-system-design", "Spring 시스템 설계"]],
  },
  {
    title: "02 · 네트워크와 API 계약",
    description: "클라이언트와 서버 사이의 요청·응답, 지연, 타임아웃을 이해합니다. 재시도는 실패 복구에 유용하지만 같은 주문을 두 번 처리할 수 있어 멱등성·요청 식별자가 함께 필요합니다.",
    question: "서버가 주문을 저장했지만 응답만 유실되었다면 재시도를 어떻게 처리할까요?",
    links: [["/tcp-vs-udp", "TCP·UDP"], ["/rest-api-design", "REST API 설계"], ["/http-errors", "HTTP 오류"]],
  },
  {
    title: "03 · 데이터베이스와 저장소",
    description: "조회 조건·인덱스·트랜잭션을 먼저 살펴보고 데이터 배치와 복제를 검토합니다. 이미지 같은 큰 파일과 검색용 메타데이터는 접근 방식이 다르므로 별도 저장소가 필요한지 판단합니다.",
    question: "복제본에서 읽으면 항상 방금 쓴 값을 볼 수 있을까요? 파일은 DB와 함께 원자적으로 저장되나요?",
    links: [["/backend/db-index-transaction", "인덱스와 격리 수준"], ["/backend/sharding-replica", "샤딩과 복제"]],
  },
  {
    title: "04 · 캐시와 확장",
    description: "반복 조회는 캐시로 줄일 수 있지만 만료·무효화·오래된 값의 허용 범위를 정해야 합니다. 서버를 늘릴 때는 세션·작업 상태가 특정 서버에 묶여 있지 않은지도 확인합니다.",
    question: "캐시 적중률이 높아도 데이터가 오래되었다면 성공적인 설계일까요?",
    links: [["/backend/redis-cache", "Redis 캐시"], ["/backend/caching-strategies", "캐시 전략"]],
  },
  {
    title: "05 · 분산 처리와 메시징",
    description: "즉시 응답할 필요가 없는 작업을 이벤트로 분리할 수 있습니다. 대신 중복·순서·재처리·부분 실패를 다뤄야 합니다. DB 변경과 이벤트 발행 사이의 실패도 설계 대상입니다.",
    question: "주문 저장은 성공하고 이벤트 발행은 실패했다면 배송 작업을 어떻게 복구할까요?",
    links: [["/messaging/kafka-architecture", "Kafka 아키텍처"], ["/messaging/saga-outbox", "Saga와 Outbox"], ["/circuit-breaker", "장애 전파 방지"]],
  },
  {
    title: "06 · 보안과 관측·운영",
    description: "인증·권한 검사를 요청 경계에 배치하고 실패율·지연·부하를 관찰합니다. 로그는 사건, 지표는 추세, 트레이스는 요청이 지나간 구간을 살펴보는 데 사용합니다. 배포 후 되돌릴 기준도 미리 정합니다.",
    question: "평균 응답은 빠른데 일부 사용자만 느리다면 어떤 자료를 더 볼까요?",
    links: [["/backend/jwt-oauth", "JWT·OAuth·OIDC"], ["/testing-basics", "검증과 테스트"], ["/ci-cd", "빌드·배포"]],
  },
  {
    title: "07 · AI·RAG·에이전트 확장",
    description: "문서 검색과 답변 생성, 여러 도구를 실행하는 에이전트를 구분합니다. 벡터 유사도가 높다는 이유만으로 정답이 보장되지는 않습니다. 검색 근거·접근 권한·평가·비용·실행 한도를 함께 설계합니다.",
    question: "사용자가 읽을 수 없는 문서가 검색 결과에 포함된다면 어디에서 차단해야 할까요?",
    links: [["/rag/architecture-comparison", "RAG 구조 비교"], ["/rag/vector-search", "벡터 검색"], ["/ai-agent-patterns", "에이전트 패턴"]],
  },
];

const security = [
  ["인증 · Authentication", "누구인지 확인합니다. 로그인 성공은 사용자 신원 확인이지 모든 자료의 접근 허가가 아닙니다."],
  ["인가 · Authorization", "그 사용자가 이 자원에 이 동작을 해도 되는지 판단합니다. 회원 역할뿐 아니라 사진 소유자·공개 여부처럼 대상 자원의 조건도 확인합니다."],
  ["OAuth 2.0과 OIDC", "OAuth 2.0은 자원 접근 권한을 위임하는 프레임워크입니다. OIDC는 그 위에 사용자 인증 계층을 더합니다. API 접근용 Access Token과 로그인 결과를 표현하는 ID Token의 용도를 구분합니다."],
  ["JWT의 세 부분", "서명된 JWS Compact 형식은 header.payload.signature로 표현됩니다. 헤더는 알고리즘 등의 메타데이터, payload는 claim, signature는 무결성 검증에 쓰입니다. 인코딩은 암호화가 아니며 암호화된 JWT의 표현은 다를 수 있습니다."],
  ["검증과 권한 판단", "토큰 내용을 읽는 것만으로 신뢰하지 않습니다. 허용 알고리즘과 서명을 검증하고 발급자·대상·만료 등의 조건을 확인한 뒤 서버에서 접근 권한을 판단합니다. JWT 자체가 즉시 로그아웃·권한 회수를 해결하지는 않습니다."],
  ["RBAC · 역할 기반 권한", "관리자·편집자·열람자 같은 역할에 권한을 연결합니다. 역할만으로 소유권을 표현하기 어렵다면 자원 속성·관계 조건을 함께 적용합니다. 화면에서 버튼을 숨기는 것만으로 서버 접근이 차단되지는 않습니다."],
];

export default function SystemDesignRoadmapPage() {
  return (
    <ReferencePage pageHref="/system-design-roadmap" label="요구사항에서 AI까지 이어지는 학습 지도" description="기술 이름을 외우는 대신 요청이 지나가는 경로, 데이터의 수명, 장애 때의 동작을 연결합니다. 각 영역의 판단 질문을 먼저 읽고 필요한 상세 페이지와 실행 실습으로 이동하세요." icon={RouteIcon} colorClass="border-sky-200 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/20">
      <nav aria-label="시스템 설계 로드맵 목차" className="flex flex-wrap gap-2 text-sm">
        {[["학습 순서", "roadmap"], ["보안 슬라이드", "security"], ["캐시 실습", "practice"], ["설계 질문", "tradeoffs"]].map(([label, id]) => <a key={id} href={`#${id}`} className="rounded-lg border bg-card px-3 py-2 underline-offset-4 hover:underline">{label}</a>)}
      </nav>
      <aside className="rounded-xl border bg-muted/30 p-5 text-sm leading-7">
        <strong>원문에서 확인한 범위</strong>
        <p className="mt-2 text-muted-foreground">공유 게시물의 캡션에 있는 시스템 설계·AI 학습 범위와 19번 이미지의 Security Part 1 내용을 확인했습니다. 게시물에서 소개한 35페이지 PDF 전체를 확보해 전사한 문서가 아닙니다. 아래 학습 순서와 사례는 Lumos Lab의 기존 페이지에 맞춰 재구성한 설명입니다.</p>
      </aside>
      <FlowSection title="하나의 요청에서 넓혀 가기" steps={[
        { label: "요구사항", icon: "user", detail: "누가 무엇을 얼마나 빠르게 요청하는가" },
        { label: "API와 데이터", icon: "server", detail: "어디에 저장하고 어떤 계약으로 전달하는가" },
        { label: "확장과 장애", icon: "database", detail: "부하·중복·부분 실패를 어떻게 다루는가" },
        { label: "검증과 관측", icon: "done", detail: "권한·정확성·지연을 어떻게 확인하는가" },
      ]} />
      <section id="roadmap" className="scroll-mt-4">
        <h2 className="text-xl font-semibold">01 · 상세 페이지로 이어지는 7단계</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">순서는 학습을 위한 제안입니다. 보안과 운영은 마지막에 붙이는 기능이 아니라 각 단계의 설계 조건으로 함께 확인합니다. 저장소·관측 영역은 여기서 개념을 안내하며 모든 주제에 독립 실습이 구현된 것은 아닙니다.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {stages.map((stage) => <article key={stage.title} className="min-w-0 rounded-xl border bg-card p-5">
            <h3 className="text-lg font-semibold">{stage.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{stage.description}</p>
            <p className="mt-3 rounded-lg bg-muted/40 p-3 text-sm leading-7"><strong>판단 질문 · </strong>{stage.question}</p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">{stage.links.map(([href, label]) => <li key={href}><Link className="underline underline-offset-4" href={href}>{label}</Link></li>)}</ul>
          </article>)}
        </div>
      </section>
      <section id="security" className="scroll-mt-4 rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold">02 · 19번 슬라이드: 인증·인가·토큰·역할</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">원문의 네 가지 주제에 검증 경계와 예시를 덧붙였습니다. 예를 들어 로그인한 사용자가 다른 사람의 비공개 사진을 요청하면, 인증은 성공했더라도 자원 접근 권한은 거절되어야 합니다.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">{security.map(([title, detail]) => <article key={title} className="rounded-lg border bg-muted/20 p-4"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{detail}</p></article>)}</div>
        <p className="mt-4 text-sm leading-7">서버는 기본 거절과 최소 권한을 기준으로 매 요청의 권한을 확인합니다. 더 자세한 토큰 흐름과 검증은 <Link href="/backend/jwt-oauth" className="underline underline-offset-4">JWT·OAuth·OIDC 페이지</Link>에서 이어갑니다. 이 로드맵의 API 실습은 로그인·권한 검사를 구현하지 않습니다.</p>
      </section>
      <section id="practice" className="scroll-mt-4 rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold">03 · 대표 실습: 캐시 용량과 원본 조회 횟수</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">위의 실행 패널은 POST /api/labs/examples/cache를 호출합니다. Java의 요청 내부 LRU 목록에서 키가 없으면 제곱값을 계산해 원본 조회를 대신합니다. 실제 Redis·DB·네트워크 캐시를 실행하지 않습니다.</p>
        <ol className="mt-4 space-y-3 text-sm leading-7">
          <li><strong>1. 반복 조회:</strong> values를 [1,2,1,3,1], parameter를 2로 실행합니다. sourceLoads는 3, 마지막 keys는 [3,1]입니다. steps의 HIT·MISS·EVICT와 오래된 접근 순서를 확인합니다.</li>
          <li><strong>2. 용량 축소:</strong> parameter를 1로 바꾸면 sourceLoads는 5가 됩니다. 적중률을 높이는 데 용량이 도움이 되는 입력이지만, 더 큰 캐시가 항상 이득인 것은 아닙니다.</li>
          <li><strong>3. 오류:</strong> parameter=0 또는 values=[]로 실행해 오류 응답을 확인합니다. values는 -10000~10000의 정수 1~30개, parameter는 용량 1~10입니다. fail 필드는 이 실습에서 사용하지 않습니다.</li>
          <li><strong>4. 실행 상태:</strong> 요청 중에는 실행 버튼이 비활성화되고 기다리는 상태를 표시합니다. 응답에서 HTTP 상태·본문·단계 기록을 보고, 연결 실패면 백엔드 실행 상태와 허용 출처를 확인합니다.</li>
        </ol>
        <details className="mt-4 rounded-lg border p-4 text-sm"><summary className="cursor-pointer font-semibold">디버깅 위치와 생략한 동작</summary><p className="mt-3 break-words leading-7">backend/src/main/java/com/lumos/lab/learning/ScenarioLabController.java의 run()에서 요청을 받고, ScenarioLabService.java의 cache()에서 containsKey·get·put·remove 전후를 관찰합니다. capacity()는 잘못된 용량을 거절합니다. BackendApplication을 Debug로 실행한 뒤 위 패널의 API 실행을 누르세요.</p><p className="mt-2 leading-7 text-muted-foreground">요청마다 상태가 초기화됩니다. TTL·원본 변경·동시 요청·분산 락·영속 저장은 생략하므로 이 결과로 실제 Redis 성능이나 데이터 정합성을 검증할 수 없습니다.</p></details>
      </section>
      <section id="tradeoffs" className="scroll-mt-4 rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold">04 · 선택의 이득과 비용을 같이 설명하기</h2>
        <div className="mt-4 space-y-3">{[
          ["캐시를 두면 무엇을 더 책임져야 하나요?", "조회 횟수를 줄이는 대신 메모리 비용과 데이터 만료·무효화를 관리합니다. 오래된 데이터가 허용되는 시간을 정하고 캐시가 비었을 때 원본으로 몰리는 부하도 확인합니다."],
          ["서비스와 메시지 큐를 늘리면 더 안전한가요?", "독립 확장과 장애 격리에 유리할 수 있지만 네트워크 실패·중복·배포 조합이 늘어납니다. 단일 애플리케이션으로 해결 가능한 문제라면 먼저 측정하고 분리의 근거를 찾습니다."],
          ["JWT를 쓰면 인가도 끝나나요?", "아닙니다. 검증된 신원과 자원 접근 허용은 별도 판단입니다. 사용자 A의 유효한 토큰으로 사용자 B의 자원에 접근하는 실패 사례도 검사해야 합니다."],
          ["AI 기능을 추가하면 기존 설계는 필요 없나요?", "검색·모델 호출에도 지연·비용·권한·재시도가 있습니다. 근거 없는 응답과 도구 실행 실패까지 평가하며 기존 API·보안·관측 원칙을 확장합니다."],
        ].map(([question, answer]) => <details key={question} className="rounded-lg border p-4"><summary className="cursor-pointer text-sm font-semibold">{question}</summary><p className="mt-3 text-sm leading-7 text-muted-foreground">{answer}</p></details>)}</div>
      </section>
      <section className="rounded-xl border bg-card p-5 text-sm">
        <h2 className="text-lg font-semibold">출처와 확인 범위</h2>
        <p className="mt-2 leading-7 text-muted-foreground">원문 캡션과 보안 이미지에서 출발해 기존 학습 페이지 및 아래 1차 문서로 보완했습니다. 링크된 상세 페이지마다 실제 실행과 로컬 모형의 범위가 다릅니다.</p>
        <ul className="mt-3 space-y-2">{[
          ["공유 게시물 · 캡션과 19번 이미지", "https://www.instagram.com/p/DducXU_DeRJ/?img_index=19"],
          ["OpenID Foundation · OIDC의 역할", "https://openid.net/developers/how-connect-works/"],
          ["IETF RFC 7519 · JWT 형식", "https://www.rfc-editor.org/rfc/rfc7519"],
          ["OWASP · 요청별 권한 검증", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"],
        ].map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-4">{label}</a></li>)}</ul>
      </section>
    </ReferencePage>
  );
}
