import Link from "next/link";
import { BracesIcon } from "lucide-react";
import { ReferencePage, ComparisonTable, CodeBlock, FlowSection } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";
export const metadata = getStudyMetadata("/java/records");
export default function RecordsPage() {
  return <ReferencePage pageHref="/java/records" label="Java 21 · 데이터 운반 객체" icon={BracesIcon} colorClass="bg-orange-50/50 dark:bg-orange-950/20" description="record는 데이터 구성 요소를 선언해 생성자·접근자·값 비교 메서드를 간결하게 표현합니다. final 필드와 깊은 불변성을 구분하는 것이 핵심입니다.">
    <FlowSection title="얕은 불변성을 확인하는 순서" steps={["같은 값으로 두 record 생성", "equals=true / 참조는 다름", "원본 List 변경", "방어적 복사 여부에 따라 결과 분기"]} />
    <ComparisonTable columns={["제공하거나 허용하는 것", "주의할 점"]} rows={[
      {topic:"자동 멤버",values:["정규 생성자, name() 형태 접근자, equals·hashCode·toString", "getName()이 자동 생성되는 JavaBean 규칙과 다름"]},
      {topic:"타입과 필드",values:["암묵적 final 클래스와 구성 요소의 private final 필드", "참조 대상의 내부 상태까지 불변으로 만들지 않음"]},
      {topic:"확장",values:["인터페이스 구현·정적 멤버·사용자 메서드", "다른 클래스 상속·추가 인스턴스 필드는 불가"]},
      {topic:"활용",values:["DTO·응답·값 운반 객체", "가변 도메인 객체나 모든 ORM 엔티티의 대체재는 아님"]},
    ]} />
    <CodeBlock title="Java · compact constructor로 입력 정규화와 방어적 복사" code={`public record Profile(String name, List<String> tags) {
    public Profile {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("이름이 필요합니다.");
        }
        name = name.trim();
        tags = List.copyOf(tags);
    }
}
// List<String>의 String은 불변. 가변 원소라면 원소 복사도 별도 설계.
// 구성 요소가 배열이면 기본 equals는 배열의 내용 비교가 아니다.`} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-xl font-semibold">실습 순서와 원문 보완</h2><p className="mt-3 text-sm leading-7">defensiveCopy=false로 실행하면 원본 목록에 append를 추가한 뒤 first의 tags도 바뀌고 equalAfter=false가 됩니다. true로 바꾸면 원본을 변경해도 record가 보유한 목록은 유지됩니다. 두 경우 모두 sameReference=false이며 생성 직후 equalBefore=true입니다. tags=null이나 빈 이름은 HTTP 400입니다.</p><p className="mt-3 text-sm leading-7">원문 도표의 ‘immutable and thread-safe’는 가변 구성 요소가 없다는 추가 조건 없이 보장할 수 없습니다. record의 값 비교는 같은 record 타입과 구성 요소 비교를 따릅니다. 가변 값을 해시 키로 쓰면 변경 후 조회가 깨질 수 있으므로 값의 수명 전체를 검토하세요.</p><div className="mt-4 flex flex-wrap gap-4 text-sm underline"><Link href="/dto-entity-vo">DTO·Entity·VO 비교</Link><a href="https://www.instagram.com/reels/Dd0CLw2KZGL/">4번 원문 · 도표 확인</a><a href="https://docs.oracle.com/en/java/javase/21/language/records.html">Java 21 Record 문서</a></div></section>
  </ReferencePage>;
}
