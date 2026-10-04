import Link from "next/link";
import { Code2Icon } from "lucide-react";
import { ReferencePage, CodeBlock, FlowSection } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";
import { ArrayBrowserLab } from "./array-browser-lab";
export const metadata = getStudyMetadata("/frontend/javascript-basics");
const cards = [
  [
    "값과 비교",
    "문자열·숫자·불리언·null·undefined·객체의 차이부터 확인합니다.",
    "엄격 비교 ===와 명시적인 변환을 사용합니다. typeof null은 object라는 예외가 있습니다."
  ],
  [
    "const와 참조",
    "const는 변수 재할당을 막지만 객체 내부 변경을 막지 않습니다.",
    "전개 구문은 얕은 복사입니다. 중첩 객체 참조는 공유될 수 있습니다."
  ],
  [
    "배열 변환",
    "map은 변환, filter는 선택, reduce는 누적입니다.",
    "기본 sort는 문자열 기준으로 정렬하며 원본을 바꿉니다. 숫자는 (a,b)=>a-b를 제공합니다."
  ],
  [
    "함수와 클로저",
    "함수는 값으로 전달할 수 있고 바깥의 렉시컬 환경을 참조합니다.",
    "화살표 함수는 자체 this를 만들지 않습니다. 호출 방식에 따른 일반 함수 this와 구분합니다."
  ],
  [
    "브라우저 역할",
    "DOM 이벤트·localStorage는 브라우저 환경의 API입니다.",
    "브라우저 값을 신뢰해 서버 검증을 생략하지 않습니다. 저장한 민감 데이터는 노출 위험이 있습니다."
  ],
  [
    "비동기와 오류",
    "Promise와 async/await는 완료 시점과 실패 전달을 다룹니다.",
    "fetch는 HTTP 400만으로 reject하지 않습니다. response.ok 검사와 로딩·오류 처리가 필요합니다."
  ]
];
const scenarios = [
  "[10,2,1]의 기본 정렬과 숫자 정렬 순서를 비교합니다.",
  "[-2,0,3,3]에서 음수·0·중복을 유지하는지 확인합니다.",
  "빈 배열·null·소수·문자열·범위 밖 값은 실행 전에 거절합니다.",
  "브라우저와 API는 같은 제한: 정수 1~30개, 각 -10000~10000. 임의 코드는 실행하지 않습니다."
];
const related = [["/frontend/event-loop","이벤트 루프"],["/frontend/react-hooks","React Hooks"]];
export default function Page() {
  return <ReferencePage pageHref="/frontend/javascript-basics" label="개념 · 흐름 · 실행 검증" description="치트시트의 핵심을 값·함수·컬렉션·브라우저 실행으로 나누고 실제 배열 변환을 Java API와 비교합니다." icon={Code2Icon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
    <ArrayBrowserLab />
    <section className="grid gap-4 xl:grid-cols-3" aria-label="핵심 개념">{cards.map(([title, body, caution], index) => <article key={title} className="min-w-0 rounded-xl border bg-card p-5"><p className="text-sm font-medium text-sky-700 dark:text-sky-300">0{index + 1}</p><h2 className="mt-2 text-lg font-semibold [overflow-wrap:anywhere]">{title}</h2><p className="mt-3 text-sm leading-6">{body}</p><p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">{caution}</p></article>)}</section>
    <FlowSection title="대표 실행 흐름" steps={["제한된 JSON 배열 파싱","브라우저에서 변환","별도 Java API 실행","숫자 정렬·합계 비교","실행 언어와 오류 경계 확인"]} />
    <CodeBlock title="JavaScript · 브라우저에서 실행하는 핵심 코드" code={"const values = [10, 2, 1];\nconst lexical = [...values].sort(); // [1, 10, 2]\nconst numeric = [...values].sort((a, b) => a - b); // [1, 2, 10]\nconst doubled = values.map(n => n * 2);\nconst evens = values.filter(n => n % 2 === 0);\nconst sum = values.reduce((total, n) => total + n, 0);\n// API의 Java Stream은 숫자 정렬을 실행합니다. JS 기본 sort를 실행하지 않습니다."} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">입력을 바꿔 확인하기</h2><ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-6 [overflow-wrap:anywhere]">{scenarios.map(item => <li key={item}>{item}</li>)}</ol></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 이어서 보기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">원문에서 확인한 주제를 학습용으로 재구성했습니다. 코드·실패 실험·설계 주의점은 프로젝트에서 보완한 내용입니다.</p><ul className="mt-3 space-y-2 text-sm"><li><a className="underline" href="https://www.instagram.com/reels/Dd7_WYhykfy/">Instagram 원문</a></li><li><a className="underline" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections">공식 문서 · 세부 계약 확인</a></li>{related.map(([href, title]) => <li key={href}><Link className="underline" href={href}>{title}</Link></li>)}</ul></section>
  </ReferencePage>;
}
