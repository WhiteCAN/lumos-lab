# 작업 이어가기 가이드

이 문서는 다음에 프로젝트를 다시 열었을 때 어디까지 되어 있는지 빠르게 확인하기 위한 메모입니다.

## 현재 목표

Spring Boot API와 Next.js 화면을 함께 실행하면서 Java 자료구조, 알고리즘, 디자인 패턴, Spring 개념, React/Next.js 라우팅을 디버깅으로 공부합니다.

## 실행 주소

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend health: [http://localhost:8080/api/health](http://localhost:8080/api/health)
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- OpenAPI JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
- DB 연결 확인: [http://localhost:8080/api/database/info](http://localhost:8080/api/database/info)
- H2 Console: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- gRPC 브리지 API: [http://localhost:8080/api/concepts/grpc/explain](http://localhost:8080/api/concepts/grpc/explain)
- RAG 문서 API: [http://localhost:8080/api/rag/documents](http://localhost:8080/api/rag/documents)

## 실행 명령

백엔드:

```powershell
Set-Location backend
.\gradlew.bat bootRun
```

프론트엔드:

```powershell
Set-Location frontend
npm run dev
```

## 서버 종료 명령

프론트엔드 3000, 백엔드 REST 8080, gRPC 9090 포트를 같이 내립니다.

```powershell
Get-NetTCPConnection -LocalPort 3000,8080,9090 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
```

## 사이드바 메뉴와 검색

알고리즘·자료구조 → Java·객체지향 → Spring·백엔드 → 데이터·메시징 → 네트워크·API → 프론트엔드 → 설계·테스트·배포 → AI·RAG

사이드바 상단 **페이지 검색** 또는 **Ctrl/Cmd+K**로 제목·이전 제목·설명·키워드를 검색합니다. 방향키로 선택하고 Enter로 이동하며 Esc로 닫습니다. 본문 전체·초성·오타 보정 검색은 제공하지 않습니다. `/search`는 검색 알고리즘 학습 페이지입니다.

81개 학습 페이지의 메뉴·검색·화면 제목·breadcrumb·브라우저 탭 제목은 공통 페이지 목록을 기준으로 표시합니다. RAG 문서·벡터 검색·질문 실습에는 **모의 실습** 상태를 표시합니다. `/dashboard`는 템플릿 화면으로 학습 메뉴와 검색에서 제외합니다.

등록 기준은 `frontend/src/lib/study-pages.ts`입니다. 제목 변경은 공통 목록에서 처리하고, 페이지의 `getStudyPage` 또는 `ReferencePage pageHref`와 서버 metadata를 연결합니다. 페이지를 추가하면 `npm run test:study`로 검색·라우트 등록을 검증합니다.

## 현재 구현된 화면

- `/frontend/javascript-async`: JavaScript 비동기: Promise·async/await — teqora_skills 게시물 DdiQw5eznHO의 이미지·캡션을 한국어로 재구성. Promise 상태·then/catch/finally·async/await, 순차/동시 실행 세로 흐름, Promise.all/allSettled, 취소·오류 전파와 Playwright 예제를 MDN·공식 문서로 보완. 정적 학습 페이지이며 API 호출 없음.

- `/`: 정렬 알고리즘 — 정렬 실험실
- `/search`: 검색 알고리즘 — 검색 실험실
- `/datastructures/stack`: 스택 — Stack 실험실
- `/datastructures/queue`: 큐 — Queue 실험실
- `/datastructures/heap`: 힙·우선순위 큐 — Heap / PriorityQueue 실험실
- `/datastructures/graph`: 그래프 탐색: BFS·DFS — Graph / BFS / DFS 실험실
- `/sync-async`: 동기·비동기 처리 비교 — 동기 / 비동기 실험실
- `/transactional`: 트랜잭션: 커밋·롤백 — `@Transactional` 실험실
- `/grpc`: gRPC 통신 흐름 — gRPC 실험실
- `/circuit-breaker`: 서킷 브레이커와 장애 전파 방지 — 장애 전파 방지, 상태 전환, Resilience4j 설정과 면접 함정 개념 정리 (정적 학습 화면)
- `/frontend-basics`: React·Next.js 입문 개요 — React / Next.js 기초 레퍼런스
- `/frontend/react`: React 기초 — React 기초 레퍼런스
- `/frontend/nextjs`: Next.js 기초 — Next.js 기초 레퍼런스
- `/messaging/kafka`: Kafka 메시징 기초 — Kafka 기초 레퍼런스
- `/messaging/kafka-config`: Kafka 주요 설정 — Kafka 설정 옵션 레퍼런스
- `/messaging/saga-outbox`: 분산 트랜잭션: Saga·Outbox — Saga / Outbox 패턴, 메시지 중복/유실 방지 레퍼런스
- `/backend/redis-cache`: Redis 캐시·세션·분산 락 — Redis / 캐시 / 세션 / 분산락 레퍼런스
- `/backend/sharding-replica`: DB 샤딩·레플리카 — 샤딩·레플리카 개념 비교, 데이터 배치, 읽기·쓰기 흐름과 운영 주의점 (데이터·메시징 메뉴, API 호출 없는 정적 가이드)
- `/backend/caching-strategies`: 캐시 전략: Cache-Aside·Write-Through — Instagram `DdYIumfpPYp`의 캐시 전략을 한국어로 정리하고 부분 실패·TTL·쓰기 정책을 보완한 정적 페이지 (데이터·메시징 메뉴)
- 공통 흐름은 CSS 기반 순차 재생과 경로 선택을 지원합니다. `FlowSection`·브랜드 아이콘 사용법과 검증은 [흐름 애니메이션 가이드](flow-animation.md)를 참고합니다. 본문 설명은 서버 컴포넌트로 유지하고 재생 영역만 클라이언트 컴포넌트입니다.
- `/genai-project-structure`: 생성형 AI 프로젝트 구조 — Instagram `DcQvJsnJXYB`의 GenAI 프로젝트 책임 구분을 정리한 정적 페이지. 폴더 트리는 학습용 예시이며 현재 저장소 구조를 변경하지 않음 (AI·RAG 메뉴)
- `/ai-agent-patterns`: AI 에이전트 설계 패턴 — Instagram `DdRObqoohGj`의 Single-shot·ReAct·Planner-executor·Reflexive·Verifier-gated 정리 (AI·RAG 메뉴)
- `/backend/security-auth`: Spring Security 인증: JWT·OAuth — Security / JWT / OAuth 레퍼런스와 JWT mock 테스트
- `/rag/concepts`: RAG·CAG·MAG·GAG 비교 — RAG / CAG / MAG / GAG 비교, RAG 아키텍처 8가지와 평가·선택 기준 레퍼런스
- `/rag/architecture-comparison`: RAG 구조 비교: Classic·Graph·Agentic — Learnbay 원문을 바탕으로 Classic·Graph·Agentic RAG를 비교합니다. 그래프 준비와 검색을 구분하고, 공통 FlowSection으로 순차 흐름·추가 검색 경로를 표시합니다. 출처와 비용·선택 기준을 함께 제공합니다.
- `/rag/documents`: RAG 문서 등록 — RAG 문서 등록, chunking, keyword mock embedding 실험실
- `/rag/vector-search`: RAG 벡터 검색 — RAG 벡터 검색 mock 실험실
- `/rag/ask`: RAG 질문·답변 — RAG 질문하기 mock 실험실
- `/patterns`: 디자인 패턴 개요 — 디자인 패턴 안내
- `/patterns/strategy`: 전략 패턴 — Strategy 패턴 실험실
- `/patterns/factory`: 팩토리 패턴 — Factory 패턴 실험실
- `/patterns/observer`: 옵저버 패턴 — Observer 패턴 실험실
- `/patterns/decorator`: 데코레이터 패턴 — Decorator 패턴 실험실
- `/patterns/command`: 커맨드 패턴 — Command 패턴 실험실
- `/project-structure`: 프론트엔드·백엔드 프로젝트 구조 — 일반 프로젝트 폴더 구조 레퍼런스
- `/ai-concepts`: AI 핵심 개념 2026 — AI 핵심 개념 레퍼런스
- `/api-vs-rest`: API·REST API 비교 — API / REST / GraphQL / gRPC / FastAPI 비교, 요청 예시, 쇼핑몰 선택 기준과 면접 함정 레퍼런스
- `/tcp-vs-udp`: TCP·UDP 비교 — TCP / UDP 레퍼런스
- `/architecture`: 헥사고날·클린 아키텍처·DDD — 헥사고날 / 클린 아키텍처 / DDD 레퍼런스
- `/ci-cd`: CI/CD: 빌드·검증·배포 — VERIQTA 캐러셀(표지 + 본문 10장)의 전체 흐름과 실습 9개 정리. 테스트·이미지 발행·스테이징 검증, 불변 digest와 Secret 주의점 포함. 실제 CI/CD 설정은 변경하지 않음.
- `/http-errors`: HTTP 상태 코드·예외 처리 — HTTP 상태코드 / Spring 전역 예외 처리 / 프론트 에러 처리 레퍼런스
- `/spring-bean-di`: Spring Bean·DI·IoC — Spring Bean / DI / IoC에 Boot 시작 흐름, 생명주기, 자동 구성, AOP·내부 호출 함정과 운영 점검을 보강한 레퍼런스. Spring Boot Core 캐러셀 10장 기반, URL 유지, Spring·백엔드 메뉴에 배치.
- `/testing-basics`: 테스트 기초: 단위·통합 테스트 — 단위 테스트 / 통합 테스트 / Given-When-Then 레퍼런스
- `/tdd`: 테스트 주도 개발: TDD — TDD 개념 / Red-Green-Refactor / JUnit 어노테이션 / 설계 주의점 레퍼런스
- `/dto-entity-vo`: DTO·Entity·VO 비교 — DTO / Entity / VO 차이 레퍼런스
- `/rest-api-design`: REST API 설계 — REST API URI / method / query / body 설계 레퍼런스
- `/llm-app-structure`: LLM 애플리케이션 구조 — Prompt / Tool Calling / RAG / Memory / Agent / Guardrail 레퍼런스

## 백엔드 패키지 기준

```text
com.lumos.lab
  algorithm.sort
  algorithm.search
  datastructure.stack
  datastructure.queue
  datastructure.heap
  datastructure.graph
  concept.syncasync
  concept.transactional
  concept.grpc
  concept.rag
  pattern.strategy
  pattern.factory
  pattern.observer
  pattern.decorator
  pattern.command
  database
  common
  config
  health
```

패턴 기능은 이전처럼 하나의 통합 API를 재사용하지 않고, 각 메뉴별 패키지와 컨트롤러로 분리되어 있습니다.

## 검증 명령

백엔드:

```powershell
Set-Location backend
.\gradlew.bat test
```

프론트엔드:

```powershell
Set-Location frontend
npm run test:study
npm run lint
npm run build
```

## 아직 안 한 일

### RAG

기본 레퍼런스 페이지와 문서 등록 / 벡터 검색 / 질문하기 mock 화면 및 API가 구현되어 있습니다.

API:

```http
GET    http://localhost:8080/api/rag/documents
POST   http://localhost:8080/api/rag/documents
DELETE http://localhost:8080/api/rag/documents
POST   http://localhost:8080/api/rag/vector-search
POST   http://localhost:8080/api/rag/ask
```

현재 구현은 DB나 실제 LLM 없이 인메모리 문서 저장소, chunking, keyword 기반 mock embedding/검색, mock 답변 생성을 사용합니다.

다음 추천 순서:

1. RAG mock API에 간단한 단위 테스트 추가
2. Spring AI의 `EmbeddingModel`, `VectorStore`, `ChatClient` 흐름과 현재 mock 구조 비교 페이지 추가
3. 이후 pgvector, Supabase PostgreSQL 연결 검토

### Supabase / CRUD / JPA

지금은 보류 상태입니다. 시작할 때는 [DB / CRUD / JPA 관계 매핑 가이드](future-db-crud-jpa.md)를 먼저 봅니다.

## 로그 파일 주의

백엔드 실행 중 생긴 `backend-bootrun*.log` 파일은 학습용 실행 로그입니다. Git에 올리지 않도록 `backend/.gitignore`에서 제외합니다.

- `/java/backend-interview`: Java 백엔드 면접 핵심 — Coding Sight 게시물의 확인 가능한 면접 질문 1~24번을 Java·동시성·Spring·JPA·마이크로서비스로 정리합니다. 잘린 25번은 제외하고 공식 문서 기반 주의점과 트랜잭션 세로 비교 흐름을 제공합니다.

- `/spring-system-design`: Spring으로 이해하는 시스템 설계 — Spring 생태계 기능 10개와 시스템 설계 개념을 연결합니다. 기능별 소속·설계 조건, @Async와 메시징의 세로 흐름 비교, 원문·공식 문서를 제공합니다.

- `/oop-concepts`: 객체지향 핵심 개념 — CodeHive의 객체지향 개념 15개를 정리합니다. Python 고유 동작, 상속·합성 세로 흐름 비교와 실행 가능한 위임 예제를 포함합니다.

- `/algorithm-patterns`: 코딩 인터뷰 알고리즘 패턴 — 코딩 인터뷰 패턴 10개의 적용 신호·동작·복잡도·주의점, DFS/BFS 세로 방문 순서 비교와 패턴 선택 기준을 정리합니다.

- `/rag/project-structure`: RAG 프로젝트 구조 — Python RAG 프로젝트 폴더 예시와 모듈별 책임, 색인·질문 처리의 세로 흐름 비교, 메타데이터·버전·평가 계약을 정리합니다. 실제 저장소 구조 변경은 없습니다.

- `/fastapi-project-structure`: FastAPI 프로젝트 구조 — FastAPI 폴더별 책임과 ORM 모델·Pydantic 스키마 구분, 정상·검증 실패 세로 흐름, 세션·비동기 실행 주의점을 정리합니다.

- /java/collections: Java 21 계층도와 14개 구현체의 실제 Java 실행 기록을 이전/다음 단계로 확인합니다. ArrayList의 삭제 오버로드·예외, Vector 용량 증가, Set 중복, Queue/Deque, Map 교체를 포함합니다. 다운로드 예제와 IntelliJ 내부 필드 관찰 안내를 제공합니다. 브라우저는 저장된 실행 기록을 재생하며 실시간 JVM 디버거는 아닙니다.

컬렉션 기록의 원본은 `frontend/public/examples/CollectionsDebugLab.java`입니다. JDK 21 환경에서 frontend 폴더 기준 `node scripts/generate-collections-trace.mjs`로 재생성하고 `node scripts/collections-trace.test.mjs`로 14개 예제의 경계값·단계 연결·실행 결과 일치를 확인합니다. 기록은 `src/app/java/collections/traces.json`, 화면은 같은 폴더의 `collection-debugger.tsx`입니다. 내부 필드와 순회 순서는 JDK 구현에 따라 달라질 수 있습니다.

- 비동기 학습 페이지 검증 중 공통 비교표의 중복 값에 따른 React key 충돌을 열 기준 key로 수정했습니다. 테마 버튼은 hydration 완료 전 시스템 아이콘을 사용해 저장된 다크 모드로 새로고침할 때 서버·클라이언트 불일치를 방지합니다.

## Instagram 학습 페이지 추가 (2026-09-22)

- `/java/ordered-maps`: TreeMap·LinkedHashMap: 정렬과 순서 — 키 정렬, 삽입 순서, 접근 순서를 구분하고 탐색 메서드와 시간 복잡도를 비교합니다.
- `/frontend/event-loop`: JavaScript 이벤트 루프: 태스크·마이크로태스크 — 동기 코드, Promise 콜백, 타이머의 실행 순서를 예제로 추적합니다.
- `/cors`: CORS: 출처·사전 요청·인증 정보 — 브라우저가 교차 출처 응답을 공개하는 조건과 OPTIONS 사전 요청을 이해합니다.
- `/microservices-patterns`: 마이크로서비스 설계 패턴 12가지 — 진입점, 장애 격리, 데이터 일관성, 점진 전환 문제에 맞춰 패턴을 선택합니다.
- `/frontend/javascript-async`: 기존 Promise·async/await 페이지를 재사용합니다. 이벤트 루프 페이지와 연결했습니다.

## API 실행·디버깅 학습

설명 중심이었던 40개 페이지에 대표 실행 실습을 연결했습니다. 책 예제 18개 새 페이지와 기존 23개 실행 페이지를 합쳐 학습 목록 81개 전체에 실행 진입점이 있습니다. 각 설명의 모든 세부 기능을 구현했다는 의미는 아닙니다.

- 실습 패널에서 요청 JSON을 변경하고 **API 실행**을 누르면 HTTP 상태·원본 응답·중간 결과를 볼 수 있습니다.
- IntelliJ에서 `backend` 프로젝트의 `BackendApplication`을 Debug로 실행합니다. 패널의 **디버깅 위치와 실행 방법**에 표시된 메서드에 브레이크포인트를 설정합니다.
- 실행 중인 일반 백엔드가 8080 포트를 사용한다면 먼저 종료한 뒤 Debug로 실행합니다. 프론트엔드는 3000·3001·3189 출처를 기본 허용합니다. 별도 출처는 `APP_CORS_ALLOWED_ORIGINS`를 설정합니다.
- 브라우저 로직은 frontend에서 `npm run dev` 후 DevTools → Sources에서 `browser-debug-labs.ts`·`debug-lab.tsx`를 찾습니다. 프로덕션 미리보기의 코드는 압축될 수 있습니다.
- CLI 원격 디버깅은 backend에서 `.\gradlew.bat bootRun --debug-jvm` 실행 후 IntelliJ Remote JVM Debug로 localhost:5005에 연결합니다. 연결 전에는 시작이 대기할 수 있습니다.
- 디버거에 멈춰 있는 시간도 응답 시간에 포함되므로 성능 비교 시 브레이크포인트를 해제합니다.

실제 실행: TreeMap·LinkedHashMap, Spring 빈 조회, H2 인덱스와 EXPLAIN, 지연 HTTP 요청·실패 응답, 브라우저 Promise·이벤트 루프·CORS.
로컬 모형: 캐시·샤드·메시지 파티션·Outbox·서킷 차단·패킷 복구·검증 파이프라인. Redis/Kafka 클러스터, 실제 네트워크 장애, 외부 CI 배포를 실행하지 않습니다. AI/RAG는 기존 키워드 기반 모의 API입니다. 각 패널에서 범위를 확인하세요.

검증 명령: backend의 `.\gradlew.bat test`, frontend의 `npm run test:labs`, `npm run test:study`, `npm run lint`, `npm run build`.

## 책 예제 디자인 패턴 23장

`/patterns#book`에 『Java 언어로 배우는 디자인 패턴 입문 3판』 예제의 장별 목차를 추가했습니다. 기존 전략·팩토리·데코레이터·옵저버·커맨드 페이지를 보완하고 나머지 18개 페이지를 추가했습니다.

- 각 장: 원본 클래스 역할, 객체 협력 흐름, 원본 Main 코드, 대표 Q/A 비교, 주의점, HTTP용 변경점.
- 실행: `POST /api/patterns/book/{pattern}`. 각 화면의 기본 JSON을 변경하고 API를 실행합니다.
- 디버깅: `backend/src/main/java/com/lumos/lab/pattern/book/BookPatternController.java`에서 장별 `BookChapters01To08`, `BookChapters09To16`, `BookChapters17To23`로 진입합니다.
- GUI·파일 출력·긴 대기 대신 요청별 데이터와 실행 기록을 사용합니다. Interpreter는 중첩·반복·실행량을 제한합니다. 모든 Q/A 원본을 실행하는 기능은 아닙니다.
- 원본 지도와 API 목록: `docs/book-examples-map.md` (루트 기준). MIT 고지: `docs/third-party/design-patterns-MIT.txt`.
