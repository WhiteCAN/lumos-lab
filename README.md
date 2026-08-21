# Study Lab

Spring Boot API와 Next.js 화면을 함께 공부하기 위한 실습 프로젝트입니다.

목표는 단순 CRUD가 아니라, API를 호출하면서 Java 자료구조, 알고리즘, 디자인 패턴, React 상태 처리, Next.js 라우팅을 디버깅으로 익히는 것입니다.

## 프로젝트 구조

```text
study-lab/
  backend/   Spring Boot REST API, gRPC 서버, 학습용 API
  frontend/  Next.js + React + TypeScript UI
  docs/      나중에 이어서 볼 작업 문서
```

이어서 작업할 때는 [작업 이어가기 가이드](docs/continuation-guide.md)를 먼저 확인합니다.

## 실행 방법

이 프로젝트는 터미널을 2개 열어서 실행합니다.

- `backend`: Spring Boot 서버입니다. REST API `8080`과 내부 gRPC 서버 `9090`을 함께 실행합니다.
- `frontend`: Next.js + React 화면입니다. 브라우저에서 접속하는 개발 서버 `3000`을 실행합니다.

gRPC는 따로 명령을 실행하지 않습니다. 백엔드를 `bootRun`으로 실행하면 Spring Boot 안에서 gRPC 서버도 같이 올라갑니다.

### 1. 백엔드 실행

새 터미널을 열고 아래 명령을 실행합니다.

```powershell
cd C:\Users\skw0329\IdeaProjects\study-lab\backend
.\gradlew.bat bootRun
```

정상 실행되면 다음 주소를 확인할 수 있습니다.

- REST health: [http://localhost:8080/api/health](http://localhost:8080/api/health)
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- gRPC 브리지 API: [http://localhost:8080/api/concepts/grpc/explain](http://localhost:8080/api/concepts/grpc/explain)

내부 포트:

- Spring REST API: `8080`
- gRPC Server: `9090`

브라우저는 gRPC를 직접 호출하지 않고, Next.js 화면 → Spring REST API → gRPC Client → gRPC Server 순서로 동작합니다.

### 2. 프론트엔드 실행

다른 터미널을 하나 더 열고 아래 명령을 실행합니다.

```powershell
cd C:\Users\skw0329\IdeaProjects\study-lab\frontend
npm run dev
```

정상 실행되면 브라우저에서 아래 주소로 접속합니다.

- 프론트엔드: [http://localhost:3000](http://localhost:3000)

### 3. 실행 구조 요약

```text
브라우저
  -> Next.js + React frontend
     http://localhost:3000

  -> Spring Boot REST API
     http://localhost:8080

  -> 내부 gRPC Client
     -> gRPC Server
        localhost:9090
```

### 4. 서버 종료

프론트엔드 `3000`, 백엔드 REST `8080`, gRPC `9090` 포트를 같이 종료합니다.

```powershell
Get-NetTCPConnection -LocalPort 3000,8080,9090 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
```

## 접속 주소

- 프론트엔드: [http://localhost:3000](http://localhost:3000)
- 백엔드 상태 확인: [http://localhost:8080/api/health](http://localhost:8080/api/health)
- DB 연결 확인: [http://localhost:8080/api/database/info](http://localhost:8080/api/database/info)
- gRPC 브리지 API: [http://localhost:8080/api/concepts/grpc/explain](http://localhost:8080/api/concepts/grpc/explain)
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- OpenAPI JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

## 현재 실험실

### 프로젝트 구조 가이드

화면: [http://localhost:3000/project-structure](http://localhost:3000/project-structure)

이미지 자료를 웹페이지로 옮긴 일반적인 프론트엔드/백엔드 폴더 구조 참고 페이지입니다. 현재 프로젝트 설명이 아니라, 다음 프로젝트를 만들 때 참고하는 템플릿입니다.

### AI 핵심 개념 가이드

화면: [http://localhost:3000/ai-concepts](http://localhost:3000/ai-concepts)

이미지 자료를 웹페이지로 옮긴 2026 AI 핵심 개념 9가지 참고 페이지입니다. Agentic Loop, Model Context Protocol, Subagents & Multi-Agent Systems, AI Gateway, Inference Cost Economics, Evals, Guardrails, Observability, The Bitter Lesson을 정리했습니다.

### RAG / CAG / MAG / GAG 가이드

화면: [http://localhost:3000/rag/concepts](http://localhost:3000/rag/concepts)

RAG, CAG, MAG, GAG의 개념, 흐름, 차이점, 잘 맞는 상황과 주의점을 비교한 레퍼런스 페이지입니다. GAG는 아직 널리 표준화된 약어라기보다 Graph-Augmented Generation 또는 GraphRAG 관점으로 정리했습니다.

### RAG 문서 / 벡터 검색 / 질문하기 mock

화면:

- 문서: [http://localhost:3000/rag/documents](http://localhost:3000/rag/documents)
- 벡터 검색: [http://localhost:3000/rag/vector-search](http://localhost:3000/rag/vector-search)
- 질문하기: [http://localhost:3000/rag/ask](http://localhost:3000/rag/ask)

API:

```http
GET    http://localhost:8080/api/rag/documents
POST   http://localhost:8080/api/rag/documents
DELETE http://localhost:8080/api/rag/documents
POST   http://localhost:8080/api/rag/vector-search
POST   http://localhost:8080/api/rag/ask
```

외부 LLM, vector DB, Spring AI 없이 인메모리 문서 저장소로 동작하는 학습용 RAG mock입니다. 문서 등록 시 chunk와 keyword를 만들고, 벡터 검색 화면에서는 keyword 겹침 점수로 topK chunk를 찾습니다. 질문하기 화면은 검색된 chunk를 근거로 mock 답변과 citation을 생성합니다.

### API vs REST API 가이드

화면: [http://localhost:3000/api-vs-rest](http://localhost:3000/api-vs-rest)

이미지 자료를 웹페이지로 옮긴 API와 REST API 비교 참고 페이지입니다. API 개념, REST API 개념, 차이점, HTTP 메서드, 동작 흐름, 실생활 예시, gRPC/FastAPI/GraphQL 비교를 정리했습니다.

### TCP vs UDP 가이드

화면: [http://localhost:3000/tcp-vs-udp](http://localhost:3000/tcp-vs-udp)

이미지 자료를 웹페이지로 옮긴 TCP와 UDP 비교 참고 페이지입니다. 연결 방식, 신뢰성, 속도, 3-way handshake, 사용 사례, 헤더 구조, 장점을 정리했습니다.

### 아키텍처 가이드

화면: [http://localhost:3000/architecture](http://localhost:3000/architecture)

헥사고날 아키텍처, 클린 아키텍처, DDD의 개요와 차이점, 사용 예시, Spring Boot 기준 폴더 구조를 정리한 참고 페이지입니다.

### HTTP 에러 처리 가이드

화면: [http://localhost:3000/http-errors](http://localhost:3000/http-errors)

HTTP 상태코드, 400/401/403/404/409/500 구분, Spring `@RestControllerAdvice`, 프론트 fetch 에러 처리 관점을 정리한 참고 페이지입니다.

### Spring Bean / DI 가이드

화면: [http://localhost:3000/spring-bean-di](http://localhost:3000/spring-bean-di)

IoC, DI, Bean, 생성자 주입, `@Controller`, `@Service`, `@Repository`, `@Component`, `@Configuration`의 역할을 정리한 참고 페이지입니다.

### 테스트 기초 가이드

화면: [http://localhost:3000/testing-basics](http://localhost:3000/testing-basics)

단위 테스트, 통합 테스트, UI 테스트, Given-When-Then, RAG 서비스 테스트 예시를 정리한 참고 페이지입니다.

### DTO / Entity / VO 가이드

화면: [http://localhost:3000/dto-entity-vo](http://localhost:3000/dto-entity-vo)

Request/Response DTO, JPA Entity, Value Object의 책임과 변환 흐름을 정리한 참고 페이지입니다.

### REST API 설계 가이드

화면: [http://localhost:3000/rest-api-design](http://localhost:3000/rest-api-design)

리소스 중심 URI, HTTP method, path variable, query param, request body, pagination, filtering 설계 기준을 정리한 참고 페이지입니다.

### LLM 애플리케이션 구조 가이드

화면: [http://localhost:3000/llm-app-structure](http://localhost:3000/llm-app-structure)

Prompt, Tool Calling, RAG, Memory, Agent, Guardrail을 하나의 LLM 앱 요청 처리 흐름으로 정리한 참고 페이지입니다.

### 동기 vs 비동기 실험실

화면: [http://localhost:3000/sync-async](http://localhost:3000/sync-async)

동기/비동기 개념을 설명하고, 같은 작업 목록을 순차 실행과 병렬 실행으로 테스트해서 실제 실행 시간을 비교하는 페이지입니다.

### 프론트엔드 기초

화면: [http://localhost:3000/frontend-basics](http://localhost:3000/frontend-basics)

HTML, CSS, JavaScript를 알고 있는 상태에서 React와 Next.js로 넘어갈 때 먼저 봐야 할 JSX, 컴포넌트, props, state, event, App Router, Server Component, Client Component 개념을 정리한 페이지입니다.

- React 기초: [http://localhost:3000/frontend/react](http://localhost:3000/frontend/react)
- Next.js 기초: [http://localhost:3000/frontend/nextjs](http://localhost:3000/frontend/nextjs)

### Java 기초 실습

화면:

- 입출력 / 문자열: [http://localhost:3000/java/io-string](http://localhost:3000/java/io-string)
- 컬렉션: [http://localhost:3000/java/collections](http://localhost:3000/java/collections)
- 비교 / 예외: [http://localhost:3000/java/equality-exception](http://localhost:3000/java/equality-exception)
- 동시성: [http://localhost:3000/java/concurrency](http://localhost:3000/java/concurrency)

API:

```http
POST http://localhost:8080/api/java/io-string/parse
POST http://localhost:8080/api/java/io-string/concat
GET  http://localhost:8080/api/java/collections/compare
POST http://localhost:8080/api/java/collections/demo
POST http://localhost:8080/api/java/equality/demo
POST http://localhost:8080/api/java/exception/demo
POST http://localhost:8080/api/java/concurrency/demo
```

`Scanner`, `BufferedReader`, `StringTokenizer`, `StringBuilder`, `StringBuffer`, Collection Framework, `==`, `equals`, `hashCode`, checked/unchecked exception, `CompletableFuture`, `synchronized`를 API 호출 결과와 예시 코드로 비교하는 페이지입니다.

### Kafka 기초

화면: [http://localhost:3000/messaging/kafka](http://localhost:3000/messaging/kafka)

Kafka의 Topic, Partition, Producer, Consumer Group, offset 개념과 producer 파티션 선택, key 유무, sticky partitioning, consumer group 파티션 할당, 주요 설정 옵션이 데이터 흐름에 주는 영향을 정리한 레퍼런스 페이지입니다.

### Kafka 설정 옵션

화면: [http://localhost:3000/messaging/kafka-config](http://localhost:3000/messaging/kafka-config)

producer / consumer 설정 옵션이 메시지 순서, 중복, 안전성, 처리량, consumer group 동작에 어떤 영향을 주는지 정리한 페이지입니다.

### Saga / Outbox 패턴

화면: [http://localhost:3000/messaging/saga-outbox](http://localhost:3000/messaging/saga-outbox)

Kafka 같은 메시지 브로커를 사용하는 분산 서비스에서 Saga와 Transactional Outbox 패턴을 왜 쓰는지, 주문/결제/재고 예시와 outbox relay 흐름으로 정리한 레퍼런스 페이지입니다. 메시지 중복, consumer 강제 종료, offset commit 타이밍, retry, DLQ, idempotent consumer 설계도 함께 정리했습니다.

### Redis / 캐시 / 분산락

화면: [http://localhost:3000/backend/redis-cache](http://localhost:3000/backend/redis-cache)

Redis를 캐시, 세션 저장소, 분산락으로 사용할 때의 기본 흐름과 TTL, 캐시 무효화, 캐시 스탬피드, 락 만료 설계 포인트를 정리한 페이지입니다.

### Security / JWT / OAuth

화면: [http://localhost:3000/backend/security-auth](http://localhost:3000/backend/security-auth)

Spring Security를 공부하기 전에 알아야 할 인증, 인가, JWT, refresh token, OAuth 로그인 흐름과 서버 권한 검사 원칙을 정리한 페이지입니다. 학습용 mock API로 JWT 발급, Bearer token 보호 API 호출, 권한 실패, 토큰 변조, OAuth callback 흐름을 테스트할 수 있습니다.

API:

```http
POST http://localhost:8080/api/backend/security-auth/login
GET  http://localhost:8080/api/backend/security-auth/protected?requiredRole=USER
POST http://localhost:8080/api/backend/security-auth/oauth/callback
```

기본 학습용 로그인 값:

- username: `demo`
- password: `password`
- role: `USER` 또는 `ADMIN`

### Bulk Insert 실습

화면: [http://localhost:3000/backend/bulk-insert](http://localhost:3000/backend/bulk-insert)

API:

```http
POST http://localhost:8080/api/database/bulk-insert/simulate
POST http://localhost:8080/api/database/bulk-insert/run
```

단건 insert, JDBC batch insert, DB 전용 bulk load의 DB 왕복 횟수와 트랜잭션 차이를 비교합니다. `simulate`는 DB 부하 없이 계산 결과를 보여주고, `run`은 현재 연결된 DB에 `bulk_insert_lab` 테이블을 만들어 실제 insert 시간을 확인합니다.

### DB 인덱스 / 트랜잭션 격리수준

화면: [http://localhost:3000/backend/db-index-transaction](http://localhost:3000/backend/db-index-transaction)

B-Tree, Hash, Composite, Covering Index의 사용 상황과 `READ COMMITTED`, `REPEATABLE READ`, `SERIALIZABLE` 같은 트랜잭션 격리수준을 정리한 레퍼런스 페이지입니다.

### @Transactional 실험실

화면: [http://localhost:3000/transactional](http://localhost:3000/transactional)

API:

```http
GET    http://localhost:8080/api/concepts/transactional/logs
POST   http://localhost:8080/api/concepts/transactional/run/NORMAL_COMMIT
POST   http://localhost:8080/api/concepts/transactional/run/RUNTIME_EXCEPTION_ROLLBACK
POST   http://localhost:8080/api/concepts/transactional/run/CHECKED_EXCEPTION_DEFAULT_COMMIT
POST   http://localhost:8080/api/concepts/transactional/run/CHECKED_EXCEPTION_ROLLBACK_FOR
DELETE http://localhost:8080/api/concepts/transactional/logs
```

H2 메모리 DB에 로그를 저장하면서 정상 커밋, RuntimeException 기본 롤백, checked exception 기본 커밋, `rollbackFor` 롤백을 비교하는 페이지입니다.

### gRPC 실험실

화면: [http://localhost:3000/grpc](http://localhost:3000/grpc)

API:

```http
POST http://localhost:8080/api/concepts/grpc/explain
```

내부 구조:

```text
Next.js 화면
  -> Spring REST API 8080
    -> gRPC Client
      -> gRPC Server 9090
```

`backend/src/main/proto/study_lab.proto`에서 계약을 정의하고, Gradle protobuf 플러그인이 Java stub을 생성합니다. 브라우저는 REST API를 호출하고 Spring 서버 내부에서 gRPC를 호출하는 브리지 구조입니다.

### TDD 가이드

화면: [http://localhost:3000/tdd](http://localhost:3000/tdd)

TDD가 무엇인지, Red-Green-Refactor 흐름, 테스트 설계 주의점, JUnit 어노테이션 역할을 정리한 참고 페이지입니다. 실제 연습용 코드는 `backend/src/test/java/com/study/lab/concept/tdd/PasswordPolicyTddTest.java`, `backend/src/test/java/com/study/lab/concept/tdd/DiscountPolicyTddTest.java`에 있으며, `.\gradlew.bat test`로 직접 실행합니다.

### 정렬 실험실

화면: [http://localhost:3000](http://localhost:3000)

API:

```http
POST http://localhost:8080/api/algorithms/sort
GET  http://localhost:8080/api/algorithms/sort/types
```

지원 알고리즘:

- `QUICK`
- `MERGE`
- `HEAP`
- `INSERTION`
- `SELECTION`
- `BUBBLE`

추천 브레이크포인트:

- `SortController.sort`
- `SortService.sort`
- `QuickSortStrategy.sort`
- `MergeSortStrategy.sort`
- `HeapSortStrategy.sort`

### 검색 실험실

화면: [http://localhost:3000/search](http://localhost:3000/search)

API:

```http
POST http://localhost:8080/api/algorithms/search
GET  http://localhost:8080/api/algorithms/search/types
```

지원 알고리즘:

- `LINEAR`
- `BINARY`

학습 개념:

- Linear Search: 정렬 필요 없이 앞에서부터 하나씩 비교
- Binary Search: 정렬된 배열에서 탐색 범위를 절반씩 줄임
- Strategy Pattern으로 검색 알고리즘 선택
- 비교 횟수와 탐색 단계 로그 확인

### Stack 실험실

화면: [http://localhost:3000/datastructures/stack](http://localhost:3000/datastructures/stack)

API:

```http
GET    http://localhost:8080/api/datastructures/stack
POST   http://localhost:8080/api/datastructures/stack/push
POST   http://localhost:8080/api/datastructures/stack/pop
POST   http://localhost:8080/api/datastructures/stack/peek
DELETE http://localhost:8080/api/datastructures/stack
```

학습 개념:

- LIFO
- `Deque.push`
- `Deque.pop`
- `Deque.peek`

### Queue 실험실

화면: [http://localhost:3000/datastructures/queue](http://localhost:3000/datastructures/queue)

API:

```http
GET    http://localhost:8080/api/datastructures/queue
POST   http://localhost:8080/api/datastructures/queue/offer
POST   http://localhost:8080/api/datastructures/queue/poll
POST   http://localhost:8080/api/datastructures/queue/peek
DELETE http://localhost:8080/api/datastructures/queue
```

학습 개념:

- FIFO
- `Deque.addLast`
- `Deque.removeFirst`
- `Deque.peekFirst`

### Heap 실험실

화면: [http://localhost:3000/datastructures/heap](http://localhost:3000/datastructures/heap)

API:

```http
GET    http://localhost:8080/api/datastructures/heap?type=MIN
GET    http://localhost:8080/api/datastructures/heap?type=MAX
POST   http://localhost:8080/api/datastructures/heap/offer
POST   http://localhost:8080/api/datastructures/heap/poll
POST   http://localhost:8080/api/datastructures/heap/peek
DELETE http://localhost:8080/api/datastructures/heap
```

학습 개념:

- 최소 힙
- 최대 힙
- `PriorityQueue`
- 우선순위 순서와 내부 heap 배열 순서의 차이

### Graph 실험실

화면: [http://localhost:3000/datastructures/graph](http://localhost:3000/datastructures/graph)

API:

```http
GET  http://localhost:8080/api/datastructures/graph/types
POST http://localhost:8080/api/datastructures/graph/traverse
```

학습 개념:

- BFS
- DFS
- 인접 리스트
- Queue 기반 너비 우선 탐색
- Stack 기반 깊이 우선 탐색

### 디자인 패턴 실험실

화면: [http://localhost:3000/patterns](http://localhost:3000/patterns)

API:

```http
POST http://localhost:8080/api/patterns/strategy/run
POST http://localhost:8080/api/patterns/factory/run
POST http://localhost:8080/api/patterns/observer/run
POST http://localhost:8080/api/patterns/decorator/run
POST http://localhost:8080/api/patterns/command/run
```

지원 패턴:

- `STRATEGY`
- `FACTORY`
- `OBSERVER`
- `DECORATOR`
- `COMMAND`

학습 개념:

- Strategy: 알고리즘 선택 분리
- Factory: 객체 생성 분리
- Observer: 상태 변경 알림
- Decorator: 기능 동적 추가
- Command: 요청 객체화와 undo

패턴 기능은 공통 실행 API 하나에 모아두지 않고, 메뉴별로 백엔드 패키지와 API를 분리했습니다. 각 화면에서 해당 패턴 API만 호출하므로 디버깅할 때 흐름이 섞이지 않습니다.

### RAG 메뉴

RAG 기본 레퍼런스와 함께 문서 등록, 벡터 검색, 질문하기 mock 실험실이 구현되어 있습니다. 실제 Spring AI, pgvector, Supabase PostgreSQL 연결은 다음 확장 단계로 남겨두었습니다.

## 로컬 DB

- H2 Console: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- JDBC URL: `jdbc:h2:mem:studylab`
- User Name: `sa`
- Password: 비워둠

## gRPC 설정

- gRPC 서버 포트: `9090`
- Proto 파일: `backend/src/main/proto/study_lab.proto`
- REST 브리지: `POST http://localhost:8080/api/concepts/grpc/explain`

브라우저에서 gRPC를 직접 호출하려면 gRPC-Web 구성이 추가로 필요합니다. 현재 프로젝트는 학습과 디버깅을 쉽게 하기 위해 REST API가 내부 gRPC 클라이언트를 호출하는 구조입니다.

## Supabase PostgreSQL 연결

기본 실행은 H2 메모리 DB를 사용합니다. Supabase를 사용할 때는 `supabase` 프로필로 백엔드를 실행합니다.

Supabase Dashboard에서 확인할 값:

- Project Settings > Database > Connection string
- Pooler의 Transaction mode 또는 Session mode 주소
- Database password

Spring Boot 실행 예시:

```powershell
cd C:\Users\skw0329\IdeaProjects\study-lab\backend
$env:SPRING_PROFILES_ACTIVE="supabase"
$env:SUPABASE_DB_URL="jdbc:postgresql://aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require"
$env:SUPABASE_DB_USERNAME="postgres.your-project-ref"
$env:SUPABASE_DB_PASSWORD="Supabase DB 비밀번호"
.\gradlew.bat bootRun
```

연결 확인:

```http
GET http://localhost:8080/api/database/info
```

Supabase 연결이 정상이라면 `databaseProductName`이 `PostgreSQL`로 표시됩니다.

Supabase 실제 연결, CRUD 실험실, JPA 관계 매핑은 당장 진행하지 않고 나중에 참고할 수 있도록 별도 문서로 정리했습니다.

- [나중에 진행할 DB / CRUD / JPA 관계 매핑 가이드](docs/future-db-crud-jpa.md)

## 검증 방법

백엔드:

```powershell
cd C:\Users\skw0329\IdeaProjects\study-lab\backend
.\gradlew.bat test
```

프론트엔드:

```powershell
cd C:\Users\skw0329\IdeaProjects\study-lab\frontend
npm run lint
npm run build
```

## 로컬 서버 종료

```powershell
Get-NetTCPConnection -LocalPort 3000,8080,9090 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
```

## 다음 로드맵

- 1순위: RAG mock API 단위 테스트 추가
- 2순위: Spring AI / pgvector / VectorStore 실제 연결 전 비교 가이드 추가
- 보류: Supabase PostgreSQL 연결, CRUD, JPA 관계 매핑은 [준비 문서](docs/future-db-crud-jpa.md)에 정리
