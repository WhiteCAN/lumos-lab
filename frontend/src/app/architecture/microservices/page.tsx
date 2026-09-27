import Link from "next/link";
import { NetworkIcon } from "lucide-react";
import { ReferencePage, ComparisonTable, FlowSection } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/architecture/microservices");

const resilience = [
  ["Timeout", "얼마나 기다릴 것인가", "연결과 응답 대기에 한도를 둡니다. 호출자가 포기해도 결제 서버는 이미 처리했을 수 있으므로 실패 응답을 미처리로 단정하지 않습니다."],
  ["Retry", "다시 시도해도 안전한가", "일시적인 실패만 횟수 제한·지수 백오프·jitter로 재시도합니다. 여러 계층에서 동시에 재시도하면 부하가 곱절로 늘어납니다."],
  ["Circuit Breaker", "지금 호출을 막아야 하는가", "실패율 등 정책에 따라 CLOSED → OPEN으로 전환하고, 대기 뒤 HALF_OPEN에서 제한된 시험 호출로 회복을 확인합니다. 동시 실행 수 제한은 별도입니다."],
  ["Bulkhead", "어디까지 자원을 공유할 것인가", "외부 결제와 상품 조회에 별도 동시 실행 한도나 풀을 두어 느린 의존성이 전체 자원을 차지하지 못하게 합니다."],
  ["Rate Limiting", "일정 시간에 얼마나 허용할 것인가", "사용자·키·서비스별 요청량을 제한합니다. 과다 요청에는 명확한 거절 정책을 적용하고 재시도 폭주를 막습니다."],
  ["Idempotency", "같은 작업이 두 번 들어오면", "업무 키와 처리 결과를 기록하여 중복 결제 같은 부작용을 막습니다. 키 범위·보관 기간·동시 요청·같은 키의 다른 입력 처리까지 정의해야 합니다."],
];

export default function MicroservicesPage() {
  return <ReferencePage pageHref="/architecture/microservices" label="서비스 경계부터 운영까지" icon={NetworkIcon}
    colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20"
    description="서비스를 작게 나누는 것보다 독립적으로 변경·배포할 수 있는 경계를 정하는 것이 먼저입니다. 주문 서비스를 예로 통신, 데이터 소유권, 장애 복구를 연결해서 살펴봅니다.">
    <section className="rounded-lg border bg-card p-4 text-sm leading-6">
      <h2 className="text-lg font-semibold">출처와 학습 범위</h2>
      <p className="mt-2 text-muted-foreground"><a href="https://www.instagram.com/p/DcbvaoljcOg/" className="underline underline-offset-4">@java_interview_prep의 Microservices Complete Interview Guide</a>의 캡션과 4/10 Gateway·Discovery 슬라이드를 확인해 구성했습니다. 전체 10장 전사본이 아니며, 아래 설명은 공식 기술 문서와 패턴 저자 자료로 보완했습니다.</p>
      <p className="mt-2">실행 패널은 기존 Spring API의 Outbox·중복 처리 메모리 모형입니다. 실제 서비스 분리, Gateway, Registry, 영속 DB, 메시지 브로커를 실행하지 않습니다.</p>
    </section>

    <section className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold">1. 언제 나눌 것인가</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">작은 팀, 변하는 요구사항, 함께 배포하는 기능이라면 모듈 경계가 있는 모놀리스부터 시작할 수 있습니다. 주문과 검색의 배포 주기·부하·담당 팀이 실제로 다르고 운영 기반이 준비되었을 때 서비스 분리를 검토합니다. 파일 수나 테이블 수만으로 나누지 않습니다.</p>
    </section>
    <ComparisonTable columns={["모듈형 모놀리스", "마이크로서비스"]} rows={[
      { topic: "배포", values: ["모듈을 한 애플리케이션으로 배포", "업무 서비스별 독립 배포가 목표"] },
      { topic: "통신", values: ["주로 프로세스 내부 호출", "네트워크 지연·부분 실패를 계약에 포함"] },
      { topic: "데이터", values: ["로컬 트랜잭션을 활용하기 쉬움", "서비스가 스키마와 쓰기 권한을 소유"] },
      { topic: "확장", values: ["애플리케이션 단위 확장이 일반적", "부하가 큰 서비스만 독립 확장 가능"] },
      { topic: "비용", values: ["초기 배포·테스트가 상대적으로 단순", "추적·배포 자동화·계약 검증·장애 대응 비용 증가"] },
    ]} />

    <section className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold">2. Gateway와 Discovery는 서로 다른 문제를 풉니다</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border p-4"><h3 className="font-semibold">Gateway · 요청의 입구</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">클라이언트의 요청을 주문·결제·사용자 서비스로 라우팅합니다. 인증, rate limit, TLS 종료, 공통 로그를 적용할 수 있습니다. 서비스의 업무 권한 검사와 도메인 로직까지 이곳으로 몰지 않습니다.</p></article>
        <article className="rounded-lg border p-4"><h3 className="font-semibold">Discovery · 현재 주소 찾기</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">인스턴스의 등록·상태·주소 변경을 반영합니다. Eureka·Consul 같은 레지스트리 또는 Kubernetes Service와 DNS를 활용할 수 있습니다. 레지스트리를 모든 업무 요청이 통과하는 중계 서버로 그리면 안 됩니다.</p></article>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">예: Gateway가 order-service 목적지를 확인해 실제 주문 인스턴스로 전달합니다. Kubernetes에서는 Service가 안정된 접근점을 제공하므로 애플리케이션이 반드시 Eureka에도 등록해야 하는 것은 아닙니다.</p>
    </section>
    <FlowSection title="주문 요청의 데이터 경로" steps={["Client: 주문 요청", "Gateway: 경로·공통 정책", "Order Service: 업무 권한·주문 처리", "Order DB: 주문 데이터 저장"]} />

    <section className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold">3. 동기 호출과 비동기 메시지</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border p-4"><h3 className="font-semibold">지금 답이 필요하면 동기</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">상품 가격 확인처럼 요청 처리에 즉시 필요한 결과를 HTTP·gRPC로 받습니다. 호출이 길게 연결되면 느린 하위 서비스가 사용자 응답 시간과 가용성에 영향을 줍니다. 전체 시간 예산을 나눠 각 호출의 timeout을 정합니다.</p></article>
        <article className="rounded-lg border p-4"><h3 className="font-semibold">나중에 완료해도 되면 비동기</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">주문 완료 후 이메일은 이벤트로 분리할 수 있습니다. 대신 지연·중복·순서·실패 재처리를 설계해야 합니다. 메시지 수신과 업무 완료는 같지 않으며 화면에는 처리 중·실패·완료 상태를 보여줍니다.</p></article>
      </div>
    </section>

    <section className="rounded-lg border bg-card p-4 text-sm leading-6">
      <h2 className="text-lg font-semibold">4. Database per Service는 데이터 소유권입니다</h2>
      <p className="mt-2 text-muted-foreground">Order는 주문, Payment는 결제 데이터를 소유합니다. 다른 서비스의 테이블을 직접 수정하거나 내부 스키마에 의존하면 독립 배포가 어려워집니다. 서비스 API나 이벤트로 협력하고, 조회에는 API 조합 또는 갱신 지연을 허용하는 읽기 모델을 사용할 수 있습니다.</p>
      <p className="mt-2 text-muted-foreground">반드시 서비스마다 물리 DB 서버 한 대가 필요한 것은 아닙니다. 중요한 것은 접근 권한과 변경 책임의 분리입니다. 반대로 서버만 나누고 서로의 테이블을 직접 참조하면 결합은 남습니다.</p>
      <h3 className="mt-4 font-semibold">주문 저장과 결제 승인을 하나의 @Transactional로 묶을 수 있을까?</h3>
      <p className="mt-2">일반적인 로컬 트랜잭션은 원격 결제 서비스까지 원자적으로 커밋하지 않습니다. 결제 성공 뒤 응답이 유실될 수도 있습니다. 조회·재시도·보상 절차와 사용자에게 보여줄 중간 상태가 필요합니다.</p>
    </section>

    <section className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold">5. Saga와 Outbox를 함께 이해하기</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border p-4"><h3 className="font-semibold">Saga · 업무를 어떻게 완결할까</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">주문 대기 → 결제 승인 → 재고 예약을 각각 로컬 트랜잭션으로 수행합니다. 재고 예약 실패 시 결제 취소 같은 보상 작업을 실행합니다. 보상은 자동 DB rollback이 아니며 실패 시 재시도와 수동 조정도 필요합니다. 이벤트 협력 방식과 중앙 조정 방식이 있습니다.</p></article>
        <article className="rounded-lg border p-4"><h3 className="font-semibold">Outbox · 저장 후 이벤트 누락을 어떻게 막을까</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">주문 변경과 발행할 이벤트를 같은 DB 트랜잭션에 기록합니다. 별도 relay가 이벤트를 전송합니다. 발행 후 완료 표시 전에 장애가 나면 재전송되므로 소비자는 이벤트 ID로 중복 부작용을 막아야 합니다. Outbox만으로 exactly-once 처리를 보장하지 않습니다.</p></article>
      </div>
      <Link href="/messaging/saga-outbox" className="mt-3 inline-block text-sm text-sky-700 underline dark:text-sky-300">Saga·Outbox 상세 설명과 기존 실습 →</Link>
    </section>

    <section className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold">6. 장애 대책은 역할을 나눠 조합합니다</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{resilience.map(([name, question, description]) => <article key={name} className="rounded-lg border p-4"><h3 className="font-semibold">{name}</h3><p className="mt-1 text-sm font-medium">{question}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article>)}</div>
      <Link href="/circuit-breaker" className="mt-3 inline-block text-sm text-sky-700 underline dark:text-sky-300">Circuit Breaker 상태와 실습 →</Link>
    </section>

    <section className="rounded-lg border bg-card p-4 text-sm leading-6">
      <h2 className="text-lg font-semibold">7. Logs·Metrics·Traces로 원인 좁히기</h2>
      <ul className="mt-3 grid gap-2">
        <li><strong>Metrics:</strong> 오류율·지연·트래픽이 평소와 다른지 확인합니다. 사용자 ID처럼 값의 종류가 많은 항목을 무분별한 지표 라벨로 쓰지 않습니다.</li>
        <li><strong>Traces:</strong> 같은 요청이 Gateway → Order → Payment에서 어디에 시간을 썼는지 span으로 봅니다. HTTP와 메시지 경계에 추적 문맥을 전달해야 연결됩니다.</li>
        <li><strong>Logs:</strong> trace ID와 업무 식별자로 당시 오류·상태 전이를 찾습니다. 토큰·결제 정보 같은 민감값은 기록하지 않습니다.</li>
      </ul>
      <p className="mt-3 text-muted-foreground">독립 배포를 실제로 유지하려면 API·이벤트 호환성, 계약 테스트, 점진 배포와 rollback, 서비스별 담당자·알림 기준도 준비해야 합니다.</p>
    </section>

    <section className="rounded-lg border bg-card p-4 text-sm leading-6">
      <h2 className="text-lg font-semibold">대표 API 실습에서 확인할 것</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li>상단 패널에서 values=[1,2,2], fail=false로 실행합니다. orders에는 중복 입력이 남고 published에는 1,2만 남는 차이를 봅니다.</li>
        <li>fail=true로 바꾸면 임시 주문·이벤트가 함께 폐기되고 발행 결과가 비는지 확인합니다. 이것은 HTTP 장애가 아닌 업무 실패 모형입니다.</li>
        <li>같은 요청을 다시 보내면 상태가 새로 만들어집니다. 요청 간 영속 멱등성이나 실제 relay 재전송 검증은 아닙니다.</li>
      </ol>
      <p className="mt-3 break-words text-muted-foreground">브레이크포인트: backend/src/main/java/com/lumos/lab/learning/ScenarioLabService.java의 outbox(). stagedOrders·stagedEvents·published와 반환 result를 비교합니다. values는 -10000~10000의 정수 1~30개입니다. parameter는 이 모형에서 사용하지 않지만 공통 요청 검증 범위는 -10000~10000입니다. values=[]는 HTTP 400이며, 공통 패널에서 오류·로딩·요청/응답을 확인합니다.</p>
    </section>

    <section className="rounded-lg border bg-card p-4 text-sm leading-6">
      <h2 className="text-lg font-semibold">공식 문서·패턴 근거와 다음 학습</h2>
      <ul className="mt-3 space-y-2">
        <li><a className="underline" href="https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices">Microsoft: 마이크로서비스의 경계·장점·운영 비용</a></li>
        <li><a className="underline" href="https://kubernetes.io/docs/concepts/services-networking/service/">Kubernetes: Service와 서비스 발견</a></li>
        <li><a className="underline" href="https://microservices.io/patterns/data/saga.html">Chris Richardson: Saga</a> · <a className="underline" href="https://microservices.io/patterns/data/transactional-outbox.html">Transactional Outbox</a></li>
        <li><a className="underline" href="https://resilience4j.readme.io/docs/circuitbreaker">Resilience4j: CircuitBreaker 상태와 동시 실행 제한의 차이</a></li>
        <li><a className="underline" href="https://opentelemetry.io/docs/concepts/signals/">OpenTelemetry: 관측 신호</a></li>
        <li><Link className="underline" href="/architecture">DDD·클린·헥사고날로 서비스 내부 경계 정하기</Link> · <Link className="underline" href="/messaging/kafka-architecture">Kafka 메시지 처리 구조</Link></li>
      </ul>
    </section>
  </ReferencePage>;
}
