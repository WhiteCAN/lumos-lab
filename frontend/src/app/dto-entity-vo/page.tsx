import {
  CodeBlock,
  ComparisonTable,
  ConceptGrid,
  FlowSection,
  ReferencePage,
} from "@/components/reference-page";
import {
  BoxesIcon,
  DatabaseIcon,
  FileJsonIcon,
  Layers3Icon,
  PackageIcon,
  ScaleIcon,
} from "lucide-react";

import { getStudyMetadata } from "@/lib/study-pages";

const cards = [
  {
    title: "DTO",
    description: "계층 사이로 데이터를 옮기기 위한 객체입니다.",
    bullets: ["Request/Response 모양을 고정", "검증 annotation과 잘 맞음", "Entity 노출을 막음"],
    colorClass: "border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20",
    icon: FileJsonIcon,
  },
  {
    title: "Entity",
    description: "식별자와 생명주기를 가진 도메인 또는 DB 매핑 객체입니다.",
    bullets: ["id로 동일성 판단", "JPA @Entity로 저장 가능", "비즈니스 규칙을 담을 수 있음"],
    colorClass: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    icon: DatabaseIcon,
  },
  {
    title: "VO",
    description: "값 자체가 의미이고 불변으로 다루는 객체입니다.",
    bullets: ["id보다 값으로 비교", "Money, Email, Period", "검증 규칙을 한 곳에 모음"],
    colorClass: "border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20",
    icon: ScaleIcon,
  },
];

const rows = [
  { topic: "목적", values: ["데이터 전달", "상태와 생명주기", "값 표현"] },
  { topic: "동일성", values: ["필드가 같아도 별 의미 없음", "id가 같으면 같은 객체", "값이 같으면 같은 값"] },
  { topic: "위치", values: ["presentation/application", "domain 또는 persistence", "domain"] },
  { topic: "예시", values: ["SortRequest, RagAnswerResponse", "TransactionLog", "Money, EmailAddress"] },
];

const code = `public record CreateOrderRequest(
        Long productId,
        int quantity
) {}

@Entity
public class Order {
    @Id
    private Long id;
    private OrderStatus status;
}

public record Money(long amount) {
    public Money {
        if (amount < 0) {
            throw new IllegalArgumentException("금액은 음수일 수 없습니다.");
        }
    }
}`;

export default function DtoEntityVoPage() {
  return (
    <ReferencePage pageHref="/dto-entity-vo"
      label="객체 모델링"
      description="Spring 프로젝트에서 Request record, JPA Entity, 도메인 값 객체가 섞이기 쉽습니다. 각 객체가 맡는 책임을 분리하면 API와 DB 변경에 덜 흔들립니다."
      icon={BoxesIcon}
      colorClass="border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20"
    >
      <ConceptGrid items={cards} />
      <ComparisonTable columns={["DTO", "Entity", "VO"]} rows={rows} />
      <FlowSection
        title="Controller에서 DB까지 변환 흐름"
        steps={["Request DTO", "Application Command", "Domain Entity", "VO 검증", "JPA Entity", "Response DTO"]}
        colorClass="border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20"
      />
      <section className="grid gap-4 xl:grid-cols-3">
        {[
          { title: "Entity 직접 응답 금지", text: "DB 컬럼과 API 스펙이 강하게 묶이고 lazy loading, 민감 필드 노출 문제가 생길 수 있습니다.", icon: Layers3Icon },
          { title: "record 활용", text: "DTO와 간단한 VO는 불변 record로 만들면 전달 객체라는 의도가 잘 드러납니다.", icon: PackageIcon },
          { title: "VO의 힘", text: "Email, Money 같은 규칙을 primitive 대신 VO에 넣으면 검증 로직이 흩어지지 않습니다.", icon: ScaleIcon },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-lg border bg-card p-4 shadow-sm">
              <Icon className="size-5 text-muted-foreground" />
              <h2 className="mt-3 font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          );
        })}
      </section>
      <CodeBlock title="간단한 예시" code={code} />
    </ReferencePage>
  );
}

export const metadata = getStudyMetadata("/dto-entity-vo");
