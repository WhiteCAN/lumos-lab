import Link from "next/link";
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
  { topic: "@Service", values: ["비즈니스 흐름", "역할 표시. 자체적으로 트랜잭션을 켜지는 않음", "SortService, RagService"] },
  { topic: "@Repository", values: ["DB 접근", "예외 변환 인프라와 함께 데이터 접근 예외 변환 대상이 됨", "TransactionLogRepository"] },
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

const coreNotes = [
  { title: "@SpringBootApplication의 구성", text: "@SpringBootConfiguration, @EnableAutoConfiguration, @ComponentScan을 결합합니다. 기본 컴포넌트 탐색은 애플리케이션 클래스의 패키지와 하위 패키지입니다. 엔티티·Spring Data Repository 탐색은 별도 설정이므로 컴포넌트 스캔 범위 변경만으로 모두 해결되지는 않습니다." },
  { title: "자동 구성은 조건부 등록", text: "Starter는 필요한 의존성을 묶고, 자동 구성은 클래스패스·설정값·기존 Bean·웹 환경 조건을 평가해 Bean 정의를 등록합니다. @ConditionalOnClass, @ConditionalOnMissingBean, @ConditionalOnProperty 등이 쓰입니다. 라이브러리를 추가했다고 모든 기능이 활성화되는 것은 아닙니다." },
  { title: "사용자 Bean과 back-off", text: "예를 들어 사용자 DataSource가 있으면 기본 DataSource 구성이 물러날 수 있습니다. 이는 MissingBean 같은 조건에 따른 동작이지 사용자 설정이 모든 자동 구성을 무조건 덮어쓴다는 뜻은 아닙니다. --debug의 조건 평가 보고서에서 적용·미적용 이유를 확인합니다." },
  { title: "자동 구성 후보를 어디서 읽나?", text: "현대 Spring Boot의 자동 구성 후보 등록은 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports를 사용합니다. 과거 spring.factories 기반 자동 구성 등록 설명과 구분합니다. 자동 구성 클래스는 일반 컴포넌트 스캔으로 무작정 찾는 것이 아닙니다." },
];

const traps = [
  ["주입 필드가 null", "new로 직접 만든 객체인지, 스캔 범위와 Bean 등록이 맞는지, static 필드에 주입하려는지 확인합니다. 필수 생성자 주입이 실패하면 보통 시작 단계에서 오류가 납니다. DI 자체는 Spring 없이도 생성자로 구현할 수 있습니다."],
  ["같은 타입의 Bean이 여러 개", "단일 주입에서는 @Qualifier로 후보를 좁히거나 @Primary로 우선 후보를 지정합니다. List<T> 주입은 여러 구현체를 받는 별도 의도입니다. 애매한 의존성을 이름 우연에 맡기지 않습니다."],
  ["@Transactional이 안 먹음", "Spring Bean과 트랜잭션 인프라 여부, 프록시를 통과하는 외부 호출인지, 메서드·프록시 방식, 예외 처리와 rollback 규칙을 확인합니다. 기본적으로 RuntimeException·Error는 롤백 대상이고 checked exception은 별도 규칙이 필요합니다."],
  ["public이 아니면 항상 트랜잭션 불가?", "그렇게 단정할 수 없습니다. Spring 6+의 클래스 기반 프록시는 기본적으로 protected·package-visible 메서드도 지원할 수 있습니다. 인터페이스 프록시는 공개 인터페이스 메서드가 필요하고, private 메서드는 프록시 advice 대상이 아닙니다."],
  ["@Async / @Cacheable이 안 먹음", "각 기능 활성화 설정, 실행기·캐시 관리자, 외부 프록시 호출을 확인합니다. 캐시는 키·조건을, 비동기는 예외 관찰 방식을 함께 확인합니다. 애너테이션 하나만 붙여 모든 인프라가 준비되지는 않습니다."],
  ["순환 의존성", "A 생성자가 B를, B 생성자가 A를 요구하면 조립할 수 없습니다. 책임 분리로 순환을 끊는 것이 우선입니다. setter나 @Lazy는 설계 해결책이 아니며, 설정과 의존 관계에 따라 여전히 실패할 수 있습니다."],
  ["싱글톤이면 스레드 안전?", "singleton은 컨테이너 안에서 Bean 정의당 인스턴스를 공유한다는 뜻입니다. 동시성 안전을 보장하지 않습니다. 요청별 변경 상태는 공유 필드에 두지 않고, 상태 공유가 필요하면 동기화 전략을 설계합니다."],
  ["@Lazy면 절대 시작 시 생성되지 않음?", "지연 생성 대상이라도 eager singleton의 의존성을 충족하려고 시작 시 생성될 수 있습니다. Bean 정의의 지연 초기화와 주입 지점의 지연 프록시를 구분합니다."],
];

const proxyExample = `// 프록시 기반 트랜잭션을 가정한 설명용 코드
@Service
class OrderService {
    public void checkout() {
        this.save(); // 프록시를 우회: save의 advice는 새로 실행되지 않음
    }
    @Transactional
    public void save() { /* 저장 */ }
}

// 개선 방향: 저장 책임을 별도 Bean으로 분리
// OrderFacade -> 주입받은 OrderWriter 프록시 -> @Transactional save()
// 단, 바깥 메서드에서 이미 시작한 트랜잭션이 있다면
// 내부 호출도 그 트랜잭션 안에서 실행될 수 있음`;

export default function SpringBeanDiPage() {
  return (
    <ReferencePage
      breadcrumb="Reference / Spring Bean DI"
      label="Spring 핵심"
      title="Spring Boot 핵심 · Bean, DI, IoC"
      description="객체 생성과 주입부터 시작 흐름, Bean 생명주기, 자동 구성, AOP 프록시까지 연결해 봅니다. 기존 Bean·DI 설명에 Spring Boot Core 게시물 10장의 내용을 보강한 정적 레퍼런스입니다."
      icon={PackageCheckIcon}
      brand="spring"
      colorClass="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20"
    >
      <ConceptGrid items={cards} />
      <ComparisonTable columns={["역할", "주로 하는 일", "이 프로젝트 예시"]} rows={rows} />
      <FlowSection
        title="Bean 생성과 주입 흐름"
        steps={[{ label: "Component Scan", icon: "spring" }, { label: "Bean 후보 발견", icon: "search" }, { label: "생성자 의존성 확인", icon: "branch" }, { label: "필요 Bean 먼저 생성", icon: "code" }, { label: "생성자 주입", icon: "spring" }, { label: "애플리케이션 실행", icon: "server" }]}
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
      <FlowSection title="Spring Boot 시작 흐름 · 개념 지도" steps={["SpringApplication.run", "Environment 준비", "ApplicationContext 생성", "설정·Bean 정의 처리", "컨텍스트 refresh", "Runner 실행", "ApplicationReadyEvent"]} colorClass="bg-card" />
      <section className="rounded-lg border bg-card p-4 text-sm leading-6">
        <h2 className="text-lg font-semibold">시작 흐름을 읽을 때 주의할 점</h2>
        <p className="mt-2 text-muted-foreground">run()은 ConfigurableApplicationContext를 반환합니다. refresh 안에서 설정 클래스 처리, 자동 구성, 후처리기 등록, 일반 singleton 생성·초기화와 웹 서버 생명주기 작업이 진행됩니다. 위 흐름은 내부 메서드의 엄밀한 일대일 순서표가 아닙니다. 모든 Bean이 생성된 뒤에만 서버를 만든다고 단순화하지 않습니다. 웹 애플리케이션이 아니면 내장 웹 서버도 필요하지 않습니다.</p>
        <p className="mt-2 text-muted-foreground">ApplicationRunner·CommandLineRunner는 컨텍스트 초기화 후 실행되며, 정상 완료 뒤 ApplicationReadyEvent가 발행됩니다. Ready 이벤트가 외부 서비스까지 모두 정상임을 보증하는 것은 아닙니다.</p>
      </section>
      <section className="grid gap-4 [overflow-wrap:anywhere] lg:grid-cols-2" aria-label="자동 구성 핵심">
        {coreNotes.map((item) => <article key={item.title} className="rounded-lg border bg-card p-4"><h2 className="text-lg font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p></article>)}
      </section>
      <FlowSection title="일반적인 Bean 생명주기" steps={["생성자 의존성 해결·인스턴스 생성", "필드·setter 주입", "Aware 콜백", "초기화 전 후처리", "초기화 콜백", "초기화 후 후처리·프록시", "사용", "컨텍스트 종료·소멸"]} colorClass="bg-card" />
      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">초기화·소멸과 후처리기</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
          <li>생성자 주입은 객체 생성 시점에 일어납니다. 생성 완료 후 생성자 의존성을 다시 넣는 단계가 있는 것은 아닙니다.</li>
          <li>@PostConstruct는 BeanPostProcessor의 초기화 전 처리 과정에서 호출됩니다. 서로 다른 메서드로 설정했다면 @PostConstruct → afterPropertiesSet → 사용자 init-method 순입니다.</li>
          <li>BeanFactoryPostProcessor는 Bean 정의를, BeanPostProcessor는 Bean 인스턴스를 다룹니다. AOP 프록시는 보통 초기화 후 후처리에서 노출되지만 모든 프록시가 동일 시점에 만들어진다고 단정하지 않습니다.</li>
          <li>초기화 콜백 안에서 자기 @Transactional 메서드를 불러도 외부 프록시 호출이 아닙니다. 초기화 완료 전 프록시 동작에 의존하지 않습니다.</li>
          <li>정상 종료 시 @PreDestroy 등으로 자원을 정리합니다. prototype Bean의 소멸은 컨테이너가 자동 관리하지 않으며 강제 프로세스 종료에서도 콜백 실행을 보장할 수 없습니다.</li>
        </ul>
      </section>
      <FlowSection title="AOP는 호출 경계가 중요" steps={["외부 호출자", "Spring 프록시", "트랜잭션·캐시 등 advice", "대상 Bean 메서드"]} colorClass="bg-card" />
      <CodeBlock title="Self-invocation · 내부 호출 함정" code={proxyExample} />
      <p className="rounded-lg border bg-card p-4 text-sm leading-6 text-muted-foreground">JDK 동적 프록시는 인터페이스 기반, CGLIB는 상속 기반입니다. CGLIB는 final 클래스·final 메서드·private 메서드에 제약이 있습니다. 인터페이스 유무만 보고 실제 방식을 단정하지 말고 Spring Boot의 프록시 설정을 확인합니다. 이 설명은 프록시 모드 기준이며 AspectJ weaving과는 다릅니다.</p>
      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-xl font-semibold">면접 질문을 운영 점검 순서로 바꾸기</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">{traps.map(([title, text]) => <article key={title} className="rounded-lg border p-4"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div>
        <p className="mt-4 text-sm leading-6">Bean 등록 → 주입 후보 → 초기화 → 프록시 경계 → 기능 설정 → 실제 호출 결과 순으로 좁혀 봅니다. <Link className="underline underline-offset-4" href="/transactional">트랜잭션 실험실</Link>과 <Link className="underline underline-offset-4" href="/sync-async">동기/비동기 실험실</Link>에서 관련 흐름을 이어서 볼 수 있습니다.</p>
      </section>
      <section className="rounded-lg border bg-card p-4 text-sm leading-6">
        <h2 className="text-lg font-semibold">출처와 버전 주의</h2>
        <p className="mt-2 text-muted-foreground">원문의 순서를 학습용으로 재구성하고 초기화 콜백·자동 구성·프록시의 조건을 보충했습니다. 구체적인 지원 범위는 사용 중인 Spring Boot·Framework 버전과 설정에 맞춰 확인합니다. 예제는 설명용이며 백엔드 코드를 변경하지 않습니다.</p>
        <ul className="mt-3 grid gap-2 underline underline-offset-4">
          <li><a href="https://www.instagram.com/java_interview_prep/p/DdJkMtbDchV/" target="_blank" rel="noreferrer">Spring Boot Core · 원문 10장</a></li>
          <li><a href="https://docs.spring.io/spring-boot/reference/features/spring-application.html" target="_blank" rel="noreferrer">Spring Boot · 시작 흐름과 이벤트</a></li>
          <li><a href="https://docs.spring.io/spring-boot/reference/using/auto-configuration.html" target="_blank" rel="noreferrer">Spring Boot · 자동 구성</a></li>
          <li><a href="https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html" target="_blank" rel="noreferrer">Spring Framework · Bean 생명주기</a></li>
          <li><a href="https://docs.spring.io/spring-framework/reference/core/aop/proxying.html" target="_blank" rel="noreferrer">Spring Framework · AOP 프록시</a></li>
        </ul>
      </section>
    </ReferencePage>
  );
}
