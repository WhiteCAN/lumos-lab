export type StudyPage = {
  href: string;
  title: string;
  category: string;
  description: string;
  keywords: string[];
  aliases: string[];
  simulated?: boolean;
};

export const studyCategories = [
  "알고리즘·자료구조",
  "Java·객체지향",
  "디자인 패턴",
  "Spring·백엔드",
  "데이터·메시징",
  "네트워크·API",
  "프론트엔드",
  "설계·테스트·배포",
  "AI·RAG"
] as const;

export const studyPages: readonly StudyPage[] = [
{
  "href": "/java/ordered-maps",
  "title": "TreeMap·LinkedHashMap: 정렬과 순서",
  "category": "Java·객체지향",
  "description": "키 정렬, 삽입 순서, 접근 순서를 구분하고 탐색 메서드와 시간 복잡도를 비교합니다.",
  "keywords": [
    "TreeMap",
    "LinkedHashMap",
    "NavigableMap",
    "트리맵",
    "순서",
    "LRU"
  ],
  "aliases": []
},
{
  "href": "/frontend/event-loop",
  "title": "JavaScript 이벤트 루프: 태스크·마이크로태스크",
  "category": "프론트엔드",
  "description": "동기 코드, Promise 콜백, 타이머의 실행 순서를 예제로 추적합니다.",
  "keywords": [
    "Event Loop",
    "이벤트 루프",
    "microtask",
    "queueMicrotask",
    "setTimeout",
    "Call Stack"
  ],
  "aliases": []
},
{
  "href": "/cors",
  "title": "CORS: 출처·사전 요청·인증 정보",
  "category": "네트워크·API",
  "description": "브라우저가 교차 출처 응답을 공개하는 조건과 OPTIONS 사전 요청을 이해합니다.",
  "keywords": [
    "CORS",
    "Same Origin Policy",
    "SOP",
    "Preflight",
    "OPTIONS",
    "credentials",
    "교차 출처"
  ],
  "aliases": []
},
{
  "href": "/microservices-patterns",
  "title": "마이크로서비스 설계 패턴 12가지",
  "category": "설계·테스트·배포",
  "description": "진입점, 장애 격리, 데이터 일관성, 점진 전환 문제에 맞춰 패턴을 선택합니다.",
  "keywords": [
    "Microservices",
    "마이크로서비스",
    "API Gateway",
    "CQRS",
    "Event Sourcing",
    "Saga",
    "Bulkhead",
    "Service Mesh",
    "Strangler",
    "Sidecar"
  ],
  "aliases": []
},
{
    "href": "/",
    "title": "정렬 알고리즘",
    "category": "알고리즘·자료구조",
    "description": "정렬 알고리즘의 실행 단계와 비교 횟수를 확인합니다.",
    "keywords": [
      "sorting",
      "bubble",
      "quick",
      "merge",
      "버블",
      "퀵",
      "병합"
    ],
    "aliases": [
      "정렬 알고리즘 실험실",
      "정렬 실험실"
    ]
  },
{
    "href": "/search",
    "title": "검색 알고리즘",
    "category": "알고리즘·자료구조",
    "description": "선형 검색과 이진 검색의 탐색 단계와 비교 횟수를 확인합니다.",
    "keywords": [
      "linear search",
      "binary search",
      "선형 검색",
      "이진 검색"
    ],
    "aliases": [
      "검색 알고리즘 실험실",
      "검색 실험실"
    ]
  },
{
    "href": "/algorithm-patterns",
    "title": "코딩 인터뷰 알고리즘 패턴",
    "category": "알고리즘·자료구조",
    "description": "입력 조건에 따라 코딩 인터뷰 문제의 풀이 패턴을 선택합니다.",
    "keywords": [
      "two pointers",
      "sliding window",
      "DFS",
      "BFS",
      "투 포인터",
      "슬라이딩 윈도우"
    ],
    "aliases": [
      "코딩 인터뷰 패턴 10가지",
      "코딩 인터뷰 패턴"
    ]
  },
{
    "href": "/datastructures/stack",
    "title": "스택",
    "category": "알고리즘·자료구조",
    "description": "스택에 값을 넣고 꺼내며 후입선출 동작을 확인합니다.",
    "keywords": [
      "stack",
      "LIFO",
      "push",
      "pop",
      "후입선출"
    ],
    "aliases": [
      "Stack 실험실",
      "스택"
    ]
  },
{
    "href": "/datastructures/queue",
    "title": "큐",
    "category": "알고리즘·자료구조",
    "description": "큐에 값을 넣고 꺼내며 선입선출 동작을 확인합니다.",
    "keywords": [
      "queue",
      "FIFO",
      "enqueue",
      "dequeue",
      "선입선출"
    ],
    "aliases": [
      "Queue 실험실",
      "큐"
    ]
  },
{
    "href": "/datastructures/heap",
    "title": "힙·우선순위 큐",
    "category": "알고리즘·자료구조",
    "description": "힙과 우선순위 큐의 삽입·추출 흐름을 확인합니다.",
    "keywords": [
      "heap",
      "priority queue",
      "PriorityQueue"
    ],
    "aliases": [
      "Heap / PriorityQueue 실험실",
      "힙"
    ]
  },
{
    "href": "/datastructures/graph",
    "title": "그래프 탐색: BFS·DFS",
    "category": "알고리즘·자료구조",
    "description": "그래프의 너비 우선 탐색과 깊이 우선 탐색을 비교합니다.",
    "keywords": [
      "graph",
      "BFS",
      "DFS",
      "너비 우선",
      "깊이 우선"
    ],
    "aliases": [
      "그래프 BFS / DFS 실험실",
      "그래프"
    ]
  },
{
    "href": "/oop-concepts",
    "title": "객체지향 핵심 개념",
    "category": "Java·객체지향",
    "description": "객체의 책임과 협력 관계를 중심으로 객체지향 개념을 정리합니다.",
    "keywords": [
      "OOP",
      "캡슐화",
      "상속",
      "다형성",
      "추상화"
    ],
    "aliases": [
      "객체지향 핵심 개념 15가지",
      "객체지향 핵심 개념"
    ]
  },
{
    "href": "/java/io-string",
    "title": "Java 입출력·문자열",
    "category": "Java·객체지향",
    "description": "Java 입력 파싱과 문자열 조립 방법을 비교합니다.",
    "keywords": [
      "Scanner",
      "BufferedReader",
      "StringTokenizer",
      "StringBuilder",
      "split"
    ],
    "aliases": [
      "Scanner, BufferedReader, StringTokenizer",
      "입출력 / 문자열"
    ]
  },
{
    "href": "/java/collections",
    "title": "Java 컬렉션",
    "category": "Java·객체지향",
    "description": "Java 컬렉션의 내부 구조와 메서드 실행 과정을 살펴봅니다.",
    "keywords": [
      "collection framework",
      "ArrayList",
      "LinkedList",
      "HashMap",
      "HashSet",
      "컬렉션"
    ],
    "aliases": [
      "Java Collection Framework",
      "컬렉션"
    ]
  },
{
    "href": "/java/equality-exception",
    "title": "Java 객체 비교·예외 처리",
    "category": "Java·객체지향",
    "description": "Java의 객체 동등성 비교와 예외 처리 흐름을 확인합니다.",
    "keywords": [
      "equals",
      "hashCode",
      "exception",
      "동등성",
      "동일성",
      "예외"
    ],
    "aliases": [
      "==, equals, hashCode / 예외 처리",
      "비교 / 예외"
    ]
  },
{
    "href": "/java/concurrency",
    "title": "Java 동시성",
    "category": "Java·객체지향",
    "description": "스레드·실행기·비동기 작업과 동기화 방법을 비교합니다.",
    "keywords": [
      "Thread",
      "Executor",
      "CompletableFuture",
      "synchronized",
      "thread pool",
      "스레드"
    ],
    "aliases": [
      "Thread, Executor, CompletableFuture, synchronized",
      "동시성"
    ]
  },
{
    "href": "/java/backend-interview",
    "title": "Java 백엔드 면접 핵심",
    "category": "Java·객체지향",
    "description": "Java 백엔드 면접에서 다루는 핵심 개념을 정리합니다.",
    "keywords": [
      "면접",
      "인터뷰",
      "JVM",
      "GC",
      "스레드",
      "컬렉션"
    ],
    "aliases": [
      "Java 백엔드 면접 핵심 정리",
      "백엔드 면접 핵심"
    ]
  },
{
    "href": "/spring-bean-di",
    "title": "Spring Bean·DI·IoC",
    "category": "Spring·백엔드",
    "description": "Bean 등록·생명주기·의존성 주입과 AOP 프록시를 정리합니다.",
    "keywords": [
      "의존성 주입",
      "dependency injection",
      "IoC",
      "빈",
      "컨테이너",
      "AOP",
      "자동 구성"
    ],
    "aliases": [
      "Spring Boot 핵심 · Bean, DI, IoC",
      "Spring Bean / DI"
    ]
  },
{
    "href": "/sync-async",
    "title": "동기·비동기 처리 비교",
    "category": "Spring·백엔드",
    "description": "같은 작업을 순차·병렬로 실행하며 소요 시간과 흐름을 비교합니다.",
    "keywords": [
      "sync",
      "async",
      "동기",
      "비동기",
      "병렬 처리"
    ],
    "aliases": [
      "동기 vs 비동기",
      "동기 / 비동기"
    ]
  },
{
    "href": "/backend/security-auth",
    "title": "Spring Security 인증: JWT·OAuth",
    "category": "Spring·백엔드",
    "description": "로그인·JWT·권한 검사와 모의 OAuth 콜백을 실습합니다.",
    "keywords": [
      "인증",
      "인가",
      "authorization",
      "authentication",
      "JWT",
      "OAuth",
      "로그인"
    ],
    "aliases": [
      "Spring Security / JWT / OAuth",
      "Security / JWT / OAuth"
    ]
  },
{
    "href": "/spring-system-design",
    "title": "Spring으로 이해하는 시스템 설계",
    "category": "Spring·백엔드",
    "description": "Spring 기능을 캐싱·일관성·가용성 등 시스템 설계 개념에 연결합니다.",
    "keywords": [
      "시스템 설계",
      "system design",
      "Async",
      "RateLimiter",
      "Actuator"
    ],
    "aliases": [
      "Spring 코드 속 시스템 설계",
      "Spring과 시스템 설계"
    ]
  },
{
    "href": "/transactional",
    "title": "트랜잭션: 커밋·롤백",
    "category": "데이터·메시징",
    "description": "H2 데이터 저장 결과로 트랜잭션의 커밋·롤백을 확인합니다.",
    "keywords": [
      "transaction",
      "commit",
      "rollback",
      "트랜잭션",
      "롤백",
      "Transactional"
    ],
    "aliases": [
      "커밋과 롤백을 직접 눌러서 확인하기",
      "트랜잭션"
    ]
  },
{
    "href": "/backend/db-index-transaction",
    "title": "DB 인덱스·트랜잭션 격리 수준",
    "category": "데이터·메시징",
    "description": "인덱스의 비용과 트랜잭션 격리 수준을 비교합니다.",
    "keywords": [
      "database",
      "index",
      "isolation",
      "격리수준",
      "인덱스",
      "ACID"
    ],
    "aliases": [
      "DB Index / Transaction Isolation",
      "인덱스 / 격리수준"
    ]
  },
{
    "href": "/backend/bulk-insert",
    "title": "대량 데이터 삽입",
    "category": "데이터·메시징",
    "description": "단건 삽입·배치·벌크 방식의 처리 흐름과 비용을 비교합니다.",
    "keywords": [
      "bulk insert",
      "batch insert",
      "JDBC",
      "벌크 인서트",
      "배치 삽입"
    ],
    "aliases": [
      "Bulk Insert 실습",
      "벌크 인서트"
    ]
  },
{
    "href": "/backend/redis-cache",
    "title": "Redis 캐시·세션·분산 락",
    "category": "데이터·메시징",
    "description": "Redis를 캐시·세션·분산 락에 사용하는 방법과 주의점을 정리합니다.",
    "keywords": [
      "redis",
      "cache",
      "session",
      "distributed lock",
      "분산락",
      "분산 락"
    ],
    "aliases": [
      "Redis / 캐시 / 세션 / 분산락",
      "Redis / 캐시 / 분산락"
    ]
  },
{
    "href": "/backend/caching-strategies",
    "title": "캐시 전략: Cache-Aside·Write-Through",
    "category": "데이터·메시징",
    "description": "캐시를 읽고 갱신하는 전략과 일관성 차이를 비교합니다.",
    "keywords": [
      "cache aside",
      "write through",
      "캐싱",
      "캐시 무효화"
    ],
    "aliases": [
      "Cache-Aside / Write-Through"
    ]
  },
{
    "href": "/backend/sharding-replica",
    "title": "DB 샤딩·레플리카",
    "category": "데이터·메시징",
    "description": "데이터 분산과 복제의 차이 및 함께 사용하는 구성을 살펴봅니다.",
    "keywords": [
      "sharding",
      "replication",
      "replica",
      "샤딩",
      "복제",
      "레플리카"
    ],
    "aliases": [
      "샤딩 / 레플리카"
    ]
  },
{
    "href": "/messaging/kafka",
    "title": "Kafka 메시징 기초",
    "category": "데이터·메시징",
    "description": "Kafka의 토픽·파티션과 생산자·소비자 흐름을 이해합니다.",
    "keywords": [
      "kafka",
      "topic",
      "partition",
      "producer",
      "consumer",
      "토픽",
      "파티션"
    ],
    "aliases": [
      "Kafka는 메시지를 어떻게 나눠 담고 읽을까?",
      "Kafka 기초"
    ]
  },
{
    "href": "/messaging/kafka-config",
    "title": "Kafka 주요 설정",
    "category": "데이터·메시징",
    "description": "Kafka의 처리량·내구성·지연 시간에 영향을 주는 설정을 정리합니다.",
    "keywords": [
      "kafka",
      "acks",
      "설정 옵션",
      "프로듀서",
      "컨슈머"
    ],
    "aliases": [
      "Kafka 설정 옵션 레퍼런스",
      "Kafka 설정 옵션"
    ]
  },
{
    "href": "/messaging/saga-outbox",
    "title": "분산 트랜잭션: Saga·Outbox",
    "category": "데이터·메시징",
    "description": "여러 서비스의 작업을 보상 처리와 메시지 발행으로 연결합니다.",
    "keywords": [
      "saga",
      "outbox",
      "분산 트랜잭션",
      "보상 트랜잭션",
      "이벤트"
    ],
    "aliases": [
      "Saga와 메시지 Outbox 패턴",
      "Saga / Outbox"
    ]
  },
{
    "href": "/tcp-vs-udp",
    "title": "TCP·UDP 비교",
    "category": "네트워크·API",
    "description": "TCP와 UDP의 연결·전송·오류 처리 방식과 사용 상황을 비교합니다.",
    "keywords": [
      "TCP",
      "UDP",
      "네트워크",
      "전송 계층"
    ],
    "aliases": [
      "TCP vs UDP"
    ]
  },
{
    "href": "/api-vs-rest",
    "title": "API·REST API 비교",
    "category": "네트워크·API",
    "description": "API와 REST의 관계 및 REST·GraphQL·gRPC의 차이를 살펴봅니다.",
    "keywords": [
      "REST",
      "GraphQL",
      "API",
      "인터페이스"
    ],
    "aliases": [
      "API vs REST API"
    ]
  },
{
    "href": "/rest-api-design",
    "title": "REST API 설계",
    "category": "네트워크·API",
    "description": "리소스·HTTP 메서드·상태 코드와 요청·응답 설계 규칙을 정리합니다.",
    "keywords": [
      "REST",
      "URI",
      "멱등성",
      "페이지네이션",
      "HTTP method"
    ],
    "aliases": [
      "REST API 설계 규칙",
      "REST API 설계"
    ]
  },
{
    "href": "/http-errors",
    "title": "HTTP 상태 코드·예외 처리",
    "category": "네트워크·API",
    "description": "HTTP 상태 코드와 Spring의 전역 예외 처리 흐름을 정리합니다.",
    "keywords": [
      "HTTP",
      "status code",
      "401",
      "403",
      "404",
      "500",
      "에러",
      "예외 처리"
    ],
    "aliases": [
      "HTTP 상태코드와 예외 처리",
      "HTTP 에러 처리"
    ]
  },
{
    "href": "/grpc",
    "title": "gRPC 통신 흐름",
    "category": "네트워크·API",
    "description": "브라우저의 REST 요청이 내부 gRPC 통신으로 이어지는 흐름을 실습합니다.",
    "keywords": [
      "gRPC",
      "protobuf",
      "proto",
      "stub",
      "RPC"
    ],
    "aliases": [
      "REST로 누르고, 내부에서는 gRPC로 통신하기",
      "gRPC"
    ]
  },
{
    "href": "/frontend-basics",
    "title": "React·Next.js 입문 개요",
    "category": "프론트엔드",
    "description": "HTML·CSS·JavaScript 지식을 React와 Next.js 개념에 연결합니다.",
    "keywords": [
      "frontend",
      "프론트엔드",
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Next.js"
    ],
    "aliases": [
      "React와 Next.js 기초",
      "React / Next.js 기초"
    ]
  },
{
    "href": "/frontend/javascript-async",
    "title": "JavaScript 비동기: Promise·async/await",
    "category": "프론트엔드",
    "description": "Promise 상태·오류 처리와 순차·동시 실행을 비교하고 Playwright의 비동기 사용법을 정리합니다.",
    "keywords": [
      "JavaScript", "자바스크립트", "비동기", "Promise", "Promises", "프로미스",
      "async", "await", "Promise.all", "Promise.allSettled", "then", "catch", "finally",
      "동시 실행", "순차 실행", "Playwright", "QA", "SDET", "테스트 자동화"
    ],
    "aliases": ["Promises & async/await", "JavaScript 비동기 처리"]
  },
{
    "href": "/frontend/react",
    "title": "React 기초",
    "category": "프론트엔드",
    "description": "컴포넌트·props·state·이벤트·effect의 기본 개념을 익힙니다.",
    "keywords": [
      "React",
      "리액트",
      "컴포넌트",
      "props",
      "state",
      "useEffect"
    ],
    "aliases": [
      "React 기초"
    ]
  },
{
    "href": "/frontend/nextjs",
    "title": "Next.js 기초",
    "category": "프론트엔드",
    "description": "App Router와 서버 렌더링 등 Next.js의 기본 구조를 익힙니다.",
    "keywords": [
      "Next.js",
      "Nextjs",
      "넥스트",
      "App Router",
      "SSR",
      "서버 컴포넌트"
    ],
    "aliases": [
      "Next.js 기초"
    ]
  },
{
    "href": "/architecture",
    "title": "헥사고날·클린 아키텍처·DDD",
    "category": "설계·테스트·배포",
    "description": "헥사고날·클린 아키텍처와 DDD의 역할 및 적용 예시를 비교합니다.",
    "keywords": [
      "hexagonal",
      "clean architecture",
      "DDD",
      "도메인",
      "포트",
      "어댑터"
    ],
    "aliases": [
      "헥사고날 · 클린 아키텍처 · DDD",
      "아키텍처"
    ]
  },
{
    "href": "/project-structure",
    "title": "프론트엔드·백엔드 프로젝트 구조",
    "category": "설계·테스트·배포",
    "description": "프론트엔드와 백엔드의 일반적인 폴더 책임과 구성을 살펴봅니다.",
    "keywords": [
      "폴더 구조",
      "디렉터리",
      "React",
      "Next.js",
      "Vue",
      "Node.js",
      "Express"
    ],
    "aliases": [
      "프론트엔드 & 백엔드 폴더 구조",
      "프로젝트 구조"
    ]
  },
{
    "href": "/fastapi-project-structure",
    "title": "FastAPI 프로젝트 구조",
    "category": "설계·테스트·배포",
    "description": "FastAPI의 라우터·서비스·모델·스키마 역할과 요청 흐름을 정리합니다.",
    "keywords": [
      "FastAPI",
      "Python",
      "Pydantic",
      "SQLAlchemy",
      "프로젝트 구조"
    ],
    "aliases": [
      "FastAPI 백엔드 구조"
    ]
  },
{
    "href": "/dto-entity-vo",
    "title": "DTO·Entity·VO 비교",
    "category": "설계·테스트·배포",
    "description": "DTO·Entity·값 객체의 책임과 사용 범위를 비교합니다.",
    "keywords": [
      "DTO",
      "Entity",
      "VO",
      "value object",
      "값 객체",
      "엔티티"
    ],
    "aliases": [
      "DTO, Entity, VO 차이",
      "DTO / Entity / VO"
    ]
  },
{
    "href": "/circuit-breaker",
    "title": "서킷 브레이커와 장애 전파 방지",
    "category": "설계·테스트·배포",
    "description": "외부 서비스 장애가 전파되지 않도록 호출을 제어하는 원리를 살펴봅니다.",
    "keywords": [
      "circuit breaker",
      "서킷브레이커",
      "장애 격리",
      "Resilience4j"
    ],
    "aliases": [
      "Circuit Breaker 개념 정리",
      "Circuit Breaker"
    ]
  },
{
    "href": "/testing-basics",
    "title": "테스트 기초: 단위·통합 테스트",
    "category": "설계·테스트·배포",
    "description": "단위·통합 테스트와 Given-When-Then 작성 방식을 정리합니다.",
    "keywords": [
      "unit test",
      "integration test",
      "Given When Then",
      "JUnit",
      "테스트"
    ],
    "aliases": [
      "단위 테스트, 통합 테스트, Given-When-Then",
      "테스트 기초"
    ]
  },
{
    "href": "/tdd",
    "title": "테스트 주도 개발: TDD",
    "category": "설계·테스트·배포",
    "description": "실패하는 테스트부터 구현·리팩터링으로 이어지는 개발 흐름을 익힙니다.",
    "keywords": [
      "TDD",
      "test driven development",
      "Red Green Refactor",
      "테스트 주도 개발"
    ],
    "aliases": [
      "TDD: Test-Driven Development",
      "TDD"
    ]
  },
{
    "href": "/ci-cd",
    "title": "CI/CD: 빌드·검증·배포",
    "category": "설계·테스트·배포",
    "description": "커밋부터 자동 검증·컨테이너 배포·운영 확인까지의 흐름을 정리합니다.",
    "keywords": [
      "CI",
      "CD",
      "GitHub Actions",
      "Docker",
      "Kubernetes",
      "배포",
      "파이프라인"
    ],
    "aliases": [
      "CI/CD · 커밋에서 운영까지",
      "CI/CD"
    ]
  },
{
    "href": "/ai-concepts",
    "title": "AI 핵심 개념 2026",
    "category": "AI·RAG",
    "description": "2026년 학습 자료를 바탕으로 AI 개발의 핵심 개념을 정리합니다.",
    "keywords": [
      "AI",
      "인공지능",
      "LLM",
      "프롬프트",
      "2026"
    ],
    "aliases": [
      "2026 AI 핵심 개념 9가지",
      "AI 핵심 개념 2026"
    ]
  },
{
    "href": "/llm-app-structure",
    "title": "LLM 애플리케이션 구조",
    "category": "AI·RAG",
    "description": "LLM 애플리케이션의 구성 요소와 요청 처리 흐름을 살펴봅니다.",
    "keywords": [
      "LLM",
      "large language model",
      "대규모 언어 모델",
      "프롬프트"
    ],
    "aliases": [
      "LLM 애플리케이션 구조",
      "LLM 앱 구조"
    ]
  },
{
    "href": "/genai-project-structure",
    "title": "생성형 AI 프로젝트 구조",
    "category": "AI·RAG",
    "description": "생성형 AI의 프롬프트·검색·후처리·평가 책임을 나눕니다.",
    "keywords": [
      "generative AI",
      "생성형 AI",
      "프로젝트 구조",
      "평가"
    ],
    "aliases": [
      "생성형 AI 프로젝트 구조"
    ]
  },
{
    "href": "/ai-agent-patterns",
    "title": "AI 에이전트 설계 패턴",
    "category": "AI·RAG",
    "description": "작업 요구에 따라 AI 에이전트의 실행 패턴을 비교합니다.",
    "keywords": [
      "AI agent",
      "에이전트",
      "워크플로",
      "도구 호출",
      "계획"
    ],
    "aliases": [
      "AI 에이전트 설계 패턴 5가지",
      "AI 에이전트 패턴"
    ]
  },
{
    "href": "/rag/concepts",
    "title": "RAG·CAG·MAG·GAG 비교",
    "category": "AI·RAG",
    "description": "외부 문서·캐시·기억·그래프로 생성 모델을 보완하는 방식을 비교합니다.",
    "keywords": [
      "RAG",
      "CAG",
      "MAG",
      "GAG",
      "retrieval augmented generation",
      "검색 증강 생성"
    ],
    "aliases": [
      "RAG, CAG, MAG, GAG 정리",
      "RAG / CAG / MAG / GAG"
    ]
  },
{
    "href": "/rag/architecture-comparison",
    "title": "RAG 구조 비교: Classic·Graph·Agentic",
    "category": "AI·RAG",
    "description": "문서 검색·관계 탐색·동적 도구 선택 중심의 RAG 구조를 비교합니다.",
    "keywords": [
      "Classic RAG",
      "Graph RAG",
      "Agentic RAG",
      "그래프 RAG"
    ],
    "aliases": [
      "Classic · Graph · Agentic RAG",
      "Classic / Graph / Agentic"
    ]
  },
{
    "href": "/rag/project-structure",
    "title": "RAG 프로젝트 구조",
    "category": "AI·RAG",
    "description": "RAG의 문서 색인과 질문 처리에 필요한 모듈 책임을 살펴봅니다.",
    "keywords": [
      "RAG",
      "ingestion",
      "chunking",
      "embeddings",
      "retrieval",
      "프로젝트 구조"
    ],
    "aliases": [
      "RAG 프로젝트 구조"
    ]
  },
{
    "href": "/rag/documents",
    "title": "RAG 문서 등록",
    "category": "AI·RAG",
    "description": "문서를 청크·키워드로 나누어 메모리에 저장하는 모의 실습입니다.",
    "keywords": [
      "RAG",
      "document",
      "chunk",
      "문서 등록",
      "청킹",
      "mock",
      "모의 실습"
    ],
    "aliases": [
      "RAG 문서 등록 mock",
      "문서"
    ],
    "simulated": true
  },
{
    "href": "/rag/vector-search",
    "title": "RAG 벡터 검색",
    "category": "AI·RAG",
    "description": "실제 임베딩 대신 키워드 겹침으로 관련 청크를 찾는 모의 실습입니다.",
    "keywords": [
      "RAG",
      "vector search",
      "topK",
      "벡터 검색",
      "유사도",
      "mock",
      "모의 실습"
    ],
    "aliases": [
      "Vector Search mock",
      "벡터 검색"
    ],
    "simulated": true
  },
{
    "href": "/rag/ask",
    "title": "RAG 질문·답변",
    "category": "AI·RAG",
    "description": "검색된 청크로 실제 LLM 없이 모의 답변과 출처를 만드는 실습입니다.",
    "keywords": [
      "RAG",
      "질문하기",
      "답변",
      "citation",
      "출처",
      "mock",
      "모의 실습"
    ],
    "aliases": [
      "RAG 질문하기 mock",
      "질문하기"
    ],
    "simulated": true
  },
{
    "href": "/patterns",
    "title": "디자인 패턴 개요",
    "category": "디자인 패턴",
    "description": "다섯 가지 디자인 패턴의 개념과 개별 실습을 둘러봅니다.",
    "keywords": [
      "design patterns",
      "객체지향 설계"
    ],
    "aliases": [
      "디자인 패턴 실험실",
      "디자인 패턴"
    ]
  },
{
  "href": "/patterns/iterator",
  "title": "반복자 · Iterator",
  "category": "디자인 패턴",
  "description": "책장의 저장 구조와 순회 위치를 분리한다. BookShelf는 책을 보관하고 BookShelfIterator가 index를 움직이므로 호출자는 hasNext와 next만 사용한다.",
  "keywords": [
    "iterator",
    "반복자 · Iterator",
    "디자인 패턴",
    "책 예제",
    "1장"
  ],
  "aliases": []
},
{
  "href": "/patterns/adapter",
  "title": "어댑터 · Adapter",
  "category": "디자인 패턴",
  "description": "클라이언트가 원하는 Print 인터페이스를 기존 Banner 기능에 연결한다. 이름과 호출 규약의 차이를 PrintBanner가 흡수한다.",
  "keywords": [
    "adapter",
    "어댑터 · Adapter",
    "디자인 패턴",
    "책 예제",
    "2장"
  ],
  "aliases": []
},
{
  "href": "/patterns/template-method",
  "title": "템플릿 메서드 · Template Method",
  "category": "디자인 패턴",
  "description": "AbstractDisplay가 open → print 반복 → close의 순서를 고정하고 StringDisplay가 개별 출력 동작을 결정한다.",
  "keywords": [
    "template-method",
    "템플릿 메서드 · Template Method",
    "디자인 패턴",
    "책 예제",
    "3장"
  ],
  "aliases": []
},
{
    "href": "/patterns/factory",
    "title": "팩토리 메서드 · Factory Method",
    "category": "디자인 패턴",
    "description": "알림 채널에 따라 팩토리가 생성하는 객체를 확인합니다.",
    "keywords": [
      "factory",
      "팩토리",
      "객체 생성"
    ],
    "aliases": [
      "팩토리 패턴 실험실",
      "팩토리 패턴"
    ]
  },
{
  "href": "/patterns/singleton",
  "title": "싱글턴 · Singleton",
  "category": "디자인 패턴",
  "description": "private 생성자와 정적 접근점을 통해 동일한 인스턴스를 돌려준다. 실습은 요청마다 여러 번 가져온 참조를 ==로 비교한다.",
  "keywords": [
    "singleton",
    "싱글턴 · Singleton",
    "디자인 패턴",
    "책 예제",
    "5장"
  ],
  "aliases": []
},
{
  "href": "/patterns/prototype",
  "title": "프로토타입 · Prototype",
  "category": "디자인 패턴",
  "description": "Manager에 등록한 MessageBox 원형을 이름으로 찾아 복제한다. 생성 방법을 호출자에게 노출하지 않고 설정된 객체 상태를 복사한다.",
  "keywords": [
    "prototype",
    "프로토타입 · Prototype",
    "디자인 패턴",
    "책 예제",
    "6장"
  ],
  "aliases": []
},
{
  "href": "/patterns/builder",
  "title": "빌더 · Builder",
  "category": "디자인 패턴",
  "description": "Director가 문서를 조립하는 순서를 알고 Builder가 표현 형식을 결정한다. 같은 조립 요청을 TextBuilder와 HTMLBuilder에 적용해 결과를 비교한다.",
  "keywords": [
    "builder",
    "빌더 · Builder",
    "디자인 패턴",
    "책 예제",
    "7장"
  ],
  "aliases": []
},
{
  "href": "/patterns/abstract-factory",
  "title": "추상 팩토리 · Abstract Factory",
  "category": "디자인 패턴",
  "description": "관련된 Link·Tray·Page 제품군을 하나의 공장으로 선택한다. 동일한 조립 코드를 ListFactory와 DivFactory에 적용하면 제품군 전체의 표현이 바뀐다.",
  "keywords": [
    "abstract-factory",
    "추상 팩토리 · Abstract Factory",
    "디자인 패턴",
    "책 예제",
    "8장"
  ],
  "aliases": []
},
{
  "href": "/patterns/bridge",
  "title": "브리지 · Bridge",
  "category": "디자인 패턴",
  "description": "Sample의 Display는 DisplayImpl에 출력을 위임하고 CountDisplay는 반복 기능만 확장한다. 구현을 바꾸는 일과 기능을 늘리는 일을 분리하는 연결을 실제 호출로 관찰한다.",
  "keywords": [
    "bridge",
    "Bridge · 기능과 구현의 두 계층",
    "디자인 패턴",
    "책 예제",
    "9장"
  ],
  "aliases": []
},
{
    "href": "/patterns/strategy",
    "title": "전략 · Strategy",
    "category": "디자인 패턴",
    "description": "회원 등급별 할인 전략을 선택하고 실행 결과를 확인합니다.",
    "keywords": [
      "strategy",
      "전략",
      "할인"
    ],
    "aliases": [
      "전략 패턴 실험실",
      "전략 패턴"
    ]
  },
{
  "href": "/patterns/composite",
  "title": "컴포지트 · Composite",
  "category": "디자인 패턴",
  "description": "Sample의 Entry 아래 File과 Directory를 두고 Directory.getSize가 자식 Entry의 크기를 합산한다. 잎과 복합체를 같은 계약으로 다루는 재귀 구조다.",
  "keywords": [
    "composite",
    "Composite · 파일과 디렉터리의 동일한 취급",
    "디자인 패턴",
    "책 예제",
    "11장"
  ],
  "aliases": []
},
{
    "href": "/patterns/decorator",
    "title": "데코레이터 · Decorator",
    "category": "디자인 패턴",
    "description": "음료 객체에 부가 기능과 가격을 조합하는 흐름을 확인합니다.",
    "keywords": [
      "decorator",
      "데코레이터",
      "기능 확장"
    ],
    "aliases": [
      "데코레이터 패턴 실험실",
      "데코레이터 패턴"
    ]
  },
{
  "href": "/patterns/visitor",
  "title": "비지터 · Visitor",
  "category": "디자인 패턴",
  "description": "Sample의 ListVisitor는 File과 Directory를 방문해 목록을 출력한다. API는 A1의 FileFindVisitor를 실행하여 같은 구조에 확장자 검색 연산을 붙이는 모습을 보여 준다.",
  "keywords": [
    "visitor",
    "Visitor · 파일 구조 밖으로 연산 분리",
    "디자인 패턴",
    "책 예제",
    "13장"
  ],
  "aliases": []
},
{
  "href": "/patterns/chain-of-responsibility",
  "title": "책임 연쇄 · Chain of Responsibility",
  "category": "디자인 패턴",
  "description": "Sample의 Support는 resolve에 성공하면 처리하고 실패하면 next로 넘긴다. Alice부터 Fred까지 연결한 객체 중 가장 먼저 처리 가능한 담당자가 선택된다.",
  "keywords": [
    "chain-of-responsibility",
    "Chain of Responsibility · 처리 책임 넘기기",
    "디자인 패턴",
    "책 예제",
    "14장"
  ],
  "aliases": []
},
{
  "href": "/patterns/facade",
  "title": "퍼사드 · Facade",
  "category": "디자인 패턴",
  "description": "Sample의 PageMaker가 Database에서 회원을 조회하고 HtmlWriter를 순서대로 호출하여 환영 HTML을 만든다. 호출자는 하위 클래스들의 사용 순서를 몰라도 된다.",
  "keywords": [
    "facade",
    "Facade · 환영 페이지 제작의 단일 창구",
    "디자인 패턴",
    "책 예제",
    "15장"
  ],
  "aliases": []
},
{
  "href": "/patterns/mediator",
  "title": "미디에이터 · Mediator",
  "category": "디자인 패턴",
  "description": "Sample의 Colleague는 상태 변화만 LoginFrame에 알린다. LoginFrame이 Guest/Login, 사용자명, 비밀번호, OK 버튼의 활성화 규칙을 한 곳에서 판단한다.",
  "keywords": [
    "mediator",
    "Mediator · 로그인 UI의 활성화 규칙",
    "디자인 패턴",
    "책 예제",
    "16장"
  ],
  "aliases": []
},
{
    "href": "/patterns/observer",
    "title": "옵저버 · Observer",
    "category": "디자인 패턴",
    "description": "이벤트가 구독자에게 전달되는 흐름을 확인합니다.",
    "keywords": [
      "observer",
      "publisher",
      "subscriber",
      "이벤트",
      "구독"
    ],
    "aliases": [
      "옵저버 패턴 실험실",
      "옵저버 패턴"
    ]
  },
{
  "href": "/patterns/memento",
  "title": "메멘토 · Memento",
  "category": "디자인 패턴",
  "description": "Gamer의 소지금과 맛있는 과일을 스냅샷으로 보관하고 손실 시 복구합니다.",
  "keywords": [
    "memento",
    "Memento · 게임 상태 저장과 복구",
    "디자인 패턴",
    "책 예제",
    "18장"
  ],
  "aliases": []
},
{
  "href": "/patterns/state",
  "title": "상태 · State",
  "category": "디자인 패턴",
  "description": "같은 금고 사용 요청도 현재 State 객체에 따라 로그 기록 또는 경비 연락으로 바뀝니다.",
  "keywords": [
    "state",
    "State · 주간과 야간의 금고 동작",
    "디자인 패턴",
    "책 예제",
    "19장"
  ],
  "aliases": []
},
{
  "href": "/patterns/flyweight",
  "title": "플라이웨이트 · Flyweight",
  "category": "디자인 패턴",
  "description": "BigCharFactory가 같은 문자에 동일 객체를 반환하는지 요청 내부 참조 번호로 확인합니다.",
  "keywords": [
    "flyweight",
    "Flyweight · 문자 객체 공유",
    "디자인 패턴",
    "책 예제",
    "20장"
  ],
  "aliases": []
},
{
  "href": "/patterns/proxy",
  "title": "프록시 · Proxy",
  "category": "디자인 패턴",
  "description": "PrinterProxy가 이름 변경은 직접 처리하고 실제 출력이 필요할 때만 Printer를 만듭니다.",
  "keywords": [
    "proxy",
    "Proxy · 프린터의 지연 생성",
    "디자인 패턴",
    "책 예제",
    "21장"
  ],
  "aliases": []
},
{
    "href": "/patterns/command",
    "title": "커맨드 · Command",
    "category": "디자인 패턴",
    "description": "명령 객체로 실행과 실행 취소를 처리합니다.",
    "keywords": [
      "command",
      "undo",
      "실행 취소"
    ],
    "aliases": [
      "커맨드 패턴 실험실",
      "커맨드 패턴"
    ]
  },
{
  "href": "/patterns/interpreter",
  "title": "인터프리터 · Interpreter",
  "category": "디자인 패턴",
  "description": "program·repeat·go·right·left 문장을 문법 트리로 만들고 가상 거북이 좌표로 실행합니다.",
  "keywords": [
    "interpreter",
    "Interpreter · 작은 언어의 파싱과 실행",
    "디자인 패턴",
    "책 예제",
    "23장"
  ],
  "aliases": []
}
];

export function getStudyPage(href: string): StudyPage {
  const page = studyPages.find((page) => page.href === href);
  if (!page) throw new Error(`등록되지 않은 학습 페이지: ${href}`);
  return page;
}

export function getStudyMetadata(href: string) {
  const page = getStudyPage(href);
  return { title: `${page.title} | Lumos Lab`, description: page.description };
}
