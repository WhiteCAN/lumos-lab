import Link from "next/link";
import { ListChecksIcon } from "lucide-react";
import { ReferencePage, CodeBlock, FlowSection } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/java/enums");
const cards = [
  [
    "문자열 대신 허용된 값",
    "MONDAY부터 SUNDAY까지 허용된 상수를 타입으로 제한합니다.",
    "문자열을 받는 HTTP 경계에서는 여전히 입력 검증과 변환 오류 처리가 필요합니다."
  ],
  [
    "값에 행동 붙이기",
    "enum은 생성자·필드·메서드를 가질 수 있습니다. 코드와 주말 판별을 한곳에 둡니다.",
    "생성자는 외부에서 호출할 수 없습니다. 공유 상수에 변경 가능한 요청 상태를 저장하지 않습니다."
  ],
  [
    "name과 valueOf",
    "name은 선언 이름, valueOf는 정확한 이름에서 상수를 찾습니다.",
    "monday· MONDAY ·UNKNOWN은 이 실습에서 400입니다. 자동 대문자화하지 않습니다."
  ],
  [
    "ordinal의 함정",
    "ordinal은 0부터 시작하는 선언 위치입니다.",
    "선언 순서를 바꾸면 숫자가 바뀝니다. DB·외부 계약에는 별도 안정적인 code와 마이그레이션 정책을 사용합니다."
  ],
  [
    "EnumSet · 중복 제거",
    "동일 enum의 집합을 만들고 선언 순서로 순회합니다.",
    "FRIDAY, MONDAY, FRIDAY 입력 결과는 MONDAY, FRIDAY입니다. 삽입 순서와 다릅니다."
  ],
  [
    "EnumMap · 개수 집계",
    "enum을 키로 사용하는 맵으로 요일별 등장 횟수를 셉니다.",
    "집합에서 사라진 중복이 counts에서는 FRIDAY=2로 남는지 확인합니다."
  ]
];
const scenarios = [
  "day=SATURDAY → ordinal=5·code=SAT·weekend=true.",
  "selectedDays=[FRIDAY,MONDAY,FRIDAY] → 집합 2개·counts의 FRIDAY=2.",
  "day=monday 또는 존재하지 않는 요일 → HTTP 400.",
  "선택 목록은 1~20개, 각 이름은 최대 12자. null·빈 목록도 400."
];
const related = [["/java/records","record와 값 비교"],["/java/collections","Java 컬렉션"]];
export default function Page() {
  return <ReferencePage pageHref="/java/enums" label="개념 · 흐름 · 실행 검증" description="요일을 실제 Java enum으로 변환하고 switch·EnumSet·EnumMap의 결과를 비교합니다." icon={ListChecksIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">

    <section className="grid gap-4 xl:grid-cols-3" aria-label="핵심 개념">{cards.map(([title, body, caution], index) => <article key={title} className="min-w-0 rounded-xl border bg-card p-5"><p className="text-sm font-medium text-sky-700 dark:text-sky-300">0{index + 1}</p><h2 className="mt-2 text-lg font-semibold [overflow-wrap:anywhere]">{title}</h2><p className="mt-3 text-sm leading-6">{body}</p><p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">{caution}</p></article>)}</section>
    <FlowSection title="대표 실행 흐름" steps={["문자열 입력 검증","Day.valueOf 변환","switch로 주말 판별","EnumSet·EnumMap 구성","선언 순서와 중복 비교"]} />
    <CodeBlock title="Java · 핵심 분기와 사용 예시" code={"enum Day {\n    MONDAY(\"MON\"), TUESDAY(\"TUE\"), WEDNESDAY(\"WED\"),\n    THURSDAY(\"THU\"), FRIDAY(\"FRI\"), SATURDAY(\"SAT\"), SUNDAY(\"SUN\");\n    private final String code;\n    Day(String code) { this.code = code; }\n    boolean weekend() {\n        return switch (this) {\n            case SATURDAY, SUNDAY -> true;\n            default -> false;\n        };\n    }\n}\nDay day = Day.valueOf(\"SATURDAY\"); // 실제 API도 같은 변환 사용\nEnumSet<Day> days = EnumSet.of(Day.FRIDAY, Day.MONDAY);\n// 순회: MONDAY, FRIDAY"} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">입력을 바꿔 확인하기</h2><ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-6 [overflow-wrap:anywhere]">{scenarios.map(item => <li key={item}>{item}</li>)}</ol></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 이어서 보기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">원문에서 확인한 주제를 학습용으로 재구성했습니다. 코드·실패 실험·설계 주의점은 프로젝트에서 보완한 내용입니다.</p><ul className="mt-3 space-y-2 text-sm"><li><a className="underline" href="https://www.instagram.com/reels/Dd8M1_yudIJ/">Instagram 원문</a></li><li><a className="underline" href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Enum.html">공식 문서 · 세부 계약 확인</a></li>{related.map(([href, title]) => <li key={href}><Link className="underline" href={href}>{title}</Link></li>)}</ul></section>
  </ReferencePage>;
}
