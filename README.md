# Lumos Lab

2026-09-30에 받은 15개 학습 자료의 순서·원문 확인·반영 현황은 [자료 정리 기록](docs/instagram-learning-2026-09-30.md)에 유지합니다. React Hooks 상세(`/frontend/react-hooks`)는 브라우저 Hooks와 Java API 요청·취소를 실습합니다.

[![CI](https://github.com/WhiteCAN/lumos-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/WhiteCAN/lumos-lab/actions/workflows/ci.yml)

Spring Boot와 Next.js를 함께 실행하며 Java, 웹 개발, 데이터베이스, 메시징, 디자인 패턴, AI 애플리케이션 구조를 실험하는 학습용 웹사이트입니다.

완성된 서비스를 제공하는 것이 아니라, 화면에서 API를 호출하고 코드 흐름을 디버깅하며 개념을 익히는 데 목적이 있습니다.

접속 대기열 학습은 `/backend/waiting-room`에서 실행합니다. 방문자 진입·FIFO 순번·퇴장·입장 만료를 Java API와 가상 시계로 비교합니다. 실행 범위와 요청 계약은 [가상 대기실 실습](docs/waiting-room.md)에 정리했습니다.

> 인증, OAuth, Redis, Kafka, RAG 등 일부 기능은 학습용 mock 또는 시뮬레이션입니다. 운영 서비스의 보안·인증 구현으로 그대로 사용하지 마세요.

## 기술 스택

프로젝트 범위·디자인·구조·보안·코드·DB·API 기준과 상세 가이드는 [프로젝트 문서 지도](docs/README.md)에서 찾습니다. 에이전트 작업 규칙은 [AGENTS.md](AGENTS.md)에 유지합니다.

| 영역 | 기술 |
| --- | --- |
| Backend | Java 21, Spring Boot 4, Spring Data JPA, REST, gRPC |
| Frontend | Node.js 22, Next.js 16, React 19, TypeScript, Tailwind CSS |
| Local DB | H2 인메모리 데이터베이스 |
| Development DB | MariaDB / `LUMOS_LAB` |
| Optional DB | Supabase PostgreSQL |
| CI/CD | GitHub Actions, GHCR, Kubernetes, Argo CD |

## 프로젝트 구조

```text
lumos-lab/
├─ backend/            Spring Boot REST API와 gRPC 서버
│  ├─ k8s/dev/         Backend Kubernetes manifest
│  └─ argocd/dev/      Backend Argo CD Application
├─ frontend/           Next.js 웹 UI
│  ├─ k8s/dev/         Frontend Kubernetes manifest
│  └─ argocd/dev/      Frontend Argo CD Application
├─ docs/               작업 및 확장 가이드
└─ .github/workflows/  GitHub Actions 워크플로
```

백엔드와 프론트엔드는 하나의 GitHub 저장소에서 함께 관리합니다. Docker Compose는 사용하지 않습니다.

## 빠른 시작

### 준비물

- Git
- Java 21
- Node.js 22 이상과 npm

로컬에서는 H2를 사용하므로 PostgreSQL, MariaDB, Docker를 별도로 설치할 필요가 없습니다.

### 1. 저장소 내려받기

```bash
git clone https://github.com/WhiteCAN/lumos-lab.git
cd lumos-lab
```

### 2. 백엔드 실행

Windows PowerShell:

```powershell
Set-Location backend
.\gradlew.bat bootRun
```

macOS/Linux:

```bash
cd backend
./gradlew bootRun
```

백엔드를 실행하면 REST API `8080`과 내부 gRPC 서버 `9090`이 함께 시작됩니다.

### 3. 프론트엔드 실행

새 터미널에서 실행합니다.

Windows PowerShell:

```powershell
Set-Location frontend
Copy-Item .env.example .env.local
npm ci
npm run dev
```

macOS/Linux:

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다. 서버는 각 터미널에서 `Ctrl+C`로 종료합니다.

## 로컬 접속 주소

| 용도 | 주소 |
| --- | --- |
| 웹사이트 | [http://localhost:3000](http://localhost:3000) |
| Backend health | [http://localhost:8080/api/health](http://localhost:8080/api/health) |
| DB 연결 정보 | [http://localhost:8080/api/database/info](http://localhost:8080/api/database/info) |
| Swagger UI | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) |
| OpenAPI JSON | [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) |
| H2 Console | [http://localhost:8080/h2-console](http://localhost:8080/h2-console) |
| gRPC REST bridge | [http://localhost:8080/api/concepts/grpc/explain](http://localhost:8080/api/concepts/grpc/explain) |

H2 Console 접속 정보:

```text
JDBC URL: jdbc:h2:mem:lumoslab
User Name: sa
Password: 비워둠
```

H2는 메모리 DB이므로 백엔드를 종료하면 저장된 데이터가 초기화됩니다.

## 실행 흐름

```text
Browser
  -> Next.js frontend :3000
     -> Spring Boot REST API :8080
        -> H2 또는 Supabase PostgreSQL
        -> internal gRPC client
           -> gRPC server :9090
```

브라우저는 gRPC를 직접 호출하지 않습니다. Next.js가 REST API를 호출하고, 필요한 기능에서 Spring Boot 내부 gRPC 클라이언트가 protobuf 메시지를 사용합니다.

## 학습 콘텐츠

| 분야 | 학습 페이지 |
| --- | --- |
| 알고리즘·자료구조 | 정렬 알고리즘 (`/`) · 검색 알고리즘 (`/search`) · 코딩 인터뷰 알고리즘 패턴 (`/algorithm-patterns`) · 스택 (`/datastructures/stack`) · 큐 (`/datastructures/queue`) · 힙·우선순위 큐 (`/datastructures/heap`) · 그래프 탐색: BFS·DFS (`/datastructures/graph`) |
| Java·객체지향 | 객체지향 핵심 개념 (`/oop-concepts`) · Java 입출력·문자열 (`/java/io-string`) · Java 컬렉션 (`/java/collections`) · Java 객체 비교·예외 처리 (`/java/equality-exception`) · Java 동시성 (`/java/concurrency`) · Java 백엔드 면접 핵심 (`/java/backend-interview`) |
| 디자인 패턴 | 개요 (`/patterns`)와 책의 1~23장 순서로 구성한 패턴별 학습·API 실습 |
| Spring·백엔드 | Spring Bean·DI·IoC (`/spring-bean-di`) · 동기·비동기 처리 비교 (`/sync-async`) · Spring Security 인증: JWT·OAuth (`/backend/security-auth`) · Spring으로 이해하는 시스템 설계 (`/spring-system-design`) |
| 데이터·메시징 | 트랜잭션: 커밋·롤백 (`/transactional`) · DB 인덱스·트랜잭션 격리 수준 (`/backend/db-index-transaction`) · 대량 데이터 삽입 (`/backend/bulk-insert`) · Redis 캐시·세션·분산 락 (`/backend/redis-cache`) · 캐시 전략: Cache-Aside·Write-Through (`/backend/caching-strategies`) · DB 샤딩·레플리카 (`/backend/sharding-replica`) · Kafka 메시징 기초 (`/messaging/kafka`) · Kafka 주요 설정 (`/messaging/kafka-config`) · 분산 트랜잭션: Saga·Outbox (`/messaging/saga-outbox`) |
| 네트워크·API | TCP·UDP 비교 (`/tcp-vs-udp`) · API·REST API 비교 (`/api-vs-rest`) · REST API 설계 (`/rest-api-design`) · HTTP 상태 코드·예외 처리 (`/http-errors`) · gRPC 통신 흐름 (`/grpc`) |
| 프론트엔드 | React·Next.js 입문 개요 (`/frontend-basics`) · JavaScript 비동기: Promise·async/await (`/frontend/javascript-async`) · React 기초 (`/frontend/react`) · Next.js 기초 (`/frontend/nextjs`) |
| 설계·테스트·배포 | 헥사고날·클린 아키텍처·DDD (`/architecture`) · 프론트엔드·백엔드 프로젝트 구조 (`/project-structure`) · FastAPI 프로젝트 구조 (`/fastapi-project-structure`) · DTO·Entity·VO 비교 (`/dto-entity-vo`) · 서킷 브레이커와 장애 전파 방지 (`/circuit-breaker`) · 테스트 기초: 단위·통합 테스트 (`/testing-basics`) · 테스트 주도 개발: TDD (`/tdd`) · CI/CD: 빌드·검증·배포 (`/ci-cd`) |
| AI·RAG | AI 핵심 개념 2026 (`/ai-concepts`) · LLM 애플리케이션 구조 (`/llm-app-structure`) · 생성형 AI 프로젝트 구조 (`/genai-project-structure`) · AI 에이전트 설계 패턴 (`/ai-agent-patterns`) · RAG·CAG·MAG·GAG 비교 (`/rag/concepts`) · RAG 구조 비교: Classic·Graph·Agentic (`/rag/architecture-comparison`) · RAG 프로젝트 구조 (`/rag/project-structure`) · RAG 문서 등록 (`/rag/documents`) · RAG 벡터 검색 (`/rag/vector-search`) · RAG 질문·답변 (`/rag/ask`) |

각 화면에는 개념 설명, 비교표, 요청 예시 또는 API 실행 UI가 포함되어 있습니다.

사이드바 상단 **페이지 검색** 또는 **Ctrl/Cmd+K**로 제목·이전 제목·설명·키워드를 검색합니다. 방향키로 선택하고 Enter로 이동하며 Esc로 닫습니다. 본문 전체·초성·오타 보정 검색은 제공하지 않습니다. `/search`는 검색 알고리즘 학습 페이지입니다.

학습 페이지의 메뉴·검색·화면 제목·breadcrumb·브라우저 탭 제목은 공통 페이지 목록을 기준으로 표시합니다. RAG 문서·벡터 검색·질문 실습에는 **모의 실습** 상태를 표시합니다. `/dashboard`는 템플릿 화면으로 학습 메뉴와 검색에서 제외합니다.


공통 학습 흐름은 단계별 강조와 재생 제어, 제품별 컬러 아이콘을 제공합니다. 캐시·샤딩·AI 에이전트에서는 경로를 바꿔 볼 수 있습니다. [흐름 애니메이션 가이드](docs/flow-animation.md)

`/api-vs-rest`에서는 REST·GraphQL·gRPC의 계약, 캐싱, 스트리밍, 요청 예시와 쇼핑몰 적용 기준을 비교합니다.

`/rag/concepts`에서는 RAG 계열 개념과 Naive·Advanced·Modular·Graph·Corrective·Self·Adaptive·Agentic RAG의 흐름, 적용 상황과 평가 기준을 정리합니다.

`/genai-project-structure`에서는 생성형 AI 프로젝트의 13개 영역, 대표 파일과 책임 경계, 질문 처리·오류 예시, Recall·MRR와 답변 근거 충실도를 설명합니다. 첨부 도표를 바탕으로 한 학습용 구조이며 현재 저장소의 폴더 구성을 변경하지 않습니다.

## 환경 설정

### 프론트엔드 API 주소

`frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

기본값도 `http://localhost:8080`이므로 일반적인 로컬 실행에서는 추가 변경이 필요하지 않습니다.

### 백엔드 로컬 / 개발계

기본 프로필은 `local`이며 별도 DB 없이 H2 메모리 DB로 실행합니다. 개발계는 `dev` 프로필로 기존 Lumos MariaDB의 전용 `LUMOS_LAB` 스키마에 연결합니다.

`backend/.env.example`은 변수 안내용이며 Spring Boot가 `.env`를 자동으로 읽지는 않습니다. 실제 값은 실행 환경변수 또는 Kubernetes Secret으로 전달합니다.

```powershell
Set-Location backend
$env:SPRING_PROFILES_ACTIVE = "dev"
$env:LUMOS_LAB_DB_URL = "jdbc:mariadb://your-lumos-db-host:3306/LUMOS_LAB?connectTimeout=5000&socketTimeout=30000"
$env:LUMOS_LAB_DB_USERNAME = "your-database-user"
$env:LUMOS_LAB_DB_PASSWORD = "your-password"
$env:LUMOS_LAB_JWT_SECRET = "change-this-secret"
.\gradlew.bat bootRun
```

비밀번호와 JWT 비밀값이 포함된 `.env` 파일은 Git에 커밋하지 않습니다. 개발계는 시작 시 DB 스키마를 검증하며 자동 변경하지 않습니다. 초기 테이블은 `backend/db/mariadb/001-lumos-lab.sql`로 준비합니다.

상세 실행·Secret·검증 절차는 [로컬 및 개발계 DB 설정](docs/database-environments.md)을 참고합니다. 기존 `supabase` 프로필은 선택 사용을 위해 유지하지만 개발계 배포에서는 사용하지 않습니다.

## 검증

Backend:

```powershell
Set-Location backend
.\gradlew.bat test
```

Frontend:

```powershell
Set-Location frontend
npm ci
npm run test:study
npm run lint
npm run build
```

GitHub Actions에서도 같은 백엔드 테스트와 프론트엔드 설치·lint·build를 수행합니다.

## 개발 환경 배포 구성

Spring 핵심 학습은 Spring·백엔드의 `/spring-bean-di`에 모았습니다. Bean·DI·IoC부터 Boot 시작·자동 구성·생명주기·AOP 내부 호출 함정까지 이어서 볼 수 있습니다.

`/ci-cd`와 `/circuit-breaker`는 설계·테스트·배포에, 동기·비동기는 Spring·백엔드에, 트랜잭션은 데이터·메시징에, gRPC는 네트워크·API에 배치합니다. 기존 URL과 실습 기능은 유지합니다.

`development` 브랜치와 다음 배포 구성이 준비되어 있습니다.

- GitHub Actions CI
- Backend·Frontend 컨테이너 이미지 빌드 및 GHCR 발행
- Kubernetes manifest: `backend/k8s/dev`, `frontend/k8s/dev`
- Argo CD Application: `backend/argocd/dev`, `frontend/argocd/dev`
- 개발 도메인: `lab.dev.lumosgraphy.com`, `api.lab.dev.lumosgraphy.com`

실제 개발 서버 배포에는 DNS, GHCR 접근 권한, Kubernetes Secret, Argo CD Application 등록이 별도로 필요합니다. DB는 기존 Lumos MariaDB의 `LUMOS_LAB`을 사용하며 접속 정보는 `lumos-lab-backend-secret`으로 주입합니다. 개발계 DB 계정은 가능하면 `LUMOS_LAB`에만 권한을 부여한 전용 계정을 사용합니다.

## 문서

- [작업 이어가기 가이드](docs/continuation-guide.md)
- [DB·CRUD·JPA 확장 가이드](docs/future-db-crud-jpa.md)
- [공개 저장소 및 개발 배포 설계](docs/superpowers/specs/2026-08-22-lumos-lab-public-development-design.md)

## 이용 안내

이 저장소는 소스 열람과 직접 내려받아 실행하는 학습을 위해 공개되어 있습니다. 별도의 오픈소스 라이선스는 제공하지 않으며, 저장소가 공개되어 있다는 사실만으로 코드의 수정·재배포 권한이 부여되는 것은 아닙니다.

- `/java/backend-interview`: Coding Sight 게시물의 확인 가능한 면접 질문 1~24번을 Java·동시성·Spring·JPA·마이크로서비스로 정리합니다. 잘린 25번은 제외하고 공식 문서 기반 주의점과 트랜잭션 세로 비교 흐름을 제공합니다.

- `/spring-system-design`: Spring 생태계 기능 10개와 시스템 설계 개념을 연결합니다. 기능별 소속·설계 조건, @Async와 메시징의 세로 흐름 비교, 원문·공식 문서를 제공합니다.

- `/oop-concepts`: CodeHive의 객체지향 개념 15개를 정리합니다. Python 고유 동작, 상속·합성 세로 흐름 비교와 실행 가능한 위임 예제를 포함합니다.

- `/algorithm-patterns`: 코딩 인터뷰 패턴 10개의 적용 신호·동작·복잡도·주의점, DFS/BFS 세로 방문 순서 비교와 패턴 선택 기준을 정리합니다.

- `/rag/project-structure`: Python RAG 프로젝트 폴더 예시와 모듈별 책임, 색인·질문 처리의 세로 흐름 비교, 메타데이터·버전·평가 계약을 정리합니다. 실제 저장소 구조 변경은 없습니다.

- `/fastapi-project-structure`: FastAPI 폴더별 책임과 ORM 모델·Pydantic 스키마 구분, 정상·검증 실패 세로 흐름, 세션·비동기 실행 주의점을 정리합니다.

- /java/collections: Java 21 계층도와 14개 구현체의 실제 Java 실행 기록을 이전/다음 단계로 확인합니다. ArrayList의 삭제 오버로드·예외, Vector 용량 증가, Set 중복, Queue/Deque, Map 교체를 포함합니다. 다운로드 예제와 IntelliJ 내부 필드 관찰 안내를 제공합니다. 브라우저는 저장된 실행 기록을 재생하며 실시간 JVM 디버거는 아닙니다.

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

### 학습 진행도

모든 학습 페이지 상단에서 **이 페이지 학습 완료**를 체크하거나 해제합니다. 전체 완료 수·진행률과 메뉴의 주제별 완료 수·페이지별 체크 표시가 즉시 반영됩니다. 방문만으로 완료 처리하지 않습니다.

기록은 현재 브라우저·사이트 주소의 localStorage(`lumos-lab.study-progress.v1`)에 저장되어 새로고침 후 유지되고 같은 주소의 다른 탭에도 반영됩니다. 다른 브라우저·기기로 동기화되지 않으며 사이트 데이터를 지우면 초기화됩니다. 저장이 차단된 경우 오류를 표시합니다.

## 통합된 릴스 학습 페이지

- `/backend/jwt-oauth`: JWT · OAuth · OIDC — 토큰 형식, 권한 위임, 사용자 인증의 차이와 검증 흐름
- `/messaging/kafka-architecture`: Kafka 아키텍처 — 브로커·파티션·복제·소비자 그룹과 오프셋
- `/docker-multi-stage`: Docker 멀티스테이지 빌드 — 빌드 도구와 실행 환경 분리 및 Java 예시
- `/docker-image-optimization`: Docker 이미지 최적화 — 이미지 최적화 10가지와 레이어·캐시·측정

## 시스템 다이어그램

Redis 캐시(`/backend/redis-cache`), Spring 시스템 설계(`/spring-system-design`), Kafka 아키텍처(`/messaging/kafka-architecture`)는 React Flow와 기존 Lucide·기술 로고로 구성도를 제공합니다. 경로 선택, 구성 요소 설명, 확대·축소와 연결 목록을 지원합니다. 모바일은 연결 목록을 기본으로 보여 줍니다. 실제 인프라 실행과 구분되는 학습용 모형이며 기존 API 실습은 유지합니다. 구현 지도, 데이터 작성법과 왕복 연결선 처리 방법은 [React Flow 시스템 다이어그램 가이드](docs/react-flow-diagrams.md)를 참고하세요.


## Instagram 자료별 학습 페이지 확장

- `/system-design-roadmap`: 시스템 설계 학습 지도와 보안 개념, 기존 심화 페이지 연결
- `/architecture/microservices`: 서비스 경계·Gateway·Discovery·데이터 소유권·Outbox 모형
- `/java/stack-heap`: 스택·힙·참조와 실제 Java 객체 수정 및 재할당 실습
- `/devops-toolchain`: Linux·Docker·Kubernetes·Terraform·Jenkins·GitHub Actions 역할 비교
- `/messaging/kafka-architecture`: 기존 구성도와 파티션·오프셋 실습 보완

원문 확인 범위와 실행 모형의 제한은 [자료별 반영 기록](docs/instagram-learning-pages.md)을 참고합니다.


## SOLID 3열 비교 학습

- `/solid-principles`: 원칙마다 설명·구조·Java 예제를 1행 3열로 비교합니다. 1024px 이상에서 3열, 좁은 화면에서는 세로 순서로 표시하며 코드 스크롤은 코드 영역 안에 한정합니다.
- 원문: https://www.instagram.com/reels/Db3_szLzmve/ — 캡션과 화면에 표시된 5행 3열 자료 확인. LSP의 비행 계약을 보완하고, 기존 `/oop-concepts`에서 연결합니다.
- 실행은 기존 Java `/api/patterns/strategy/run`을 재사용합니다. Java 예제 실행이나 SOLID 전체 검증은 아니며, 음수 보정·등급 선택 방식·입력 오류와 브레이크포인트를 안내합니다.

### 기존 구성도·흐름도 React Flow 통합

2026-09-28: 공통 FlowSection과 페이지별 HTML 흐름을 React Flow로 전환했습니다. SOLID·Saga/Outbox·샤딩/복제·Java 참조/컬렉션·Kafka 복제 배치도도 같은 카드/아이콘을 사용합니다. 재생·경로 선택·API 실습을 유지하고 텍스트 대체 목록을 제공합니다. 상세 계약은 [구성도 가이드](docs/react-flow-diagrams.md)를 참고하세요.

## 2026-09-30 자료 정리

15개 원문의 반영 내역과 확인 범위는 [순차 정리 기록](docs/instagram-learning-2026-09-30.md)을 참고합니다.

| 새 상세 페이지 | 경로 | 실행 범위 |
| --- | --- | --- |
| React Hooks | `/frontend/react-hooks` | 실제 Hooks·타이머·Java API 요청/취소 |
| Kubernetes 배포 | `/kubernetes-deployment` | 복제 수·Ready·라우팅 조건 모형 |
| Java record | `/java/records` | 실제 record 값 비교·방어적 복사 |
| 로드밸런싱 | `/load-balancing` | Round Robin·Least Connections 배정 모형 |
| LLM 핸드북 | `/llm-handbook` | softmax·temperature 확률 계산 |
| 로깅·모니터링 | `/observability` | 평균·nearest-rank percentile 계산 |
| Spring Security | `/backend/spring-security` | 기존 HMAC 토큰 실습 연결 |

Kafka 구조·설정, 캐싱, JWT·OAuth, 트랜잭션, 마이크로서비스 페이지는 기존 내용을 보존하면서 보완했습니다. 다이어그램은 React Flow, 예제는 Java를 기본으로 사용합니다. React 자체 실행은 TypeScript입니다.
