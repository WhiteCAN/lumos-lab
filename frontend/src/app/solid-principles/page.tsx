import { solidExamples } from "@/lib/solid-examples";
import { LearningFlowCanvas } from "@/components/learning-flow-canvas";
import { solidGraphs } from "@/components/learning-diagram-data";
import Link from "next/link";
import { BoxesIcon, Code2Icon, GitBranchIcon, LightbulbIcon } from "lucide-react";
import { ReferencePage } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/solid-principles");

const principles = [
  {
    letter: "S", name: "단일 책임 원칙", english: "Single Responsibility Principle",
    summary: "변경 이유가 다른 책임을 나눕니다.",
    detail: "회원 가입 정책과 저장 방식은 서로 다른 이유로 바뀝니다. 업무 규칙은 서비스에, 데이터 저장은 저장소에 두면 한쪽 변경의 영향을 좁힐 수 있습니다.",
    caution: "메서드를 하나만 두라는 뜻은 아닙니다. 함께 바뀌는 일을 묶고, 다른 담당자·정책 때문에 바뀌는 일을 구분하세요.",
    check: "저장 방식 변경이 가입 규칙까지 바꾸게 하나요?",
    code: solidExamples.S,
    codeNote: "가입 규칙과 저장 계약을 분리했습니다. MemoryUserRepository는 메모리에만 저장하는 학습용 구현입니다.",
  },
  {
    letter: "O", name: "개방·폐쇄 원칙", english: "Open/Closed Principle",
    summary: "예상하는 변경은 구현 확장으로 받아들입니다.",
    detail: "도형 종류가 늘 때마다 합계 계산기에 분기를 추가하면 기존 동작에 영향을 줄 수 있습니다. 계산기는 Area만 알고, 면적 계산은 각 도형이 맡도록 합니다.",
    caution: "기존 코드를 절대로 고치지 않는다는 뜻은 아닙니다. 새 객체를 만드는 조립 코드는 바뀔 수 있고, 아직 필요 없는 확장 지점을 모두 만들 필요도 없습니다.",
    check: "새 도형을 추가해도 합계 계산 로직은 유지되나요?",
    code: solidExamples.O,
    codeNote: "Area 구현을 늘려도 measure의 호출 방식은 유지됩니다. 예시는 일반적인 크기의 도형을 가정합니다.",
  },
  {
    letter: "L", name: "리스코프 치환 원칙", english: "Liskov Substitution Principle",
    summary: "구현을 바꿔도 호출자가 기대하는 계약을 지킵니다.",
    detail: "문법적으로 상속할 수 있는 것과 안전하게 대체할 수 있는 것은 다릅니다. 입력 조건을 더 까다롭게 하거나 약속한 결과를 약하게 만들면 호출자가 깨질 수 있습니다.",
    caution: "Bird에 fly를 강제하면 날지 못하는 새가 계약을 지킬 수 없습니다. 원문의 새 예시는 비행 가능한 역할을 분리해 보완했습니다. 상속 이름보다 행동·실패 조건을 확인하세요.",
    check: "같은 계약 테스트를 모든 구현에 적용해도 통과하나요?",
    code: solidExamples.L,
    codeNote: "날 수 없는 객체를 타입 단계에서 제외합니다. 실제 시스템에서는 결과·예외·상태 불변식까지 계약 테스트로 확인합니다.",
  },
  {
    letter: "I", name: "인터페이스 분리 원칙", english: "Interface Segregation Principle",
    summary: "사용하지 않는 기능에 의존하도록 강요하지 않습니다.",
    detail: "인쇄만 필요한 호출자가 스캔과 팩스까지 알아야 할 이유는 없습니다. 클라이언트가 사용하는 역할로 계약을 나누면 불필요한 구현과 변경 영향을 줄입니다.",
    caution: "모든 메서드를 인터페이스 하나씩으로 쪼개라는 뜻은 아닙니다. 같은 호출자가 함께 사용하는 기능은 하나의 계약으로 묶어도 됩니다.",
    check: "지원하지 않는 기능을 빈 메서드나 예외로 때우고 있나요?",
    code: solidExamples.I,
    codeNote: "단순 프린터에는 scan이나 fax 메서드가 필요하지 않습니다. 복합기는 필요한 계약을 함께 구현합니다.",
  },
  {
    letter: "D", name: "의존성 역전 원칙", english: "Dependency Inversion Principle",
    summary: "상위 정책이 구체 기술 대신 추상 계약에 의존합니다.",
    detail: "주문 서비스가 특정 결제 업체의 클래스에 묶이면 업체 변경이 주문 로직에 전파됩니다. 주문 쪽에서 필요한 Payment 계약을 정의하고 결제 구현이 그 계약을 따르게 합니다.",
    caution: "DI는 의존 객체를 전달하는 기법이고 DIP는 의존 방향을 정하는 원칙입니다. 생성자로 구체 클래스를 전달했다고 자동으로 DIP가 되는 것은 아닙니다.",
    check: "외부 결제 없이 대체 구현으로 주문 정책을 테스트할 수 있나요?",
    code: solidExamples.D,
    codeNote: "실제 결제 업체 호출은 포함하지 않습니다. 구현 선택은 서비스 바깥의 조립 지점에서 담당합니다.",
  },
];

export default function SolidPrinciplesPage() {
  return <ReferencePage pageHref="/solid-principles" label="SOLID · 원칙 × 구조 × 코드" icon={BoxesIcon}
    description="원칙을 암기하는 대신 변경 이유, 의존 관계와 호출 계약을 함께 봅니다. 각 원칙을 설명·구조·Java 예제의 3열로 비교하고, 상단 Java API에서는 전략 교체의 실제 동작을 확인합니다."
    colorClass="border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/60 dark:bg-indigo-950/20">
    <nav aria-label="SOLID 원칙 바로가기" className="flex flex-wrap gap-2">
      {principles.map(p => <a key={p.letter} href={`#solid-${p.letter}`} className="rounded-lg border bg-card px-3 py-2 text-sm hover:bg-muted"><strong>{p.letter}</strong> · {p.name}</a>)}
    </nav>
    <p className="text-sm leading-6 text-muted-foreground">각 행을 왼쪽에서 오른쪽으로 읽으세요. 넓은 화면은 1행 3열, 좁은 화면은 설명 → 구조 → 코드 순서입니다. 다섯 원칙은 함께 적용할 수 있으며 클래스 수를 늘리는 것 자체가 목표는 아닙니다.</p>
    <div className="grid gap-5">
      {principles.map(p => <section key={p.letter} id={`solid-${p.letter}`} aria-labelledby={`title-${p.letter}`} className="min-w-0 scroll-mt-4 overflow-hidden rounded-xl border bg-card shadow-sm">
        <header className="flex items-center gap-3 border-b bg-muted/40 p-4">
          <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-3xl font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{p.letter}</span>
          <div className="min-w-0"><h2 id={`title-${p.letter}`} className="text-xl font-semibold">{p.name}</h2><p className="text-sm text-muted-foreground">{p.english}</p></div>
        </header>
        <div data-solid-row={p.letter} className="grid min-w-0 grid-cols-1 divide-y lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <div className="min-w-0 p-4 xl:p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300"><LightbulbIcon className="size-4" aria-hidden="true" />01 · 원칙 이해</h3>
            <p className="mt-4 text-lg font-semibold leading-7">{p.summary}</p><p className="mt-3 text-sm leading-7 text-muted-foreground">{p.detail}</p>
            <p className="mt-4 rounded-lg border bg-muted/40 p-3 text-sm leading-6"><strong>오해하지 않기</strong><br />{p.caution}</p>
          </div>
          <div className="min-w-0 p-4 xl:p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300"><GitBranchIcon className="size-4" aria-hidden="true" />02 · 구조로 보기</h3>
            <div className="mt-4"><LearningFlowCanvas title={p.name} graph={solidGraphs[p.letter]} height={480} /></div>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">위의 호출자·구현체에서 아래의 계약으로 읽습니다. 실선은 사용·의존, 점선은 implements입니다. 실행 순서가 아니라 코드의 관계를 보여 줍니다.</p>
            <p className="mt-3 text-sm leading-6"><strong>확인 질문</strong><br />{p.check}</p>
          </div>
          <div className="min-w-0 p-4 xl:p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300"><Code2Icon className="size-4" aria-hidden="true" />03 · Java 코드 예제</h3>
            <pre tabIndex={0} aria-label={`${p.name} Java 예제`} className="mt-4 max-w-full overflow-x-auto rounded-lg border bg-background p-3 text-xs leading-6 focus-visible:outline-2 focus-visible:outline-ring"><code>{p.code}</code></pre>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">{p.codeNote}</p>
          </div>
        </div>
      </section>)}
    </div>
    <section className="rounded-xl border bg-card p-5 text-sm leading-7">
      <h2 className="text-xl font-semibold">API 실습 · 전략을 바꾸면 무엇이 달라질까요?</h2>
      <p className="mt-3">상단 실습은 기존 Java 전략 패턴 API를 재사용합니다. 아래 Java 예제 코드를 직접 실행하거나 SOLID 전체를 자동 판정하는 기능은 아닙니다. 같은 discount 계약을 서로 다른 전략이 구현하는 부분을 관찰합니다.</p>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li>VIP·10000 입력: VipDiscountStrategy, 할인 2000, 최종 8000을 확인합니다. GOLD는 할인 1000, BASIC은 할인 100입니다.</li>
        <li>amount=-1은 HTTP 오류가 아니라 0으로 보정됩니다. grade 누락·공백·알 수 없는 등급은 기본 전략입니다. 현재 선택기는 vip·gold 문자열 포함 여부로 검사하므로 엄격한 등급 검증 API가 아닙니다.</li>
        <li>amount는 Java int 범위의 정수로 입력합니다. 2147483648처럼 범위를 넘기면 HTTP 400, 잘못된 JSON은 브라우저의 파싱 오류로 요청 전에 중단됩니다.</li>
      </ol>
      <p className="mt-3 break-words text-muted-foreground">브레이크포인트: pattern/strategy/StrategyPatternService.java의 run() → selectStrategy() → 각 discount(). 호출은 인터페이스를 사용하지만 새 등급의 선택 분기는 selectStrategy()를 수정해야 합니다. 따라서 프로젝트 전체가 변경 없이 확장된다거나 DIP를 완전히 구현했다고 해석하지 않습니다.</p>
    </section>
    <section className="rounded-xl border bg-card p-5 text-sm leading-7">
      <h2 className="text-xl font-semibold">출처와 다음 학습</h2>
      <p className="mt-3"><a href="https://www.instagram.com/reels/Db3_szLzmve/" className="underline" target="_blank" rel="noreferrer">learnwithdotnet · SOLID 원문</a>의 캡션과 화면에 표시된 5행 3열 자료를 확인했습니다. 원문의 C# 예제를 Java 21 학습 코드로 재구성했으며 영상 전체 전사는 아닙니다. 원문의 단순화된 LSP 예시는 비행 계약 분리와 계약 테스트 설명으로 보완했습니다.</p>
      <ul className="mt-3 space-y-2">
        <li><a className="underline" href="https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html">Robert C. Martin · 단일 책임의 변경 이유</a></li>
        <li><a className="underline" href="https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles">Microsoft · 책임 분리와 의존성 역전</a></li>
        <li><a className="underline" href="https://dev.java/learn/interfaces/">Java · 인터페이스 계약</a></li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-4 underline"><Link href="/oop-concepts">객체지향 개념</Link><Link href="/patterns/strategy">전략 패턴 실행</Link><Link href="/spring-bean-di">Spring DI·IoC</Link><Link href="/architecture">아키텍처 경계</Link></div>
    </section>
  </ReferencePage>;
}
