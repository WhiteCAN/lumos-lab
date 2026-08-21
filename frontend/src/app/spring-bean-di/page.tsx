import {
  CodeBlock,
  ComparisonTable,
  ConceptGrid,
  FlowSection,
  ReferencePage,
} from "@/components/reference-page";
import {
  BoxesIcon,
  ComponentIcon,
  GitBranchIcon,
  PackageCheckIcon,
  PlugZapIcon,
  WorkflowIcon,
} from "lucide-react";

const cards = [
  {
    title: "IoC",
    description: "객체 생성과 연결의 제어권을 개발자 코드가 아니라 Spring Container가 갖는 방식입니다.",
    bullets: ["new로 직접 조립하지 않음", "Container가 Bean 생명주기 관리", "설정과 교체가 쉬워짐"],
    colorClass: "border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20",
    icon: WorkflowIcon,
  },
  {
    title: "DI",
    description: "필요한 의존 객체를 외부에서 넣어주는 방식입니다.",
    bullets: ["생성자 주입 권장", "테스트 대역 주입 쉬움", "구현체 교체에 유리"],
    colorClass: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    icon: PlugZapIcon,
  },
  {
    title: "Bean",
    description: "Spring Container가 생성하고 관리하는 객체입니다.",
    bullets: ["@Component 계열로 등록", "@Bean 메서드로 등록 가능", "기본 scope는 singleton"],
    colorClass: "border-violet-200 bg-violet-50/50 dark:border-violet-900/60 dark:bg-violet-950/20",
    icon: BoxesIcon,
  },
];

const rows = [
  { topic: "@Controller", values: ["HTTP 요청 진입점", "요청/응답 변환", "SortController, RagController"] },
  { topic: "@Service", values: ["비즈니스 흐름", "트랜잭션, 알고리즘 실행", "SortService, RagService"] },
  { topic: "@Repository", values: ["DB 접근", "JPA 예외 변환", "TransactionLogRepository"] },
  { topic: "@Component", values: ["일반 Bean", "분류가 애매한 인프라 객체", "GrpcServerLifecycle"] },
  { topic: "@Configuration", values: ["Bean 설정", "외부 라이브러리 Bean 등록", "CorsConfig"] },
];

const code = `@Service
public class SortService {
    private final List<SortStrategy> strategies;

    public SortService(List<SortStrategy> strategies) {
        this.strategies = strategies;
    }
}`;

export default function SpringBeanDiPage() {
  return (
    <ReferencePage
      breadcrumb="Reference / Spring Bean DI"
      label="Spring 핵심"
      title="Bean, DI, IoC"
      description="Spring Boot 코드를 읽을 때 가장 먼저 잡아야 하는 객체 생성 방식입니다. Controller가 Service를 직접 만들지 않고 생성자로 주입받는 이유를 이해하면 프로젝트 흐름이 훨씬 또렷해집니다."
      icon={PackageCheckIcon}
      colorClass="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20"
    >
      <ConceptGrid items={cards} />
      <ComparisonTable columns={["역할", "주로 하는 일", "이 프로젝트 예시"]} rows={rows} />
      <FlowSection
        title="Bean 생성과 주입 흐름"
        steps={["Component Scan", "Bean 후보 발견", "생성자 의존성 확인", "필요 Bean 먼저 생성", "생성자 주입", "애플리케이션 실행"]}
        colorClass="border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20"
      />
      <section className="grid gap-4 xl:grid-cols-3">
        {[
          { title: "생성자 주입", text: "필수 의존성이 누락되면 애플리케이션 시작 시 바로 실패해서 문제를 빨리 찾을 수 있습니다.", icon: GitBranchIcon },
          { title: "싱글톤 Bean", text: "기본 Bean은 하나만 만들어 공유됩니다. 상태를 필드에 저장하는 서비스는 동시 요청에서 위험할 수 있습니다.", icon: ComponentIcon },
          { title: "인터페이스 주입", text: "여러 구현체가 있으면 List로 모두 받거나, @Qualifier로 특정 구현체를 고를 수 있습니다.", icon: PlugZapIcon },
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
      <CodeBlock title="생성자 주입 예시" code={code} />
    </ReferencePage>
  );
}
