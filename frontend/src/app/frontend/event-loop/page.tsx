import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { ReferencePage, ComparisonTable, FlowSection, CodeBlock } from "@/components/reference-page";
import { getStudyMetadata, getStudyPage } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/frontend/event-loop");
const sections = [
  [
    "콜 스택이 먼저 실행됩니다",
    "현재 실행 중인 JavaScript 코드는 콜 스택에서 처리됩니다. 타이머를 등록하거나 Promise에 콜백을 연결한다고 현재 함수를 중간에 끊고 콜백을 실행하지 않습니다. 긴 동기 계산은 같은 스레드의 입력 처리와 화면 갱신을 지연시킬 수 있습니다."
  ],
  [
    "마이크로태스크 체크포인트",
    "브라우저는 현재 작업이 끝나고 적절한 체크포인트에 도달하면 Promise 반응과 queueMicrotask 등의 마이크로태스크를 처리합니다. 처리 도중 추가된 마이크로태스크도 큐가 빌 때까지 처리하므로 무한히 추가하면 다음 태스크와 렌더링이 굶을 수 있습니다."
  ],
  [
    "타이머의 0은 즉시 실행이 아닙니다",
    "setTimeout(fn, 0)은 호출 즉시 fn을 실행하라는 뜻이 아닙니다. 타이머 조건을 충족한 이후 태스크로 실행될 기회를 기다립니다. 브라우저의 최소 지연·백그라운드 제한·현재 작업 때문에 더 늦어질 수 있습니다."
  ],
  [
    "환경과 큐를 구분합니다",
    "이 페이지는 브라우저의 기본 모델을 설명합니다. 브라우저에는 여러 태스크 소스가 있으며 전부 하나의 전역 FIFO라고 볼 수 없습니다. 렌더링은 기회에 따라 진행되어 매 태스크 뒤 반드시 페인트하는 것도 아닙니다. fetch의 Promise 후속 then은 마이크로태스크이며, Node.js의 nextTick·setImmediate는 별도 실행 모델로 확인해야 합니다."
  ],
  [
    "Playwright에서 적용하기",
    "잠깐 기다리면 화면이 준비될 것이라는 시간 가정 대신 await expect(locator).toBeVisible() 같은 상태 검증을 사용합니다. Promise.resolve를 기다리는 것만으로 네트워크나 브라우저 페인트가 완료되지는 않습니다. 독립 작업의 동시 실행은 Promise 페이지에서 이어서 비교합니다."
  ]
];
const steps = [
  "현재 태스크의 동기 코드 실행",
  "스택이 비고 체크포인트 도달",
  "마이크로태스크 큐가 빌 때까지 처리",
  "렌더링 기회·다음 태스크로 진행"
];
const rows = [
  {
    "topic": "예시",
    "values": [
      "일반 함수·console.log",
      "Promise.then·queueMicrotask",
      "타이머 콜백·이벤트 처리"
    ]
  },
  {
    "topic": "예제의 순서",
    "values": [
      "A 다음 B",
      "C 다음 D 다음 E",
      "마지막 T"
    ]
  },
  {
    "topic": "주의점",
    "values": [
      "긴 계산은 스레드를 점유",
      "계속 추가하면 다른 작업 지연",
      "0ms도 즉시 실행 보장 없음"
    ]
  }
];
const codes = [
  {
    "title": "브라우저 콘솔 · 출력 순서를 먼저 예상하기",
    "code": "console.log(\"A\");\nsetTimeout(() => console.log(\"T\"), 0);\nPromise.resolve().then(() => {\n  console.log(\"C\");\n  queueMicrotask(() => console.log(\"E\"));\n});\nqueueMicrotask(() => console.log(\"D\"));\nconsole.log(\"B\");\n// A → B → C → D → E → T\n// C 실행 중 E를 넣어도 이미 대기 중인 D가 먼저 실행됩니다."
  }
];
const refs = [
  [
    "MDN · 마이크로태스크 가이드",
    "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide"
  ]
];
const related = [
  "/frontend/javascript-async",
  "/sync-async",
  "/testing-basics"
];

export default function Page() {
  return (
<ReferencePage pageHref="/frontend/event-loop" label="개념 · 흐름 · 선택 기준" description="동기 코드, Promise 콜백, 타이머의 실행 순서를 예제로 추적합니다." icon={BookOpenIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        {sections.map(([title, body]) => (
          <section key={title} className="min-w-0 rounded-xl border bg-card p-5 [overflow-wrap:anywhere]">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>
      <FlowSection title="핵심 흐름" orientation="vertical" steps={steps} />
      <ComparisonTable columns={[
  "동기 실행",
  "마이크로태스크",
  "태스크"
]} rows={rows} />
      {codes.map(({ title, code }) => <CodeBlock key={title} title={title} code={code} />)}
      <section className="rounded-xl border bg-card p-5 [overflow-wrap:anywhere]">
        <h2 className="text-lg font-semibold">출처와 함께 읽기</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">원문 이미지와 캡션을 한국어로 재구성하고 아래 공식 문서로 조건과 주의점을 보완했습니다. 예제와 흐름은 학습용으로 작성했으며 실제 서비스 호출을 수행하지 않습니다.</p>
        <a href="https://www.instagram.com/reels/DdipdLyT4bl/" className="mt-3 inline-block text-sm underline underline-offset-4">Instagram 원문</a>
        <ul className="mt-3 grid gap-2 text-sm">{refs.map(([title, href]) => <li key={href}><a href={href} className="underline underline-offset-4">{title}</a></li>)}</ul>
        <div className="mt-5 flex flex-wrap gap-3 border-t pt-4 text-sm">{related.map(href => <Link key={href} href={href} className="underline underline-offset-4">{getStudyPage(href).title}</Link>)}</div>
      </section>
    </ReferencePage>
  );
}
