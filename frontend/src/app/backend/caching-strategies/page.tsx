import Link from "next/link";
import { DatabaseIcon } from "lucide-react";
import { ComparisonTable, FlowSection, ReferencePage } from "@/components/reference-page";

import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/backend/caching-strategies");

const rows = [
  { topic: "캐시를 채우는 시점", values: ["읽기 요청에서 캐시 miss가 발생할 때", "쓰기 요청을 처리하면서 캐시와 DB에 반영"] },
  { topic: "주요 책임", values: ["애플리케이션이 캐시 조회·DB 조회·캐시 저장을 조율", "쓰기 계층이 DB와 캐시 갱신 및 실패 처리를 조율"] },
  { topic: "읽기 비용", values: ["hit는 빠르지만 miss는 DB 조회와 캐시 채우기 필요", "쓰기 후 캐시가 유지되면 빠른 조회 가능"] },
  { topic: "쓰기 비용", values: ["DB 변경 후 관련 캐시 무효화 등을 처리", "동기 쓰기 경로에서 두 저장소 반영 비용을 부담"] },
  { topic: "적합한 상황", values: ["일부 데이터에 읽기가 집중되고 일정한 지연을 허용", "변경 직후 자주 읽으며 쓰기 경로를 통제할 수 있음"] },
  { topic: "핵심 위험", values: ["오래된 캐시, miss 폭증, 동시 요청의 재삽입 경쟁", "부분 실패, 쓰기 지연, 다른 경로의 DB 변경"] },
];

export default function CachingStrategiesPage() {
  return (
    <ReferencePage pageHref="/backend/caching-strategies" label="Redis · 읽기와 쓰기 정책"
      description="캐시 전략은 빠른 저장소를 쓰는 것에서 끝나지 않습니다. 데이터를 언제 채우고, 변경되면 어떻게 갱신하며, 실패하면 무엇을 신뢰할지 정하는 약속입니다."
      icon={DatabaseIcon} brand="redis" colorClass="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20">
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">Cache-Aside · 필요할 때 채우기</h2><p className="mt-3 text-sm leading-6">앱이 먼저 캐시를 조회합니다. 값이 없으면 DB를 읽고 결과를 캐시에 저장합니다. 자주 읽는 상품 정보처럼 모든 데이터를 미리 복제할 필요가 없는 경우에 어울립니다.</p><p className="mt-3 text-sm leading-6 text-muted-foreground">쓰기 때는 DB를 변경하고 관련 캐시를 지우는 방식을 사용할 수 있습니다. TTL은 오래된 값의 잔존 시간을 제한하지만 즉시 정합성을 보장하지 않습니다.</p></article>
        <article className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">Write-Through · 쓸 때 함께 반영하기</h2><p className="mt-3 text-sm leading-6">쓰기 계층이 캐시와 원본 DB 반영을 조율합니다. 여기서는 필요한 반영이 완료될 때까지 기다리는 동기식 패턴을 설명합니다. 자주 변경되고 곧바로 읽히는 데이터에 검토할 수 있습니다.</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Redis의 SET 명령만으로 외부 DB가 자동 갱신되지는 않습니다. 앱이나 별도의 연동 계층이 이 계약을 구현해야 합니다.</p></article>
      </section>
      <FlowSection title="Cache-Aside 읽기 · Hit / Miss" defaultPathLabel="Cache Miss" steps={[
        { label: "상품 조회", icon: "server" }, { label: "Redis GET · Miss", icon: "redis", detail: "캐시에 값이 없음" },
        { label: "원본 DB 조회", icon: "database" }, { label: "Redis SET + TTL", icon: "redis" }, { label: "결과 응답", icon: "user" },
      ]} paths={[{ label: "Cache Hit", steps: [{ label: "상품 조회", icon: "server" }, { label: "Redis GET · Hit", icon: "redis", detail: "DB 조회 없이 반환" }, { label: "결과 응답", icon: "user" }] }]} colorClass="border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/20" />
      <FlowSection title="Cache-Aside 쓰기 · 무효화 예시" steps={[{ label: "DB 변경 커밋", icon: "database" }, { label: "관련 캐시 삭제", icon: "redis" }, { label: "다음 읽기에서 miss", icon: "search" }, { label: "새 값으로 캐시 채우기", icon: "redis" }]} colorClass="border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/20" />
      <FlowSection title="Write-Through 쓰기 · 개념적 계약" steps={[{ label: "앱 → 쓰기 계층", icon: "server" }, { label: "DB·캐시 갱신 조율", icon: "redis" }, { label: "필요한 반영 성공 확인", icon: "verify" }, { label: "성공 응답 또는 실패 처리", icon: "branch" }]} colorClass="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20" />
      <ComparisonTable columns={["Cache-Aside", "Write-Through"]} rows={rows} />
      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">상품 가격 변경으로 보는 실패 상황</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border p-4"><h3 className="font-semibold">DB는 12,000원, 캐시는 10,000원</h3><p className="mt-2 text-sm leading-6">DB 갱신 뒤 캐시 삭제가 실패하거나, 이전 값을 읽던 요청이 삭제 이후 그 값을 다시 캐시에 넣으면 오래된 가격이 노출될 수 있습니다. 삭제 재시도, 데이터 버전 확인, 변경 이벤트 기반 무효화 등을 요구사항에 맞춰 설계합니다.</p></article>
          <article className="rounded-lg border p-4"><h3 className="font-semibold">두 저장소 중 하나만 성공</h3><p className="mt-2 text-sm leading-6">Write-Through도 DB와 캐시를 하나의 원자적 트랜잭션으로 묶어주지는 않습니다. DB가 성공하고 캐시가 실패했을 때 응답, 재시도, 무효화 정책이 필요합니다. 재시도가 중복 변경을 만들지 않도록 멱등성도 고려합니다.</p></article>
        </div>
      </section>
      <section className="rounded-lg border border-amber-200 bg-amber-50/40 p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
        <h2 className="text-lg font-semibold">원문을 읽을 때 함께 알아둘 점</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6">
          <li><strong>항상 동기화된다는 보장은 없습니다.</strong> 쓰기 경로를 우회한 DB 변경과 부분 실패까지 처리해야 정합성을 유지할 수 있습니다.</li>
          <li><strong>Cache-Aside는 읽기 적재, Write-Through는 쓰기 정책입니다.</strong> 서로 완전히 배타적인 선택이 아니며, 캐시 만료·축출 이후에는 읽기 miss 처리도 필요합니다.</li>
          <li><strong>RAM 대 Disk만의 문제가 아닙니다.</strong> DB도 버퍼 캐시를 쓰며, Redis도 영속성을 구성할 수 있습니다. 여기서 비교하는 것은 갱신 책임과 시점입니다.</li>
          <li><strong>Write-Behind와 구분합니다.</strong> DB 반영을 나중에 비동기로 처리하는 방식은 별도 패턴이며 유실·순서 보장 문제를 다룹니다.</li>
        </ul>
      </section>
      <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-semibold">출처와 함께 읽기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">원문 캡션과 화면 도표를 바탕으로 한국어로 재구성했습니다. 실패 상황과 정합성 설명은 학습용 보완입니다.</p><ul className="mt-3 grid gap-2 text-sm"><li><a className="underline underline-offset-4" href="https://www.instagram.com/reels/DdYIumfpPYp/">원문 · careerwithcodedev의 Redis 캐시 전략</a></li><li><a className="underline underline-offset-4" href="https://redis.io/docs/latest/develop/use-cases/cache-aside/">Redis 공식 문서 · Cache-Aside</a></li><li><a className="underline underline-offset-4" href="https://redis.io/blog/cache-layer-architecture-guide/">Redis · 캐시 계층과 쓰기 패턴</a></li><li><Link className="underline underline-offset-4" href="/backend/redis-cache">Redis 캐시·세션·분산 락</Link></li></ul></section>
      <section id="technology" className="space-y-4">
        <h2 className="text-2xl font-semibold">캐시 위치와 기술 선택</h2>
        <div className="grid gap-4 lg:grid-cols-3">{[
          ["로컬 · Caffeine", "JVM 안에서 조회해 네트워크 왕복을 줄입니다. 인스턴스마다 캐시가 독립적이라 서로 다른 값을 가질 수 있고 재시작하면 사라집니다. 최대 크기·만료·갱신 정책을 함께 설정합니다."],
          ["공유 · Redis·Memcached", "여러 애플리케이션이 네트워크로 접근하는 캐시입니다. 공유의 이점과 네트워크 지연·장애·메모리 비용을 함께 봅니다. Redis의 영속성 여부는 설정에 따라 달라집니다."],
          ["분산·엣지 · Hazelcast·CDN", "클러스터 캐시와 HTTP 엣지 캐시는 해결하는 문제가 다릅니다. 객체·세션 공유가 필요한지, 정적 파일·공개 HTTP 응답을 가까이 제공할지 먼저 정합니다. 관리형 서비스는 운영 책임의 분담 방식입니다."],
        ].map(([title,text])=><article key={title} className="rounded-xl border bg-card p-5"><h3 className="font-semibold">{title}</h3><p className="mt-3 text-sm leading-7">{text}</p></article>)}</div>
        <p className="text-sm leading-7">캐시할 대상은 읽기 빈도뿐 아니라 허용 가능한 오래된 시간, 민감도, 무효화 범위로 고릅니다. 사용자별 응답은 사용자·권한을 캐시 키에 반영하고 공개 CDN 캐시와 섞지 않습니다. TTL은 만료 기준이고 LRU는 용량 부족 때 퇴출 기준입니다.</p>
        <p className="text-sm leading-7">위 API에 values=[1,2,1,3,2], parameter=2를 입력하면 접근 순서를 반영한 퇴출을 관찰합니다. parameter=3과 비교하고 0으로 실패를 확인하세요. 이 LinkedHashMap 실습은 제품별 성능 비교나 TTL·분산 정합성 검증이 아닙니다.</p>
        <div className="flex flex-wrap gap-4 text-sm underline"><a href="https://www.instagram.com/p/DdKCmAWj38e/?img_index=2">8번 원문 · 캐싱 도표·캡션</a><a href="https://github.com/ben-manes/caffeine/wiki">Caffeine 공식 문서</a></div>
      </section>
    </ReferencePage>
  );
}
