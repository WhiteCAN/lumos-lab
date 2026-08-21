import {
  CodeBlock,
  ComparisonTable,
  ConceptGrid,
  FlowSection,
  ReferencePage,
} from "@/components/reference-page";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  FlaskConicalIcon,
  ListChecksIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react";

const cards = [
  {
    title: "Red",
    description: "실패하는 테스트를 먼저 작성하고, 실패 이유가 요구사항과 맞는지 확인합니다.",
    bullets: ["구현보다 테스트가 먼저", "실패를 통해 테스트가 동작함을 확인", "요구사항을 작게 자름"],
    colorClass: "border-rose-200 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20",
    icon: AlertTriangleIcon,
  },
  {
    title: "Green",
    description: "테스트를 통과하는 가장 단순한 구현을 작성합니다.",
    bullets: ["완벽한 설계보다 통과 우선", "작게 구현", "모든 테스트가 초록색인지 확인"],
    colorClass: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    icon: CheckCircle2Icon,
  },
  {
    title: "Refactor",
    description: "테스트가 통과하는 상태를 유지하면서 중복과 설계를 정리합니다.",
    bullets: ["동작 변경 금지", "이름과 구조 개선", "테스트를 안전망으로 사용"],
    colorClass: "border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20",
    icon: RefreshCwIcon,
  },
];

const rows = [
  { topic: "@Test", values: ["테스트 메서드 표시", "JUnit이 실행 대상으로 인식", "하나의 기대 동작을 검증"] },
  { topic: "@DisplayName", values: ["테스트 이름 지정", "리포트를 사람이 읽기 쉽게 만듦", "요구사항 문장으로 작성"] },
  { topic: "@BeforeEach", values: ["각 테스트 전 준비", "공유 상태 오염 방지", "Given 단계 구성"] },
  { topic: "@AfterEach", values: ["각 테스트 후 정리", "테스트가 바꾼 상태를 초기화", "임시 상태, mock, 로그 정리"] },
  { topic: "@BeforeAll", values: ["전체 테스트 전 1회 실행", "비용 큰 공통 준비", "static 메서드로 작성"] },
  { topic: "@AfterAll", values: ["전체 테스트 후 1회 실행", "공통 리소스 정리", "연결 해제, 임시 파일 삭제"] },
  { topic: "@Nested", values: ["테스트 그룹화", "요구사항 또는 단계별 묶음", "Red/Green/Refactor 분리"] },
  { topic: "@TestMethodOrder", values: ["테스트 순서 지정", "학습용 단계 표현", "실무에서는 순서 의존 최소화"] },
  { topic: "@Order", values: ["실행 순서 번호", "TestMethodOrder와 함께 사용", "Red → Green → Refactor 설명에 유용"] },
  { topic: "@ParameterizedTest", values: ["입력 여러 개 반복", "같은 규칙의 케이스를 압축", "경계값 테스트에 유용"] },
  { topic: "@CsvSource", values: ["CSV 입력 제공", "password, expected 형태", "ParameterizedTest와 함께 사용"] },
  { topic: "@ValueSource", values: ["값 목록 입력", "문자열/숫자 단일 인자 반복", "대소문자, 여러 숫자 입력"] },
  { topic: "@NullAndEmptySource", values: ["null과 빈 값 입력", "방어 로직 테스트", "문자열 입력 검증에 유용"] },
  { topic: "@RepeatedTest", values: ["같은 테스트 반복", "반복 실행 안정성 확인", "랜덤/시간 의존 코드 점검"] },
  { topic: "@Timeout", values: ["제한 시간 검증", "무한 루프, 느린 계산 방지", "성능 기준의 가장 작은 안전망"] },
  { topic: "@Tag", values: ["테스트 분류", "fast, slow, red 같은 그룹", "선택 실행과 리포트 분류"] },
];

const tddExample = `@DisplayName("TDD 예제 - 비밀번호 정책")
class PasswordPolicyTddTest {

    private PasswordPolicy passwordPolicy;

    @BeforeEach
    void setUp() {
        passwordPolicy = new PasswordPolicy();
    }

    @Test
    @DisplayName("8자 이상이고 문자와 숫자를 포함하면 유효하다")
    void validPasswordPasses() {
        boolean actual = passwordPolicy.isValid("abc12345");

        assertThat(actual).isTrue();
    }
}`;

const discountExample = `@DisplayName("TDD 예제 - 할인 정책")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class DiscountPolicyTddTest {

    @BeforeAll
    static void beforeAll() {
        // 모든 테스트 전 한 번만 실행
    }

    @AfterEach
    void tearDown() {
        // 각 테스트 후 상태 정리
    }

    @ParameterizedTest
    @Order(2)
    @Tag("green")
    @ValueSource(strings = {"VIP", "vip", "Vip"})
    @DisplayName("VIP 등급은 대소문자와 상관없이 20% 할인이다")
    void vipGradeIsCaseInsensitive(String grade) {
        int actual = discountPolicy.discountPrice(10_000, grade);

        assertThat(actual).isEqualTo(8_000);
    }

    @RepeatedTest(3)
    @Timeout(1)
    @DisplayName("같은 입력은 반복 실행해도 같은 결과를 반환한다")
    void sameInputAlwaysReturnsSameResult() {
        int actual = discountPolicy.discountPrice(15_000, "VIP");

        assertThat(actual).isEqualTo(12_000);
    }
}`;

const checklist = [
  "테스트 이름은 구현 방식이 아니라 기대 동작을 설명합니다.",
  "한 테스트는 한 가지 이유로만 실패하게 만듭니다.",
  "처음부터 많은 케이스를 넣지 말고 가장 중요한 한 케이스부터 시작합니다.",
  "실패 메시지를 보고 바로 원인을 알 수 있게 expected와 actual을 명확히 둡니다.",
  "리팩터링할 때는 새 기능을 섞지 않고 구조 개선만 합니다.",
  "Controller, DB, 외부 API보다 순수 도메인 로직부터 TDD로 연습합니다.",
];

const scenarioSteps = [
  {
    title: "1. 요구사항을 한 문장으로 쓴다",
    example: "VIP 회원은 주문 금액의 20%를 할인받는다.",
    point: "테스트 이름과 DisplayName의 재료가 됩니다.",
  },
  {
    title: "2. 입력과 기대 결과를 표로 만든다",
    example: "price=10000, grade=VIP, expected=8000",
    point: "Given과 Then이 명확해집니다.",
  },
  {
    title: "3. 정상 케이스를 먼저 고른다",
    example: "VIP 10000원 주문은 8000원이 된다.",
    point: "가장 대표적인 성공 흐름으로 Red를 시작합니다.",
  },
  {
    title: "4. 경계값과 예외를 추가한다",
    example: "0원, 음수 금액, null 등급, 빈 등급",
    point: "운영에서 자주 깨지는 부분을 테스트로 고정합니다.",
  },
  {
    title: "5. 테스트 이름을 기대 동작으로 쓴다",
    example: "vipMemberGetsTwentyPercentDiscount",
    point: "구현이 바뀌어도 테스트 의도가 남습니다.",
  },
  {
    title: "6. Given-When-Then 순서로 정리한다",
    example: "given price and grade, when discount, then final price",
    point: "나중에 읽어도 준비, 실행, 검증이 분리됩니다.",
  },
];

const scenarioMatrixRows = [
  { topic: "Happy Path", values: ["가장 대표적인 성공 흐름", "VIP 10000원 → 8000원", "첫 Red 테스트로 좋음"] },
  { topic: "Boundary", values: ["값의 경계", "0원, 8자 비밀번호, 최대 수량", "오프바이원 오류 발견"] },
  { topic: "Invalid Input", values: ["잘못된 입력", "음수 금액, null, 빈 문자열", "예외와 방어 로직 확인"] },
  { topic: "State Change", values: ["상태가 바뀌는 흐름", "주문 생성 → 결제 완료 → 취소", "전후 상태 검증"] },
  { topic: "Regression", values: ["한 번 고친 버그 재발 방지", "과거 실패 케이스", "수정 후 다시 깨지지 않게 고정"] },
];

const scenarioTemplate = `// 테스트 시나리오 작성 템플릿
// 요구사항: VIP 회원은 주문 금액의 20%를 할인받는다.
//
// Given
// - price = 10_000
// - grade = "VIP"
//
// When
// - discountPolicy.discountPrice(price, grade)를 실행한다.
//
// Then
// - 최종 금액은 8_000원이어야 한다.

@Test
@DisplayName("VIP 회원은 20% 할인을 받는다")
void vipMemberGetsTwentyPercentDiscount() {
    int price = 10_000;
    String grade = "VIP";

    int actual = discountPolicy.discountPrice(price, grade);

    assertThat(actual).isEqualTo(8_000);
}`;

const scenarioExample = `// 시나리오 표를 먼저 만들면 ParameterizedTest로 옮기기 쉽습니다.
//
// | price  | grade   | expected | reason           |
// |--------|---------|----------|------------------|
// | 10000  | VIP     | 8000     | 정상 VIP 할인     |
// | 10000  | BASIC   | 10000    | 일반 회원 할인 없음 |
// | 10000  | null    | 10000    | 등급 없음          |
// | -1     | VIP     | exception| 음수 금액 금지     |

@ParameterizedTest
@CsvSource({
        "10000, VIP, 8000",
        "10000, BASIC, 10000",
        "10000, UNKNOWN, 10000"
})
@DisplayName("등급별 할인 금액을 계산한다")
void discountPriceByGrade(int price, String grade, int expected) {
    int actual = discountPolicy.discountPrice(price, grade);

    assertThat(actual).isEqualTo(expected);
}`;

export default function TddPage() {
  return (
    <ReferencePage
      breadcrumb="Reference / TDD"
      label="테스트 설계"
      title="TDD: Test-Driven Development"
      description="TDD는 테스트를 먼저 작성하고, 실패를 확인한 뒤, 최소 구현으로 통과시키고, 테스트를 안전망 삼아 리팩터링하는 개발 방식입니다. 실제 코드는 main이 아니라 src/test에서 직접 작성하고 실행합니다."
      icon={FlaskConicalIcon}
      colorClass="border-violet-200 bg-violet-50/50 dark:border-violet-900/60 dark:bg-violet-950/20"
    >
      <ConceptGrid items={cards} />

      <FlowSection
        title="TDD 작업 루프"
        steps={["요구사항 선택", "Red 테스트 작성", "실패 확인", "Green 최소 구현", "테스트 통과", "Refactor", "반복"]}
        colorClass="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20"
      />

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <section className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ListChecksIcon className="size-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">설계할 때 주의할 점</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {checklist.map((item) => (
              <div key={item} className="flex gap-2 rounded-lg border bg-muted/30 p-3 text-sm leading-6">
                <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="size-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">어디에 작성하나?</h2>
          </div>
          <div className="grid gap-3 text-sm leading-6">
            <div className="rounded-lg border bg-white/75 p-3 dark:bg-background/45">
              <p className="font-semibold">실제 테스트 코드</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                backend/src/test/java/com/study/lab/concept/tdd/PasswordPolicyTddTest.java
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                backend/src/test/java/com/study/lab/concept/tdd/DiscountPolicyTddTest.java
              </p>
            </div>
            <div className="rounded-lg border bg-white/75 p-3 dark:bg-background/45">
              <p className="font-semibold">실행 명령</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                cd backend && .\gradlew.bat test
              </p>
            </div>
            <p className="text-muted-foreground">
              main에는 사용자 기능과 API가 들어가고, 테스트 연습과 검증 코드는 src/test에 둡니다.
            </p>
          </div>
        </section>
      </section>

      <section className="rounded-lg border border-cyan-200 bg-cyan-50/40 p-4 shadow-sm dark:border-cyan-900/60 dark:bg-cyan-950/20">
        <div className="mb-4 flex items-center gap-2">
          <ListChecksIcon className="size-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">테스트 시나리오 작성법</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {scenarioSteps.map((step) => (
            <article key={step.title} className="rounded-lg border bg-white/75 p-4 shadow-sm dark:bg-background/45">
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-3 rounded-md border bg-background/70 p-3 font-mono text-xs leading-5">
                {step.example}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.point}</p>
            </article>
          ))}
        </div>
      </section>

      <ComparisonTable
        columns={["무엇을 검증하나", "예시", "왜 필요한가"]}
        rows={scenarioMatrixRows}
      />

      <ComparisonTable columns={["기능", "언제 쓰나", "TDD에서의 역할"]} rows={rows} />

      <section className="grid gap-4 xl:grid-cols-3">
        {[
          {
            title: "무엇부터 테스트할까?",
            text: "비밀번호 정책, 할인 계산, 정렬 결과처럼 입력과 출력이 명확한 작은 로직부터 시작합니다.",
          },
          {
            title: "무엇을 피할까?",
            text: "처음부터 DB, 네트워크, 브라우저까지 섞으면 실패 원인이 많아져 TDD 리듬을 잡기 어렵습니다.",
          },
          {
            title: "언제 통합 테스트로 넓힐까?",
            text: "순수 로직이 안정된 뒤 Controller, Repository, 외부 API 연결처럼 경계가 있는 부분으로 확장합니다.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <CodeBlock title="비밀번호 정책 TDD 예시" code={tddExample} />
        <CodeBlock title="할인 정책 TDD 예시" code={discountExample} />
        <CodeBlock title="Given-When-Then 시나리오 템플릿" code={scenarioTemplate} />
        <CodeBlock title="시나리오 표에서 ParameterizedTest로 옮기기" code={scenarioExample} />
      </section>
    </ReferencePage>
  );
}
