import Link from "next/link";
import { CopyIcon, DatabaseIcon, GitBranchIcon } from "lucide-react";
import { ConceptGrid, FlowSection, ReferencePage } from "@/components/reference-page";

import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/backend/sharding-replica");

const comparisons = [
  ["데이터 배치", "서로 다른 데이터를 샤드에 나눠 저장", "같은 데이터의 사본을 여러 노드에 저장"],
  ["주요 목적", "저장 용량과 읽기·쓰기 처리량 확장", "장애 대비와 읽기 부하 분산"],
  ["쓰기 요청", "샤드 키를 기준으로 대상 샤드에 전달", "일반적인 단일 Primary 구성에서는 Primary가 처리"],
  ["읽기 요청", "대상 샤드 조회, 전체 조회는 여러 샤드 결과 취합", "읽기를 허용한 Replica로 분산 가능"],
  ["주요 비용", "샤드 간 조인·트랜잭션, 데이터 재배치", "복제 지연, 저장 공간, 장애 전환 관리"],
  ["장애 대응", "샤딩 자체는 사본을 만들지 않음", "승격과 요청 전환 구성을 통해 가용성 확보"],
];

const cautions = [
  ["샤드 키와 핫스팟", "user_id처럼 요청을 고르게 나누고 자주 조회하는 조건에 맞는 키를 선택합니다. 특정 고객이나 최신 날짜에 요청이 몰리면 한 샤드만 바빠지는 핫스팟이 생깁니다."],
  ["샤드 확장과 재배치", "샤드를 늘리면 기존 데이터를 옮겨야 할 수 있습니다. 단순한 ID % 샤드 수 방식은 샤드 수가 바뀔 때 많은 데이터의 위치가 달라집니다."],
  ["복제 지연과 최신 조회", "비동기 복제에서는 저장 성공 직후 Replica가 이전 값을 반환할 수 있습니다. 자신의 변경을 바로 확인해야 하는 흐름은 Primary 조회나 복제 반영 확인 정책이 필요합니다."],
  ["동기 복제의 대가", "동기 복제는 설정된 복제 확인을 기다려 지연과 장애 시 데이터 손실 위험의 균형을 조절합니다. 확인 기준은 제품·설정마다 다르며, 모든 Replica가 즉시 최신 조회를 보장하는 것은 아닙니다."],
  ["장애 전환은 별도 구성", "Primary 장애를 감지하고 Replica를 승격한 뒤 요청을 새 Primary로 전환해야 합니다. 비동기 복제는 미전달 데이터가 유실될 수 있고, 기존 Primary의 쓰기도 차단해야 합니다."],
  ["레플리카는 백업이 아님", "실수로 지운 데이터도 복제됩니다. 과거 시점으로 복구하려면 별도 백업과 복구 절차가 필요합니다."],
];

export default function ShardingReplicaPage() {
  return (
    <ReferencePage pageHref="/backend/sharding-replica"
      label="데이터베이스 확장과 복제"
      description="샤딩(Sharding)은 데이터를 나누어 저장하는 방식이고, 레플리카(Replica)는 같은 데이터를 복제해 둔 사본입니다. 나누기와 복사는 서로 다른 문제를 해결하며 함께 사용할 수 있습니다."
      icon={DatabaseIcon}
      colorClass="border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/60 dark:bg-indigo-950/20"
    >
      <ConceptGrid items={[
        { title: "샤딩 = 나누기", description: "하나의 논리적 데이터 집합을 여러 샤드에 수평 분할합니다.", bullets: ["각 샤드는 전체 데이터의 일부를 담당", "샤드 키로 저장·조회 위치 결정", "큰 데이터와 쓰기 부하를 여러 서버에 분산"], icon: GitBranchIcon, colorClass: "border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/20" },
        { title: "레플리카 = 복사본", description: "복제(Replication)로 유지하는 데이터의 사본입니다.", bullets: ["Primary의 변경을 Replica에 전달", "읽기 분산은 해당 구성이 지원할 때 가능", "사본 수가 늘어도 원본 데이터 용량은 줄지 않음"], icon: CopyIcon, colorClass: "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20" },
        { title: "함께 사용하기", description: "각 샤드에 Primary와 Replica를 구성할 수 있습니다.", bullets: ["샤딩으로 데이터를 분산", "복제로 각 샤드의 사본 유지", "분산과 장애 대응 정책을 함께 설계"], icon: DatabaseIcon, colorClass: "border-violet-200 bg-violet-50/40 dark:border-violet-900/60 dark:bg-violet-950/20" },
      ]} />

      <section className="grid gap-4 lg:grid-cols-2" aria-label="데이터 배치 비교">
        <article className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold">샤딩: 회원 100만 명 나누기</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">아래는 회원 ID 범위로 나눈 학습용 예시입니다. 실제 운영에서는 데이터 크기와 요청 분포를 함께 봅니다.</p>
          <div className="mt-4 rounded-lg border bg-muted/40 p-3 text-center text-sm">애플리케이션 → 회원 ID로 샤드 선택</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-sky-300 p-4 dark:border-sky-800"><h3 className="font-semibold">샤드 A</h3><p className="mt-2 text-sm">회원 1 ~ 500,000</p></div>
            <div className="rounded-lg border border-violet-300 p-4 dark:border-violet-800"><h3 className="font-semibold">샤드 B</h3><p className="mt-2 text-sm">회원 500,001 ~ 1,000,000</p></div>
          </div>
          <p className="mt-3 text-sm leading-6">회원 100,000번은 샤드 A로, 800,000번은 샤드 B로 요청합니다. 전체 회원 수는 두 샤드의 결과를 모아 계산합니다.</p>
        </article>
        <article className="rounded-lg border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold">레플리카: 회원 100만 명 복제하기</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">일반적인 단일 Primary와 읽기 가능한 Replica 구성의 예시입니다. 복제 방식과 읽기 지원은 제품마다 다릅니다.</p>
          <div className="mt-4 rounded-lg border bg-muted/40 p-3 text-center text-sm">Primary · 전체 회원 100만 명 · 쓰기 처리</div>
          <p className="my-2 text-center text-sm text-muted-foreground">↓ 변경 내용 복제 ↓</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-300 p-4 dark:border-emerald-800"><h3 className="font-semibold">Replica A</h3><p className="mt-2 text-sm">전체 회원 사본 · 읽기</p></div>
            <div className="rounded-lg border border-emerald-300 p-4 dark:border-emerald-800"><h3 className="font-semibold">Replica B</h3><p className="mt-2 text-sm">전체 회원 사본 · 읽기</p></div>
          </div>
          <p className="mt-3 text-sm leading-6">세 노드가 같은 데이터 집합을 보관합니다. 비동기 복제 중에는 각 노드의 최신 반영 시점이 다를 수 있습니다.</p>
        </article>
      </section>

      <section className="min-w-0 rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">한눈에 비교</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">샤딩과 레플리카의 목적과 동작 비교</caption>
            <thead className="bg-muted/60"><tr><th scope="col" className="p-3">구분</th><th scope="col" className="p-3">샤딩</th><th scope="col" className="p-3">레플리카</th></tr></thead>
            <tbody>{comparisons.map(([topic, sharding, replica]) => (
              <tr key={topic} className="border-t"><th scope="row" className="whitespace-nowrap p-3 font-medium">{topic}</th><td className="p-3 leading-6">{sharding}</td><td className="p-3 leading-6">{replica}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <FlowSection title="샤드 선택과 복제 · 회원 ID에 따라 달라지는 경로" defaultPathLabel="회원 800,000 · 샤드 B" steps={[
        { label: "회원 800,000 확인", icon: "user" }, { label: "샤드 B 선택", icon: "branch", detail: "샤드 A에는 쓰지 않음" },
        { label: "Primary B에 쓰기", icon: "database" }, { label: "Replica B로 복제", icon: "database", detail: "비동기 복제는 지연 가능" },
      ]} paths={[{ label: "회원 100,000 · 샤드 A", steps: [
        { label: "회원 100,000 확인", icon: "user" }, { label: "샤드 A 선택", icon: "branch", detail: "샤드 B에는 쓰지 않음" },
        { label: "Primary A에 쓰기", icon: "database" }, { label: "Replica A로 복제", icon: "database", detail: "비동기 복제는 지연 가능" },
      ] }]} colorClass="border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/20" />
      <FlowSection title="함께 쓸 때의 읽기 흐름" steps={[{ label: "회원 ID로 샤드 선택", icon: "branch" }, { label: "최신성 요구 확인", icon: "verify" }, { label: "Primary 또는 읽기 가능한 Replica 조회", icon: "database" }, { label: "응답 반환", icon: "user" }]} colorClass="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20" />

      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">설계할 때 확인할 점</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{cautions.map(([title, description]) => (
          <article key={title} className="rounded-lg border bg-muted/20 p-4"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article>
        ))}</div>
      </section>

      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="text-lg font-semibold">상황별 판단 기준</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6">
          <li><strong>조회만 느리다면:</strong> 실행 계획과 인덱스, 쿼리부터 점검하고 읽기 부하가 병목이면 Replica를 검토합니다.</li>
          <li><strong>용량이나 쓰기가 한계라면:</strong> 단일 DB 최적화 후에도 한계가 남는지 확인하고 샤딩의 운영 비용을 비교합니다.</li>
          <li><strong>장애에도 서비스를 유지해야 한다면:</strong> 복제뿐 아니라 장애 감지, 승격, 요청 전환과 복구 훈련까지 준비합니다.</li>
          <li><strong>샤딩과 파티셔닝:</strong> 파티셔닝은 데이터를 나누는 넓은 개념입니다. 한 DB 내부의 테이블 파티셔닝이 곧 여러 서버로의 샤딩을 뜻하지는 않습니다.</li>
        </ul>
        <Link href="/backend/db-index-transaction" className="mt-4 inline-block text-sm underline underline-offset-4">DB 인덱스·트랜잭션 격리 수준</Link>
      </section>
    </ReferencePage>
  );
}
