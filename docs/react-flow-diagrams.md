# React Flow 시스템 다이어그램 구현 가이드

## 목적과 적용 범위

시스템 구성 요소의 연결·분기·복제 관계를 React Flow 카드와 화살표로 보여 줍니다. 기존 `FlowSection`의 순차 재생과 API 실습은 유지하고, 관계를 탐색할 수 있는 구성도를 추가했습니다.

일반 역할에는 Lucide 아이콘을, 실제 기술에는 기존 원본 SVG 로고를 사용합니다. `@xyflow/react` 본체로 구현했으며 유료 Pro 예제나 템플릿은 포함하지 않았습니다. 현재 `frontend/package.json`의 의존성 범위는 `^12.12.0`이고 실제 설치 버전은 잠금 파일로 관리합니다.

| 페이지 | `kind` | 선택 가능한 경로 | 설명 범위 |
| --- | --- | --- | --- |
| `/backend/redis-cache` | `redis` | 캐시 적중·캐시 미스·캐시 무효화 | 앱이 Redis와 원본 DB를 각각 호출하는 Cache Aside 관계 |
| `/spring-system-design` | `spring` | 전체 구성·캐시 조회·외부 호출 | 사용자 → Gateway → Spring 서비스 → Redis·DB·외부 서비스 |
| `/messaging/kafka-architecture` | `kafka` | 이벤트 발행·배송 그룹·분석 그룹·P0 복제 | 파티션 리더, 그룹별 소비, P0 Follower 두 개의 복제 관계 |

화면은 실제 Redis·Kafka·Spring 인프라의 상태를 조회하지 않는 **학습용 모형**입니다. 경로 선택은 설명할 연결을 바꾸는 동작이며 API 실행이나 시간순 재생이 아닙니다. Kafka의 전체 복제본 9개 배치표와 상세 설명은 기존 본문에 남아 있습니다.

## 파일과 역할

| 파일 | 역할 |
| --- | --- |
| [system-diagram.tsx](../frontend/src/components/system-diagram.tsx) | 클라이언트 컴포넌트, React Flow 설정, 커스텀 카드, 경로·노드 선택, 목록 보기, 연결점 결정 |
| [system-diagram-data.ts](../frontend/src/components/system-diagram-data.ts) | 타입과 세 페이지의 노드·좌표·설명·경로 데이터 |
| [technology-icon.tsx](../frontend/src/components/technology-icon.tsx) | Lucide 역할 아이콘과 로컬 기술 로고 재사용 |
| [public/brands](../frontend/public/brands/) | 브랜드 SVG 원본 및 출처 정보 |
| [theme-provider.tsx](../frontend/src/components/theme-provider.tsx) | 사이트 테마 상태 제공 |

서버 페이지에서 `kind`만 전달합니다. 상태와 이벤트 처리는 공통 클라이언트 컴포넌트 안에 둡니다.

```tsx
import { SystemDiagram } from "@/components/system-diagram";

<SystemDiagram kind="redis" />
```

`ServiceCard`는 React Flow의 `service` 노드 타입입니다. 아이콘·제목·역할을 표시하는 버튼을 누르면 하단 상세 설명이 바뀝니다. React Flow 기본 CSS는 공통 컴포넌트에서 가져옵니다.

## 데이터 작성 방법

| 타입 | 필드 | 작성 기준 |
| --- | --- | --- |
| `DiagramNode` | `id`, `label`, `icon`, `role`, `detail`, `x`, `y` | 고유 ID, 제목, `FlowIconName`, 짧은 역할, 상세 설명, 수동 배치 좌표 |
| `DiagramLink` | `source`, `target`, `label` | 출발·도착 노드 ID와 연결의 의미 |
| `DiagramScene` | `label`, `summary`, `links`, 선택적 `nodeIds` | 경로 버튼 이름, 상황 설명, 연결 목록, 표시할 노드 ID |
| `Diagram` | `title`, `nodes`, `scenes` | 다이어그램 제목, 전체 노드, 선택 가능한 경로 |

다음은 기존 Redis 카드 두 개를 참조하는 경로 예시입니다. `scenes`에 들어갈 데이터이며 별도 API 호출은 없습니다.

```ts
{
  label: "캐시 적중",
  summary: "Redis에서 값을 찾아 반환합니다. DB 조회는 생략합니다.",
  links: [
    { source: "app", target: "cache", label: "① GET" },
    { source: "cache", target: "app", label: "② 캐시 값 반환" },
  ],
}
```

`links`의 노드 ID는 반드시 `nodes`에 있어야 합니다. `nodeIds`를 지정하면 해당 경로에서 표시할 노드를 한정하므로 연결 양 끝도 포함해야 합니다. 현재 Kafka P0 복제 경로에서 사용합니다.

현재 구현에는 Kafka Follower를 위해 `nodeIds`가 없을 때 ID가 `f`로 시작하는 노드를 숨기는 규칙이 있습니다. 새 일반 노드에 `frontend`처럼 `f`로 시작하는 ID를 쓰면 기본 화면에서 숨겨질 수 있으므로 다른 ID를 쓰거나 각 경로에 `nodeIds`를 명시하세요. 범용적인 숨김 속성은 아직 없습니다.

노드 위치는 자동 배치하지 않습니다. `x`, `y`를 직접 정하고 기본적으로 왼쪽에서 오른쪽으로 연결합니다. 경로 전환 시 같은 노드의 좌표는 유지됩니다. 숨겨진 노드도 상세 설명 드롭다운에서는 선택할 수 있습니다.

## 연결선과 왕복 경로

연결선은 React Flow 기본 Bézier 곡선과 도착 화살표를 사용합니다. 별도의 장애물 회피나 자동 라우팅 엔진은 없습니다.

첫 구현에서는 모든 선을 오른쪽 출구 → 왼쪽 입구로 연결했습니다. Redis의 응답도 이 규칙을 따르면서 오른쪽 Redis 카드 뒤를 돌아 왼쪽 앱으로 향했고, 요청선과 교차하며 라벨이 겹쳤습니다.

현재는 같은 경로 안에 `A → B`와 `B → A`가 함께 있으면 왕복 연결로 판단합니다. 출발 노드의 `x`가 더 크면 반환 방향으로 분류하고 서로 마주 보는 면의 위·아래 연결점을 나눕니다.

| 연결 | 출발 Handle | 도착 Handle | 위치 |
| --- | --- | --- | --- |
| 일반 단방향 | `out` | `in` | 오른쪽 중앙 → 왼쪽 중앙 |
| 왕복 중 요청 | `request-out` | `request-in` | 오른쪽 위 20% → 왼쪽 위 20% |
| 왕복 중 응답 | `response-out` | `response-in` | 왼쪽 아래 80% → 오른쪽 아래 80% |

추가 Handle은 투명하게 두어 카드에 점이 과도하게 보이지 않게 합니다. 연결선은 해당 Handle ID에 실제로 연결됩니다.

이 규칙은 **서로 다른 x 좌표의 수평 배치**를 전제로 합니다. 동일 x 좌표의 수직 왕복, 역방향 단방향, 다중 병렬 연결을 추가할 때는 별도 연결점 설계가 필요합니다. 또한 두 선의 연결점을 나누더라도 노드 간격이 너무 좁거나 라벨이 길면 다른 선·라벨과 겹칠 수 있으므로 화면에서 확인해야 합니다.

## 조작·반응형·테마

- 경로 버튼은 `aria-pressed`로 선택 상태를 알립니다. 선택한 경로의 연결과 상황 설명이 함께 바뀝니다.
- 노드 버튼이나 상세 설명 드롭다운으로 구성 요소를 선택합니다. 설명 변경은 `aria-live="polite"`로 전달합니다.
- 데스크톱에서는 구성도와 연결 목록을 전환할 수 있습니다. `md` 미만 화면에서는 캔버스를 숨기고 연결 목록을 표시합니다.
- 목록과 구성도는 같은 `scene.links`를 사용합니다. 작은 화면에서도 출발·도착·연결 설명을 읽을 수 있습니다.
- 캔버스 높이는 460px이며 최초 `fitView`와 전체 보기 버튼으로 화면에 맞춥니다. 확대 범위는 0.35~1.5입니다.
- 노드 드래그, 연결 편집, 삭제는 비활성화했습니다. 휠 확대도 끄고 페이지 스크롤을 허용합니다.
- 노드와 경로를 자동 재생하지 않습니다. 움직임이 필요한 순차 설명은 기존 `FlowSection`을 사용합니다.
- 사이트 테마를 React Flow `colorMode`에 전달합니다. 서버와 첫 클라이언트 렌더는 `light`로 맞춘 뒤 `useSyncExternalStore`의 hydration 판별 후 저장된 테마를 적용합니다. 저장된 다크 테마로 직접 접속할 때 발생했던 초기 HTML 불일치를 방지하기 위한 처리입니다.

실제 제품에는 등록된 브랜드 로고를, 추상적인 사용자·서버·DB에는 역할 아이콘을 지정합니다. 지원 이름은 `technology-icon.tsx`를 기준으로 확인하고, 브랜드 SVG를 임의로 재색칠하지 않습니다.

## 다른 페이지에 확장하기

1. 단순 순서 설명이면 `FlowSection`, 분기·복제·여러 구성 요소의 관계 설명이면 `SystemDiagram`을 선택합니다.
2. `systemDiagrams`의 키 타입과 데이터에 새 `kind`를 추가합니다. 노드 ID, 설명, 좌표와 경로를 정의합니다.
3. 해당 페이지에서 `<SystemDiagram kind="새 키" />`를 사용합니다. 기존 개념 설명과 API 실습은 유지합니다.
4. 요청·응답과 복제 방향을 검토합니다. 실제 실행과 생략한 구성 요소를 상황 설명에 명시합니다.
5. 아래 검증을 수행하고 적용 페이지 표와 관련 README를 갱신합니다.

## 검증과 현재 한계

실행 코드 변경 시 `frontend`에서 실행합니다.

```powershell
npm run lint
npm run build
npm run test:study
npm run test:labs
```

브라우저에서는 다음을 확인합니다.

- 320·768·1024·1440px에서 문서 가로 넘침, 목록과 캔버스 표시
- 세 페이지의 모든 경로 전환과 연결선·라벨·도착 방향
- Redis 캐시 적중의 요청·응답 두 선이 카드 뒤를 돌아가지 않는지
- 노드 클릭, Tab·Enter 조작, 드롭다운 선택과 상세 설명
- 밝은 테마·어두운 테마 및 저장된 테마로 새로고침했을 때 hydration 오류
- 브랜드 이미지 로딩과 콘솔 오류

이번 적용에서는 린트·빌드·학습 페이지 및 실습 연결 검사를 통과했고, 세 페이지의 4개 너비와 경로 전환을 확인했습니다. 왕복 연결선 수정 후 Redis 세 경로와 실제 화면을 다시 확인하고 린트·빌드를 통과했습니다. 자동 접근성 감사나 모든 배치에서의 연결선 충돌 방지를 보장한 것은 아닙니다.

이 기록은 로컬 구현·검증 결과이며 배포 완료를 의미하지 않습니다. 문서만 수정할 때는 경로·내용·diff를 확인하고 빌드와 실행 테스트를 반복하지 않습니다.
