# 에이전트 작업 메모

이 프론트엔드는 최신 Next.js와 shadcn/ui 코드를 사용합니다. 프레임워크 동작을 크게 바꾸기 전에는 현재 문서와 로컬 패키지 버전을 확인하세요.

## 프로젝트 정보

- 프레임워크: Next.js App Router
- 언어: TypeScript
- 스타일링: Tailwind CSS v4
- UI: shadcn/ui, `sidebar-07` 기반
- 아이콘: lucide-react
- API 기준 주소: `NEXT_PUBLIC_API_BASE_URL`

## 명령어

```powershell
npm run lint
npm run build
npm run dev
```

## 작업 규칙

- 화면은 `src/app` 아래에 둡니다.
- shadcn 컴포넌트는 `src/components/ui`에서 가져옵니다.
- 실험실 화면 헤더에는 `ThemeToggle`을 사용합니다.
- 실험실 화면에는 `AppSidebar`를 사용합니다.
- 앱이 아직 작으므로 API 요청/응답 타입은 각 화면 파일 가까이에 둡니다.
- 모든 API 동작에는 명시적인 loading/error 상태를 둡니다.

## 현재 라우트

- `/`
- `/search`
- `/project-structure`
- `/ai-concepts`
- `/api-vs-rest`
- `/tcp-vs-udp`
- `/architecture`
- `/sync-async`
- `/transactional`
- `/grpc`
- `/frontend-basics`
- `/frontend/react`
- `/frontend/nextjs`
- `/messaging/kafka`
- `/messaging/kafka-config`
- `/messaging/saga-outbox`
- `/backend/redis-cache`
- `/backend/security-auth`
- `/patterns`
- `/patterns/strategy`
- `/patterns/factory`
- `/patterns/observer`
- `/patterns/decorator`
- `/patterns/command`
- `/datastructures/stack`
- `/datastructures/queue`
- `/datastructures/heap`
- `/datastructures/graph`

## 현재 사이드바 순서

```text
알고리즘 -> 자료구조 -> 개념 실험 -> 프론트엔드 -> 메시징 -> 백엔드 -> 디자인 패턴 -> RAG -> 레퍼런스
```

RAG는 메뉴만 있고 아직 실제 라우트가 없습니다. 다음에 구현할 때는 레퍼런스 페이지를 먼저 만들고, 이후 문서 등록 / 벡터 검색 / 질문하기 실험실을 나눠서 붙입니다.

## 이어서 볼 문서

- 루트 README: `../README.md`
- 작업 이어가기 가이드: `../docs/continuation-guide.md`
- 나중에 진행할 DB / CRUD / JPA 가이드: `../docs/future-db-crud-jpa.md`

## 주의 사항

Next.js, React, shadcn/ui 버전은 빠르게 바뀔 수 있습니다. 큰 변경 전에는 오래된 예제를 그대로 믿지 말고, 로컬 파일과 현재 패키지 버전을 먼저 확인하세요.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
