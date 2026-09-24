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

## 사이드바 메뉴 순서

```text
알고리즘
  정렬 실험실
  검색 실험실

자료구조
  스택
  큐
  힙
  그래프

개념 실험
  동기 / 비동기
  트랜잭션
  gRPC

프론트엔드
  React / Next.js 기초
  React 기초
  Next.js 기초

메시징
  Kafka 기초
  Kafka 설정 옵션
  Saga / Outbox

백엔드
  Redis / 캐시 / 분산락
  Security / JWT / OAuth

디자인 패턴
  전략 패턴
  팩토리 패턴
  옵저버 패턴
  데코레이터 패턴
  커맨드 패턴

RAG
  RAG / CAG / MAG / GAG
  문서
  벡터 검색
  질문하기

레퍼런스
  프로젝트 구조
  AI 핵심 개념 2026
  API vs REST API
  TCP vs UDP
  아키텍처
  Circuit Breaker
  CI/CD
  HTTP 에러 처리
  Spring Bean / DI
  테스트 기초
  TDD
  DTO / Entity / VO
  REST API 설계
  LLM 앱 구조
```

## 현재 구현된 화면

- `/`: 정렬 실험실
- `/search`: 검색 실험실
- `/datastructures/stack`: Stack 실험실
- `/datastructures/queue`: Queue 실험실
- `/datastructures/heap`: Heap / PriorityQueue 실험실
- `/datastructures/graph`: Graph / BFS / DFS 실험실
- `/sync-async`: 동기 / 비동기 실험실
- `/transactional`: `@Transactional` 실험실
- `/grpc`: gRPC 실험실
- `/circuit-breaker`: 장애 전파 방지, 상태 전환, Resilience4j 설정과 면접 함정 개념 정리 (정적 학습 화면)
- `/frontend-basics`: React / Next.js 기초 레퍼런스
- `/frontend/react`: React 기초 레퍼런스
- `/frontend/nextjs`: Next.js 기초 레퍼런스
- `/messaging/kafka`: Kafka 기초 레퍼런스
- `/messaging/kafka-config`: Kafka 설정 옵션 레퍼런스
- `/messaging/saga-outbox`: Saga / Outbox 패턴, 메시지 중복/유실 방지 레퍼런스
- `/backend/redis-cache`: Redis / 캐시 / 세션 / 분산락 레퍼런스
- `/backend/sharding-replica`: 샤딩·레플리카 개념 비교, 데이터 배치, 읽기·쓰기 흐름과 운영 주의점 (백엔드 메뉴, API 호출 없는 정적 가이드)
- `/backend/caching-strategies`: Instagram `DdYIumfpPYp`의 캐시 전략을 한국어로 정리하고 부분 실패·TTL·쓰기 정책을 보완한 정적 페이지 (백엔드 메뉴)
- 공통 흐름은 CSS 기반 순차 재생과 경로 선택을 지원합니다. `FlowSection`·브랜드 아이콘 사용법과 검증은 [흐름 애니메이션 가이드](flow-animation.md)를 참고합니다. 본문 설명은 서버 컴포넌트로 유지하고 재생 영역만 클라이언트 컴포넌트입니다.
- `/genai-project-structure`: Instagram `DcQvJsnJXYB`의 GenAI 프로젝트 책임 구분을 정리한 정적 페이지. 폴더 트리는 학습용 예시이며 현재 저장소 구조를 변경하지 않음 (레퍼런스 메뉴)
- `/ai-agent-patterns`: Instagram `DdRObqoohGj`의 Single-shot·ReAct·Planner-executor·Reflexive·Verifier-gated 정리 (레퍼런스 메뉴)
- `/backend/security-auth`: Security / JWT / OAuth 레퍼런스와 JWT mock 테스트
- `/rag/concepts`: RAG / CAG / MAG / GAG 비교, RAG 아키텍처 8가지와 평가·선택 기준 레퍼런스
- `/rag/architecture-comparison`: Learnbay 원문을 바탕으로 Classic·Graph·Agentic RAG를 비교합니다. 그래프 준비와 검색을 구분하고, 공통 FlowSection으로 순차 흐름·추가 검색 경로를 표시합니다. 출처와 비용·선택 기준을 함께 제공합니다.
- `/rag/documents`: RAG 문서 등록, chunking, keyword mock embedding 실험실
- `/rag/vector-search`: RAG 벡터 검색 mock 실험실
- `/rag/ask`: RAG 질문하기 mock 실험실
- `/patterns`: 디자인 패턴 안내
- `/patterns/strategy`: Strategy 패턴 실험실
- `/patterns/factory`: Factory 패턴 실험실
- `/patterns/observer`: Observer 패턴 실험실
- `/patterns/decorator`: Decorator 패턴 실험실
- `/patterns/command`: Command 패턴 실험실
- `/project-structure`: 일반 프로젝트 폴더 구조 레퍼런스
- `/ai-concepts`: AI 핵심 개념 레퍼런스
- `/api-vs-rest`: API / REST / GraphQL / gRPC / FastAPI 비교, 요청 예시, 쇼핑몰 선택 기준과 면접 함정 레퍼런스
- `/tcp-vs-udp`: TCP / UDP 레퍼런스
- `/architecture`: 헥사고날 / 클린 아키텍처 / DDD 레퍼런스
- `/ci-cd`: VERIQTA 캐러셀(표지 + 본문 10장)의 전체 흐름과 실습 9개 정리. 테스트·이미지 발행·스테이징 검증, 불변 digest와 Secret 주의점 포함. 실제 CI/CD 설정은 변경하지 않음.
- `/http-errors`: HTTP 상태코드 / Spring 전역 예외 처리 / 프론트 에러 처리 레퍼런스
- `/spring-bean-di`: Spring Bean / DI / IoC에 Boot 시작 흐름, 생명주기, 자동 구성, AOP·내부 호출 함정과 운영 점검을 보강한 레퍼런스. Spring Boot Core 캐러셀 10장 기반, 기존 메뉴·URL 유지.
- `/testing-basics`: 단위 테스트 / 통합 테스트 / Given-When-Then 레퍼런스
- `/tdd`: TDD 개념 / Red-Green-Refactor / JUnit 어노테이션 / 설계 주의점 레퍼런스
- `/dto-entity-vo`: DTO / Entity / VO 차이 레퍼런스
- `/rest-api-design`: REST API URI / method / query / body 설계 레퍼런스
- `/llm-app-structure`: Prompt / Tool Calling / RAG / Memory / Agent / Guardrail 레퍼런스

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

개발계 DB는 기존 Lumos MariaDB의 전용 `LUMOS_LAB` 스키마로 연결합니다. 로컬은 H2를 유지하며 환경 구분과 실행·Secret·검증 절차는 [로컬 및 개발계 DB 설정](database-environments.md)을 봅니다. Supabase 프로필은 선택 기능으로 유지합니다. 추가 CRUD·관계 매핑 학습 확장은 [DB / CRUD / JPA 관계 매핑 가이드](future-db-crud-jpa.md)를 참고합니다.

## 로그 파일 주의

백엔드 실행 중 생긴 `backend-bootrun*.log` 파일은 학습용 실행 로그입니다. Git에 올리지 않도록 `backend/.gitignore`에서 제외합니다.
