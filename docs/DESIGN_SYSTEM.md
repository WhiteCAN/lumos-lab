# 디자인 시스템

## 방향과 원본

한국어 학습 콘텐츠를 읽고 비교하고 실행하기 쉬운 화면을 유지합니다. 따뜻한 중립색의 밝은 테마와 어두운 테마를 제공하고, 색상보다 제목·아이콘·설명으로 의미를 전달합니다.

값의 원본은 [globals.css](../frontend/src/app/globals.css), 컴포넌트 원본은 [components/ui](../frontend/src/components/ui/)입니다. 제공 가이드의 Inter·분홍색·64px 제목 예제는 적용하지 않습니다.

## 토큰과 타이포그래피

| 용도 | 사용 토큰·클래스 |
| --- | --- |
| 화면·본문 | `bg-background`, `text-foreground` |
| 카드 | `bg-card`, `text-card-foreground` |
| 보조 설명·구역 | `text-muted-foreground`, `bg-muted` |
| 버튼·강조 | `primary`, `primary-foreground`, `accent` |
| 테두리·입력·포커스 | `border-border`, `input`, `ring` |
| 파괴적 상태 | `destructive`와 명확한 텍스트 설명 |

밝은 배경은 `oklch(0.972 0.012 88)`, 어두운 배경은 `oklch(0.145 0 0)`이며 전체 값은 CSS에서 관리합니다. 임의의 색상 세트를 새로 만들지 않습니다. 주제별 보조색은 기존 페이지의 밝은·어두운 테마 조합을 참고합니다.

본문은 Geist Sans와 시스템 대체 글꼴, 코드 계열은 Geist Mono 설정을 사용합니다. 기존 학습 페이지의 제목은 주로 `text-3xl`, 절 제목은 `text-lg`·`text-xl`, 설명은 `text-sm leading-6`·`leading-7`을 사용합니다. 모든 기존 화면이 동일한 치수로 강제되어 있다고 가정하지 않습니다.

간격은 기존 `gap-3/4`, `p-4/5` 등 Tailwind 단위를 따릅니다. 기본 radius 토큰은 `0.625rem`이며 카드에는 `rounded-lg/xl`, 필요한 경우 `shadow-sm`을 사용합니다.

## 공통 구성 요소

- 페이지 틀은 `ReferencePage`와 `AppSidebar`, 헤더 테마 전환은 `ThemeToggle`을 재사용합니다.
- `ConceptGrid`, `ComparisonTable`, `CodeBlock`으로 기존 콘텐츠 표현을 이어갑니다.
- 순차 재생은 [FlowSection](flow-animation.md), 분기·복제 관계는 [SystemDiagram](react-flow-diagrams.md)을 사용합니다.
- 실제 제품은 `TechnologyIcon`의 원본 SVG, 일반 사용자·서버·DB는 Lucide로 표시합니다. 로고를 임의 재색칠하지 않습니다.
- 버튼·입력은 기존 `components/ui` 변형과 주변 화면을 먼저 확인합니다.

## 상태·반응형·접근성

API 화면은 로딩·성공·오류 상태를 명시하고 필요한 곳에 빈 결과도 설명합니다. 선택·포커스·비활성 상태는 색만으로 구분하지 않고 텍스트와 시맨틱 속성을 제공합니다.

모바일은 한 열을 기본으로 하고 비교 콘텐츠는 넓은 화면에서 여러 열로 확장합니다. 현재 Tailwind 기본 `sm/md/lg/xl` 경계는 각각 640/768/1024/1280px이며 화면의 실제 클래스가 우선입니다. React Flow는 `md` 미만에서 연결 목록을, 비교 FlowSection은 모바일에서 세로 배치를 제공합니다. 표·코드의 필요한 스크롤은 해당 영역 안에 한정합니다.

`SidebarInset` 아래에 main을 다시 만들지 않습니다. 입력 레이블, 버튼 이름, 키보드 조작, 보이는 포커스를 제공합니다. FlowSection의 동작 줄이기를 유지하고 새로운 모션도 같은 사용자 설정을 고려합니다. UI 변경 후 320·768·1024·1440px에서 넘침과 주요 조작을 확인하며, 접근성 기준을 문서화한 것과 전체 감사를 통과한 것은 구분합니다.
