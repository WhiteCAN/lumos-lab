import Link from "next/link";
import { BoxesIcon } from "lucide-react";
import { ReferencePage, ComparisonTable, FlowSection, CodeBlock } from "@/components/reference-page";

import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/oop-concepts");
const concepts = [
  ["Class · 클래스", "상태와 동작을 묶어 객체의 종류를 정의합니다.", "예: 주문의 항목·금액과 주문 취소 동작을 Order에 정의합니다."],
  ["Object · 객체", "클래스로 만든 구체적인 인스턴스입니다. 각 객체는 자신의 상태와 정체성을 가집니다.", "예: 같은 Order 클래스에서 만든 주문 A와 B는 서로 다른 주문입니다."],
  ["Encapsulation · 캡슐화", "상태 변경을 정해진 동작으로 통제해 객체가 지켜야 할 규칙을 보호합니다.", "예: 잔액을 직접 바꾸는 대신 출금 메서드에서 한도와 금액을 검사합니다."],
  ["Abstraction · 추상화", "사용자가 알아야 할 역할과 계약을 드러내고 불필요한 구현 세부를 숨깁니다.", "예: 결제 요청은 결제 수단별 내부 통신 방법을 몰라도 사용할 수 있습니다."],
  ["Inheritance · 상속", "기존 타입을 확장해 하위 타입을 정의합니다. 부모의 계약을 지키는 대체 관계인지 확인합니다.", "코드가 비슷하다는 이유만으로 상속하면 부모 변경이 자식에 전파될 수 있습니다."],
  ["Polymorphism · 다형성", "같은 호출 계약을 서로 다른 객체가 각자의 방식으로 수행합니다.", "Python에서는 공통 부모 없이 필요한 메서드를 제공하는 덕 타이핑으로도 활용합니다."],
  ["Method Overloading · 오버로딩", "같은 이름으로 서로 다른 인자 형태의 호출을 표현하는 개념입니다.", "Python에서 같은 이름의 def를 여러 번 쓰면 마지막 정의가 앞선 정의를 대체합니다. 기본 인자·가변 인자 등으로 처리할 수 있습니다."],
  ["Method Overriding · 오버라이딩", "하위 클래스가 상위 클래스의 메서드를 재정의해 동작을 바꿉니다.", "호출자가 기대하는 입력·결과·실패 조건을 지켜야 합니다. 필요한 부모 동작은 super()로 이어갈 수 있습니다."],
  ["Constructor · 생성과 초기화", "객체가 사용할 수 있는 상태를 갖도록 준비하는 단계입니다.", "Python은 __new__가 생성을, __init__가 초기화를 담당합니다. __init__를 생성 전체와 동일시하지 않습니다."],
  ["Destructor · 정리", "객체 수명 종료와 관련된 정리 개념입니다. 언어마다 실행 보장이 다릅니다.", "Python의 __del__ 호출 시점에 중요한 자원 반환을 맡기지 않습니다. del은 참조를 제거하며 즉시 소멸을 보장하지 않습니다. 파일은 with로 관리합니다."],
  ["Access Modifiers · 접근 범위", "외부에 공개할 계약과 내부 구현을 구분합니다.", "Python의 _name은 비공개 관례, __name은 이름 맹글링입니다. Java의 private·protected처럼 접근을 강제하는 제한자가 아닙니다."],
  ["Association · 연관", "객체들이 서로 알고 있거나 협력하는 일반적인 관계입니다.", "예: 학생이 도서관을 이용합니다. 연관만으로 소유권이나 수명이 결정되지는 않습니다."],
  ["Aggregation · 집합", "전체와 부분의 관계에서 부분이 독립적으로 존재할 수 있음을 표현합니다.", "예: 팀이 해체되어도 선수는 존재합니다. 실제 코드에서는 소유권 의도를 별도로 설명해야 합니다."],
  ["Composition · 합성", "강한 전체·부분 관계를 모델링하거나, 객체가 다른 객체에 일을 위임하도록 조립하는 설계에 쓰입니다.", "UML의 수명·소유권 의미와 넓은 의미의 객체 조립은 구분합니다. 참조를 필드에 넣는 것만으로 수명 규칙이 강제되지는 않습니다."],
  ["Inheritance vs Composition · 선택 기준", "진짜 하위 타입 관계면 상속을, 동작을 조립·교체하는 협력 관계면 합성을 검토합니다.", "상속 깊이를 늘리기 전에 위임으로 충분한지 살핍니다. 합성 역시 인터페이스와 연결 코드 비용이 있으므로 무조건 우월한 것은 아닙니다."],
];
const delegation = `class EmailSender:
    def send(self, message):
        return f"email: {message}"

class SmsSender:
    def send(self, message):
        return f"sms: {message}"

class Notifier:
    def __init__(self, sender):
        self.sender = sender

    def notify(self, message):
        return self.sender.send(message)

print(Notifier(EmailSender()).notify("주문 완료"))
print(Notifier(SmsSender()).notify("주문 완료"))`;

export default function OopConceptsPage() {
  return <ReferencePage pageHref="/oop-concepts" label="15개 개념 · Python 예제 · 설계 기준" description="객체의 책임과 협력 관계를 이해하고, 변경할 때 영향을 줄이는 구조를 선택하는 복습 노트입니다." icon={BoxesIcon} colorClass="border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/60 dark:bg-indigo-950/20">
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">네 가지 특징에서 객체 간 관계까지</h2><p className="mt-2 text-sm leading-6">CodeHive의 게시물은 클래스·객체, 캡슐화·추상화·상속·다형성과 객체 간 관계를 함께 다룹니다. 아래 예시와 주의점은 학습용 보완입니다. 언어 공통 설계 개념과 Python의 실제 문법·수명 규칙을 구분해서 읽어 주세요.</p></section>
    <section aria-label="객체지향 개념 15가지" className="grid gap-4 lg:grid-cols-3">{concepts.map(([name,body,note],i)=><article key={name} className="rounded-xl border bg-card p-5"><p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">CONCEPT {String(i+1).padStart(2,"0")}</p><h2 className="mt-2 text-lg font-semibold">{name}</h2><p className="mt-3 text-sm leading-6">{body}</p><p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">{note}</p></article>)}</section>
    <ComparisonTable columns={["중심 질문", "혼동하지 않기"]} rows={[
      {topic:"캡슐화 / 추상화",values:["변경을 어떻게 통제하나? / 어떤 역할을 노출하나?","필드를 숨기는 문법과 추상 클래스를 만드는 문법만으로 완성되지 않습니다."]},
      {topic:"오버로딩 / 오버라이딩",values:["호출 인자 형태를 달리하나? / 하위 타입에서 동작을 바꾸나?","Python의 typing.overload는 정적 타입 검사 도구를 위한 선언이며 런타임 구현을 자동 선택하지 않습니다."]},
      {topic:"연관 / 집합 / 합성",values:["협력하나? / 부분이 독립적인가? / 전체가 부분을 소유하나?","객체 참조만 보고 소유권을 단정하지 않고 도메인의 수명 규칙을 확인합니다."]},
    ]} />
    <section><h2 className="mb-3 text-xl font-semibold">동작을 바꾸는 두 가지 경로</h2><div className="grid gap-4 xl:grid-cols-2">
      <FlowSection orientation="vertical" title="상속 · 하위 타입에서 재정의" steps={[{label:"호출자가 공통 계약 사용",icon:"user"},{label:"하위 타입 객체 선택",icon:"branch"},{label:"오버라이딩 메서드 실행",icon:"code"},{label:"부모 계약에 맞는 결과",icon:"verify"}]} />
      <FlowSection orientation="vertical" title="합성 · 협력 객체에 위임" steps={[{label:"호출자가 알림 요청",icon:"user"},{label:"Notifier가 요청 수신",icon:"server"},{label:"주입된 sender에 위임",icon:"branch"},{label:"Email 또는 SMS 처리",icon:"done"}]} />
    </div></section>
    <CodeBlock title="Python · 협력 객체를 바꿔 알림 방식 교체" code={delegation} />
    <p className="text-sm leading-6 text-muted-foreground">이 예제는 넓은 의미의 객체 합성과 덕 타이핑입니다. Notifier가 sender의 생성을 독점하거나 수명을 소유하는 UML 합성을 강제하는 예제는 아닙니다. 실제 메일·문자를 전송하지 않고 문자열을 반환합니다.</p>
    <section className="grid gap-4 md:grid-cols-2"><article className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">원문을 읽을 때 보완할 점</h2><p className="mt-3 text-sm leading-6">Python에서 추상 계약을 명시적으로 강제하려면 ABC와 abstractmethod를 사용할 수 있습니다. 캡슐화는 이름 규칙뿐 아니라 유효성 검사와 공개 메서드의 계약으로 구현합니다. 자원 정리는 소멸자보다 명시적인 수명 관리가 중요합니다.</p></article><article className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">설계 점검 질문</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6"><li>이 객체가 책임지는 규칙은 무엇인가요?</li><li>상위 타입 자리에 넣어도 계약이 유지되나요?</li><li>구현을 교체할 때 수정해야 하는 곳은 어디인가요?</li><li>협력 객체의 생성·정리 책임은 누구에게 있나요?</li></ul></article></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 함께 읽기</h2><ul className="mt-3 space-y-2 text-sm">
      <li><a className="underline" href="https://www.instagram.com/reels/DdayDWbzAg2/">CodeHive · 15 Must-Know OOPs Concepts 원문</a></li>
      <li><a className="underline" href="https://docs.python.org/3/tutorial/classes.html">Python · 클래스와 비공개 이름 규칙</a></li>
      <li><a className="underline" href="https://docs.python.org/3/reference/datamodel.html">Python · 객체 생성·초기화·정리</a></li>
      <li><a className="underline" href="https://docs.python.org/3/library/typing.html#typing.overload">Python · overload의 의미</a></li>
      <li><a className="underline" href="https://docs.python.org/3/library/abc.html">Python · 추상 기반 클래스</a></li>
      <li><Link className="underline" href="/patterns/strategy">전략 패턴</Link></li>
      <li><Link className="underline" href="/spring-bean-di">Spring Bean·DI·IoC</Link></li>
    </ul></section>
  </ReferencePage>;
}
