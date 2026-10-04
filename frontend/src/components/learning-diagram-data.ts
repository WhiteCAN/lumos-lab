import type { LearningGraph, LearningNode } from "./learning-flow-canvas";

const n = (id: string, label: string, x: number, y: number, detail?: string, icon: LearningNode["icon"] = "code"): LearningNode => ({id,label,x,y,detail,icon});
export const solidGraphs: Record<string, LearningGraph> = {
  S: {nodes:[n("service","UserService",0,0,"가입 정책"),n("impl","MemoryUserRepository",240,0,"메모리 저장 구현"),n("repo","UserRepository",120,240,"save(String) 계약")],edges:[{source:"service",target:"repo",label:"save 호출"},{source:"impl",target:"repo",label:"implements",dashed:true}]},
  O: {nodes:[n("circle","Circle",0,0,"원 면적"),n("calc","AreaCalculator",240,0,"면적 호출"),n("rect","Rectangle",480,0,"사각형 면적"),n("area","Area",240,240,"area() 계약")],edges:[{source:"calc",target:"area",label:"area 호출"},{source:"circle",target:"area",label:"implements",dashed:true},{source:"rect",target:"area",label:"implements",dashed:true}]},
  L: {nodes:[n("caller","Flight.launch",0,0,"비행 계약만 요구"),n("sparrow","Sparrow",240,0,"비행 구현"),n("bird","FlyingBird",120,240,"fly() 계약")],edges:[{source:"caller",target:"bird",label:"fly 호출"},{source:"sparrow",target:"bird",label:"implements",dashed:true}]},
  I: {nodes:[n("simple","SimplePrinter",0,0,"인쇄만 제공"),n("copy","CopyMachine",240,0,"인쇄·스캔 제공"),n("print","Printer",0,240,"print() 계약"),n("scan","ScannerDevice",240,240,"scan() 계약")],edges:[{source:"simple",target:"print",label:"implements",dashed:true},{source:"copy",target:"print",label:"implements",dashed:true},{source:"copy",target:"scan",label:"implements",dashed:true}]},
  D: {nodes:[n("order","OrderService",0,0,"상위 업무 정책"),n("card","CardPayment",240,0,"결제 모형 구현"),n("port","Payment",120,240,"pay(BigDecimal) 계약")],edges:[{source:"order",target:"port",label:"pay 호출"},{source:"card",target:"port",label:"implements",dashed:true}]},
};

export const referenceGraphs: Record<string, LearningGraph> = {
  sharding: {nodes:[n("app","애플리케이션",0,0,"회원 ID로 샤드 선택","server"),n("a","샤드 A",-140,240,"회원 1 ~ 500,000","database"),n("b","샤드 B",140,240,"회원 500,001 ~ 1,000,000","database")],edges:[{source:"app",target:"a",label:"범위 A"},{source:"app",target:"b",label:"범위 B"}]},
  replica: {nodes:[n("primary","Primary",0,0,"전체 회원 100만 명 · 쓰기","database"),n("a","Replica A",-140,240,"전체 회원 사본 · 읽기","database"),n("b","Replica B",140,240,"전체 회원 사본 · 읽기","database")],edges:[{source:"primary",target:"a",label:"변경 복제"},{source:"primary",target:"b",label:"변경 복제"}]},
  collections: {nodes:[n("iter","Iterable",0,0),n("coll","Collection",0,220),n("seq","SequencedCollection",-300,440),n("list","List",-300,700),n("set","Set",300,440),n("queue","Queue",0,440),n("deque","Deque",0,700),n("map","Map",600,0,"Collection과 별도 계층")],edges:[{source:"coll",target:"iter",label:"extends"},{source:"seq",target:"coll",label:"extends"},{source:"list",target:"seq",label:"extends"},{source:"set",target:"coll",label:"extends"},{source:"queue",target:"coll",label:"extends"},{source:"deque",target:"queue",label:"extends"},{source:"deque",target:"seq",label:"extends",dashed:true}]},

  "stack-heap": {
    nodes:[n("caller","run의 p",0,0,"호출자 지역 참조"),n("local","change의 local",0,200,"복사된 참조 값"),n("object","Person 객체 A",350,100,"공유 객체 · age=20","database")],
    edges:[{source:"caller",target:"object",label:"참조"},{source:"local",target:"object",label:"같은 객체 참조"}],
  },
  "saga-outbox": {
    nodes:[n("api","Client / API",0,0,"POST /orders","user"),n("order","Order Service",300,0,"주문 처리","spring"),n("db","orders + outbox_events",600,0,"하나의 로컬 DB 트랜잭션","database"),n("relay","Outbox Relay",900,0,"미발행 이벤트 조회","server"),n("kafka","Kafka Topic",900,220,"order-events","apachekafka"),n("consumer","Payment / Stock",600,220,"소비자별 로컬 업무 처리","server"),n("dedup","processed_message",300,220,"업무 변경과 중복 기록 원자화","database"),n("saga","Saga State",300,440,"업무 진행 상태","branch"),n("comp","Compensation",0,440,"결제 취소·재고 복구","code"),n("retry","Retry + Backoff",600,440,"일시 오류·횟수 제한","server"),n("dlq","DLQ",900,440,"반복 실패 격리","apachekafka"),n("observe","Logs / Metrics / Alert",900,660,"lag·실패율·재처리 관측","search")],
    edges:[{source:"api",target:"order",label:"HTTP"},{source:"order",target:"db",label:"같이 commit"},{source:"relay",target:"db",label:"미발행 조회"},{source:"relay",target:"kafka",label:"publish"},{source:"kafka",target:"consumer",label:"그룹별 소비"},{source:"consumer",target:"dedup",label:"멱등 처리"},{source:"consumer",target:"saga",label:"결과 이벤트"},{source:"saga",target:"comp",label:"실패 보상",dashed:true},{source:"consumer",target:"retry",label:"처리 오류",dashed:true},{source:"retry",target:"dlq",label:"한도 초과",dashed:true},{source:"dlq",target:"observe",label:"운영 대응",dashed:true}],
  },
};

export const kafkaRoutingGraph: LearningGraph = {
  nodes: [
    n("producer", "Producer", 0, 240, "이벤트 A·B·C", "server"),
    n("routing", "파티션 선택", 290, 240, "명시적 번호·키·파티셔너", "branch"),
    n("p0", "P0", 580, 0, "A: user-1 · 예시 배정", "apachekafka"),
    n("p1", "P1", 580, 240, "B: user-2 · 예시 배정", "apachekafka"),
    n("p2", "P2", 580, 480, "C: 키 없음 · 예시 배정", "apachekafka"),
  ],
  edges: [
    { source: "producer", target: "routing" },
    { source: "routing", target: "p0", label: "예시 A" },
    { source: "routing", target: "p1", label: "예시 B" },
    { source: "routing", target: "p2", label: "예시 C" },
  ],
};
