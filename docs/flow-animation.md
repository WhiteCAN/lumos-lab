# 학습 흐름 애니메이션과 아이콘

## 표현 원칙

- `frontend/src/components/flow-section.tsx`는 기존 `FlowSection`의 문자열 배열과 호환됩니다. 공통 정리 페이지는 `reference-page.tsx`에서 그대로 가져옵니다.
- React Flow 노드의 테두리를 1.1초마다 순차 강조하고 완료 문구를 표시합니다. 방향 화살표로 연결하며 재생 중 글자·아이콘 크기는 변하지 않습니다.
- 화면에 들어오면 한 번 재생하고 완료 후 멈춥니다. 일시정지·재생·다시 보기를 지원하며 화면 밖과 숨겨진 탭에서는 진행을 멈춥니다.
- `prefers-reduced-motion` 사용자는 모든 단계를 정적으로 읽습니다. 단계가 5개 이하이고 실제 구성도 영역이 충분히 넓으면 왼쪽→오른쪽 한 줄로 연결합니다. 2단계는 680px, 3단계는 720px, 4단계는 960px, 5단계는 1,200px 이상이 기준입니다. 좁은 영역·6단계 이상·명시적 vertical 비교는 위→아래로 연결합니다. 모니터 인치나 전체 창 너비가 아니라 사이드바·본문 여백을 제외한 영역을 ResizeObserver로 측정합니다. 행을 거꾸로 읽는 지그재그 배치는 사용하지 않습니다. 확대·축소·이동과 전체 보기를 지원합니다.
- 개념 흐름의 재생은 실제 API 실행 상황이나 처리 시간 측정이 아닙니다. 색 외에 연결 순서·현재 단계 상태·완료 문구를 함께 제공합니다.

## 사용 방법

방향·높이·간격 계산은 `frontend/src/lib/flow-layout.ts`의 `getFlowLayout`에 있습니다. 가로 흐름은 200px 카드 사이에 40px을 두고 캔버스 맞춤 여백을 줄입니다. 모든 대안 경로 중 가장 긴 경로를 기준으로 방향과 높이를 정하므로 경로를 바꿀 때 주변 본문 위치가 유지됩니다.

```tsx
<FlowSection
  title="캐시 조회"
  defaultPathLabel="Miss"
  steps={[
    { label: "Redis 조회", icon: "redis", detail: "캐시 값 없음" },
    { label: "DB 조회", icon: "database" },
  ]}
  paths={[{ label: "Hit", steps: [
    { label: "Redis 조회", icon: "redis" },
    { label: "바로 응답", icon: "user" },
  ] }]}
/>
```

`paths`는 명시적인 대안 경로입니다. 새 경로 선택 시 처음부터 재생하며 잘못된 경로의 노드를 계속 강조하지 않습니다. 캐시 Hit/Miss, 샤드 A/B, 에이전트 검증 통과/실패에서 사용합니다.

## 적용 범위

모든 FlowSection 사용 페이지와 별도 HTML 흐름을 React Flow로 통합했습니다. TCP/UDP·REST·Next.js·인증·아키텍처·RAG·AI 패턴·Saga/Outbox도 포함합니다. 캐시·샤딩·AI·GenAI·LLM·Spring·CI/CD·메시징의 주요 단계에는 의미에 맞는 아이콘을 지정했습니다. 일반 비교표와 본문은 정적인 가독성을 유지합니다. API 실험의 기존 로그는 실시간 처리처럼 보이지 않도록 그대로 유지합니다.

`TechnologyIcon`은 브랜드 이름 또는 역할 이름을 받습니다. 브랜드 SVG는 Devicon의 `original` 파일을 `frontend/public/brands/`에 수정 없이 저장합니다. 원본의 다색·명암·형태를 보존하고 재색칠하지 않습니다. 어두운 테마에서도 원본이 보이도록 밝은 받침을 사용합니다. 일반 역할은 기존 Lucide 아이콘으로 표현합니다. 상세 출처와 파일 해시는 해당 폴더의 README와 `sources.json`을 확인합니다.

## 검증

프론트엔드에서 다음 명령을 실행합니다. 재생 상태 테스트는 TypeScript 타입 제거를 지원하는 Node.js 22.6 이상이 필요합니다.

```powershell
node --experimental-strip-types --test tests/flow-playback.test.mjs tests/flow-layout.test.mjs
npm run lint
npm run build
```

브라우저에서는 단계 진행·완료·정지·재시작, 경로 전환, 화면 밖 일시정지, 모바일 넘침과 브랜드 SVG 로딩을 확인합니다.

모바일 진입 시 기존 사이드바의 서버/클라이언트 초기 판별이 달라 발생하던 hydration 오류를 `useIsMobile`의 서버 스냅샷으로 수정했습니다. 모바일 직접 접속 시 초기 렌더링과 첫 경로 선택도 함께 검증합니다.

비교 페이지에서는 `FlowSection orientation="vertical"`을 사용해 각 흐름을 위에서 아래로 표시합니다. `/rag/architecture-comparison`은 넓은 화면에서 세 흐름을 3열로 비교하고 모바일에서는 한 열로 배치합니다.

경로 전환이 있는 흐름은 가장 긴 경로의 단계 수와 공통 영역 너비로 높이를 계산하고 CSS grid로 확보하고 선택된 경로만 노출합니다. 비활성 경로는 접근성 트리·키보드 탐색·자동 재생에서 제외합니다. 비교 열은 같은 높이로 늘리고, 경로 전환 및 재생 완료 전후에 박스 높이와 아래 콘텐츠 위치가 유지되는지 확인합니다.

## React Flow 시스템 구성도

Redis·Spring 시스템 설계·Kafka 페이지는 별도의 `SystemDiagram`으로 연결·분기·복제 관계를 보여 줍니다. FlowSection도 React Flow로 순차 재생하며 API 실습은 유지합니다.

적용 페이지, 데이터 작성 예제, 왕복 연결선 수정, 모바일·테마 동작과 확장 절차는 [React Flow 시스템 다이어그램 구현 가이드](react-flow-diagrams.md)를 참고하세요.
