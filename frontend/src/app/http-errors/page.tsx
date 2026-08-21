import {
  CodeBlock,
  ComparisonTable,
  ConceptGrid,
  FlowSection,
  ReferencePage,
} from "@/components/reference-page";
import {
  AlertTriangleIcon,
  BugIcon,
  FileWarningIcon,
  LockKeyholeIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from "lucide-react";

const statusCards = [
  {
    title: "2xx Success",
    description: "요청을 서버가 정상 처리한 상태입니다.",
    bullets: ["200 OK: 조회/수정 성공", "201 Created: 생성 성공", "204 No Content: 응답 본문 없이 성공"],
    colorClass: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20",
    icon: ShieldCheckIcon,
  },
  {
    title: "4xx Client Error",
    description: "요청 값, 인증, 권한, 경로처럼 클라이언트가 고쳐야 할 문제가 있는 상태입니다.",
    bullets: ["400: request body/query가 잘못됨", "401: 로그인 또는 토큰 필요", "403: 로그인했지만 권한 부족"],
    colorClass: "border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20",
    icon: AlertTriangleIcon,
  },
  {
    title: "5xx Server Error",
    description: "서버 코드, DB, 외부 API 장애처럼 서버 쪽에서 처리해야 할 문제입니다.",
    bullets: ["500: 예상 못 한 서버 예외", "502/503: 게이트웨이 또는 서비스 장애", "로그와 모니터링 확인 필요"],
    colorClass: "border-rose-200 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20",
    icon: BugIcon,
  },
];

const rows = [
  { topic: "400", values: ["요청 형식 오류", "validation 실패, JSON 필드 누락", "@Valid, MethodArgumentNotValidException"] },
  { topic: "401", values: ["인증 필요", "Authorization 헤더 없음, 토큰 만료", "Spring Security AuthenticationEntryPoint"] },
  { topic: "403", values: ["권한 부족", "USER가 ADMIN API 호출", "AccessDeniedHandler"] },
  { topic: "404", values: ["리소스 없음", "없는 문서 ID 조회", "NotFound 예외를 명확히 분리"] },
  { topic: "409", values: ["상태 충돌", "이미 처리된 주문 취소", "도메인 규칙 위반"] },
  { topic: "500", values: ["서버 내부 오류", "null, DB 장애, 외부 API 장애", "사용자에게 내부 상세 노출 금지"] },
];

const exceptionCode = `@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleValidation(MethodArgumentNotValidException ex) {
        return ApiResponse.fail("요청 값이 올바르지 않습니다.");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleIllegalArgument(IllegalArgumentException ex) {
        return ApiResponse.fail(ex.getMessage());
    }
}`;

export default function HttpErrorsPage() {
  return (
    <ReferencePage
      breadcrumb="Reference / HTTP Errors"
      label="에러 처리 레퍼런스"
      title="HTTP 상태코드와 예외 처리"
      description="REST API를 만들 때 성공, 입력 오류, 인증 실패, 권한 부족, 서버 장애를 어떤 상태코드로 표현할지 정리합니다. Spring의 전역 예외 처리와 프론트 fetch 처리까지 함께 보면 좋습니다."
      icon={FileWarningIcon}
      colorClass="border-rose-200 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20"
    >
      <ConceptGrid items={statusCards} />
      <ComparisonTable columns={["의미", "예시", "Spring에서 보는 곳"]} rows={rows} />
      <FlowSection
        title="API 에러 처리 흐름"
        steps={["Controller 요청", "Validation", "Service 실행", "Exception 발생", "GlobalExceptionHandler", "ApiResponse 실패 응답", "프론트 에러 메시지"]}
        colorClass="border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/20"
      />
      <section className="grid gap-4 xl:grid-cols-3">
        {[
          { title: "401 vs 403", text: "401은 아직 누구인지 모르는 상태이고, 403은 누구인지는 알지만 권한이 부족한 상태입니다.", icon: LockKeyholeIcon },
          { title: "400 vs 409", text: "400은 요청 형식 자체가 잘못된 경우, 409는 요청 형식은 맞지만 현재 리소스 상태와 충돌하는 경우에 어울립니다.", icon: ShieldAlertIcon },
          { title: "500", text: "500 계열은 사용자에게 내부 구현 상세를 보여주지 말고, 서버 로그와 trace id로 추적하는 쪽이 안전합니다.", icon: BugIcon },
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
      <CodeBlock title="Spring 전역 예외 처리 예시" code={exceptionCode} />
    </ReferencePage>
  );
}
