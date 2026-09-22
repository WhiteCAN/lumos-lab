"use client";

import { useState } from "react";
import { ArrowDownIcon, BugIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import traces from "./traces.json";

const groups = [
  { title: "List", path: "Collection → SequencedCollection → List", note: "위치와 순서가 있고 중복을 허용합니다.", names: ["ArrayList", "LinkedList", "Vector", "Stack"], color: "border-rose-300 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20" },
  { title: "Set", path: "Collection → Set", note: "중복 없음. 순서 정책은 구현체마다 다릅니다.", names: ["HashSet", "LinkedHashSet", "TreeSet"], color: "border-amber-300 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20" },
  { title: "Queue / Deque", path: "Collection → Queue → Deque", note: "우선순위 큐 또는 양끝 삽입·제거입니다.", names: ["PriorityQueue", "ArrayDeque", "LinkedList"], color: "border-sky-300 bg-sky-50/50 dark:border-sky-900 dark:bg-sky-950/20" },
  { title: "Map", path: "Collection과 별도 계층", note: "키로 값을 찾습니다. 값은 중복될 수 있습니다.", names: ["HashMap", "LinkedHashMap", "TreeMap", "Hashtable", "ConcurrentHashMap"], color: "border-violet-300 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/20" },
];
const tips: Record<string, { structure: string; watch: string; method: string }> = {
  ArrayList: { structure: "동적 배열 · 조회 O(1), 중간 삽입/삭제 O(n)", watch: "list.size, list.elementData · add에서 grow와 배열 복사 확인", method: "arrayList" },
  LinkedList: { structure: "이중 연결 리스트 · 양끝 O(1), 인덱스 탐색 O(n)", watch: "list.first, list.last, Node.prev/next · node와 link/unlink 확인", method: "linkedList" },
  Vector: { structure: "동적 배열 · 개별 메서드 동기화 · 레거시", watch: "vector.elementCount, vector.elementData, vector.capacityIncrement · grow 확인", method: "vector" },
  Stack: { structure: "Vector 상속 · LIFO · 새 코드에는 Deque 권장", watch: "stack.elementCount, stack.elementData · push/pop 확인", method: "stack" },
  HashSet: { structure: "해시 기반 · 순서 미보장 · 적절한 해시 분산에서 평균 O(1)", watch: "set.map · HashMap.put과 hashCode/equals 확인", method: "set" },
  LinkedHashSet: { structure: "해시 + 연결 순서 · 삽입 순서 유지", watch: "set.map · LinkedHashMap의 head/tail 확인", method: "set" },
  TreeSet: { structure: "균형 트리 · 정렬 · 추가/조회/삭제 O(log n)", watch: "set.m · TreeMap의 root, 비교 결과가 0인 중복 확인", method: "set" },
  PriorityQueue: { structure: "힙 · offer/poll O(log n), peek O(1)", watch: "queue.queue, queue.size · siftUp/siftDown 확인", method: "priorityQueue" },
  ArrayDeque: { structure: "원형 배열 · 양끝 연산 분할 상환 O(1)", watch: "deque.elements, deque.head, deque.tail · 양끝 위치 확인", method: "deque" },
  HashMap: { structure: "해시 테이블 · 키 순서 미보장", watch: "map.table, map.size, map.threshold · putVal 확인", method: "map" },
  LinkedHashMap: { structure: "해시 + 연결 순서 · 기본값은 삽입 순서", watch: "map.head, map.tail · before/after 연결 확인", method: "map" },
  TreeMap: { structure: "균형 트리 · 키 정렬 · 주요 연산 O(log n)", watch: "map.root · 키 비교와 균형 조정 확인", method: "map" },
  Hashtable: { structure: "동기화된 레거시 해시 테이블 · null 불가", watch: "map.table, map.count · synchronized 메서드 확인", method: "map" },
  ConcurrentHashMap: { structure: "동시 접근용 Map · null 불가", watch: "map.table · putVal/putIfAbsent 확인. 이 단일 스레드 예제는 경합 실험이 아닙니다.", method: "map" },
};

export function CollectionDebugger() {
  const [selected, setSelected] = useState("ArrayList");
  // cursor=0은 초기 상태, 이후는 실행 완료한 호출 수입니다.
  const [cursor, setCursor] = useState(0);
  const scenario = traces.scenarios.find(item => item.name === selected)!;
  const tip = tips[selected];
  function select(name: string) { setSelected(name); setCursor(0); }

  return <>
    <section className="min-w-0 rounded-lg border bg-card p-4 shadow-sm" aria-labelledby="hierarchy-title">
      <h2 id="hierarchy-title" className="text-xl font-semibold">컬렉션 계층도</h2>
      <p className="mt-2 text-sm text-muted-foreground">원본의 분류를 Java 21 기준으로 보완했습니다. 구현체를 누르면 아래 디버깅 예제가 바뀝니다.</p>
      <div className="my-5 flex flex-col items-center gap-2 text-sm"><span className="rounded-lg border bg-muted px-6 py-2 font-mono">Iterable&lt;E&gt;</span><ArrowDownIcon className="size-4" /><span className="rounded-lg border bg-muted px-6 py-2 font-mono">Collection&lt;E&gt;</span></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {groups.map(group => <article key={group.title} className={`min-w-0 rounded-xl border p-4 ${group.color}`}>
          <div className="text-xs text-muted-foreground [overflow-wrap:anywhere]">{group.path}</div>
          <h3 className="mt-2 text-lg font-semibold">{group.title}</h3>
          <p className="mt-1 min-h-12 text-sm">{group.note}</p>
          <div className="mt-3 grid gap-2">{group.names.map(name => <button key={name} type="button" aria-pressed={selected === name} onClick={() => select(name)} className={`rounded-lg border px-3 py-2 text-left font-mono text-sm transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-ring ${selected === name ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}>{name}{name === "Stack" ? " ← Vector" : ""}</button>)}</div>
        </article>)}
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">분류 지도이며 모든 상속선을 표시한 UML은 아닙니다. Deque는 Queue와 SequencedCollection을 확장합니다. LinkedList는 List·Deque 양쪽에 속합니다. TreeSet은 NavigableSet → SortedSet → SequencedSet → Set 계층이며, LinkedHashSet도 SequencedSet을 구현합니다. TreeMap은 NavigableMap → SortedMap → SequencedMap → Map 계층, LinkedHashMap은 SequencedMap 구현체입니다. PriorityQueue는 Deque가 아닙니다.</p>
    </section>

    <section id="collection-debugger" className="min-w-0 rounded-lg border bg-card p-4 shadow-sm" aria-labelledby="debug-title">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="debug-title" className="flex items-center gap-2 text-xl font-semibold"><BugIcon className="size-5" />단계별 로직 확인</h2><span className="rounded-full border px-3 py-1 text-xs">Java {traces.javaVersion} 실제 실행 기록</span></div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">다음 단계를 누르면 한 호출의 실행 결과를 확인합니다. 브라우저는 저장된 Java 실행 기록을 재생합니다. 입력값 변경·중단점·JDK 내부 진입은 아래 Java 파일을 IDE에서 실행하세요.</p>
      <label htmlFor="debug-collection" className="mt-4 block text-sm font-medium">디버깅할 구현체</label>
      <select id="debug-collection" value={selected} onChange={event => select(event.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3 sm:max-w-sm">{traces.scenarios.map(s => <option key={s.name}>{s.name}</option>)}</select>
      <p className="mt-3 text-sm font-medium">{tip.structure}</p>
      <div className="my-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" disabled={cursor === 0} onClick={() => setCursor(c => c - 1)}><ChevronLeftIcon />이전</Button>
        <Button disabled={cursor === scenario.steps.length} onClick={() => setCursor(c => c + 1)}>다음 단계<ChevronRightIcon /></Button>
        <Button variant="outline" disabled={cursor === 0} onClick={() => setCursor(0)}><RotateCcwIcon />처음으로</Button>
        <span className="text-sm tabular-nums">{cursor} / {scenario.steps.length}</span>
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <div className="min-w-0 rounded-lg border bg-background p-3">
          <h3 className="mb-3 font-semibold">실행 코드 · 강조된 호출까지 실행 완료</h3>
          <pre className="min-h-80 overflow-auto text-xs leading-7"><code><span className={`block rounded px-2 ${cursor === 0 ? "bg-primary/10 font-bold" : ""}`}>{scenario.setup}</span>{scenario.steps.map((step, i) => <span key={i} aria-current={cursor === i + 1 ? "step" : undefined} className={`block rounded px-2 transition-colors motion-reduce:transition-none ${cursor === i + 1 ? "bg-primary text-primary-foreground" : ""}`}>{i + 1}. {step.code};</span>)}</code></pre>
        </div>
        <div className="min-w-0 rounded-lg border bg-background p-4" aria-live="polite" aria-atomic="true">
          <h3 className="font-semibold">변수와 반환값</h3>
          <div className="mt-3 grid">{[null, ...scenario.steps].map((frame, frameIndex) => <div key={frameIndex} aria-hidden={cursor !== frameIndex} className={`grid gap-3 ${cursor !== frameIndex ? "invisible" : ""}`} style={{ gridArea: "1 / 1" }}>
            <div><p className="text-xs text-muted-foreground">호출 전</p><p className="mt-1 min-h-12 rounded border p-3 font-mono text-sm [overflow-wrap:anywhere]">{frame?.before ?? scenario.steps[0].before}</p></div>
            <ArrowDownIcon className="mx-auto size-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">{frame ? "호출 후" : "초기 상태"}</p><p className="mt-1 min-h-12 rounded border border-primary/40 bg-primary/5 p-3 font-mono text-sm [overflow-wrap:anywhere]">{frame?.after ?? scenario.steps[0].before}</p></div>
            <p className="min-h-12 rounded border p-3 text-sm [overflow-wrap:anywhere]">반환값 / 예외: <strong>{frame?.result ?? "아직 호출하지 않았습니다"}</strong></p>
            <p className="min-h-24 text-sm leading-6">{frame?.note ?? "다음 단계로 이동하며 상태와 반환값을 비교하세요. 이전·처음으로는 원본 기록의 해당 위치로 돌아갑니다."}</p>
          </div>)}</div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">대괄호/중괄호는 toString()으로 관찰한 상태입니다. HashSet·HashMap 등의 표시 순서는 보장된 계약이 아니고 PriorityQueue의 순회 순서는 정렬 순서가 아닙니다. null 반환과 void를 구분해 보세요.</p>
    </section>

    <section className="min-w-0 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">IntelliJ에서 실제 JDK 내부 디버깅</h2><a href="/examples/CollectionsDebugLab.java" download className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"><DownloadIcon className="size-4" />Java 예제 다운로드</a></div>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6">
        <li>JDK 21 프로젝트의 소스 폴더에 파일을 넣고 <code>CollectionsDebugLab.main()</code>을 Debug로 실행합니다. 외부 라이브러리는 필요 없습니다.</li>
        <li>현재 선택한 <strong>{selected}</strong>는 <code>{tip.method}()</code>에 있습니다. <code>s.step(..., () -&gt; ...)</code> 안의 실제 컬렉션 호출에 중단점을 놓습니다. Set·Map 예제는 이름 인수로 구현체를 구분합니다.</li>
        <li>Step Over로 호출 전후를 비교하고 Step Into로 구현을 따라갑니다. 라이브러리 필터로 건너뛰면 Force Step Into를 사용하세요. JDK 소스가 연결되어 있어야 내부 코드가 보입니다.</li>
        <li>Variables에서 객체를 펼쳐 필드를 확인하세요. 컬렉션 렌더러가 원소만 보여주면 객체 필드 표시로 전환합니다. 내부 필드 이름은 JDK 버전에 따라 달라질 수 있습니다.</li>
      </ol>
      <p className="mt-4 rounded-lg border bg-muted/40 p-3 text-sm leading-6 [overflow-wrap:anywhere]"><strong>현재 관찰 포인트:</strong> {tip.watch}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <article className="rounded-lg border p-3"><h3 className="font-semibold">ArrayList 확장 직접 보기</h3><p className="mt-2 text-sm leading-6">초기화를 <code>new ArrayList&lt;Integer&gt;(2)</code>로 바꾸고 add를 3번 실행합니다. size와 elementData.length를 비교하세요. grow → 배열 복사를 확인하되 증가 비율은 API 보장 사항으로 외우지 않습니다.</p></article>
        <article className="rounded-lg border p-3"><h3 className="font-semibold">Vector와 나란히 보기</h3><p className="mt-2 text-sm leading-6">capacity 2 → 4와 trimToSize 후 변화를 관찰합니다. 생성자의 두 번째 인수를 3으로 바꾸면 고정 증가량 정책도 비교할 수 있습니다. synchronized가 붙어도 contains 후 add 전체가 자동 원자적이지는 않습니다.</p></article>
        <article className="rounded-lg border p-3"><h3 className="font-semibold">다른 구현체로 바꿔 보기</h3><p className="mt-2 text-sm leading-6">Set에 30, 10, 20, 10을 넣어 순서·중복을 비교하세요. PriorityQueue는 poll을 반복해 출력 순서를 확인하고, Map은 같은 키를 두 번 넣어 이전 값 반환을 확인하세요.</p></article>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">원본 계층도를 바탕으로 예제와 디버깅 설명을 추가했습니다. 아래 기존 API 실습에서는 사용자가 입력한 값으로 서버 실행 결과도 확인할 수 있습니다.</p>
      <div className="mt-3 flex flex-wrap gap-4 text-sm underline"><a href="https://www.instagram.com/reels/DdWtkC_NWnE/" target="_blank" rel="noreferrer">원본 · InterviewEdge</a><a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/package-summary.html" target="_blank" rel="noreferrer">Java 21 컬렉션 문서</a><a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Vector.html" target="_blank" rel="noreferrer">Vector</a><a href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayList.html" target="_blank" rel="noreferrer">ArrayList</a></div>
    </section>
  </>;
}
