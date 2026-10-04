# Lumos Lab 프론트엔드

## 2026-10-04 추가 화면

- `/messaging/kafka-acks`: Kafka ACK · 복제 확인과 손실 경계
- `/java/enums`: Java enum · 고정 값과 타입 안전성
- `/frontend/javascript-basics`: JavaScript 기초 · 값·배열·실행 경계
- `/ai-agent-lab`: 에이전트 실행 실습 · 수정과 검증 게이트
- `/agent-rag-mcp`: Agent·RAG·MCP · 검색과 도구의 경계
- `/backend/fastapi`: FastAPI 핵심 · 계약·검증·테스트

JavaScript 화면의 array-browser-lab.tsx는 실제 브라우저 배열 연산과 Java API 결과를 비교합니다. FastAPI Python 예시는 public/examples/fastapi_quote.py에서 내려받을 수 있습니다. 실제 웹 API는 기존 Spring Boot 가격 실습입니다. [자료·검증 기록](../docs/instagram-learning-2026-10-04.md)

React Hooks 상세는 `/frontend/react-hooks`이며 React 기초에서 연결됩니다. 카운터·Context·메모화·DOM 참조·Java API 요청과 취소를 실제 실행합니다. [15개 원문 순차 반영 현황](../docs/instagram-learning-2026-09-30.md)을 참고하세요.

Next.js, React, TypeScript, Tailwind CSS, shadcn/ui를 공부하기 위한 프론트엔드입니다.

`/backend/waiting-room`은 접속 대기열 전용 실습입니다. 3열 상태판(모바일 1열), React Flow, Java 예제와 실제 API 호출을 제공합니다. [실습 계약과 재현 순서](../docs/waiting-room.md)를 참고하세요.

프로젝트 전체 문서는 [문서 지도](../docs/README.md), 화면 기준은 [디자인 시스템](../docs/DESIGN_SYSTEM.md), 작성·검증 규칙은 [코드 스타일](../docs/CODE_STYLE.md), 통신 계약은 [API 가이드](../docs/API.md)를 참고합니다. 페이지 구현 위치는 [AGENTS.md](AGENTS.md)가 안내합니다.

## 의존성 보안 점검

2026-09-24에 Next.js와 eslint-config-next를 16.3.6으로 맞추고, 취약점이 보고된 하위 의존성을 갱신했습니다. `npm ci` 후 `npm audit`, `npm run test:team-navigation`, `npm run lint`, `npm run build`로 점검합니다. 취약점 데이터는 바뀔 수 있으므로 배포 전 다시 검사합니다.

잠금 파일은 CI와 동일한 Node.js 22 / npm 10.9.8 기준으로 관리합니다. 다른 npm 버전으로 갱신했다면 `npx --yes npm@10.9.8 install --package-lock-only --ignore-scripts` 후 `npx --yes npm@10.9.8 ci --dry-run --ignore-scripts`로 CI 호환성을 확인합니다.

## 공통 팀 전환

공통 순서는 Lumos Photo (`Alt+1`), Lumos Lab (`Alt+2`), Lumos Admin (`Alt+3`)입니다. Lab은 아직 로그인 연동이 없으므로 Photo와 Lab만 표시하고 `Alt+3`도 무시합니다. 두 사이트를 새 탭으로 열며 현재 페이지는 Lumos Lab 표시를 유지합니다. 입력 중·키 반복·IME 조합 중에는 단축키가 동작하지 않습니다. `npm run test:team-navigation`으로 이동 대상과 단축키 보호 동작을 검증합니다. 로그인은 [JWT 인증 학습 과제](../docs/future-jwt-auth.md)로 남깁니다.

## 실행 방법

```powershell
cd frontend
npm run dev
```

[http://localhost:3000](http://localhost:3000)으로 접속합니다.

## 환경 변수

`.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 페이지 찾기

사이드바 상단 **페이지 검색** 또는 **Ctrl/Cmd+K**로 제목·이전 제목·설명·키워드를 검색합니다. 방향키로 선택하고 Enter로 이동하며 Esc로 닫습니다. 본문 전체·초성·오타 보정 검색은 제공하지 않습니다. `/search`는 검색 알고리즘 학습 페이지입니다.

학습 페이지의 메뉴·검색·화면 제목·breadcrumb·브라우저 탭 제목은 공통 페이지 목록을 기준으로 표시합니다. RAG 문서·벡터 검색·질문 실습에는 **모의 실습** 상태를 표시합니다. `/dashboard`는 템플릿 화면으로 학습 메뉴와 검색에서 제외합니다.

## 화면 목록

### 알고리즘·자료구조

- `/`: 정렬 알고리즘
- `/search`: 검색 알고리즘
- `/algorithm-patterns`: 코딩 인터뷰 알고리즘 패턴
- `/datastructures/stack`: 스택
- `/datastructures/queue`: 큐
- `/datastructures/heap`: 힙·우선순위 큐
- `/datastructures/graph`: 그래프 탐색: BFS·DFS

### Java·객체지향

- `/oop-concepts`: 객체지향 핵심 개념
- `/java/io-string`: Java 입출력·문자열
- `/java/collections`: Java 컬렉션
- `/java/equality-exception`: Java 객체 비교·예외 처리
- `/java/concurrency`: Java 동시성
- `/java/backend-interview`: Java 백엔드 면접 핵심

### 디자인 패턴

책의 1~23장 순서로 구성합니다. 전체 장별 링크는 `/patterns#book` 목차에서 확인합니다.

- `/patterns`: 디자인 패턴 개요
- `/patterns/strategy`: 전략 패턴
- `/patterns/factory`: 팩토리 패턴
- `/patterns/observer`: 옵저버 패턴
- `/patterns/decorator`: 데코레이터 패턴
- `/patterns/command`: 커맨드 패턴

### Spring·백엔드

- `/spring-bean-di`: Spring Bean·DI·IoC
- `/sync-async`: 동기·비동기 처리 비교
- `/backend/security-auth`: Spring Security 인증: JWT·OAuth
- `/spring-system-design`: Spring으로 이해하는 시스템 설계

### 데이터·메시징

- `/transactional`: 트랜잭션: 커밋·롤백
- `/backend/db-index-transaction`: DB 인덱스·트랜잭션 격리 수준
- `/backend/bulk-insert`: 대량 데이터 삽입
- `/backend/redis-cache`: Redis 캐시·세션·분산 락
- `/backend/caching-strategies`: 캐시 전략: Cache-Aside·Write-Through
- `/backend/sharding-replica`: DB 샤딩·레플리카
- `/messaging/kafka`: Kafka 메시징 기초
- `/messaging/kafka-config`: Kafka 주요 설정
- `/messaging/saga-outbox`: 분산 트랜잭션: Saga·Outbox

### 네트워크·API

- `/tcp-vs-udp`: TCP·UDP 비교
- `/api-vs-rest`: API·REST API 비교
- `/rest-api-design`: REST API 설계
- `/http-errors`: HTTP 상태 코드·예외 처리
- `/grpc`: gRPC 통신 흐름

### 프론트엔드

- `/frontend-basics`: React·Next.js 입문 개요
- `/frontend/javascript-async`: JavaScript 비동기: Promise·async/await — 상태·오류 처리, 순차/동시 실행 흐름 비교, 콘솔 예제와 Playwright 자동 대기
- `/frontend/react`: React 기초
- `/frontend/nextjs`: Next.js 기초

### 설계·테스트·배포

- `/architecture`: 헥사고날·클린 아키텍처·DDD
- `/project-structure`: 프론트엔드·백엔드 프로젝트 구조
- `/fastapi-project-structure`: FastAPI 프로젝트 구조
- `/dto-entity-vo`: DTO·Entity·VO 비교
- `/circuit-breaker`: 서킷 브레이커와 장애 전파 방지
- `/testing-basics`: 테스트 기초: 단위·통합 테스트
- `/tdd`: 테스트 주도 개발: TDD
- `/ci-cd`: CI/CD: 빌드·검증·배포

### AI·RAG

- `/ai-concepts`: AI 핵심 개념 2026
- `/llm-app-structure`: LLM 애플리케이션 구조
- `/genai-project-structure`: 생성형 AI 프로젝트 구조
- `/ai-agent-patterns`: AI 에이전트 설계 패턴
- `/rag/concepts`: RAG·CAG·MAG·GAG 비교
- `/rag/architecture-comparison`: RAG 구조 비교: Classic·Graph·Agentic
- `/rag/project-structure`: RAG 프로젝트 구조
- `/rag/documents`: RAG 문서 등록 (모의 실습)
- `/rag/vector-search`: RAG 벡터 검색 (모의 실습)
- `/rag/ask`: RAG 질문·답변 (모의 실습)

## 사이드바 메뉴 순서

알고리즘·자료구조 → Java·객체지향 → 디자인 패턴 → Spring·백엔드 → 데이터·메시징 → 네트워크·API → 프론트엔드 → 설계·테스트·배포 → AI·RAG

## 폴더 구조

```text
src/
  app/          Next.js 라우트와 페이지
  assets/       소스에서 import하는 정적 자원
  components/   재사용 UI 컴포넌트
  constants/    상수와 설정값
  context/      전역 Context Provider
  features/     기능 단위 모듈
  hooks/        커스텀 React 훅
  lib/          공통 페이지 목록·검색·UI 유틸
  services/     API 호출과 외부 연동
  styles/       전역 스타일 확장
  types/        공통 TypeScript 타입
```

## UI 기술 스택

- Next.js App Router
- React Client Components
- shadcn/ui `sidebar-07`
- Tailwind CSS v4
- lucide-react 아이콘
- 화이트 / 다크 / 시스템 테마 전환

## 검증 방법

학습 흐름은 순차 강조·연결선 이동·재생 제어를 제공합니다. Redis·React·Spring 등의 제품 아이콘은 Devicon의 원본 SVG를 색상·형태 변경 없이 사용합니다. 사용법과 검증은 [흐름 애니메이션 가이드](../docs/flow-animation.md)를 참고합니다.

```powershell
npm run test:study
npm run lint
npm run build
```

## 참고 사항

실행형 화면은 Client Component에서 백엔드 API를 호출합니다. 정적 학습 페이지는 Server Component로 작성하고, 페이지 검색은 백엔드 호출 없이 브라우저에서 처리합니다.

백엔드 DB 연결 상태는 [http://localhost:8080/api/database/info](http://localhost:8080/api/database/info)에서 확인합니다. Supabase 프로필로 실행하면 PostgreSQL 연결 정보가 표시됩니다.

다음 작업을 이어갈 때는 [작업 이어가기 가이드](../docs/continuation-guide.md)를 먼저 확인합니다.

RAG 아키텍처 비교의 데이터 흐름은 데스크톱에서 세로 흐름 3열, 모바일에서 한 열로 표시합니다.

- `/java/backend-interview`: Coding Sight 게시물의 확인 가능한 면접 질문 1~24번을 Java·동시성·Spring·JPA·마이크로서비스로 정리합니다. 잘린 25번은 제외하고 공식 문서 기반 주의점과 트랜잭션 세로 비교 흐름을 제공합니다.

- `/spring-system-design`: Spring 생태계 기능 10개와 시스템 설계 개념을 연결합니다. 기능별 소속·설계 조건, @Async와 메시징의 세로 흐름 비교, 원문·공식 문서를 제공합니다.

- `/oop-concepts`: CodeHive의 객체지향 개념 15개를 정리합니다. Python 고유 동작, 상속·합성 세로 흐름 비교와 실행 가능한 위임 예제를 포함합니다.

- `/algorithm-patterns`: 코딩 인터뷰 패턴 10개의 적용 신호·동작·복잡도·주의점, DFS/BFS 세로 방문 순서 비교와 패턴 선택 기준을 정리합니다.

- `/rag/project-structure`: Python RAG 프로젝트 폴더 예시와 모듈별 책임, 색인·질문 처리의 세로 흐름 비교, 메타데이터·버전·평가 계약을 정리합니다. 실제 저장소 구조 변경은 없습니다.

- `/fastapi-project-structure`: FastAPI 폴더별 책임과 ORM 모델·Pydantic 스키마 구분, 정상·검증 실패 세로 흐름, 세션·비동기 실행 주의점을 정리합니다.

- /java/collections: Java 21 계층도와 14개 구현체의 실제 Java 실행 기록을 이전/다음 단계로 확인합니다. ArrayList의 삭제 오버로드·예외, Vector 용량 증가, Set 중복, Queue/Deque, Map 교체를 포함합니다. 다운로드 예제와 IntelliJ 내부 필드 관찰 안내를 제공합니다. 브라우저는 저장된 실행 기록을 재생하며 실시간 JVM 디버거는 아닙니다.

## 페이지 등록과 제목 관리

`src/lib/study-pages.ts`에 URL·분류·대표 제목·설명·키워드·이전 제목을 등록합니다. 메뉴는 자동 생성되므로 `app-sidebar.tsx`에 페이지를 중복 등록하지 않습니다. 정적 페이지는 `ReferencePage pageHref`와 `getStudyMetadata`를 사용합니다. 클라이언트 실습 화면은 `getStudyPage`로 H1·breadcrumb를 표시하고 해당 경로의 서버 `layout.tsx`에서 metadata를 제공합니다. `/`의 기본 metadata는 루트 layout에 있습니다.

검색·라우트 테스트는 Node.js 22.6 이상에서 `npm run test:study`로 실행합니다. 검색 정규화·우선순위·이전 제목과 라우트 누락을 검사합니다. 제목 변경 시 관련 링크·문서도 갱신하고 기존 이름은 별칭으로 보존합니다.

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

디자인 패턴은 Java·객체지향과 별도 메뉴로 분리하며, 개요 다음에 책의 1~23장 순서로 표시합니다. 검색 결과와 페이지 경로 표시도 동일한 분류를 사용합니다.

### 학습 진행도

모든 학습 페이지 상단에서 **이 페이지 학습 완료**를 체크하거나 해제합니다. 전체 완료 수·진행률과 메뉴의 주제별 완료 수·페이지별 체크 표시가 즉시 반영됩니다. 방문만으로 완료 처리하지 않습니다.

기록은 현재 브라우저·사이트 주소의 localStorage(`lumos-lab.study-progress.v1`)에 저장되어 새로고침 후 유지되고 같은 주소의 다른 탭에도 반영됩니다. 다른 브라우저·기기로 동기화되지 않으며 사이트 데이터를 지우면 초기화됩니다. 저장이 차단된 경우 오류를 표시합니다.

디자인 패턴 상세 제목은 `데코레이터 · Decorator`처럼 한글 이름과 영문 패턴명으로 통일하며, 메뉴·검색·책 목차에도 동일하게 표시합니다.

## 통합된 릴스 학습 페이지

- `/backend/jwt-oauth`: JWT · OAuth · OIDC — 토큰 형식, 권한 위임, 사용자 인증의 차이와 검증 흐름
- `/messaging/kafka-architecture`: Kafka 아키텍처 — 브로커·파티션·복제·소비자 그룹과 오프셋
- `/docker-multi-stage`: Docker 멀티스테이지 빌드 — 빌드 도구와 실행 환경 분리 및 Java 예시
- `/docker-image-optimization`: Docker 이미지 최적화 — 이미지 최적화 10가지와 레이어·캐시·측정

## 시스템 다이어그램

Redis 캐시(`/backend/redis-cache`), Spring 시스템 설계(`/spring-system-design`), Kafka 아키텍처(`/messaging/kafka-architecture`)는 React Flow와 기존 Lucide·기술 로고로 구성도를 제공합니다. 경로 선택, 구성 요소 설명, 확대·축소와 연결 목록을 지원합니다. 모바일은 연결 목록을 기본으로 보여 줍니다. 실제 인프라 실행과 구분되는 학습용 모형이며 기존 API 실습은 유지합니다. 구현 지도, 데이터 작성법과 왕복 연결선 처리 방법은 [React Flow 시스템 다이어그램 가이드](../docs/react-flow-diagrams.md)를 참고하세요.


## Instagram 자료별 학습 페이지 확장

- `/system-design-roadmap`: 시스템 설계 학습 지도와 보안 개념, 기존 심화 페이지 연결
- `/architecture/microservices`: 서비스 경계·Gateway·Discovery·데이터 소유권·Outbox 모형
- `/java/stack-heap`: 스택·힙·참조와 실제 Java 객체 수정 및 재할당 실습
- `/devops-toolchain`: Linux·Docker·Kubernetes·Terraform·Jenkins·GitHub Actions 역할 비교
- `/messaging/kafka-architecture`: 기존 구성도와 파티션·오프셋 실습 보완

원문 확인 범위와 실행 모형의 제한은 [자료별 반영 기록](../docs/instagram-learning-pages.md)을 참고합니다.


## SOLID 3열 비교 학습

- `/solid-principles`: 원칙마다 설명·구조·Java 예제를 1행 3열로 비교합니다. 1024px 이상에서 3열, 좁은 화면에서는 세로 순서로 표시하며 코드 스크롤은 코드 영역 안에 한정합니다.
- 원문: https://www.instagram.com/reels/Db3_szLzmve/ — 캡션과 화면에 표시된 5행 3열 자료 확인. LSP의 비행 계약을 보완하고, 기존 `/oop-concepts`에서 연결합니다.
- 실행은 기존 Java `/api/patterns/strategy/run`을 재사용합니다. Java 예제 실행이나 SOLID 전체 검증은 아니며, 음수 보정·등급 선택 방식·입력 오류와 브레이크포인트를 안내합니다.

### 기존 구성도·흐름도 React Flow 통합

2026-09-28: 공통 FlowSection과 페이지별 HTML 흐름을 React Flow로 전환했습니다. SOLID·Saga/Outbox·샤딩/복제·Java 참조/컬렉션·Kafka 복제 배치도도 같은 카드/아이콘을 사용합니다. 재생·경로 선택·API 실습을 유지하고 텍스트 대체 목록을 제공합니다. 상세 계약은 [구성도 가이드](../docs/react-flow-diagrams.md)를 참고하세요.

## 2026-09-30 자료 정리

15개 원문의 반영 내역과 확인 범위는 [순차 정리 기록](../docs/instagram-learning-2026-09-30.md)을 참고합니다.

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
