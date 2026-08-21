# Lumos Lab 프론트엔드

Next.js, React, TypeScript, Tailwind CSS, shadcn/ui를 공부하기 위한 프론트엔드입니다.

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
- `/frontend-basics`: React / Next.js 기초 참고 페이지
- `/frontend/react`: React 기초 참고 페이지
- `/frontend/nextjs`: Next.js 기초 참고 페이지
- `/messaging/kafka`: Kafka 기초 참고 페이지
- `/messaging/kafka-config`: Kafka 설정 옵션 참고 페이지
- `/messaging/saga-outbox`: Saga / Outbox 패턴, 메시지 중복/유실 방지 참고 페이지
- `/backend/redis-cache`: Redis / 캐시 / 세션 / 분산락 참고 페이지
- `/backend/security-auth`: Spring Security / JWT / OAuth 참고 페이지와 JWT mock 테스트
- `/rag/concepts`: RAG / CAG / MAG / GAG 비교 참고 페이지
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
- `/api-vs-rest`: API와 REST API 비교 참고 페이지
- `/tcp-vs-udp`: TCP와 UDP 비교 참고 페이지
- `/architecture`: 헥사고날 / 클린 아키텍처 / DDD 참고 페이지

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

```powershell
npm run lint
npm run build
```

## 참고 사항

API 호출과 상태 변화를 브라우저에서 디버깅하기 쉽도록, 각 화면은 Client Component에서 `fetch()`로 백엔드 API를 직접 호출합니다.

백엔드 DB 연결 상태는 [http://localhost:8080/api/database/info](http://localhost:8080/api/database/info)에서 확인합니다. Supabase 프로필로 실행하면 PostgreSQL 연결 정보가 표시됩니다.

다음 작업을 이어갈 때는 [작업 이어가기 가이드](../docs/continuation-guide.md)를 먼저 확인합니다.
