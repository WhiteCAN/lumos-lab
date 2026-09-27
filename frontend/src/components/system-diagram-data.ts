import type { FlowIconName } from "./technology-icon";

export type DiagramNode = { id: string; label: string; icon: FlowIconName; role: string; detail: string; x: number; y: number };
export type DiagramLink = { source: string; target: string; label: string };
export type DiagramScene = { label: string; summary: string; links: DiagramLink[]; nodeIds?: string[] };
export type Diagram = { title: string; nodes: DiagramNode[]; scenes: DiagramScene[] };
const link = (source: string, target: string, label: string): DiagramLink => ({ source, target, label });

export const systemDiagrams: Record<"redis" | "spring" | "kafka", Diagram> = {
  redis: {
    title: "Redis · 요청이 지나가는 길",
    nodes: [
      { id: "app", label: "애플리케이션", icon: "server", role: "조회와 캐시 갱신", detail: "애플리케이션이 Redis와 DB를 각각 호출합니다. Redis가 직접 DB를 조회하는 구조가 아닙니다.", x: 0, y: 120 },
      { id: "cache", label: "Redis", icon: "redis", role: "키와 TTL로 저장", detail: "키가 있고 유효하면 캐시 값을 반환합니다. 만료되거나 값이 없으면 애플리케이션이 DB를 조회합니다.", x: 340, y: 0 },
      { id: "db", label: "원본 데이터베이스", icon: "database", role: "원본 데이터 조회", detail: "캐시 미스 시 조회한 결과를 애플리케이션이 Redis에 저장합니다. TTL과 무효화 정책은 별도로 정해야 합니다.", x: 340, y: 260 },
    ],
    scenes: [
      { label: "캐시 적중", summary: "Redis에서 값을 찾아 반환합니다. DB 조회는 생략합니다.", links: [link("app", "cache", "① GET"), link("cache", "app", "② 캐시 값 반환")] },
      { label: "캐시 미스", summary: "GET 결과가 없으면 앱이 DB를 조회하고 Redis에 결과를 저장합니다. 번호는 처리 순서입니다.", links: [link("app", "cache", "① GET → 없음 · ③ SET EX"), link("app", "db", "② 원본 조회·결과 수신")] },
      { label: "캐시 무효화", summary: "DB 변경 성공 뒤 캐시를 삭제하는 예시입니다. 동시 요청과 삭제 실패에 대한 정책은 별도로 필요합니다.", links: [link("app", "db", "① DB 변경"), link("app", "cache", "② DEL")] },
    ],
  },
  spring: {
    title: "Spring · 시스템 안에서 기능 연결하기",
    nodes: [
      { id: "user", label: "사용자", icon: "user", role: "요청 시작", detail: "클라이언트가 API를 호출합니다. 인증과 업무 권한은 각 경계에서 검증합니다.", x: 0, y: 160 },
      { id: "gateway", label: "API Gateway", icon: "spring", role: "라우팅 · 공통 필터", detail: "Spring Cloud Gateway를 사용하는 예시입니다. 서비스로 요청을 전달하며 업무 권한 검사를 모두 대신하지는 않습니다.", x: 290, y: 160 },
      { id: "service", label: "Spring 서비스", icon: "spring", role: "업무 처리 · 정책 적용", detail: "@Cacheable, @Transactional 같은 기능은 설정된 저장소와 트랜잭션 경계 안에서 동작합니다.", x: 580, y: 160 },
      { id: "cache", label: "Redis", icon: "redis", role: "선택 가능한 캐시 저장소", detail: "Spring 캐시 추상화의 저장소 예시입니다. Redis 연결과 TTL·무효화 설정은 별도로 필요합니다.", x: 900, y: 0 },
      { id: "db", label: "데이터베이스", icon: "database", role: "로컬 트랜잭션", detail: "@Transactional은 해당 트랜잭션 매니저의 경계를 제어합니다. 외부 HTTP 요청까지 원자성을 보장하지 않습니다.", x: 900, y: 160 },
      { id: "external", label: "외부 서비스", icon: "server", role: "HTTP · 장애 경계", detail: "FeignClient로 호출할 수 있습니다. 타임아웃과 Circuit Breaker는 별도 라이브러리·설정이 필요합니다.", x: 900, y: 320 },
    ],
    scenes: [
      { label: "전체 구성", summary: "대표 기능을 연결한 학습용 구성입니다. 모든 요청이 세 저장소·서비스를 전부 호출하는 것은 아닙니다.", links: [link("user", "gateway", "HTTP"), link("gateway", "service", "라우팅"), link("service", "cache", "캐시"), link("service", "db", "트랜잭션"), link("service", "external", "HTTP 호출")] },
      { label: "캐시 조회", summary: "서비스가 캐시를 먼저 확인합니다. 미스 시 DB 조회 후 캐시에 저장하는 정책을 적용할 수 있습니다.", links: [link("user", "gateway", "요청"), link("gateway", "service", "라우팅"), link("service", "cache", "① 캐시 확인"), link("service", "db", "② 미스 시 조회")] },
      { label: "외부 호출", summary: "외부 호출 경로를 강조합니다. 차단 상태에서는 실제 호출을 생략하고 실패·대체 응답 정책을 적용합니다.", links: [link("user", "gateway", "요청"), link("gateway", "service", "라우팅"), link("service", "external", "Circuit Breaker 경계")] },
    ],
  },
  kafka: {
    title: "Kafka · 파티션과 소비자 연결",
    nodes: [
      { id: "producer", label: "주문 Producer", icon: "server", role: "orders 토픽에 발행", detail: "키와 파티셔너에 따라 대상 파티션이 정해집니다. 그림은 하나의 토픽에 파티션 3개가 있는 예시입니다.", x: 0, y: 180 },
      ...[0, 1, 2].map((p) => ({ id: `p${p}`, label: `Partition ${p}`, icon: "apachekafka" as const, role: `Broker ${p + 1} · Leader`, detail: `Partition ${p}의 리더입니다. 다른 두 브로커에도 이 파티션의 Follower가 있습니다. 아래 배치표에서 전체 9개 복제본을 확인하세요.`, x: 330, y: p * 180 })),
      { id: "a", label: "Consumer A", icon: "server", role: "shipping · P0, P1", detail: "배송 그룹에서 파티션 0과 1을 담당합니다. 할당은 리밸런싱으로 변경될 수 있습니다.", x: 700, y: 0 },
      { id: "b", label: "Consumer B", icon: "server", role: "shipping · P2", detail: "같은 배송 그룹의 Consumer B는 파티션 2를 담당합니다. 같은 그룹의 A와 작업을 분담합니다.", x: 700, y: 180 },
      { id: "c", label: "Consumer C", icon: "server", role: "analytics · P0, P1, P2", detail: "분석 그룹은 배송 그룹과 독립적으로 같은 로그를 읽습니다. 그룹별 커밋 위치도 독립적입니다.", x: 700, y: 360 },
      { id: "f1", label: "P0 Follower", icon: "apachekafka", role: "Broker 2 · 복제본", detail: "Broker 1의 P0 리더 로그를 복제합니다. Broker 2에는 별도로 P1 리더도 존재합니다.", x: 700, y: 0 },
      { id: "f2", label: "P0 Follower", icon: "apachekafka", role: "Broker 3 · 복제본", detail: "같은 P0 로그의 사본입니다. 리더 선출 자격과 데이터 손실 위험은 ISR·acks 등 설정에 따라 달라집니다.", x: 700, y: 180 },
    ],
    scenes: [
      { label: "이벤트 발행", summary: "가능한 발행 경로입니다. 이벤트 한 건은 선택된 파티션 하나에 기록됩니다. Follower·컨트롤러는 이 그림에서 생략했습니다.", links: [0, 1, 2].map((p) => link("producer", `p${p}`, `키에 따라 P${p} 선택`)) },
      { label: "배송 그룹", summary: "A는 P0·P1, B는 P2를 읽습니다. 화살표는 데이터 이동 방향이며 Consumer가 가져오는 방식입니다.", links: [link("p0", "a", "P0 읽기"), link("p1", "a", "P1 읽기"), link("p2", "b", "P2 읽기")] },
      { label: "분석 그룹", summary: "별도 그룹 C는 모든 파티션을 독립적으로 읽습니다. 배송 그룹의 읽기 위치에 영향을 주지 않습니다.", links: [0, 1, 2].map((p) => link(`p${p}`, "c", `P${p} 읽기`)) },
      { label: "P0 복제", summary: "P0만 펼친 예시입니다. 리더의 로그를 나머지 두 브로커의 Follower가 복제합니다. P1·P2도 각각 사본 3개를 유지합니다.", nodeIds: ["producer", "p0", "f1", "f2"], links: [link("producer", "p0", "P0에 발행"), link("p0", "f1", "로그 복제"), link("p0", "f2", "로그 복제")] },
    ],
  },
};
