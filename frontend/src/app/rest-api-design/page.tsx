import {
  CodeBlock,
  ComparisonTable,
  ConceptGrid,
  FlowSection,
  ReferencePage,
} from "@/components/reference-page";
import {
  FilterIcon,
  Globe2Icon,
  ListFilterIcon,
  RouteIcon,
  Rows3Icon,
  SendIcon,
} from "lucide-react";

const cards = [
  {
    title: "Resource 중심 URI",
    description: "URI는 동사가 아니라 리소스 이름을 표현합니다.",
    bullets: ["GET /orders", "POST /orders", "DELETE /orders/{id}"],
    colorClass: "border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20",
    icon: RouteIcon,
  },
  {
    title: "HTTP Method",
    description: "무엇을 할지는 메서드로 표현합니다.",
    bullets: ["GET 조회", "POST 생성/명령", "PUT/PATCH 수정"],
    colorClass: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    icon: SendIcon,
  },
  {
    title: "Query와 Body",
    description: "조회 조건은 query, 생성/수정 데이터는 body에 두는 편이 자연스럽습니다.",
    bullets: ["?page=0&size=20", "?status=PAID", "POST body에 command 데이터"],
    colorClass: "border-violet-200 bg-violet-50/50 dark:border-violet-900/60 dark:bg-violet-950/20",
    icon: FilterIcon,
  },
];

const rows = [
  { topic: "Path Variable", values: ["특정 리소스 식별", "/orders/{orderId}", "id, slug"] },
  { topic: "Query Param", values: ["조회 조건", "/orders?status=PAID&page=0", "filter, sorting, pagination"] },
  { topic: "Request Body", values: ["복잡한 입력", "POST /orders", "생성/수정 command"] },
  { topic: "Header", values: ["요청 메타데이터", "Authorization, Idempotency-Key", "인증, 추적, 멱등성"] },
];

const code = `GET    /api/rag/documents
POST   /api/rag/documents
DELETE /api/rag/documents
POST   /api/rag/vector-search
POST   /api/rag/ask

GET    /api/orders?status=PAID&page=0&size=20
GET    /api/orders/{orderId}
PATCH  /api/orders/{orderId}/shipping-address`;

export default function RestApiDesignPage() {
  return (
    <ReferencePage
      breadcrumb="Reference / REST API Design"
      label="API 설계"
      title="REST API 설계 규칙"
      description="REST API는 URI, HTTP method, status code, request/response DTO의 약속입니다. 일관된 규칙을 정해두면 프론트와 백엔드가 덜 헷갈립니다."
      icon={Globe2Icon}
      colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20"
    >
      <ConceptGrid items={cards} />
      <ComparisonTable columns={["용도", "예시", "주로 담는 값"]} rows={rows} />
      <FlowSection
        title="목록 조회 API 설계 흐름"
        steps={["리소스 이름", "필터 query", "정렬 sort", "페이징 page/size", "응답 DTO", "상태코드"]}
        colorClass="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20"
      />
      <section className="grid gap-4 xl:grid-cols-3">
        {[
          { title: "Pagination", text: "목록 API는 처음부터 page, size, sort를 고려하면 데이터가 늘어도 화면이 버티기 쉽습니다.", icon: Rows3Icon },
          { title: "Filtering", text: "복잡한 검색 조건은 query param으로 시작하고, 너무 커지면 검색 전용 POST API로 분리할 수 있습니다.", icon: ListFilterIcon },
          { title: "Idempotency", text: "결제나 주문 생성처럼 중복 요청이 위험하면 Idempotency-Key 헤더를 고려합니다.", icon: SendIcon },
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
      <CodeBlock title="URI 설계 예시" code={code} />
    </ReferencePage>
  );
}
