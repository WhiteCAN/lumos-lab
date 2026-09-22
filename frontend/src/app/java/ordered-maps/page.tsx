import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { ReferencePage, ComparisonTable, FlowSection, CodeBlock } from "@/components/reference-page";
import { getStudyMetadata, getStudyPage } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/java/ordered-maps");
const sections = [
  [
    "같은 Map이라도 순서를 정하는 기준이 다릅니다",
    "TreeMap은 키의 자연 순서 또는 Comparator로 정렬합니다. LinkedHashMap은 기본적으로 삽입 순서를 유지하며, 접근 순서 모드를 선택할 수도 있습니다. 값의 크기순 정렬이 필요하다면 별도 정렬 기준이 필요합니다."
  ],
  [
    "공통 메서드부터 구분하기",
    "put은 키에 값을 연결하고 기존 값이 있으면 교체합니다. get과 remove의 null 결과만으로는 키가 없었는지 null 값이 있었는지 구분할 수 없어 containsKey를 함께 사용합니다. containsValue는 값 탐색이므로 두 구현 모두 일반적으로 O(n)입니다. size, isEmpty, clear로 크기 확인과 전체 삭제를 수행합니다."
  ],
  [
    "TreeMap의 경계 탐색",
    "lowerKey(k)는 k 미만, floorKey(k)는 k 이하 중 가장 큰 키입니다. higherKey(k)는 k 초과, ceilingKey(k)는 k 이상 중 가장 작은 키입니다. 대응하는 키가 없으면 null입니다. firstKey·lastKey는 빈 맵에서 예외를 던집니다. subMap은 기본적으로 복사본이 아닌 원본과 연결된 범위 뷰입니다."
  ],
  [
    "LinkedHashMap의 순서 변경",
    "기본 모드에서 기존 키의 put은 삽입 위치를 바꾸지 않습니다. accessOrder=true에서는 get 같은 접근으로 해당 항목이 뒤로 이동합니다. Java 21의 putFirst·putLast는 명시적으로 위치를 조정할 수 있습니다. 접근 순서만 설정한다고 용량 제한이나 자동 퇴출이 생기지는 않습니다."
  ],
  [
    "선택 전에 확인할 제약",
    "TreeMap에서 비교 결과가 0이면 같은 키로 취급하므로 비교 기준과 equals를 일관되게 설계합니다. 자연 순서에서는 null 키를 허용하지 않습니다. LinkedHashMap은 null 키·값을 허용합니다. 두 구현 모두 동기화된 컬렉션이 아니며 접근 순서 모드의 get도 순회를 변경할 수 있습니다."
  ]
];
const steps = [
  "키 정렬·범위 검색 필요 → TreeMap",
  "입력 순서 유지 필요 → LinkedHashMap",
  "최근 접근 순서 필요 → accessOrder=true",
  "동시 접근·퇴출 정책은 별도 검토"
];
const rows = [
  {
    "topic": "기본 순서",
    "values": [
      "키 비교 결과순",
      "삽입 순서"
    ]
  },
  {
    "topic": "get·put·remove",
    "values": [
      "O(log n) 보장",
      "해시가 적절히 분산되면 평균 O(1)"
    ]
  },
  {
    "topic": "containsValue",
    "values": [
      "일반적으로 O(n)",
      "일반적으로 O(n)"
    ]
  },
  {
    "topic": "주요 용도",
    "values": [
      "최솟값·최댓값·경계·범위 탐색",
      "입력 순서 출력·접근 순서 추적"
    ]
  }
];
const codes = [
  {
    "title": "Java 21 · 순서와 경계를 직접 확인",
    "code": "import java.util.*;\n\nclass OrderedMapsDemo {\n  public static void main(String[] args) {\n    var sorted = new TreeMap<Integer, String>();\n    var inserted = new LinkedHashMap<Integer, String>();\n    for (int key : new int[] {30, 10, 20}) {\n      sorted.put(key, \"v\" + key);\n      inserted.put(key, \"v\" + key);\n    }\n    System.out.println(sorted.keySet());   // [10, 20, 30]\n    System.out.println(inserted.keySet()); // [30, 10, 20]\n    System.out.println(sorted.lowerKey(20));   // 10\n    System.out.println(sorted.floorKey(20));   // 20\n    System.out.println(sorted.ceilingKey(25)); // 30\n    System.out.println(sorted.higherKey(30));  // null\n\n    var accessed = new LinkedHashMap<Integer, String>(16, 0.75f, true);\n    accessed.putAll(inserted);\n    accessed.get(30);\n    System.out.println(accessed.keySet()); // [10, 20, 30]\n  }\n}"
  }
];
const refs = [
  [
    "Oracle Java 21 · TreeMap",
    "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html"
  ],
  [
    "Oracle Java 21 · LinkedHashMap",
    "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedHashMap.html"
  ]
];
const related = [
  "/java/collections",
  "/java/concurrency"
];

export default function Page() {
  return (
<ReferencePage pageHref="/java/ordered-maps" label="개념 · 흐름 · 선택 기준" description="키 정렬, 삽입 순서, 접근 순서를 구분하고 탐색 메서드와 시간 복잡도를 비교합니다." icon={BookOpenIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">
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
  "TreeMap",
  "LinkedHashMap"
]} rows={rows} />
      {codes.map(({ title, code }) => <CodeBlock key={title} title={title} code={code} />)}
      <section className="rounded-xl border bg-card p-5 [overflow-wrap:anywhere]">
        <h2 className="text-lg font-semibold">출처와 함께 읽기</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">원문 이미지와 캡션을 한국어로 재구성하고 아래 공식 문서로 조건과 주의점을 보완했습니다. 예제와 흐름은 학습용으로 작성했으며 실제 서비스 호출을 수행하지 않습니다.</p>
        <a href="https://www.instagram.com/reels/Ddj0EUUv7cV/" className="mt-3 inline-block text-sm underline underline-offset-4">Instagram 원문</a>
        <ul className="mt-3 grid gap-2 text-sm">{refs.map(([title, href]) => <li key={href}><a href={href} className="underline underline-offset-4">{title}</a></li>)}</ul>
        <div className="mt-5 flex flex-wrap gap-3 border-t pt-4 text-sm">{related.map(href => <Link key={href} href={href} className="underline underline-offset-4">{getStudyPage(href).title}</Link>)}</div>
      </section>
    </ReferencePage>
  );
}
