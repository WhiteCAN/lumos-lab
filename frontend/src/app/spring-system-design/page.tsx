import Link from "next/link";
import { NetworkIcon } from "lucide-react";
import { ReferencePage, FlowSection, ComparisonTable } from "@/components/reference-page";

import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/spring-system-design");

const features = [
  { name: "@Cacheable", concept: "캐싱", owner: "Spring Framework", body: "같은 키의 결과가 캐시에 있으면 메서드 실행을 생략하고 재사용합니다. 반복 조회 비용과 응답 시간을 줄이는 전략입니다.", caution: "Redis는 선택 가능한 저장소입니다. 애너테이션 자체가 Redis를 설치하거나 TTL·갱신·무효화 정책을 정해 주지는 않습니다.", link: "/backend/redis-cache" },
  { name: "@CircuitBreaker", concept: "장애 전파 제한", owner: "Resilience4j 등", body: "실패율 등의 조건을 관찰해 문제 있는 대상으로의 호출을 잠시 차단하고 제한적으로 회복을 확인합니다.", caution: "Spring Boot 기본 애너테이션이 아닙니다. 라이브러리와 설정이 필요하며, 타임아웃·동시 실행 제한·재시도는 별도 정책입니다.", link: "/circuit-breaker" },
  { name: "@Async", concept: "비동기 실행", owner: "Spring Framework", body: "메서드 실행을 설정된 실행기에 위임해 호출 흐름과 작업 실행을 분리합니다. 애플리케이션 내부 작업에 활용합니다.", caution: "메시지 브로커를 사용하는 기능이 아닙니다. 내구성 있는 저장·프로세스 재시작 후 재처리·다른 서비스로의 전달을 자동 보장하지 않습니다.", link: "/java/concurrency" },
  { name: "@RateLimiter", concept: "요청량 제한", owner: "Resilience4j 등", body: "일정한 기간에 허용하는 호출 수를 제한해 과도한 요청으로부터 자원을 보호합니다.", caution: "일반적인 로컬 제한기는 인스턴스마다 계산합니다. 여러 서버에 걸친 사용자별 한도라면 공유 상태나 게이트웨이 정책이 필요합니다.", link: "/backend/security-auth" },
  { name: "@Transactional", concept: "트랜잭션 경계와 일관성", owner: "Spring Framework", body: "트랜잭션 매니저를 통해 작업의 시작·참여·커밋·롤백 경계를 선언합니다. 저장소의 격리 수준과 제약 조건도 함께 설계합니다.", caution: "여러 서비스의 DB 변경과 외부 API 호출까지 하나의 원자적 작업이 되지는 않습니다. 분산 환경에서는 Saga·Outbox 같은 별도 전략을 검토합니다.", link: "/transactional" },
  { name: "@LoadBalanced", concept: "클라이언트 측 부하 분산", owner: "Spring Cloud", body: "지원되는 HTTP 클라이언트에 부하 분산 기능을 연결하고 서비스 이름에 해당하는 인스턴스 중 하나를 선택하도록 구성합니다.", caution: "서버를 자동 증설하는 기능이 아닙니다. 인스턴스 목록 제공 방식, 선택 정책과 장애 인스턴스 처리가 필요합니다.", link: "/architecture" },
  { name: "@FeignClient", concept: "서비스 간 HTTP 통신", owner: "Spring Cloud OpenFeign", body: "인터페이스에 선언한 요청 계약으로 HTTP 클라이언트를 구성해 다른 서비스 API를 호출합니다.", caution: "네트워크 실패·시간 초과·인증·계약 변경은 그대로 존재합니다. 서비스 탐색과 부하 분산은 관련 구성에 달려 있습니다.", link: "/rest-api-design" },
  { name: "Spring Cloud Gateway", concept: "API 게이트웨이", owner: "Spring Cloud", body: "요청을 적절한 서비스로 라우팅하고 필터를 통해 인증 연계나 요청 정책 같은 공통 처리를 배치합니다.", caution: "게이트웨이가 모든 업무 권한 검사를 대신하지는 않습니다. 병목·장애 지점이 되지 않도록 가용성과 처리 용량도 설계합니다.", link: "/api-vs-rest" },
  { name: "Eureka", concept: "서비스 등록과 탐색", owner: "Spring Cloud Netflix", body: "서비스 인스턴스가 자신을 등록하고, 클라이언트가 서비스 이름에 해당하는 주소 목록을 알아내도록 돕습니다.", caution: "탐색은 대상을 찾는 일이고 부하 분산은 그중 하나를 고르는 일입니다. 등록 정보 갱신 지연이 있을 수 있으며 Eureka가 유일한 탐색 방식은 아닙니다.", link: "/architecture" },
  { name: "Spring Boot Actuator", concept: "상태 확인과 관측성", owner: "Spring Boot", body: "상태·메트릭 등의 관리 기능을 제공해 애플리케이션을 관찰할 수 있게 합니다. 수집·저장·시각화·알림 시스템과 연결해 운영합니다.", caution: "추가 설정 없이 모든 로그·분산 추적·대시보드가 완성되는 것은 아닙니다. 관리 엔드포인트의 노출 범위와 접근 권한도 정해야 합니다.", link: "/ci-cd" },
];
const sources = [
  ["원문 · Spring Boot × System Design", "https://www.instagram.com/reels/DdgfwaWogfM/"],
  ["Spring · 캐시 추상화", "https://docs.spring.io/spring-framework/reference/integration/cache.html"],
  ["Spring · 비동기 실행", "https://docs.spring.io/spring-framework/reference/integration/scheduling.html"],
  ["Resilience4j · Spring 연동", "https://resilience4j.readme.io/docs/getting-started-3"],
  ["Spring · 트랜잭션", "https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html"],
  ["Spring Cloud · LoadBalancer", "https://docs.spring.io/spring-cloud-commons/reference/spring-cloud-commons/loadbalancer.html"],
  ["Spring Cloud · OpenFeign", "https://docs.spring.io/spring-cloud-openfeign/reference/"],
  ["Spring Cloud · Gateway", "https://docs.spring.io/spring-cloud-gateway/reference/"],
  ["Spring Cloud Netflix · Eureka", "https://docs.spring.io/spring-cloud-netflix/reference/spring-cloud-netflix.html"],
  ["Spring Boot · Actuator 관리 엔드포인트", "https://docs.spring.io/spring-boot/reference/actuator/monitoring.html"],
];

export default function SpringSystemDesignPage() {
  return <ReferencePage pageHref="/spring-system-design" label="기능 10개 · 설계 개념 · 적용 조건" description="익숙한 애너테이션과 도구를 캐싱·일관성·장애 대응·서비스 연결이라는 설계 문제와 함께 읽어 봅니다." icon={NetworkIcon} brand="spring" colorClass="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20">
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">핵심 · 기능 이름 다음에는 정책이 필요합니다</h2><p className="mt-2 text-sm leading-6">원문은 Spring 생태계의 기능 10개를 시스템 설계 개념에 연결합니다. 모두 Spring Boot 자체 기능은 아니며, 도구를 도입한 뒤에도 저장 범위·장애 처리·운영 정책을 정해야 합니다. 아래 주의점은 원문의 단순한 연결을 보완한 설명입니다.</p></section>
    <section className="grid gap-4 lg:grid-cols-2" aria-label="시스템 설계와 연결되는 기능 10개">{features.map((f,i)=><article key={f.name} className="rounded-xl border bg-card p-5"><p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{String(i+1).padStart(2,"0")} · {f.owner}</p><h2 className="mt-2 text-lg font-semibold">{f.name}</h2><p className="mt-1 font-medium">{f.concept}</p><p className="mt-3 text-sm leading-6">{f.body}</p><p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground"><strong>설계할 점 · </strong>{f.caution}</p><Link href={f.link} className="mt-3 inline-block text-sm underline underline-offset-4">관련 개념 더 보기</Link></article>)}</section>
    <section><h2 className="mb-3 text-xl font-semibold">@Async와 메시지 큐의 경계</h2><div className="grid gap-4 xl:grid-cols-2">
      <FlowSection orientation="vertical" title="@Async · 프로세스 내부 실행" steps={[{label:"호출자",icon:"user"},{label:"Spring 프록시",icon:"spring"},{label:"실행기에 작업 위임",icon:"branch"},{label:"같은 앱에서 작업 수행",icon:"server"},{label:"결과·실패 처리",icon:"verify"}]} />
      <FlowSection orientation="vertical" title="메시징 · 브로커를 통한 전달" steps={[{label:"생산자",icon:"server"},{label:"메시지 발행",icon:"document"},{label:"브로커에 전달·저장",icon:"database",detail:"내구성은 설정에 따라 다름"},{label:"소비자가 작업 수행",icon:"server"},{label:"처리 확인·재처리 정책",icon:"verify"}]} />
    </div><p className="mt-3 text-sm leading-6 text-muted-foreground">두 방식 모두 호출자와 작업 실행을 분리할 수 있습니다. 메시징의 저장·확인·재전달은 브로커와 클라이언트 설정에 달려 있으며, 중복 처리를 고려해야 합니다. 일반적인 프록시 기반 @Async는 같은 객체의 내부 호출에 적용되지 않습니다.</p></section>
    <ComparisonTable columns={["담당하는 역할", "별도로 정할 내용"]} rows={[
      {topic:"캐시",values:["계산·조회 결과 재사용","키, TTL, 무효화, 허용할 데이터 지연"]},
      {topic:"Rate Limiter / Circuit Breaker",values:["요청량 제한 / 실패 대상 호출 차단","사용자·서버별 범위, 임계값, 대기·실패 응답"]},
      {topic:"탐색 / 부하 분산 / Gateway",values:["주소 목록 / 대상 선택 / 라우팅·필터","목록 갱신, 선택 정책, 진입점 가용성"]},
      {topic:"트랜잭션 / 메시징",values:["로컬 변경 경계 / 작업 전달","원자성 범위, 중복 방지, 재처리·보상"]},
    ]} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">적용 전에 확인할 네 가지</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6"><li>느린 조회, 호출 폭주, 장애 전파 중 해결할 문제를 먼저 정합니다.</li><li>한 프로세스·한 DB·여러 서비스 중 보장 범위를 구분합니다.</li><li>타임아웃·실패 응답·재시도·멱등성 정책을 정합니다.</li><li>지연·오류율·대기열·캐시 적중률 등 실제 지표로 효과를 검증합니다.</li></ol></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 함께 읽기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">softwaredeveloper_077의 게시물을 바탕으로 한국어로 재구성했습니다. 프로젝트에 해당 기능을 설치한 것은 아니며, 적용 시 Spring Boot·Spring Cloud·외부 라이브러리의 버전 호환성을 확인해야 합니다.</p><ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{sources.map(([label,url])=><li key={url}><a href={url} className="underline underline-offset-4">{label}</a></li>)}</ul></section>
  </ReferencePage>;
}
