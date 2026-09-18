# 학습 흐름 애니메이션과 아이콘

## 표현 원칙

- `frontend/src/components/flow-section.tsx`는 기존 `FlowSection`의 문자열 배열과 호환됩니다. 공통 정리 페이지는 `reference-page.tsx`에서 그대로 가져옵니다.
- 각 단계의 테두리·배경을 1.1초마다 순차 강조하고 연결선의 작은 점으로 이동을 표시합니다. 글자·아이콘 크기는 변하지 않습니다.
- 화면에 들어오면 한 번 재생하고 완료 후 멈춥니다. 일시정지·재생·다시 보기를 지원하며 화면 밖과 숨겨진 탭에서는 진행을 멈춥니다.
- `prefers-reduced-motion` 사용자는 모든 단계를 정적으로 읽습니다. 모바일은 세로 흐름, 넓은 화면은 가로 흐름이며 긴 흐름은 영역 안에서 스크롤합니다.
- 개념 흐름의 재생은 실제 API 실행 상황이나 처리 시간 측정이 아닙니다. 색 외에 단계 번호·현재 상태·완료 체크를 함께 제공합니다.

## 사용 방법

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

기존 공통 흐름 13개 페이지에 적용하고 Redis·Kafka·Saga/Outbox 흐름을 추가했습니다. 캐시·샤딩·AI·GenAI·LLM·Spring·CI/CD·메시징의 주요 단계에는 의미에 맞는 아이콘을 지정했습니다. 일반 비교표와 본문은 정적인 가독성을 유지합니다. API 실험의 기존 로그는 실시간 처리처럼 보이지 않도록 그대로 유지합니다.

`TechnologyIcon`은 브랜드 이름 또는 역할 이름을 받습니다. 브랜드 SVG는 Devicon의 `original` 파일을 `frontend/public/brands/`에 수정 없이 저장합니다. 원본의 다색·명암·형태를 보존하고 재색칠하지 않습니다. 어두운 테마에서도 원본이 보이도록 밝은 받침을 사용합니다. 일반 역할은 기존 Lucide 아이콘으로 표현합니다. 상세 출처와 파일 해시는 해당 폴더의 README와 `sources.json`을 확인합니다.

## 검증

프론트엔드에서 다음 명령을 실행합니다. 재생 상태 테스트는 TypeScript 타입 제거를 지원하는 Node.js 22.6 이상이 필요합니다.

```powershell
node --experimental-strip-types --test tests/flow-playback.test.mjs
npm run lint
npm run build
```

브라우저에서는 단계 진행·완료·정지·재시작, 경로 전환, 화면 밖 일시정지, 모바일 넘침과 브랜드 SVG 로딩을 확인합니다.

모바일 진입 시 기존 사이드바의 서버/클라이언트 초기 판별이 달라 발생하던 hydration 오류를 `useIsMobile`의 서버 스냅샷으로 수정했습니다. 모바일 직접 접속 시 초기 렌더링과 첫 경로 선택도 함께 검증합니다.

비교 페이지에서는 `FlowSection orientation="vertical"`을 사용해 각 흐름을 위에서 아래로 표시합니다. `/rag/architecture-comparison`은 넓은 화면에서 세 흐름을 3열로 비교하고 모바일에서는 한 열로 배치합니다.

경로 전환이 있는 흐름은 모든 경로의 실제 콘텐츠 높이를 CSS grid로 확보하고 선택된 경로만 노출합니다. 비활성 경로는 접근성 트리·키보드 탐색·자동 재생에서 제외합니다. 비교 열은 같은 높이로 늘리고, 경로 전환 및 재생 완료 전후에 박스 높이와 아래 콘텐츠 위치가 유지되는지 확인합니다.
