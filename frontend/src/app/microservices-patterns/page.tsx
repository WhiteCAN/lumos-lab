import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { ReferencePage, ComparisonTable, FlowSection } from "@/components/reference-page";
import { getStudyMetadata, getStudyPage } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/microservices-patterns");
const sections = [
  [
    "API Gateway",
    "클라이언트의 진입점에서 라우팅·인증·호출 제한을 공통 처리합니다. 게이트웨이에 업무 로직이 집중되거나 병목이 생기지 않도록 범위를 제한합니다."
  ],
  [
    "Service Discovery",
    "변하는 서비스 인스턴스 주소를 탐색합니다. Kubernetes Service·DNS 또는 레지스트리 등을 사용하며 등록만으로 서비스가 항상 건강하다고 보장하지 않습니다."
  ],
  [
    "Circuit Breaker",
    "실패가 누적된 의존성 호출을 잠시 차단하고 제한적으로 복구를 확인합니다. Closed·Open·Half-Open 상태를 사용합니다. 타임아웃과 대체 응답의 의미도 함께 설계합니다."
  ],
  [
    "Retry",
    "일시적 실패에 한해 제한된 횟수로 재시도합니다. 지수 백오프·지터·총 시간 예산을 두고, 결제처럼 중복 실행이 위험한 작업은 멱등성을 확보합니다. 여러 계층의 재시도가 곱해질 수 있습니다."
  ],
  [
    "Bulkhead",
    "의존성별 스레드·연결 풀이나 동시 실행 한도를 분리합니다. 한 경로의 자원 고갈을 격리하지만 용량 분배와 운영 비용이 생깁니다."
  ],
  [
    "Asynchronous Communication",
    "이벤트·메시지를 통해 생산자와 소비자의 시간적 결합을 낮춥니다. 중복·순서·재처리·실패 메시지·지연을 다뤄야 하며 큐만 도입한다고 전달 보장이 완성되지는 않습니다."
  ],
  [
    "Saga",
    "여러 서비스의 로컬 트랜잭션을 연결하고 실패 시 보상 작업을 수행합니다. 오케스트레이션과 코레오그래피가 있습니다. 보상은 DB 롤백과 같지 않고 보상 자체도 실패할 수 있습니다."
  ],
  [
    "CQRS",
    "명령 처리와 조회 모델을 분리합니다. 별도 DB는 필수가 아니며 복잡한 읽기 요구에서 유용합니다. 모델을 비동기로 갱신하면 일시적인 지연을 사용자에게 설명해야 합니다."
  ],
  [
    "Event Sourcing",
    "상태 변경 이벤트를 기록의 기준으로 보존하고 상태를 재구성합니다. 단순 메시지 발행이나 로그 저장과 다릅니다. 이벤트 스키마 진화·재생 비용·개인정보 삭제를 고려합니다. CQRS와 결합할 수 있으나 필수 관계는 아닙니다."
  ],
  [
    "Strangler Fig",
    "트래픽을 기능 단위로 새 구현에 넘겨 기존 시스템을 점진 교체합니다. 구·신 시스템의 데이터 소유권, 이중 쓰기, 되돌리기 전략이 필요합니다."
  ],
  [
    "Sidecar",
    "애플리케이션 옆 프로세스·컨테이너로 프록시·관측 등 공통 기능을 배치합니다. 배포와 자원 사용이 늘며 서비스 메시와 동의어가 아닙니다."
  ],
  [
    "Service Mesh",
    "서비스 간 통신 정책·보안·관측을 인프라 계층에서 관리합니다. Sidecar 방식만 있는 것은 아닙니다. 운영 복잡성과 자원 비용이 도입 이익보다 큰지 먼저 확인합니다."
  ],
  [
    "도입 기준: 해결할 문제부터 고릅니다",
    "트래픽·장애·팀의 배포 독립성에 대한 실제 요구를 먼저 확인합니다. 작은 서비스에 12가지를 모두 적용하는 것은 목표가 아닙니다. 모듈화된 모놀리스가 운영 비용과 트랜잭션 단순성 측면에서 더 적합할 수 있습니다."
  ]
];
const steps = [
  "문제 확인: 결제 서비스 지연",
  "Timeout·Bulkhead로 대기와 자원 제한",
  "멱등성 확인 후 제한된 Retry",
  "지속 장애는 Circuit Breaker로 차단",
  "메트릭·추적으로 결과 검증"
];
const rows = [
  {
    "topic": "외부 진입·주소 변경",
    "values": [
      "클라이언트 결합과 동적 인스턴스",
      "API Gateway·Service Discovery"
    ]
  },
  {
    "topic": "장애 확산",
    "values": [
      "무한 대기·반복 실패·자원 고갈",
      "Circuit Breaker·Retry·Bulkhead"
    ]
  },
  {
    "topic": "데이터와 작업 흐름",
    "values": [
      "시스템 간 연결·분산된 상태 변경",
      "비동기 통신·Saga·CQRS·Event Sourcing"
    ]
  },
  {
    "topic": "전환·공통 운영",
    "values": [
      "점진 교체와 통신 정책 관리",
      "Strangler·Sidecar·Service Mesh"
    ]
  }
];
const refs = [
  [
    "Microsoft · 클라우드 설계 패턴",
    "https://learn.microsoft.com/en-us/azure/architecture/patterns/"
  ]
];
const related = [
  "/circuit-breaker",
  "/messaging/saga-outbox",
  "/architecture"
];

export default function Page() {
  return (
<ReferencePage pageHref="/microservices-patterns" label="개념 · 흐름 · 선택 기준" description="진입점, 장애 격리, 데이터 일관성, 점진 전환 문제에 맞춰 패턴을 선택합니다." icon={BookOpenIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
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
  "해결하는 문제",
  "선택할 패턴"
]} rows={rows} />
      <section className="rounded-xl border bg-card p-5 [overflow-wrap:anywhere]">
        <h2 className="text-lg font-semibold">출처와 함께 읽기</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">원문 이미지와 캡션을 한국어로 재구성하고 아래 공식 문서로 조건과 주의점을 보완했습니다. 예제와 흐름은 학습용으로 작성했으며 실제 서비스 호출을 수행하지 않습니다.</p>
        <a href="https://www.instagram.com/reels/DdhFOHFhGNb/" className="mt-3 inline-block text-sm underline underline-offset-4">Instagram 원문</a>
        <ul className="mt-3 grid gap-2 text-sm">{refs.map(([title, href]) => <li key={href}><a href={href} className="underline underline-offset-4">{title}</a></li>)}</ul>
        <div className="mt-5 flex flex-wrap gap-3 border-t pt-4 text-sm">{related.map(href => <Link key={href} href={href} className="underline underline-offset-4">{getStudyPage(href).title}</Link>)}</div>
      </section>
    </ReferencePage>
  );
}
