# 메뉴 분류·페이지 제목·검색 통합 계획

> 구현 담당자는 `superpowers:executing-plans`를 사용해 아래 작업을 순서대로 진행합니다. 사용자가 승인한 계획에 따라 구현과 프론트엔드 검증을 완료했습니다. 커밋·푸시·배포는 수행하지 않았습니다.

**목표:** 주제로 둘러보거나 기억나는 용어로 검색해 학습 페이지를 찾고, 메뉴·검색·페이지·브라우저 탭에서 같은 제목을 확인할 수 있게 합니다.

**구조:** 페이지 정보를 공통 목록으로 분리하고 메뉴와 검색이 공유합니다. 기존 URL과 각 페이지의 학습·실습 기능은 유지하며, 페이지 제목과 경로 표시는 목록의 값을 사용합니다.

**기술:** 기존 Next.js App Router, React, TypeScript, Tailwind CSS, Base UI를 사용합니다. 1차 검색은 정적 페이지 목록을 대상으로 브라우저에서 수행합니다.

**설계 근거:** 이번 대화에서 제안한 8개 주제 분류와 제목·설명·키워드 검색에 사용자가 요청한 페이지 제목 정리를 통합했습니다. 아래 제목·분류 표는 검토할 설계안이며 아직 제품에 적용하지 않았습니다.

## 1. 확인한 상태와 범위

- 2026-09-22 작업 트리 기준 실제 페이지 파일은 59개입니다. 현재 메뉴는 11개 그룹, 58개 링크, 중복을 제외한 57개 페이지입니다.
- `/transactional`이 중복 등록되어 있고 `/patterns`, `/dashboard`는 메뉴의 하위 페이지 목록에 없습니다.
- `/patterns`는 학습 목록에 포함합니다. `/dashboard`는 현재 템플릿 화면이므로 학습 메뉴·검색에서 제외하고 URL과 화면은 유지합니다.
- 레퍼런스 그룹에는 서로 다른 주제의 19개 항목이 모여 있습니다.
- 화면 제목은 한국어·영어·문장형이 섞여 있고 일부 페이지는 자체 metadata가 없어 루트의 `Lumos Lab` 제목을 상속합니다.
- 기존 미커밋 변경이 README, 메뉴, Java 컬렉션, 신규 학습 페이지 등에 있습니다. 구현 시작 시 상태를 다시 확인하고 현재 콘텐츠를 기준으로 통합하며 기존 변경을 덮어쓰지 않습니다.
- 본문 전체 검색, 검색 서버, 콘텐츠 저장 방식 변경, 새 학습 콘텐츠, URL 변경은 이번 범위에 포함하지 않습니다.

## 2. 제목과 분류 규칙

1. 핵심 주제를 앞에 놓고 한국어 중심의 명사형으로 작성합니다. Java, Spring, RAG처럼 통용되는 기술명은 유지합니다.
2. 메뉴·검색 결과·H1은 같은 대표 제목을 사용합니다. 메뉴가 길면 툴팁을 제공하고 제목을 임의로 축약한 별도 이름은 만들지 않습니다.
3. breadcrumb는 `분류 > 대표 제목`, 브라우저 탭은 `대표 제목 | Lumos Lab`으로 통일합니다.
4. 설명형 문장, 상세 API 이름, 항목 개수는 소개 문장이나 검색 키워드로 옮깁니다. 본문에서 의미 있는 개수와 설명을 삭제하지 않습니다.
5. 병렬 개념은 `·`, 비교는 `비교`로 표현합니다. `/`와 `vs`를 제목 구분자로 혼용하지 않습니다. CI/CD 같은 정착된 기술 표기는 유지합니다.
6. 실습·개념·면접은 콘텐츠 속성으로 취급합니다. 제목에 붙은 `실험실`을 일괄 반복하지 않고 필요한 안내는 배지와 설명으로 제공합니다.
7. RAG 3개 실습의 `mock`은 제목에서만 옮깁니다. 제목 바로 아래에 `모의 실습` 배지와 현재 구현의 한계를 표시하고, 검색 결과에도 상태를 표시합니다. 실제 모델·벡터 검색으로 오인시키지 않습니다.
8. 연도는 자료 범위를 뜻할 때 유지합니다. AI 개념 페이지의 2026년 범위는 제목에도 남깁니다.
9. 대표 분류는 하나만 지정합니다. 이전 메뉴명·화면 제목·기술 용어는 검색 별칭으로 보존합니다.

## 3. 전체 페이지 제목과 메뉴 배치안

아래 순서를 메뉴의 기본 순서로 사용합니다. `현재 H1`은 소스에서 확인한 화면 제목이며 장식 아이콘은 생략했습니다. 변경하지 않는 제목도 누락 방지를 위해 포함합니다.

| 분류 | URL | 현재 H1 | 대표 제목 제안 |
| --- | --- | --- | --- |
| 알고리즘·자료구조 | `/` | 정렬 알고리즘 실험실 | 정렬 알고리즘 |
| 알고리즘·자료구조 | `/search` | 검색 알고리즘 실험실 | 검색 알고리즘 |
| 알고리즘·자료구조 | `/algorithm-patterns` | 코딩 인터뷰 패턴 10가지 | 코딩 인터뷰 알고리즘 패턴 |
| 알고리즘·자료구조 | `/datastructures/stack` | Stack 실험실 | 스택 |
| 알고리즘·자료구조 | `/datastructures/queue` | Queue 실험실 | 큐 |
| 알고리즘·자료구조 | `/datastructures/heap` | Heap / PriorityQueue 실험실 | 힙·우선순위 큐 |
| 알고리즘·자료구조 | `/datastructures/graph` | 그래프 BFS / DFS 실험실 | 그래프 탐색: BFS·DFS |
| Java·객체지향 | `/oop-concepts` | 객체지향 핵심 개념 15가지 | 객체지향 핵심 개념 |
| Java·객체지향 | `/java/io-string` | Scanner, BufferedReader, StringTokenizer | Java 입출력·문자열 |
| Java·객체지향 | `/java/collections` | Java Collection Framework | Java 컬렉션 |
| Java·객체지향 | `/java/equality-exception` | ==, equals, hashCode / 예외 처리 | Java 객체 비교·예외 처리 |
| Java·객체지향 | `/java/concurrency` | Thread, Executor, CompletableFuture, synchronized | Java 동시성 |
| Java·객체지향 | `/java/backend-interview` | Java 백엔드 면접 핵심 정리 | Java 백엔드 면접 핵심 |
| Java·객체지향 | `/patterns` | 디자인 패턴 실험실 | 디자인 패턴 개요 |
| Java·객체지향 | `/patterns/strategy` | 전략 패턴 실험실 | 전략 패턴 |
| Java·객체지향 | `/patterns/factory` | 팩토리 패턴 실험실 | 팩토리 패턴 |
| Java·객체지향 | `/patterns/observer` | 옵저버 패턴 실험실 | 옵저버 패턴 |
| Java·객체지향 | `/patterns/decorator` | 데코레이터 패턴 실험실 | 데코레이터 패턴 |
| Java·객체지향 | `/patterns/command` | 커맨드 패턴 실험실 | 커맨드 패턴 |
| Spring·백엔드 | `/spring-bean-di` | Spring Boot 핵심 · Bean, DI, IoC | Spring Bean·DI·IoC |
| Spring·백엔드 | `/sync-async` | 동기 vs 비동기 | 동기·비동기 처리 비교 |
| Spring·백엔드 | `/backend/security-auth` | Spring Security / JWT / OAuth | Spring Security 인증: JWT·OAuth |
| Spring·백엔드 | `/spring-system-design` | Spring 코드 속 시스템 설계 | Spring으로 이해하는 시스템 설계 |
| 데이터·메시징 | `/transactional` | 커밋과 롤백을 직접 눌러서 확인하기 | 트랜잭션: 커밋·롤백 |
| 데이터·메시징 | `/backend/db-index-transaction` | DB Index / Transaction Isolation | DB 인덱스·트랜잭션 격리 수준 |
| 데이터·메시징 | `/backend/bulk-insert` | Bulk Insert 실습 | 대량 데이터 삽입 |
| 데이터·메시징 | `/backend/redis-cache` | Redis / 캐시 / 세션 / 분산락 | Redis 캐시·세션·분산 락 |
| 데이터·메시징 | `/backend/caching-strategies` | Cache-Aside / Write-Through | 캐시 전략: Cache-Aside·Write-Through |
| 데이터·메시징 | `/backend/sharding-replica` | 샤딩 / 레플리카 | DB 샤딩·레플리카 |
| 데이터·메시징 | `/messaging/kafka` | Kafka는 메시지를 어떻게 나눠 담고 읽을까? | Kafka 메시징 기초 |
| 데이터·메시징 | `/messaging/kafka-config` | Kafka 설정 옵션 레퍼런스 | Kafka 주요 설정 |
| 데이터·메시징 | `/messaging/saga-outbox` | Saga와 메시지 Outbox 패턴 | 분산 트랜잭션: Saga·Outbox |
| 네트워크·API | `/tcp-vs-udp` | TCP vs UDP | TCP·UDP 비교 |
| 네트워크·API | `/api-vs-rest` | API vs REST API | API·REST API 비교 |
| 네트워크·API | `/rest-api-design` | REST API 설계 규칙 | REST API 설계 |
| 네트워크·API | `/http-errors` | HTTP 상태코드와 예외 처리 | HTTP 상태 코드·예외 처리 |
| 네트워크·API | `/grpc` | REST로 누르고, 내부에서는 gRPC로 통신하기 | gRPC 통신 흐름 |
| 프론트엔드 | `/frontend-basics` | React와 Next.js 기초 | React·Next.js 입문 개요 |
| 프론트엔드 | `/frontend/react` | React 기초 | React 기초 |
| 프론트엔드 | `/frontend/nextjs` | Next.js 기초 | Next.js 기초 |
| 설계·테스트·배포 | `/architecture` | 헥사고날 · 클린 아키텍처 · DDD | 헥사고날·클린 아키텍처·DDD |
| 설계·테스트·배포 | `/project-structure` | 프론트엔드 & 백엔드 폴더 구조 | 프론트엔드·백엔드 프로젝트 구조 |
| 설계·테스트·배포 | `/fastapi-project-structure` | FastAPI 백엔드 구조 | FastAPI 프로젝트 구조 |
| 설계·테스트·배포 | `/dto-entity-vo` | DTO, Entity, VO 차이 | DTO·Entity·VO 비교 |
| 설계·테스트·배포 | `/circuit-breaker` | Circuit Breaker 개념 정리 | 서킷 브레이커와 장애 전파 방지 |
| 설계·테스트·배포 | `/testing-basics` | 단위 테스트, 통합 테스트, Given-When-Then | 테스트 기초: 단위·통합 테스트 |
| 설계·테스트·배포 | `/tdd` | TDD: Test-Driven Development | 테스트 주도 개발: TDD |
| 설계·테스트·배포 | `/ci-cd` | CI/CD · 커밋에서 운영까지 | CI/CD: 빌드·검증·배포 |
| AI·RAG | `/ai-concepts` | 2026 AI 핵심 개념 9가지 | AI 핵심 개념 2026 |
| AI·RAG | `/llm-app-structure` | LLM 애플리케이션 구조 | LLM 애플리케이션 구조 |
| AI·RAG | `/genai-project-structure` | 생성형 AI 프로젝트 구조 | 생성형 AI 프로젝트 구조 |
| AI·RAG | `/ai-agent-patterns` | AI 에이전트 설계 패턴 5가지 | AI 에이전트 설계 패턴 |
| AI·RAG | `/rag/concepts` | RAG, CAG, MAG, GAG 정리 | RAG·CAG·MAG·GAG 비교 |
| AI·RAG | `/rag/architecture-comparison` | Classic · Graph · Agentic RAG | RAG 구조 비교: Classic·Graph·Agentic |
| AI·RAG | `/rag/project-structure` | RAG 프로젝트 구조 | RAG 프로젝트 구조 |
| AI·RAG | `/rag/documents` | RAG 문서 등록 mock | RAG 문서 등록 |
| AI·RAG | `/rag/vector-search` | Vector Search mock | RAG 벡터 검색 |
| AI·RAG | `/rag/ask` | RAG 질문하기 mock | RAG 질문·답변 |

`Java·객체지향`은 12개, `AI·RAG`는 10개로 상대적으로 큽니다. 우선 2단계를 유지하고, 실제 탐색 검증에서 길이가 문제가 되면 펼침 영역 안에 비접이식 소제목을 넣습니다. 접기 동작을 3단계로 늘리지 않습니다.

## 4. 공통 페이지 목록

신규 `frontend/src/lib/study-pages.ts`에서 분류와 페이지를 정의합니다. 아이콘은 메뉴 컴포넌트에서 분류별로 연결해 서버 metadata에서 읽을 데이터에 JSX를 넣지 않습니다.

```ts
export type StudyPage = {
  href: string;
  title: string;
  category: string;
  description: string;
  keywords: string[];
  aliases: string[];
  simulated?: boolean;
};

export const studyCategories: readonly string[] = [
  "알고리즘·자료구조", "Java·객체지향", "Spring·백엔드", "데이터·메시징",
  "네트워크·API", "프론트엔드", "설계·테스트·배포", "AI·RAG",
];
// studyPages: 위 표의 58개 페이지를 표 순서대로 등록하는 readonly StudyPage[].
// getStudyPage(href: string): StudyPage — 정확한 URL로 조회, 누락은 개발 오류로 처리.
```

- `description`은 해당 본문을 확인해 작성하는 한 줄 설명입니다. 제목에 없는 기능을 약속하지 않습니다.
- `aliases`에는 변경 전 메뉴명과 H1을 보존합니다. `keywords`에는 `의존성 주입`, `dependency injection`, `분산락`, `분산 락` 등 실제 관련 용어를 넣습니다.
- API 실행 페이지도 목록에는 정적 설명만 넣습니다. 검색 때문에 학습 API를 호출하지 않습니다.
- 메뉴의 페이지 활성 표시는 정확한 URL로 비교합니다. `/patterns/strategy`에서 `/patterns` 개요까지 함께 활성화되는 기존 접두어 비교 문제를 방지합니다.
- 현재 페이지가 속한 그룹을 펼칩니다. 검색으로 이동한 뒤에도 새 그룹이 펼쳐지는지 확인하며 초기 `defaultOpen`에만 의존하지 않습니다.

## 5. 제목 적용 방식

- `ReferencePage`에 공통 목록을 참조할 `pageHref`를 도입하고 제목과 breadcrumb를 목록에서 가져오도록 점진적으로 전환합니다. 콘텐츠 블록과 애니메이션은 유지합니다.
- 개별 화면 틀을 가진 페이지는 기존 레이아웃을 유지하고 H1·breadcrumb 문자열만 같은 목록을 참조하도록 변경합니다.
- 서버 페이지의 `metadata`는 목록의 제목·설명을 사용합니다. 루트 제목 템플릿을 사용한다면 기존 `| Lumos Lab` 접미사를 함께 정리해 중복을 막습니다.
- `use client` 페이지는 metadata를 직접 export하지 않습니다. 해당 경로의 서버 `layout.tsx`에서 제목·설명을 export하는 방식을 사용해 큰 실습 컴포넌트 이동을 피합니다.
- `/`의 metadata는 루트 기본값으로 제공하되 `/dashboard`에 별도의 `대시보드 | Lumos Lab` metadata를 설정해 정렬 페이지의 제목을 상속하지 않게 합니다. `/dashboard`의 학습 콘텐츠 개편은 하지 않습니다.
- 관련 페이지 링크와 카드에도 바뀐 대표 제목을 적용합니다. 코드 예제·설명 속 일반 기술명까지 일괄 치환하지 않습니다.

## 6. 검색 동작

- 사이드바 상단 `페이지 검색` 버튼과 Ctrl/Cmd+K로 검색창을 엽니다. 모바일과 아이콘만 보이는 사이드바에서도 버튼에 접근할 수 있게 합니다.
- 기존 `/search`는 알고리즘 학습 URL로 유지합니다. 페이지 검색을 위한 새 라우트는 만들지 않습니다.
- 제목·이전 제목·설명·키워드를 대상으로 검색합니다. 유니코드 NFKC, 영문 소문자, 연속 공백 정규화를 적용하고 공백 제거 비교도 제공합니다.
- 제목 완전 일치 → 제목 부분 일치 → 이전 제목·키워드 → 설명 순으로 정렬합니다. 여러 단어는 모두 일치하는 페이지를 찾고, 동점은 등록 순서로 고정합니다.
- 빈 검색어에는 입력 안내, 결과가 없으면 검색어를 포함한 안내를 표시합니다. 검색 결과는 페이지별 1건으로 반환합니다.
- 결과에는 대표 제목·분류·설명과 필요한 경우 `모의 실습` 상태를 표시합니다. 방향키 선택, Enter 이동, Esc 닫기, 포커스 복귀를 지원합니다.
- 한글 IME 조합 중 Enter는 페이지 이동으로 처리하지 않습니다. 검색창이 열려 있을 때 배경과 모바일 사이드바의 포커스가 충돌하지 않도록 검증합니다.
- 초성 검색·오타 보정·검색 이력 저장·본문 전체 검색은 1차 범위에서 제외합니다.

## 7. 구현 순서와 검증

### 작업 1: 페이지 목록과 메뉴 재분류

**대상:** 신규 `frontend/src/lib/study-pages.ts`, 기존 `frontend/src/components/app-sidebar.tsx`, `frontend/src/components/nav-main.tsx`.

- [x] 구현 시점의 작업 트리와 59개 라우트를 다시 대조하고 신규 페이지가 있으면 표와 목록에 함께 반영합니다.
- [x] 58개 학습 페이지의 제목·설명·별칭을 등록하고 메뉴를 공통 목록으로 생성합니다.
- [x] 트랜잭션 중복을 제거하고 디자인 패턴 개요를 추가합니다. Swagger 등 도구 링크는 학습 목록과 분리된 기존 영역에 둡니다.
- [x] URL 중복 없음, 분류 누락 없음, `/dashboard` 제외, `/patterns` 포함을 검증합니다.
- [x] `/`와 `/patterns/strategy`에서 각각 정확히 한 페이지가 활성화되는지, 그룹 전환 뒤 활성 그룹이 펼쳐지는지 확인합니다.

### 작업 2: 화면 제목·breadcrumb·metadata 정리

**대상:** `frontend/src/components/reference-page.tsx`, 위 표의 `frontend/src/app/**/page.tsx`, `frontend/src/app/layout.tsx`, 클라이언트 페이지 경로의 신규 `layout.tsx`, `/dashboard`의 metadata.

- [x] 정적 페이지 1개와 클라이언트 실습 페이지 1개에 먼저 공통 제목을 연결하고 제목 상속을 확인합니다.
- [x] 나머지 페이지에 표의 제목을 적용하고 이전 제목은 검색 별칭으로 보존합니다.
- [x] RAG 실습의 모의 동작 배지와 설명을 유지하며 실제 구현 범위에 맞게 표현합니다.
- [x] 내부 링크·카드 문구와 breadcrumb를 확인합니다.
- [x] 58개 학습 페이지에서 H1·메뉴·검색 제목이 동일하고 탭 제목에 `Lumos Lab`이 한 번만 나오는지 확인합니다.
- [x] 컬렉션 단계 재생·초기화와 화면 탐색을 확인했습니다. API 실습의 실제 서버 연동은 로컬 백엔드 미응답으로 확인하지 못했으며 아래 검증 제한에 기록합니다.

### 작업 3: 빠른 페이지 검색

**대상:** 신규 `frontend/src/lib/study-search.ts`, `frontend/src/components/page-search.tsx`, 기존 `frontend/src/components/app-sidebar.tsx`. 재사용 가능한 대화상자 래퍼가 필요하면 `frontend/src/components/ui/dialog.tsx`에 둡니다.

**인터페이스:** `searchStudyPages(query: string, pages: readonly StudyPage[]): StudyPage[]`. 검색 UI는 이 결과를 표시하고 선택한 `href`로 이동합니다.

- [x] 순수 검색 함수의 동작 테스트를 먼저 작성합니다. 현재 테스트 도구를 확인하고 기존 방식 또는 Node 내장 테스트로 실행하며 테스트만을 위한 큰 도구 묶음은 추가하지 않습니다.
- [x] `의존성 주입` → `/spring-bean-di`, `분산락`과 `분산 락` → `/backend/redis-cache`, `Scanner` → `/java/io-string`, `Java Collection Framework` → `/java/collections`를 검증합니다.
- [x] `KAFKA`, 앞뒤 공백, 여러 단어, 빈 입력, 결과 없음, 제목 일치 우선순위, URL 중복 제거를 검증합니다.
- [x] 설치된 Base UI와 Next.js의 로컬 문서를 확인한 뒤 검색 대화상자와 이동을 구현합니다. 단축키는 페이지마다 중복 등록하지 않습니다.
- [x] 키보드·터치·한글 조합 입력·포커스 복귀·모바일 메뉴 닫힘과 검색 이동을 실제 화면에서 확인합니다.

### 작업 4: 문서와 최종 검증

**대상:** `README.md`, `frontend/README.md`, `frontend/AGENTS.md`, `docs/continuation-guide.md`.

- [x] 콘텐츠 목록의 분류·대표 제목을 갱신합니다.
- [x] 새 페이지 추가 절차를 `공통 목록 등록 → 화면/metadata 연결 → 메뉴·검색 확인`으로 수정합니다. 메뉴 컴포넌트를 직접 편집하라는 기존 안내를 교체합니다.
- [x] `frontend`에서 `npm run lint`, `npm run build`를 실행합니다. backend 변경이 없다면 Gradle 테스트는 범위 밖입니다.
- [x] 모든 학습 URL이 유지되는지, 누락·404·중복 제목·이중 접미사가 없는지 확인합니다.
- [x] 375px·768px·1440px, 밝은/어두운 테마에서 긴 제목 줄바꿈, 사이드바 스크롤, 검색 결과 잘림을 확인합니다.
- [x] diff를 검토해 기존 사용자 변경이 보존되고 요청 외 동작 변경이 없는지 확인합니다. 커밋·푸시·배포는 별도 요청 범위에 따릅니다.

## 8. 완료 기준

- 학습 페이지 58개가 각각 한 분류에 등록되고 메뉴·검색에서 빠짐없이 접근 가능합니다.
- 제목을 모르는 경우에도 대표 한국어·영어 키워드와 이전 제목으로 찾을 수 있습니다.
- 메뉴·검색·H1·breadcrumb·브라우저 탭이 같은 대표 제목을 기준으로 표시됩니다.
- 기존 URL·실습·본문의 의미와 모의 구현 안내가 보존됩니다.
- frontend lint/build와 검색 동작 검증, 주요 화면의 반응형·접근성 검증이 통과합니다.

## 9. 이번 계획 문서의 검증

계획 작성 시 경로·제목 표를 대조했으며, 구현 후 아래 항목을 추가 검증했습니다.


## 10. 구현 결과와 검증 기록 (2026-09-22)

- 58개 학습 페이지와 8개 분류를 공통 목록으로 관리하며 기존 URL을 유지했습니다. 디자인 패턴 개요를 포함하고 트랜잭션 중복을 제거했습니다.
- 메뉴·검색·화면 제목·breadcrumb·탭 제목을 연결했고 RAG 모의 실습 상태를 화면과 검색 결과에 표시했습니다.
- `npm run test:study`: 13개 통과. 검색 기능 미구현 상태에서 9개 실패를 확인한 후 구현해 통과시켰습니다.
- `npm run lint`, `npm run build`: 통과. 58개 학습 라우트의 HTTP 응답·H1·브라우저 탭 제목을 확인했습니다.
- 375px·768px·1440px에서 전체 58개 H1의 제목 넘침 검증 174건 통과. 긴 RAG 제목의 최소 너비 문제를 수정했습니다.
- PC·모바일 크기의 밝은/어두운 테마에서 검색 결과 표시와 스크롤을 확인했습니다. Ctrl/Cmd+K, 방향키 순환, Enter 이동, Esc 닫기, 포커스 복귀, 뒤로 가기, 한글 조합 중 Enter 방어를 확인했습니다.
- 터치 가능한 모바일 브라우저 에뮬레이션에서 사이드바 열기 → 검색 → 결과 터치 → 이동·모달 닫기를 확인했습니다. 실제 휴대전화와 가상 키보드에 대한 검증은 아닙니다.
- 기존 컬렉션의 실제 Java 실행 기록 검증 14개와 화면의 다음 단계·처음으로 동작을 확인했습니다.
- 독립 코드 리뷰에서 발견한 아이콘 모드 활성 그룹 펼침 문제를 수정하고 브라우저에서 재검증했습니다. 최종 리뷰에 잔여 확정 오류는 없었습니다.
- **검증 제한:** 로컬 백엔드 health가 응답하지 않았고 기존 컬렉션 비교 API에서 연결 거부가 발생했습니다. 실제 백엔드 API 실습의 요청·응답 결과는 이번에 검증하지 못했습니다. 백엔드 코드는 변경하지 않았습니다.
- 기존 미커밋 작업을 복사한 별도 worktree에서 구현했습니다. 원본 작업 폴더의 소스·문서 내용이 바뀌지 않았음을 기준 스냅샷과 대조했습니다.
