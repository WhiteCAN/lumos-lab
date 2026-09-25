# Lumos Lab 프론트엔드

Next.js, React, TypeScript, Tailwind CSS, shadcn/ui를 공부하기 위한 프론트엔드입니다.

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

## 화면 목록

- `/`: 정렬 실험실
- `/search`: 검색 실험실
- `/sync-async`: 동기와 비동기 실행 비교 실험실
- `/transactional`: Spring `@Transactional` 커밋/롤백 실험실
- `/grpc`: gRPC 서버/클라이언트/REST 브리지 실험실
- `/circuit-breaker`: Circuit Breaker 상태 전환, Resilience4j 설정, Timeout·Retry 비교와 운영 주의점 개념 정리
- `/frontend-basics`: React / Next.js 기초 참고 페이지
- `/frontend/react`: React 기초 참고 페이지
- `/frontend/nextjs`: Next.js 기초 참고 페이지
- `/messaging/kafka`: Kafka 기초 참고 페이지
- `/messaging/kafka-config`: Kafka 설정 옵션 참고 페이지
- `/messaging/saga-outbox`: Saga / Outbox 패턴, 메시지 중복/유실 방지 참고 페이지
- `/backend/redis-cache`: Redis / 캐시 / 세션 / 분산락 참고 페이지
- `/backend/sharding-replica`: 샤딩·레플리카 비교, 데이터 배치 그림, 읽기·쓰기 흐름, 복제 지연과 장애 전환 참고 페이지
- `/backend/caching-strategies`: Cache-Aside / Write-Through 흐름·비교와 실패 시 정합성 보완
- `/genai-project-structure`: 생성형 AI 프로젝트 13개 영역의 책임과 대표 파일, 수집·질문 처리 경로, 요청·오류 예시와 검색·답변 평가 기준
- `/ai-agent-patterns`: AI 에이전트 설계 패턴 5가지, 선택 기준과 조합 예시
- `/backend/security-auth`: Spring Security / JWT / OAuth 참고 페이지와 JWT mock 테스트
- `/rag/concepts`: RAG / CAG / MAG / GAG 비교와 RAG 아키텍처 8가지의 흐름·선택 기준
- `/rag/architecture-comparison`: Learnbay 게시물 기반 Classic·Graph·Agentic RAG 비교, 순차 흐름과 추가 검색 경로, 비용·선택 기준
- `/patterns`: 패턴 실험실 안내
- `/patterns/strategy`: Strategy 패턴 실험실
- `/patterns/factory`: Factory 패턴 실험실
- `/patterns/observer`: Observer 패턴 실험실
- `/patterns/decorator`: Decorator 패턴 실험실
- `/patterns/command`: Command 패턴 실험실
- `/datastructures/stack`: Stack 실험실
- `/datastructures/queue`: Queue 실험실
- `/datastructures/heap`: Heap / PriorityQueue 실험실
- `/datastructures/graph`: Graph / BFS / DFS 실험실
- `/project-structure`: 일반 폴더 구조 참고 페이지
- `/ai-concepts`: AI 핵심 개념 참고 페이지
- `/api-vs-rest`: API 기본 개념, REST·GraphQL·gRPC 비교, 요청 예시, 선택 기준과 면접 함정
- `/tcp-vs-udp`: TCP와 UDP 비교 참고 페이지
- `/architecture`: 헥사고날 / 클린 아키텍처 / DDD 참고 페이지
- `/ci-cd`: CI/CD 전달 흐름, 실습 9개, 이미지·보안·스테이징 검증과 현재 저장소 설정의 차이
- `/spring-bean-di`: Bean·DI·IoC, Spring Boot 시작, 자동 구성, 생명주기, AOP 프록시와 운영 함정 (기존 레퍼런스 보강)

메뉴 분류: 개념 실험에는 실행형 화면(동기/비동기·트랜잭션·gRPC)을 두고, 정적 가이드인 Circuit Breaker와 CI/CD는 레퍼런스에 둡니다. 페이지 URL은 유지합니다.

RAG 메뉴는 사이드바에 자리만 잡아둔 상태입니다. 아직 `/rag` 계열 화면은 없습니다.

## 사이드바 메뉴 순서

```text
알고리즘 -> 자료구조 -> 개념 실험 -> 프론트엔드 -> 메시징 -> 백엔드 -> 디자인 패턴 -> RAG -> 레퍼런스
```

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
  lib/          shadcn 유틸
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
npm run lint
npm run build
```

## 참고 사항

API 호출과 상태 변화를 브라우저에서 디버깅하기 쉽도록, 각 화면은 Client Component에서 `fetch()`로 백엔드 API를 직접 호출합니다.

백엔드 DB 연결 상태는 [http://localhost:8080/api/database/info](http://localhost:8080/api/database/info)에서 확인합니다. Supabase 프로필로 실행하면 PostgreSQL 연결 정보가 표시됩니다.

다음 작업을 이어갈 때는 [작업 이어가기 가이드](../docs/continuation-guide.md)를 먼저 확인합니다.

RAG 아키텍처 비교의 데이터 흐름은 데스크톱에서 세로 흐름 3열, 모바일에서 한 열로 표시합니다.
