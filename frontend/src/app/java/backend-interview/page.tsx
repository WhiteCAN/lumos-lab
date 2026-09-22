import Link from "next/link";
import { CoffeeIcon } from "lucide-react";
import { ReferencePage, FlowSection } from "@/components/reference-page";

import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/java/backend-interview");

const groups = [
  { id: "core", title: "Java 기초", link: "/java/collections", start: 1, items: [
    ["==와 equals()는 무엇이 다른가요?", "기본형의 ==는 값을, 참조형의 ==는 같은 객체를 가리키는지 비교합니다. equals()는 클래스가 정의한 동등성 규칙을 사용합니다.", "Object의 기본 equals()는 참조 비교입니다. 문자열 내용은 String.equals()로 비교하며 null 가능성은 Objects.equals()로 다룰 수 있습니다."],
    ["HashMap은 어떻게 값을 찾나요?", "키의 해시로 버킷을 정하고, 후보 키의 동등성을 확인해 값을 찾습니다. 충돌한 항목은 같은 버킷에서 관리합니다.", "적절한 해시 분산에서 기본 연산은 평균 O(1)입니다. 충돌·리사이징 비용이 있으며, 트리 전환은 구현과 조건에 따릅니다."],
    ["equals()와 hashCode()를 왜 함께 재정의하나요?", "equals()로 같은 두 객체는 같은 해시 코드를 가져야 해시 기반 컬렉션에서 일관되게 동작합니다.", "같은 해시 코드가 같은 객체를 뜻하지는 않습니다. 키를 넣은 뒤 동등성에 쓰는 필드를 바꾸면 검색이 실패할 수 있습니다."],
    ["ArrayList와 LinkedList는 어떻게 선택하나요?", "ArrayList는 배열 기반이라 인덱스 접근에 유리하고, LinkedList는 노드 연결 구조라 양 끝 작업 등에 활용할 수 있습니다.", "LinkedList도 삽입 위치까지 찾는 데 O(n)이 들 수 있습니다. 중간 삽입이 많다는 이유만으로 항상 더 빠르지는 않습니다."],
    ["HashMap과 ConcurrentHashMap의 차이는요?", "HashMap은 자체적으로 동시 접근을 동기화하지 않습니다. ConcurrentHashMap은 동시 접근을 지원하고 원자적 갱신 메서드를 제공합니다.", "get 후 put 같은 여러 호출의 조합까지 원자적이지는 않습니다. compute, merge, putIfAbsent 등 작업에 맞는 API를 사용합니다."],
  ]},
  { id: "concurrency", title: "멀티스레딩", link: "/java/concurrency", start: 6, items: [
    ["프로세스와 스레드의 차이는요?", "프로세스는 실행 자원과 주소 공간을 갖는 단위이고, 스레드는 프로세스 안에서 실행되는 흐름입니다. 같은 프로세스의 스레드는 힙 등의 자원을 공유합니다.", "공유 메모리에는 경쟁이 생길 수 있습니다. 스레드별 스택과 공유 자원을 구분해 설명하세요."],
    ["synchronized와 volatile의 차이는요?", "synchronized는 같은 모니터를 사용하는 임계 구역의 상호 배제와 가시성을 제공합니다. volatile은 해당 변수의 읽기·쓰기 사이 가시성과 순서 보장에 쓰입니다.", "volatile int의 count++는 읽기·계산·쓰기의 복합 연산이라 원자적이지 않습니다. 잠금이나 AtomicInteger를 고려합니다."],
    ["경쟁 상태는 무엇인가요?", "여러 실행 흐름의 타이밍에 따라 결과가 달라지는 상황입니다. 공유 카운터를 동시에 증가시키면 갱신이 유실될 수 있습니다.", "공유 상태를 줄이거나 같은 잠금으로 보호합니다. 단일 변수 원자 연산만으로 여러 필드의 불변식까지 보장하지는 못합니다."],
    ["ExecutorService는 어떤 역할인가요?", "작업 제출과 실행 관리를 분리하는 API입니다. submit의 Future로 결과·실패를 확인하고 실행기 수명도 관리합니다.", "모든 실행기가 고정 스레드 풀인 것은 아닙니다. Java 21의 가상 스레드 실행기는 작업별 스레드를 사용합니다. 종료·취소·예외 처리도 설명하세요."],
    ["스레드 풀이 포화되면 어떻게 되나요?", "ThreadPoolExecutor의 동작은 코어·최대 스레드 수, 작업 큐와 거절 정책에 달려 있습니다. 처리 속도보다 제출 속도가 빠르면 대기나 거절이 발생합니다.", "무제한 큐는 메모리·지연을 키울 수 있고, 제한 큐는 포화 시 거절 정책이 중요합니다. DB 풀과 외부 API의 처리 한계도 함께 봅니다."],
  ]},
  { id: "spring", title: "Spring Boot", link: "/spring-bean-di", start: 11, items: [
    ["Spring Boot 애플리케이션은 어떻게 시작하나요?", "main에서 SpringApplication.run()을 호출하면 환경과 ApplicationContext를 준비하고 설정을 처리해 빈을 생성·연결합니다.", "웹 애플리케이션은 설정에 따라 내장 서버를 시작합니다. 자동 설정은 클래스패스·프로퍼티·기존 빈 등의 조건에 따라 적용됩니다."],
    ["@Component, @Service, @Repository의 차이는요?", "세 애너테이션은 컴포넌트를 나타내며, Service는 서비스 계층, Repository는 데이터 접근 계층의 의도를 드러냅니다.", "Repository의 예외 변환은 관련 Spring 인프라가 동작할 때 적용됩니다. Service만 붙인다고 트랜잭션이 자동 생성되지는 않습니다."],
    ["생성자 주입을 왜 선호하나요?", "필수 의존성을 생성 시점에 드러내고 final 필드로 유지할 수 있습니다. 테스트에서도 필요한 객체를 명시적으로 전달하기 쉽습니다.", "필드 주입은 의존성을 숨기고 컨테이너 없이 객체를 만들 때 초기화가 누락되기 쉽습니다. 생성자가 하나라면 일반적으로 @Autowired를 생략할 수 있습니다."],
    ["@RestController와 @Controller의 차이는요?", "RestController는 Controller와 ResponseBody의 의미를 결합합니다. 반환 값을 응답 본문으로 처리하며 메시지 변환기가 직렬화합니다.", "항상 JSON만 반환하는 것은 아닙니다. Controller도 ResponseBody나 ResponseEntity를 사용해 본문을 반환할 수 있습니다."],
    ["@Transactional은 어떻게 동작하나요?", "일반적인 프록시 방식에서는 프록시가 호출을 가로채 트랜잭션 참여·시작과 커밋·롤백을 처리합니다.", "기본 롤백 대상은 RuntimeException과 Error입니다. 체크 예외는 규칙 설정이 필요하며, 같은 객체 내부 호출은 일반적으로 프록시를 거치지 않습니다."],
  ]},
  { id: "jpa", title: "JPA · 데이터베이스", link: "/backend/db-index-transaction", start: 16, items: [
    ["LAZY와 EAGER는 무엇이 다른가요?", "LAZY는 접근 시점까지 로딩을 미루라는 힌트이고 EAGER는 즉시 로딩을 요구하는 전략입니다. 실제 SQL 형태는 구현과 조회 방식에 달려 있습니다.", "EAGER가 JOIN 한 번을 보장하지 않습니다. LAZY도 영속성 컨텍스트가 닫힌 뒤 접근하면 문제가 생길 수 있어 조회 목적에 맞는 fetch 계획이 필요합니다."],
    ["N+1 조회 문제는 무엇인가요?", "목록을 가져온 뒤 각 항목의 연관 데이터를 따로 조회하면서 쿼리가 반복되는 현상입니다. SQL 로그와 쿼리 수로 확인합니다.", "fetch join, EntityGraph, DTO 조회, 배치 로딩 등을 검토합니다. LAZY만의 문제가 아니며 컬렉션 fetch join과 페이징 조합도 주의합니다."],
    ["DB 커넥션 풀은 왜 사용하나요?", "연결을 매번 만들지 않고 빌려 쓰고 반환해 연결 생성 비용과 동시 연결 수를 관리합니다.", "풀 크기를 크게 하는 것이 항상 빠르지는 않습니다. 대기 시간·누수·긴 트랜잭션·DB 최대 연결 수를 함께 확인합니다."],
    ["Spring에서 예외 응답을 공통 처리하려면요?", "RestControllerAdvice와 ExceptionHandler로 예외를 상태 코드와 일관된 오류 응답에 매핑할 수 있습니다.", "스택 추적·인증정보를 응답에 노출하지 않습니다. MVC 예외 처리 범위와 보안 필터 단계의 예외 처리는 구분해야 합니다."],
    ["PUT과 PATCH는 어떻게 다른가요?", "PUT은 대상 리소스 상태의 생성·대체를, PATCH는 변경 지시의 적용을 나타냅니다. API가 어떤 필드를 어떻게 바꾸는지 계약이 필요합니다.", "PUT은 멱등 의미를 가지며 PATCH는 연산에 따라 멱등일 수도 아닐 수도 있습니다. 부분 수정이라고 자동으로 멱등인 것은 아닙니다."],
  ]},
  { id: "services", title: "마이크로서비스", link: "/circuit-breaker", start: 21, items: [
    ["모놀리스와 마이크로서비스를 어떻게 비교하나요?", "모놀리스는 하나의 배포 단위를 중심으로, 마이크로서비스는 독립적으로 배포 가능한 서비스 경계를 중심으로 구성합니다.", "모놀리스도 모듈화·수평 확장이 가능합니다. 서비스를 분리해도 장애가 자동 격리되지 않으며 통신·운영·데이터 일관성 비용이 늘어납니다."],
    ["REST 호출과 비동기 메시징은 언제 사용하나요?", "요청·응답 호출은 즉시 결과가 필요한 상호작용에, 메시징은 생산자와 소비자의 처리 시점을 분리하는 작업에 활용할 수 있습니다.", "REST는 블로킹 I/O와 동의어가 아닙니다. HTTP도 비동기 클라이언트나 202 응답을 사용할 수 있습니다. 메시징은 중복·순서·재처리를 고려합니다."],
    ["의존 서비스가 중단되면 어떻게 대응하나요?", "타임아웃으로 대기를 제한하고, 적절한 재시도·서킷 브레이커·자원 격리로 장애 전파를 줄입니다. 관측 지표와 알림으로 상태를 파악합니다.", "폴백은 오래된 값이나 기능 제한임을 명확히 해야 합니다. 실패를 성공으로 숨기거나 무제한 재시도하면 장애를 키울 수 있습니다."],
    ["재시도와 서킷 브레이커의 차이는요?", "재시도는 일시적 실패 후 다시 시도하는 것이고, 서킷 브레이커는 실패가 누적된 대상 호출을 일시 차단하는 장치입니다.", "재시도에는 횟수·시간 예산과 백오프·지터를 적용합니다. 결제 같은 변경 요청은 중복 실행 방지와 멱등성도 필요합니다."],
  ]},
];

export default function BackendInterviewPage() {
  return <ReferencePage pageHref="/java/backend-interview" label="핵심 답변 · 동작 원리 · 주의점" description="Java 컬렉션에서 분산 시스템 장애 대응까지, 질문에 짧게 답하고 그 답이 성립하는 조건을 함께 설명하는 복습 노트입니다." icon={CoffeeIcon} colorClass="border-orange-200 bg-orange-50/50 dark:border-orange-900/60 dark:bg-orange-950/20">
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">이 페이지의 범위</h2><p className="mt-2 text-sm leading-6">Coding Sight의 5장짜리 게시물을 바탕으로 질문과 답변을 재구성했습니다. 원문은 25문항으로 소개하지만 마지막 이미지 하단이 잘려 25번은 확인되지 않습니다. 여기에는 확인 가능한 1~24번만 포함하며, 주의점은 학습용 보완 설명입니다.</p></section>
    <nav aria-label="분야 바로가기" className="flex flex-wrap gap-2">{groups.map(g=><a key={g.id} href={`#${g.id}`} className="rounded-lg border bg-card px-4 py-2 text-sm hover:bg-muted">{g.title}</a>)}</nav>
    {groups.map(g=><section key={g.id} id={g.id} className="scroll-mt-20"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-semibold">{g.title}</h2><Link href={g.link} className="text-sm underline underline-offset-4">관련 개념 더 보기</Link></div><div className="grid gap-3 lg:grid-cols-2">{g.items.map(([question,answer,caution],i)=><article key={question} className="rounded-xl border bg-card p-5"><p className="text-xs font-semibold text-orange-700 dark:text-orange-300">QUESTION {String(g.start+i).padStart(2,"0")}</p><h3 className="mt-2 font-semibold">{question}</h3><p className="mt-3 text-sm leading-6">{answer}</p><p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground"><strong>주의할 점 · </strong>{caution}</p></article>)}</div></section>)}
    <section><h2 className="mb-3 text-xl font-semibold">동작으로 복습하기 · 트랜잭션 경계</h2><div className="grid gap-4 xl:grid-cols-2">
      <FlowSection orientation="vertical" title="외부에서 프록시를 통한 호출" steps={[{label:"호출자",icon:"user"},{label:"트랜잭션 프록시",icon:"branch"},{label:"트랜잭션 시작·참여",icon:"database"},{label:"서비스 메서드 실행",icon:"server"},{label:"규칙에 따라 커밋·롤백",icon:"verify"}]} />
      <FlowSection orientation="vertical" title="같은 객체의 내부 호출" steps={[{label:"서비스 메서드 실행",icon:"server"},{label:"this로 내부 메서드 호출",icon:"code"},{label:"프록시를 거치지 않음",icon:"branch"},{label:"새 트랜잭션 조언 미적용",icon:"database"},{label:"기존 트랜잭션은 유지 가능",icon:"verify"}]} />
    </div><p className="mt-3 text-sm leading-6 text-muted-foreground">Spring의 일반적인 프록시 기반 트랜잭션 예시입니다. 내부 호출이라는 이유만으로 기존 트랜잭션이 사라지는 것은 아닙니다.</p></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처 · 더 정확하게 읽기</h2><ul className="mt-3 space-y-2 text-sm">
      <li><a className="underline" href="https://www.instagram.com/p/DdONgQAiutM/">Coding Sight · Java Backend Interview Notes 원문</a></li>
      <li><a className="underline" href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html">Java 21 · HashMap</a></li>
      <li><a className="underline" href="https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html">Java 21 · ThreadPoolExecutor</a></li>
      <li><a className="underline" href="https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html">Spring · 트랜잭션 애너테이션과 프록시</a></li>
      <li><a className="underline" href="https://jakarta.ee/specifications/persistence/3.1/apidocs/jakarta.persistence/jakarta/persistence/fetchtype">Jakarta Persistence · FetchType</a></li>
      <li><a className="underline" href="https://www.rfc-editor.org/rfc/rfc5789">RFC 5789 · PATCH 의미</a></li>
    </ul></section>
  </ReferencePage>;
}
