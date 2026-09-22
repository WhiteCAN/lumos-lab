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

## 페이지 작성 지도

이 절은 2026-09-22에 실제 파일을 확인해 정리했습니다. 일반적인 페이지 추가에서는 아래 경로로 바로 이동하고, 기존 페이지를 여러 개 읽거나 전체 라우트를 다시 수집하지 않습니다.

아래 경로는 `frontend/` 기준입니다.

| 역할 | 위치·사용 방법 |
| --- | --- |
| URL과 페이지 | `src/app/<경로>/page.tsx`. 예: `/backend/sharding-replica` → `src/app/backend/sharding-replica/page.tsx` |
| 루트 레이아웃 | `src/app/layout.tsx`: 한국어 문서, 폰트, ThemeProvider, TooltipProvider. 사이드바는 여기서 제공하지 않음 |
| 정적 학습 페이지 틀 | `src/components/reference-page.tsx`의 `ReferencePage`: `pageHref`로 공통 목록의 제목·breadcrumb를 사용하며 사이드바, 테마 토글, 소개 영역과 main 제공 |
| 학습 콘텐츠 블록 | 같은 파일의 `ConceptGrid`, `ComparisonTable`, `FlowSection`, `CodeBlock`. 필요한 블록만 재사용 |
| 순차 흐름·경로 선택 | `src/components/flow-section.tsx`: 화면 진입 시 한 번 재생, 일시정지·다시 보기, 동작 줄이기 대응. 문자열 또는 `{ label, icon, detail }` 사용. `reference-page.tsx`에서 재내보냄 |
| 제품·역할 아이콘 | `src/components/technology-icon.tsx`: 브랜드는 Devicon 등의 원본 SVG를 `public/brands/`에 수정 없이 저장하며 임의로 재색칠하지 않음. 일반 역할은 Lucide. 사용법은 `../docs/flow-animation.md` |
| 정적 페이지 참고 예시 | `src/app/backend/sharding-replica/page.tsx`: 한국어 설명, 비교표, 데이터 배치 그림, 관련 페이지 링크, metadata |
| API 실행형 참고 예시 | `src/app/backend/bulk-insert/page.tsx`: 요청과 결과 표시. 실행형 페이지를 만들 때만 확인 |
| Java 컬렉션 단계 재생 | `src/app/java/collections/collection-debugger.tsx`와 `traces.json`. 원본은 `public/examples/CollectionsDebugLab.java`; `scripts/generate-collections-trace.mjs`로 기록 생성, `scripts/collections-trace.test.mjs`로 실제 Java 결과 검증 |
| 페이지 등록·메뉴 순서 | `src/lib/study-pages.ts`의 `studyCategories`, `studyPages`. URL·분류·제목·설명·키워드·별칭을 등록하면 메뉴·검색에 반영 |
| 페이지 검색 | `src/lib/study-search.ts`, `src/components/page-search.tsx`. `app-sidebar.tsx`에서 검색 버튼과 단축키 연결 |
| 브라우저 탭 제목 | `getStudyMetadata(href)`. 서버 페이지의 metadata 또는 클라이언트 페이지 경로의 서버 `layout.tsx`에서 제공 |
| 메뉴 활성화·펼침 | `src/components/nav-main.tsx`: 현재 URL로 활성 항목과 그룹 판단. 단순 메뉴 추가 시 수정 불필요 |
| 공통 UI·테마 | `src/components/ui/`, `src/components/theme-toggle.tsx`, `src/app/globals.css` |
| 책 예제 23장 | `src/lib/book-chapters-*.json`, `book-source-snippets.json`; `src/components/book-pattern-content.tsx`, `book-pattern-page.tsx`. 원본 고지와 지도는 `../docs/book-examples-map.md` |
| 실행·디버깅 패널 | `src/components/debug-lab.tsx`, `src/lib/debug-lab-catalog.ts`. ReferencePage는 자동 연결하며 자체 레이아웃 페이지는 PageDebugLab을 배치. `npm run test:labs`로 누락 확인 |
| API 통신 공통 코드 | `src/services/http.ts`, `src/constants/api.ts`. 실제 요청이 있는 작업에서만 확인 |
| 콘텐츠 목록·인계 | `../README.md`의 학습 콘텐츠, `README.md`의 화면 목록, `../docs/continuation-guide.md` |

### 정적 개념 정리 페이지 추가 순서

1. `git status --short`와 대상 경로의 추가 지침을 확인합니다. 위 지도와 대상 파일만 먼저 읽습니다.
2. 주제에 맞는 기존 경로 아래에 `page.tsx`를 만들고 `ReferencePage`를 재사용합니다. 상세한 props 확인이 필요할 때 공통 파일을 한 번 읽습니다.
3. 상태·이벤트가 필요 없는 설명 페이지는 Server Component로 작성합니다. 설명·비교표·흐름·주의점을 주제에 맞게 구성하고 기존 반응형·다크 테마 스타일을 따릅니다.
4. 정리 요청에는 실행 API 실습을 기본으로 포함합니다. 기존 API와 공통 실습 패널을 우선 재사용하며 새로운 의존성은 필요할 때만 추가합니다. 브라우저 고유 동작은 브라우저 실행과 API 경계를 함께 보여줍니다.
5. `study-pages.ts`에 페이지를 등록하고 화면·metadata를 연결합니다. 메뉴와 검색에 자동으로 반영되는지 확인합니다. 이전 제목은 별칭으로 보존하고 메뉴명·H1을 별도로 하드코딩하지 않습니다.
6. 루트·프론트엔드 README와 인계 문서의 관련 항목을 갱신합니다. 이 지침에 전체 라우트 목록을 중복 관리하지 않습니다.
7. 코드 변경 후 `npm run test:study`, `npm run lint`, `npm run build`를 실행하고 새 경로가 빌드되는지 확인합니다. 문서만 변경했다면 루트 지침의 문서 검증 기준을 따릅니다.

전체 콘텐츠 목록은 루트 README의 학습 콘텐츠 표를, 실제 라우트 여부는 해당 `src/app` 경로를 기준으로 확인합니다. 구조가 바뀌었거나 경로를 찾을 수 없을 때만 해당 영역을 검색합니다.

## 현재 사이드바 순서

알고리즘·자료구조 → Java·객체지향 → 디자인 패턴 → Spring·백엔드 → 데이터·메시징 → 네트워크·API → 프론트엔드 → 설계·테스트·배포 → AI·RAG

페이지당 대표 분류는 하나입니다. 트랜잭션·샤딩은 데이터·메시징에, RAG는 AI·RAG에 등록합니다. 학습 페이지 81개를 메뉴와 검색에 제공하며 `/dashboard`는 제외합니다. 상세 목록은 `study-pages.ts`를 기준으로 확인합니다.

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

흐름을 비교하는 페이지는 `FlowSection orientation="vertical"`과 반응형 열 배치를 우선 사용합니다. 단일 흐름의 기본 방향은 기존 가로 흐름을 유지합니다.

경로 전환이 있는 흐름은 모든 경로의 실제 콘텐츠 높이를 CSS grid로 확보하고 선택된 경로만 노출합니다. 비활성 경로는 접근성 트리·키보드 탐색·자동 재생에서 제외합니다. 비교 열은 같은 높이로 늘리고, 경로 전환 및 재생 완료 전후에 박스 높이와 아래 콘텐츠 위치가 유지되는지 확인합니다.

## 학습 진행도

`components/study-progress.tsx`와 `lib/study-progress.ts`가 localStorage 완료 기록을 관리합니다. 공통 `SidebarInset`에서 페이지 완료 체크를 표시하고 `nav-main.tsx`에서 메뉴별 진도를 표시합니다. `study-pages.ts` 등록 URL만 집계하며 새 페이지에 별도 저장 코드를 추가하지 않습니다.

디자인 패턴 상세 제목은 `한글 이름 · 영문 패턴명` 형식으로 통일합니다. `study-pages.ts`와 `book-chapters-*.json`의 제목을 함께 맞춰 메뉴·검색·페이지·책 목차에 같은 이름을 표시합니다. 역할 설명은 제목 대신 소개 문장에 둡니다.
