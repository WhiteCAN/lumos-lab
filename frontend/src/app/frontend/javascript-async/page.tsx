import Link from "next/link";
import { BracesIcon } from "lucide-react";
import { CodeBlock, ComparisonTable, FlowSection, ReferencePage } from "@/components/reference-page";
import { getStudyMetadata, getStudyPage } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/frontend/javascript-async");

const promiseCode = `function loadMessage(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error("불러오기 실패"));
      else resolve("데이터 준비 완료");
    }, 300);
  });
}

loadMessage()
  .then((message) => console.log(message))
  .catch((error) => console.error(error.message))
  .finally(() => console.log("로딩 표시 종료"));

// loadMessage(true)로 바꾸면 catch → finally 순서입니다.`;

const awaitCode = `// 위에서 정의한 loadMessage를 사용합니다.
async function showMessage() {
  try {
    const message = await loadMessage();
    console.log(message);
    return message;
  } catch (error) {
    console.error("화면에 실패 안내 표시", error);
    throw error; // 호출한 쪽에도 실패를 전달할 때
  } finally {
    console.log("로딩 표시 종료");
  }
}

// async 함수의 반환값도 Promise이므로 호출부에서 처리합니다.
showMessage().catch(() => console.log("호출부에서 실패 확인"));`;

const concurrentCode = `// 외부 API 없이 콘솔에서 실행할 수 있는 시간 비교 예제
const job = (name, ms) => new Promise((resolve) => {
  setTimeout(() => resolve(name), ms);
});

async function compare() {
  console.time("순차 실행");
  const products = await job("상품", 800);
  const notices = await job("공지", 500);
  console.log([products, notices]);
  console.timeEnd("순차 실행"); // 약 1,300ms

  console.time("동시 실행");
  const results = await Promise.all([
    job("상품", 800),
    job("공지", 500),
  ]);
  console.log(results); // 공지가 먼저 끝나도 ["상품", "공지"]
  console.timeEnd("동시 실행"); // 약 800ms
}

compare().catch(console.error);`;

const dependentCode = `// fetchUser와 fetchOrders는 Promise를 반환한다고 가정합니다.
async function loadOrders() {
  const user = await fetchUser();
  const orders = await fetchOrders(user.id);
  return orders;
}

// 주문 조회에 user.id가 필요하므로 두 요청을 동시에 시작할 수 없습니다.
// 호출부에서도 await 또는 catch로 실패를 처리해야 합니다.`;

const settledCode = `async function collectResults() {
  const results = await Promise.allSettled([
    Promise.resolve("상품 조회 성공"),
    Promise.reject(new Error("공지 조회 실패")),
  ]);

  for (const result of results) {
    if (result.status === "fulfilled") console.log(result.value);
    else console.error(result.reason.message);
  }
}

collectResults().catch(console.error);`;

const playwrightCode = `import { test, expect } from "@playwright/test";

// baseURL과 테스트 계정이 준비된 예시 애플리케이션을 가정합니다.
test("로그인 후 대시보드 표시", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("아이디").fill("demo-user");
  await page.getByLabel("비밀번호").fill("demo-password");
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page).toHaveURL(/\\/dashboard$/);
  await expect(page.getByRole("heading", { name: "대시보드" }))
    .toBeVisible();
});`;

const pitfalls = [
  ["await는 브라우저 전체를 멈추지 않습니다", "해당 async 함수의 다음 부분을 나중에 이어서 실행합니다. 이미 성공한 Promise를 await해도 이후 코드는 비동기로 재개됩니다. async 함수는 첫 await 전까지 동기적으로 실행되며, 긴 CPU 계산을 자동으로 다른 스레드에 옮겨주지 않습니다."],
  ["Promise.all은 작업을 대신 시작하지 않습니다", "배열을 만드는 동안 job() 같은 함수 호출이 작업을 시작하고, Promise.all이 그 결과를 모읍니다. Promise.all([fetchProducts, fetchNotices])처럼 함수 자체를 넣으면 호출되지 않습니다."],
  ["실패가 나머지 작업의 취소를 뜻하지 않습니다", "입력 중 하나가 거부되면 Promise.all의 결과가 거부됩니다. 이미 진행 중인 다른 요청은 계속될 수 있습니다. 요청 취소가 필요하면 해당 API의 AbortSignal 같은 별도 취소 수단이 필요합니다."],
  ["catch로 처리하면 성공 상태가 될 수도 있습니다", "catch에서 오류를 기록한 뒤 정상 반환하면 그 다음 Promise는 성공 상태가 됩니다. 호출부에서도 실패를 알아야 한다면 다시 throw하거나 명시적인 실패 결과를 반환하도록 계약을 정합니다."],
  ["finally는 실패를 처리하는 catch가 아닙니다", "성공·실패로 완료된 뒤 정리 작업을 실행합니다. 계속 pending이면 실행되지 않습니다. finally에서 예외를 던지거나 거부된 Promise를 반환하면 원래 결과 대신 그 실패가 전달될 수 있습니다."],
  ["동시성은 무제한 요청을 의미하지 않습니다", "Promise.all은 동시 실행 수를 제한하지 않습니다. 대량의 요청은 서버 부하와 호출 한도를 고려해 묶음 처리나 동시성 제한을 별도로 설계합니다."],
];

const sources = [
  ["원문 · teqora_skills의 Promises & async/await", "https://www.instagram.com/reels/DdiQw5eznHO/"],
  ["MDN · Promise와 상태·체이닝", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"],
  ["MDN · async 함수", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"],
  ["MDN · await와 실행 재개", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await"],
  ["MDN · Promise.all의 결과 순서와 실패", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all"],
  ["MDN · finally의 결과 전달", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally"],
  ["Playwright · 자동 대기", "https://playwright.dev/docs/actionability"],
  ["Playwright · 재시도하는 검증", "https://playwright.dev/docs/test-assertions"],
];

export default function JavaScriptAsyncPage() {
  return (
    <ReferencePage
      pageHref="/frontend/javascript-async"
      label="비동기 결과 · 실행 순서 · 오류 처리"
      description="Promise의 상태와 async/await의 관계를 이해하고, 작업 간 의존성에 따라 순차 실행과 동시 실행을 선택합니다. 코드 예제와 두 실행 흐름을 함께 비교합니다."
      icon={BracesIcon}
      colorClass="border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20"
    >
      <section className="grid gap-4 md:grid-cols-3" aria-label="Promise의 세 가지 상태">
        {[
          ["Pending · 대기", "성공과 실패가 아직 결정되지 않았습니다. 비동기 작업의 결과를 기다리는 상태입니다."],
          ["Fulfilled · 성공", "결과값과 함께 성공한 상태입니다. then의 성공 핸들러나 await 이후 코드에서 값을 사용합니다."],
          ["Rejected · 실패", "실패 이유가 정해진 상태입니다. catch 또는 await를 감싼 try/catch에서 처리합니다."],
        ].map(([title, body]) => (
          <article key={title} className="min-w-0 rounded-xl border bg-card p-5">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Promise와 async/await는 함께 쓰는 개념입니다</h2>
        <p className="mt-3 text-sm leading-7">Promise는 나중에 결정될 결과를 나타내는 객체입니다. async/await는 그 결과를 순서대로 읽기 쉽게 다루는 문법입니다. <strong>async 함수는 항상 Promise를 반환</strong>하고, await는 성공값을 꺼내거나 실패를 예외로 전달합니다.</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">fulfilled와 rejected를 합쳐 settled라고 부릅니다. await는 async 함수 내부와 ES 모듈 최상위에서 사용할 수 있습니다. resolve에 다른 Promise를 넘기면 그 결과를 따르므로, resolve 호출 자체를 항상 즉시 성공한 상태와 같다고 보면 안 됩니다.</p>
      </section>

      <div className="grid min-w-0 gap-4 xl:grid-cols-2 [&>section]:min-w-0">
        <CodeBlock title="then·catch·finally로 결과 연결" code={promiseCode} />
        <CodeBlock title="같은 작업을 async/await로 표현" code={awaitCode} />
      </div>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">순차와 동시 실행을 가르는 기준은 의존성입니다</h2>
        <p className="mt-3 text-sm leading-7">상품 조회 800ms와 공지 조회 500ms가 서로 독립적이라고 가정합니다. 상품 조회가 끝난 뒤 공지 조회를 시작하면 약 1,300ms, 두 작업을 먼저 시작하면 약 800ms에 결과를 모을 수 있습니다. 실제 시간은 실행 환경과 작업 부하에 따라 달라집니다.</p>
      </section>
      <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-2">
        <FlowSection orientation="vertical" title="순차 실행 · 하나씩 시작하고 기다리기" steps={[
          { label: "상품 조회 시작", icon: "server", detail: "첫 번째 비동기 작업" },
          { label: "상품 결과 대기", icon: "step", detail: "약 800ms · 공지 조회는 아직 시작하지 않음" },
          { label: "공지 조회 시작·대기", icon: "document", detail: "상품 완료 후 추가 약 500ms" },
          { label: "두 결과 사용", icon: "done", detail: "이 예제에서는 약 1,300ms" },
        ]} />
        <FlowSection orientation="vertical" title="동시 실행 · 먼저 시작하고 함께 기다리기" steps={[
          { label: "상품·공지 조회를 모두 시작", icon: "branch", detail: "각 함수 호출이 작업을 시작함" },
          { label: "Promise.all로 결과 모으기", icon: "code", detail: "두 작업의 대기 시간이 겹침" },
          { label: "모든 작업의 성공 기다리기", icon: "verify", detail: "공지 500ms · 상품 800ms" },
          { label: "입력 순서로 두 결과 사용", icon: "done", detail: "이 예제에서는 약 800ms" },
        ]} />
      </div>
      <CodeBlock title="콘솔에서 직접 비교 · 같은 두 작업, 다른 시작 시점" code={concurrentCode} />
      <CodeBlock title="순차 실행이 필요한 경우 · 사용자 → 해당 사용자의 주문" code={dependentCode} />

      <ComparisonTable columns={["순차 await", "Promise.all", "Promise.allSettled"]} rows={[
        { topic: "사용할 때", values: ["앞 결과가 다음 작업에 필요", "독립적인 작업이 모두 성공해야 함", "일부 실패해도 각 결과를 확인해야 함"] },
        { topic: "시작 시점", values: ["이 예제처럼 await 뒤에서 다음 함수를 호출하면 순차 시작", "각 작업을 호출해 시작한 뒤 함께 대기", "각 작업을 호출해 시작한 뒤 함께 대기"] },
        { topic: "입력 작업 실패", values: ["예외 처리 방식에 따라 이후 진행 결정", "하나라도 거부되면 합쳐진 Promise가 거부됨", "모두 완료될 때까지 기다리고 성공·실패 상태를 반환"] },
        { topic: "반환 결과", values: ["각 await에서 성공값", "입력 순서의 성공값 배열", "입력 순서의 status·value 또는 reason 배열"] },
      ]} />
      <CodeBlock title="부분 실패도 결과로 다루기 · Promise.allSettled" code={settledCode} />

      <section className="grid gap-4 md:grid-cols-2" aria-label="비동기 처리에서 주의할 점">
        {pitfalls.map(([title, body]) => (
          <article key={title} className="min-w-0 rounded-xl border bg-card p-5">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-sky-200 bg-sky-50/40 p-5 dark:border-sky-900/60 dark:bg-sky-950/20">
        <h2 className="text-lg font-semibold">Playwright에서는 행동의 순서를 지킵니다</h2>
        <p className="mt-3 text-sm leading-7">화면 이동 → 입력 → 로그인 → 결과 확인은 앞 단계의 상태에 의존합니다. 이런 동작을 무작정 Promise.all로 묶으면 경합이 생길 수 있습니다. 독립적인 API 준비 작업과 화면 조작을 구분합니다.</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">고정 시간 sleep 대신 액션의 자동 대기와 await expect의 재시도 검증을 사용합니다. 오류를 catch에서 로그만 남기고 끝내면 실패한 테스트가 통과할 수 있으므로 필요한 실패는 테스트 실행기에 전달합니다. 아래 코드는 별도의 로그인 앱을 가정한 학습 예제입니다.</p>
      </section>
      <CodeBlock title="Playwright 예제 · 순서를 지키고 화면 상태로 검증" code={playwrightCode} />

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">출처와 함께 읽기</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">teqora_skills 게시물의 이미지와 캡션을 한국어로 재구성했습니다. 예제 코드는 새로 작성했으며, 결과 순서·취소·오류 전파·테스트 실패 처리 설명은 MDN과 Playwright 문서로 보완했습니다. 흐름 애니메이션은 개념 설명이며 실제 API를 실행하지 않습니다.</p>
        <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          {sources.map(([label, href]) => <li key={href}><a href={href} className="underline underline-offset-4">{label}</a></li>)}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3 border-t pt-4 text-sm">
          {["/frontend/event-loop", "/sync-async", "/frontend/react", "/testing-basics"].map((href) => (
            <Link key={href} href={href} className="underline underline-offset-4">{getStudyPage(href).title}</Link>
          ))}
        </div>
      </section>
    </ReferencePage>
  );
}
