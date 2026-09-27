import { LearningFlowCanvas } from "@/components/learning-flow-canvas";
import { referenceGraphs } from "@/components/learning-diagram-data";
import { LayersIcon } from "lucide-react";
import { CodeBlock, ComparisonTable, ReferencePage } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/java/stack-heap");

export default function StackHeapPage() {
  return (
    <ReferencePage pageHref="/java/stack-heap" label="Java 참조와 메모리" icon={LayersIcon}
      colorClass="bg-orange-50/60 dark:bg-orange-950/20"
      description="메서드의 지역 참조와 그 참조가 가리키는 객체를 구분합니다. 실제 Java API로 객체 수정과 지역 참조 재할당의 차이를 확인합니다.">
      <section className="rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">p와 new Person()은 같은 것이 아닙니다</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">지역 변수 p는 객체를 가리키는 참조 값을 담습니다. Person 객체에는 age 같은 필드가 있습니다. 다른 메서드에 p를 전달하면 참조 값이 복사됩니다. 복사된 참조로 객체를 수정하는 것과, 그 지역 참조에 새 객체를 대입하는 것은 결과가 다릅니다.</p>
        <div className="mt-4"><LearningFlowCanvas title="지역 참조와 힙 객체" graph={referenceGraphs["stack-heap"]} /></div>

      </section>
      <ComparisonTable columns={["JVM 스택", "힙"]} rows={[
        { topic: "주요 역할", values: ["스레드별 호출 프레임: 지역 변수 배열·피연산자 스택 등", "클래스 인스턴스와 배열을 위한 런타임 영역"] },
        { topic: "수명", values: ["호출 시 프레임 생성, 메서드 완료 시 제거", "메서드 종료와 객체 수명은 같지 않음. 다른 참조가 남을 수 있음"] },
        { topic: "오류 관점", values: ["허용한 스택보다 깊은 호출은 StackOverflowError 가능", "필요한 객체 공간을 확보할 수 없으면 OutOfMemoryError 가능"] },
      ]} />
      <CodeBlock title="객체 수정과 참조 재할당 비교" code={`Person p = new Person(20);
change(p);            // 참조 값의 복사
System.out.println(p.age);

void change(Person local) {
    local.age = 30;   // 같은 객체 수정: 호출자에게 30이 보임
    // 위 줄 대신 다음 줄만 실행하면 호출자의 값은 20
    // local = new Person(30);
}`} />
      <section className="rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">실습에서 확인할 순서</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7">
          <li>위 API 패널에서 initialAge=20, nextAge=30, reassign=false로 실행합니다. callerAgeAfter=30, sameReferenceBeforeReturn=true를 확인합니다.</li>
          <li>reassign=true로 바꾸면 callerAgeAfter=20, calleeAgeBeforeReturn=30이 됩니다. sameReferenceBeforeReturn=false는 실제 Java == 비교 결과입니다.</li>
          <li>nextAge를 151로 바꾸면 HTTP 400 검증 오류가 발생합니다. 나이는 0~150의 정수로 입력하세요. 필드 누락·null도 거부합니다.</li>
          <li>steps의 마지막 localAge는 메서드 종료 후 살아 있는 지역 변수가 아니라 반환 직전 저장한 관찰값입니다.</li>
        </ol>
        <p className="mt-4 break-words text-sm leading-7 text-muted-foreground">디버깅: backend/src/main/java/com/lumos/lab/stackheap/StackHeapService.java의 run() → change()에서 local.age 대입과 local = new Person(...)에 브레이크포인트를 둡니다. 호출 스택·p·original·local을 함께 살펴보세요. API는 실제 Java 메서드를 실행하지만 GC 강제 실행, 메모리 주소, 할당량, OOM·무한 재귀는 재현하지 않습니다.</p>
      </section>
      <section className="rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">면접에서 피할 단정</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
          <li>“기본형은 무조건 스택”이라고 말하지 않습니다. 객체의 int 필드는 그 객체의 상태입니다.</li>
          <li>“메서드가 끝나면 객체도 즉시 삭제”가 아닙니다. 다른 참조와 도달 가능성을 살펴야 하며 회수 시점은 보장되지 않습니다.</li>
          <li>JVMS는 추상 실행 모델입니다. 실제 프레임 배치·최적화·GC 방식은 구현에 달려 있어 개념도만으로 물리 위치를 단정하지 않습니다.</li>
          <li>자료구조의 Heap/PriorityQueue와 JVM 힙 메모리는 서로 다른 주제입니다.</li>
        </ul>
      </section>
      <section className="rounded-lg border bg-card p-5 text-sm leading-7">
        <h2 className="text-lg font-semibold">출처와 보완 범위</h2>
        <p className="mt-3"><a className="underline" href="https://www.instagram.com/reels/DdweGPXuI0y/" target="_blank" rel="noreferrer">@http.code.404 · Stack vs Heap 원문</a>의 확인 가능한 캡션 주제를 출발점으로 참조·객체 구분과 실습을 새로 작성했습니다. 영상 전체의 자막을 전사한 페이지는 아닙니다.</p>
        <p className="mt-2"><a className="underline" href="https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html#jvms-2.5" target="_blank" rel="noreferrer">Java 21 JVMS §2.5 런타임 영역</a>과 <a className="underline" href="https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html#jvms-2.6" target="_blank" rel="noreferrer">§2.6 프레임</a>을 바탕으로 구현 의존성과 프레임의 의미를 보완했습니다.</p>
      </section>
    </ReferencePage>
  );
}
