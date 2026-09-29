import Link from "next/link";
import { BracesIcon } from "lucide-react";
import { ReferencePage, FlowSection, CodeBlock } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";
import { HooksLab, EffectLab } from "./hooks-lab";

export const metadata = getStudyMetadata("/frontend/react-hooks");
const hooks = [
  ["useState", "렌더링에 쓰는 값", "const [count, setCount] = useState(0);\nsetCount(c => c + 1);", "이전 값에 의존하면 함수형 갱신. 객체를 직접 수정하지 않습니다."],
  ["useEffect", "외부 시스템과 동기화", "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, [tick]);", "의존성을 생략해 경고를 숨기지 않습니다. 개발 Strict Mode는 정리 대칭성을 확인합니다."],
  ["useRef", "DOM 또는 렌더링과 무관한 값", "const input = useRef(null);\n// 이벤트에서\ninput.current?.focus();", "current 변경은 재렌더링을 유발하지 않습니다. 화면 값은 state로 관리합니다."],
  ["useContext", "가까운 Provider의 값 읽기", "const step = useContext(StepContext);", "공유 데이터 접근 수단이며 전역 저장소·성능 최적화를 자동 제공하지 않습니다."],
  ["useReducer", "상태 전이 규칙 분리", "const [state, dispatch] = useReducer(reducer, initial);\ndispatch({ type: 'reset' });", "reducer는 순수 함수로 유지하고 API 호출은 이벤트나 별도 동기화 영역에 둡니다."],
  ["useMemo", "계산 결과 캐시", "const total = useMemo(() => sum(items), [items]);", "정확성을 캐시에 의존시키지 않습니다. 먼저 실제 병목을 측정하세요."],
  ["useCallback", "함수 참조 캐시", "const add = useCallback(() => dispatch(step), [step]);", "함수를 실행하거나 모든 자식 렌더링을 막는 기능이 아닙니다."],
];
export default function ReactHooksPage() {
  return <ReferencePage pageHref="/frontend/react-hooks" label="React · 상태와 외부 시스템" brand="react" icon={BracesIcon} colorClass="bg-sky-50/50 dark:bg-sky-950/20" description="원문의 7가지 Hooks를 목적·코드·주의점으로 비교합니다. React 코드는 브라우저에서 실행하고 서버 요청은 기존 Java API와 연결합니다.">
    <HooksLab />
    <EffectLab />
    <section className="rounded-xl border bg-card p-4 text-sm leading-7">두 번째 원문의 Render → Effect → Dependency → Cleanup은 암기용 축약입니다. 정확히는 커밋 후 setup, 의존성 변경 시 이전 cleanup → 새 setup, 언마운트 시 마지막 cleanup입니다. <a className="underline" href="https://www.instagram.com/reels/Dd1xxJGuNph/">2번 원문</a> · <a className="underline" href="https://react.dev/reference/react/useEffect">공식 useEffect 계약</a></section>
    <FlowSection title="상태 변화에서 정리까지" steps={["이벤트 발생", "상태 갱신", "렌더·커밋", "Effect 동기화", "정리 후 재동기화"]} />
    <div className="grid min-w-0 gap-4 xl:grid-cols-3">{hooks.map(([name, purpose, code, warning]) => <section key={name} className="min-w-0 rounded-xl border bg-card p-4"><h2 className="text-lg font-semibold">{name}</h2><p className="my-3 text-sm">{purpose}</p><CodeBlock title={`${name} 핵심 문법`} code={code} /><p className="mt-3 text-sm leading-6 text-muted-foreground">{warning}</p></section>)}</div>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">선택 순서와 실습 범위</h2><p className="mt-3 text-sm leading-7">화면에 보여 줄 값은 state, 상태 전이가 복잡해지면 reducer, 외부 연결은 effect, DOM 참조는 ref부터 판단합니다. Hooks는 함수 컴포넌트·커스텀 Hook의 최상위에서 호출합니다. 이 페이지의 카운터와 API 패널은 실제 React Hooks를 실행하지만 성능 벤치마크나 서버 렌더링 비교 실습은 아닙니다.</p><p className="mt-3 text-sm leading-7">Context 증가량을 5로 바꿔 카운터를 누르고 합계를 확인하세요. API 성공 후 실패 주입, 1500ms 지연 후 취소, 요청 중 재실행을 비교합니다. React 기능을 Java로 바꾸면 실행 의미가 달라지므로 Hooks 예제는 TypeScript/JavaScript로 제공합니다.</p><div className="mt-4 flex flex-wrap gap-4 text-sm underline"><Link href="/frontend/react">React 기초로 돌아가기</Link><a href="https://www.instagram.com/reels/Dd1tFc6t_j_/">원문 릴스 · 캡션 기준</a><a href="https://react.dev/reference/react/hooks">React 공식 Hooks 문서</a></div></section>
  </ReferencePage>;
}
