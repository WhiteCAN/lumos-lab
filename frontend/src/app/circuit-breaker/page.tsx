import type { Metadata } from "next";
import { CodeBlock, ComparisonTable, ConceptGrid, FlowSection, ReferencePage } from "@/components/reference-page";
import { CheckCircle2Icon, ShieldCheckIcon, RefreshCcwIcon, ShieldAlertIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Circuit Breaker | Lumos Lab",
  description: "장애 전파 방지, 상태 전환, Resilience4j 설정과 운영 시 주의점을 정리합니다.",
};

const states = [
  { title: "CLOSED · 정상 호출", description: "요청을 전달하면서 최근 호출 결과를 관찰합니다.", bullets: ["최소 호출 수를 채운 뒤 실패율과 느린 호출 비율 평가", "설정 임계값 이상이면 OPEN으로 전환"], icon: CheckCircle2Icon, colorClass: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20" },
  { title: "OPEN · 호출 차단", description: "하위 서비스를 호출하지 않고 빠르게 거절합니다.", bullets: ["CallNotPermittedException 발생", "대기 시간이 지난 뒤 복구 확인 단계로 이동"], icon: ShieldAlertIcon, colorClass: "border-rose-200 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20" },
  { title: "HALF-OPEN · 복구 확인", description: "제한된 시험 호출로 서비스 상태를 다시 평가합니다.", bullets: ["시험 호출의 실패율·느린 호출 비율이 임계값 미만이면 CLOSED", "어느 비율이든 임계값 이상이면 다시 OPEN"], icon: RefreshCcwIcon, colorClass: "border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20" },
];

const configuration = `resilience4j:
  circuitbreaker:
    instances:
      paymentService:
        slidingWindowType: COUNT_BASED
        slidingWindowSize: 20
        minimumNumberOfCalls: 10
        failureRateThreshold: 50
        slowCallDurationThreshold: 2s
        slowCallRateThreshold: 50
        waitDurationInOpenState: 30s
        permittedNumberOfCallsInHalfOpenState: 5
        automaticTransitionFromOpenToHalfOpenEnabled: true`;

const example = `// Spring Boot 3 + Resilience4j의 어노테이션 사용 예시
// RestClient에는 별도로 연결·응답 타임아웃을 설정합니다.
@Service
public class PaymentStatusService {
    private final RestClient client;

    public PaymentStatusService(RestClient client) {
        this.client = client;
    }

    @CircuitBreaker(name = "paymentService", fallbackMethod = "unavailable")
    public String status(String paymentId) {
        return client.get().uri("/payments/{id}/status", paymentId)
                .retrieve().body(String.class);
    }

    // 원래 인자 + 처리할 예외, 동일한 반환 타입
    private String unavailable(String paymentId, CallNotPermittedException ex) {
        return "결제 상태 확인 불가";
    }

    private String unavailable(String paymentId, ResourceAccessException ex) {
        return "결제 상태 확인 불가";
    }
}`;

const questions = [
  ["자동으로 재시도하나요?", "재시도는 Retry의 역할입니다. 호출 차단과 재시도를 구분하고, 재시도 횟수·간격·전체 요청 시간을 함께 제한합니다."],
  ["실패 한 번이면 열리나요?", "최소 표본과 임계값에 따라 달라집니다. 예시 설정에서는 9번 모두 실패해도 최소 호출 수 10을 채우기 전에는 열리지 않습니다."],
  ["4xx도 실패로 세나요?", "HTTP 상태를 직접 해석하는 장치가 아닙니다. 클라이언트가 던지는 예외와 기록·무시 정책을 정해야 합니다. 입력 오류와 하위 서비스 장애를 구분합니다."],
  ["OPEN이면 서버가 죽은 건가요?", "호출하는 쪽에서 잠시 접근을 중단한 상태입니다. 서버가 느리거나 일부 요청만 실패해도 열릴 수 있습니다."],
  ["느린 요청을 중간에 끊나요?", "느린 호출 비율을 기록할 수 있지만 실행 중인 네트워크 요청을 직접 중단하지는 않습니다. HTTP 타임아웃과 필요에 맞는 TimeLimiter를 함께 설계합니다."],
  ["fallback은 항상 성공 응답인가요?", "업무상 허용되는 대체 결과만 반환합니다. 결제 상태를 모르면 확인 불가로 표시해야 하며 결제 성공으로 바꾸면 안 됩니다."],
  ["임계값은 어떻게 정하나요?", "정상 지연 시간, 트래픽, 오류율과 서비스 목표를 바탕으로 정합니다. 예시 숫자를 운영 기본값으로 복사하지 말고 부하·장애 시험으로 조정합니다."],
  ["예외를 무시하면 fallback도 안 타나요?", "실패 통계와 fallback 선택은 별개입니다. ignoreExceptions는 통계에서 제외하는 설정이고, fallback은 발생한 예외 타입에 맞춰 선택됩니다."],
  ["이것만 적용하면 충분한가요?", "동시 요청 제한은 Bulkhead, 대기 제한은 Timeout이 맡습니다. 재시도와 fallback까지 함께 설계하고 상태 전환·거절 호출·오류율을 관찰합니다."],
];

export default function CircuitBreakerPage() {
  return (
    <ReferencePage breadcrumb="레퍼런스 / Circuit Breaker" label="장애 격리와 복구" title="Circuit Breaker 개념 정리"
      description="결제 서비스 하나가 느려졌을 때 주문 서비스까지 멈추지 않도록, 최근 호출 결과를 보고 잠시 호출을 차단하는 패턴입니다. 장애가 있는 서비스에는 회복할 시간을 주고 호출하는 쪽의 자원 소모를 줄입니다."
      icon={ShieldCheckIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
      <FlowSection title="왜 필요한가: 장애가 전파되는 과정" steps={["결제 응답 지연", "주문 요청 대기 누적", "스레드·연결 풀 고갈", "주문 서비스도 지연"]} colorClass="border-rose-200 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20" />
      <ConceptGrid items={states} />
      <FlowSection title="호출 경로" steps={["주문 서비스", "Circuit Breaker가 호출 허용 여부 판단", "결제 서비스", "결과 기록"]} colorClass="border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/20" />
      <p className="text-sm leading-6 text-muted-foreground">OPEN에서는 결제 서비스로 가지 않고 예외가 발생합니다. 별도로 설정한 fallback이 있다면 대체 응답을 반환할 수 있습니다. HALF-OPEN에서 허용된 시험 호출 수를 넘는 요청도 거절됩니다.</p>
      <ComparisonTable columns={["Timeout", "Retry", "Circuit Breaker"]} rows={[
        { topic: "판단 기준", values: ["얼마나 기다릴까?", "다시 시도할까?", "지금 호출해도 될까?"] },
        { topic: "대응", values: ["대기 시간 제한", "일시적 실패에 제한된 재시도", "최근 실패·지연에 따라 호출 차단"] },
        { topic: "주의", values: ["타임아웃이 원격 작업 취소를 보장하지 않음", "중복 결제 방지를 위한 멱등성·백오프 필요", "동시성 제한이나 실행 중 요청 취소를 대신하지 않음"] },
      ]} />
      <CodeBlock title="주요 설정 · 학습용 application.yml" code={configuration} />
      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">설정 읽는 법</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6">
          <li>최근 최대 20개 완료 호출을 집계하고, 10개 이상부터 실패율을 평가합니다. TIME_BASED를 선택하면 창 크기의 단위는 초입니다.</li>
          <li>최초 10개 결과 중 실패가 5개라면 50%이므로 OPEN입니다. 20개가 모두 쌓일 때까지 기다리지 않습니다.</li>
          <li>2초를 넘긴 호출은 느린 호출입니다. 그 비율이 50% 이상이어도 OPEN이 됩니다.</li>
          <li>30초 후 자동으로 HALF-OPEN으로 전환해 시험 호출 5개를 허용합니다. 자동 전환을 끄면 대기 시간 이후 들어오는 호출이 전환을 유발합니다.</li>
          <li>HALF-OPEN은 시험 표본으로 다시 평가합니다. 위 설정에서 5개 중 실패 2개는 40%, 3개는 60%입니다. 느린 호출 비율도 함께 판단합니다.</li>
        </ul>
      </section>
      <CodeBlock title="Spring 적용 예시 · 결제 상태 조회" code={example} />
      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">예시를 적용할 때</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Spring Boot 3용 설명 예시입니다. 해당 Starter와 AOP·Actuator 의존성이 필요하며, 프로젝트의 Spring Boot 버전에 맞는 호환성을 먼저 확인합니다. 위 코드는 이 실험실 백엔드에 연결된 기능이 아닙니다. RestClient Bean·기본 주소·타임아웃을 구성하고 다른 Spring Bean에서 메서드를 호출해야 프록시를 거칩니다.</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">예시는 회로 차단과 연결·I/O 오류만 대체 응답으로 처리합니다. 서버 오류 등 추가 예외의 처리 정책은 업무에 맞게 정합니다. Retry를 조합할 때는 적용 순서와 fallback 위치에 따라 실패가 통계에 기록되는 방식과 재시도 여부가 달라집니다.</p>
      </section>
      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">면접과 실무에서 헷갈리는 9가지</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {questions.map(([question, answer], index) => <article key={question} className="rounded-lg border p-4"><h3 className="font-semibold">{index + 1}. {question}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p></article>)}
        </div>
      </section>
      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">운영 점검과 한 줄 복습</h2>
        <p className="mt-3 text-sm leading-6">“최근 실패와 지연이 기준을 넘으면 호출을 차단하고, 잠시 뒤 제한된 호출로 복구를 확인한다.”</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">실패율·느린 호출 비율·거절 호출 수·상태 전환을 모니터링하고 장시간 OPEN 또는 잦은 상태 전환에 알림을 둡니다. 정상 응답, 연속 실패, 느린 응답, 복구 상황과 fallback 자체의 실패까지 시험합니다.</p>
      </section>
      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">출처와 더 읽기</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">java_interview_prep의 10장 캐러셀 주제를 한국어 학습 노트로 재구성하고, 상태 판정과 fallback 설명은 공식 문서로 보완했습니다.</p>
        <ul className="mt-3 grid gap-2 text-sm">
          <li><a className="underline underline-offset-4" href="https://www.instagram.com/java_interview_prep/p/DdMfJWdDdvA/?img_index=1" target="_blank" rel="noreferrer">원본 Instagram · Circuit Breaker Interview Guide</a></li>
          <li><a className="underline underline-offset-4" href="https://resilience4j.readme.io/docs/circuitbreaker" target="_blank" rel="noreferrer">Resilience4j · CircuitBreaker 상태와 설정</a></li>
          <li><a className="underline underline-offset-4" href="https://resilience4j.readme.io/docs/getting-started-3" target="_blank" rel="noreferrer">Resilience4j · Spring Boot 연동과 fallback</a></li>
        </ul>
      </section>
    </ReferencePage>
  );
}
