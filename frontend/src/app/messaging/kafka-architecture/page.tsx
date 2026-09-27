import { SystemDiagram } from "@/components/system-diagram";
import type { Metadata } from "next";
import Link from "next/link";
import { NetworkIcon } from "lucide-react";
import { FlowSection, ReferencePage } from "@/components/reference-page";

export const metadata: Metadata = {
  title: "Kafka 아키텍처 | Lumos Lab",
  description: "Producer부터 Broker, Topic, Partition, Consumer Group까지 주문 이벤트로 이해하는 Kafka 구조와 KRaft, 복제, 오프셋 정리입니다.",
};

const terms = [
  ["Producer", "이벤트를 발행하는 애플리케이션", "주문 서비스가 OrderCreated 이벤트를 orders 토픽에 보냅니다."],
  ["Topic", "이벤트를 분류하는 논리적 이름", "orders, payments처럼 업무별로 나눕니다. 토픽은 하나 이상의 파티션으로 구성됩니다."],
  ["Partition", "순서가 있는 이벤트 로그", "이벤트가 끝에 추가됩니다. 병렬 처리와 순서 보장의 단위이며 토픽 전체 순서를 보장하지는 않습니다."],
  ["Broker", "파티션을 저장하는 Kafka 서버", "여러 브로커가 클러스터를 구성합니다. 브로커 하나가 여러 토픽의 파티션과 복제본을 저장할 수 있습니다."],
  ["Consumer Group", "파티션을 나누어 읽는 소비자 묶음", "일반 소비자 그룹에서는 한 파티션을 그룹 내 한 소비자가 담당합니다. 다른 그룹은 같은 이벤트를 독립적으로 읽습니다."],
  ["KRaft", "클러스터 메타데이터를 관리하는 방식", "컨트롤러들이 Raft 합의로 메타데이터를 관리합니다. 주문 이벤트를 처리하는 Consumer의 역할과는 다릅니다."],
];

const questions = [
  ["Kafka를 왜 사용하나요?", "이벤트를 내보내는 서비스와 처리하는 서비스를 분리하고, 많은 이벤트를 저장·전달·재처리하기 위해 사용합니다. 소비자가 잠시 멈춰도 보존된 로그부터 이어 읽을 수 있습니다."],
  ["Topic과 Partition은 어떻게 다른가요?", "Topic은 이벤트의 논리적 분류이고 Partition은 그 토픽을 나눈 실제 로그 단위입니다. 여러 파티션을 여러 소비자가 병렬로 처리합니다."],
  ["Consumer를 늘리면 항상 빨라지나요?", "일반 소비자 그룹이 파티션 3개인 토픽만 읽는다면 동시에 파티션을 담당하는 소비자는 최대 3개입니다. 소비자를 4개로 늘려도 하나는 할당받을 파티션이 없습니다."],
  ["Offset을 커밋하면 메시지가 삭제되나요?", "아닙니다. 커밋은 그룹이 다시 시작할 위치를 기록하는 일입니다. 데이터 삭제는 보존·압축 정책으로 결정됩니다."],
  ["파티션과 복제본을 늘리는 목적은 같나요?", "파티션은 데이터를 나눠 병렬 처리하고, 복제본은 같은 파티션의 사본을 보관해 장애에 대비합니다. 둘 다 저장 공간과 운영 비용을 함께 고려해야 합니다."],
  ["ZooKeeper도 설치해야 하나요?", "Kafka 4.0부터 ZooKeeper 모드는 제거되었습니다. 신규 학습에서는 KRaft를 기준으로 보고, 오래된 구성도는 사용 버전을 확인합니다."],
];

const sources = [
  ["원본 릴스 · HTTP.CODE.404", "https://www.instagram.com/reels/DdwlpNOOqiP/"],
  ["Apache Kafka · 기본 개념", "https://kafka.apache.org/intro/"],
  ["Apache Kafka · Consumer API", "https://kafka.apache.org/40/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html"],
  ["Apache Kafka · KRaft", "https://kafka.apache.org/40/operations/kraft/"],
  ["Apache Kafka · 4.0 변경 사항", "https://kafka.apache.org/40/getting-started/upgrade/"],
];

export default function KafkaArchitecturePage() {
  return (
    <ReferencePage
      pageHref="/messaging/kafka-architecture"
      label="이벤트가 저장되고 소비되는 구조"
      description="Producer가 보낸 이벤트는 브로커의 파티션 로그에 저장되고, Consumer가 자신의 속도로 읽습니다. 주문 이벤트 한 건을 따라가며 구성 요소의 관계와 장애·재처리의 기준을 알아봅니다."
      icon={NetworkIcon}
      brand="apachekafka"
      colorClass="border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20"
    >
      <nav aria-label="Kafka 아키텍처 목차" className="flex flex-wrap gap-2 text-sm">
        {[["실습 읽는 법", "practice"], ["구성 요소", "components"], ["클러스터 배치", "cluster"], ["소비자 그룹", "groups"], ["오프셋과 재처리", "offsets"], ["면접 질문", "questions"]].map(([label, id]) => (
          <a key={id} href={`#${id}`} className="rounded-lg border bg-card px-3 py-2 underline-offset-4 hover:underline">{label}</a>
        ))}
      </nav>

      <section id="practice" className="scroll-mt-4 rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold">먼저 실행하기 · 키와 파티션별 위치 관찰</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">위 API 실습은 Java 서버가 요청마다 새 목록을 만드는 교육용 모형입니다. 입력 JSON을 바꾸고 API 실행을 누르면 요청·HTTP 상태·응답과 단계 기록이 표시됩니다. 실행 중에는 응답을 기다리며, 잘못된 입력은 오류로 표시됩니다.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {[
            ["1 · 기본 요청", "values=[1,4,2,1,7], parameter=3으로 실행합니다. result의 파티션 1은 [1,4,1,7], 파티션 2는 [2]가 됩니다. 기록이 없는 파티션 0은 결과 객체에 나타나지 않습니다."],
            ["2 · 단계 기록", "steps에서 파티션 1의 offset은 0·1·2·3, 파티션 2는 0부터 시작합니다. 같은 키 1은 같은 파티션으로 가지만 같은 값이 두 번 들어가는 것을 막지는 않습니다."],
            ["3 · 분할 수 변경", "같은 values에 parameter=2를 넣어 다시 실행합니다. 파티션 0은 [4,2], 파티션 1은 [1,1,7]입니다. 나머지 기반 배치가 달라지는 실험이며, 실제 Kafka의 파티션 증설이나 데이터 이동을 실행하지 않습니다."],
            ["4 · 실패 확인", "parameter=0 또는 11은 분할 수 범위 오류입니다. values=[]도 거절됩니다. 각 키는 -10000~10000 정수, 목록은 1~30개, 분할 수는 1~10입니다. 이 모형에서 fail 필드는 사용하지 않으므로 true로 바꿔도 브로커 장애가 발생하지 않습니다."],
          ].map(([title, detail]) => (
            <article key={title} className="rounded-lg border bg-muted/20 p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{detail}</p>
            </article>
          ))}
        </div>
        <details className="mt-4 rounded-lg border p-4 text-sm">
          <summary className="cursor-pointer font-semibold">소스에서 멈춰 볼 위치와 실습의 한계</summary>
          <p className="mt-3 break-words leading-7"><code>backend/src/main/java/com/lumos/lab/learning/ScenarioLabController.java</code>의 <code>run()</code>에서 입력을 확인하고, 같은 폴더 <code>ScenarioLabService.java</code>의 <code>partition()</code>에서 <code>Math.floorMod</code>, <code>entries.size()</code>, <code>entries.add(key)</code> 전후를 비교하세요. 실패 입력은 <code>capacity()</code>에서 확인합니다.</p>
          <p className="mt-2 leading-7 text-muted-foreground">Kafka 기본 해시 파티셔너, Consumer 할당·커밋, 영속 로그, ACK·복제·리더 선출은 실행하지 않습니다. 요청 간 데이터가 유지되지 않아 다시 실행하면 offset도 다시 0부터 시작합니다. 실제 Kafka의 offset은 압축·트랜잭션 등에 따라 빈 번호가 생길 수 있으므로 메시지 개수와 동일하게 취급하지 않습니다.</p>
        </details>
      </section>

      <section id="components" className="scroll-mt-4">
        <h2 className="mb-3 text-xl font-semibold">01 · 여섯 가지 구성 요소</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {terms.map(([title, role, detail]) => (
            <article key={title} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm font-medium text-sky-700 dark:text-sky-300">{role}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <FlowSection title="주문 이벤트 한 건의 이동" steps={[
        { label: "주문 서비스", icon: "server", detail: "orders 토픽으로 이벤트 발행" },
        { label: "파티션 리더", icon: "apachekafka", detail: "키·파티셔너에 따라 선택된 로그에 기록" },
        { label: "배송 Consumer", icon: "server", detail: "할당된 파티션에서 가져와 배송 처리" },
        { label: "Offset 커밋", icon: "done", detail: "다시 시작할 위치를 그룹별로 기록" },
      ]} />

      <SystemDiagram kind="kafka" />
      <section id="cluster" className="scroll-mt-4 rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold">02 · Topic은 분류, Partition은 로그, Broker는 서버</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">Topic → Partition → Broker를 서로 다른 서버를 거치는 순서로 외우지 마세요. 아래는 orders 토픽의 파티션 3개를 브로커 3대에 배치하고, 각 파티션을 3개씩 복제한 예시입니다.</p>
        <figure className="mt-5">
          <div className="grid gap-3 lg:grid-cols-3">
            {[0, 1, 2].map((broker) => (
              <div key={broker} className="rounded-xl border bg-muted/30 p-4">
                <h3 className="font-semibold">Broker {broker + 1}</h3>
                <p className="mt-1 text-xs text-muted-foreground">orders 토픽의 파티션 복제본</p>
                <ul className="mt-3 space-y-2">
                  {[0, 1, 2].map((partition) => (
                    <li key={partition} className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm ${broker === partition ? "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40" : "bg-background"}`}>
                      <span>Partition {partition}</span>
                      <strong>{broker === partition ? "Leader · 쓰기 담당" : "Follower · 복제"}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <figcaption className="mt-3 text-sm leading-7 text-muted-foreground">논리적 파티션은 3개, 저장되는 복제본은 총 9개입니다. 리더 장애 시 적격 복제본으로 리더를 바꿉니다. 데이터 손실 위험은 복제 수뿐 아니라 acks, min.insync.replicas와 리더 선출 설정에도 영향을 받습니다.</figcaption>
        </figure>
        <aside className="mt-4 rounded-lg border border-violet-200 bg-violet-50/60 p-4 text-sm leading-7 dark:border-violet-900 dark:bg-violet-950/20">
          <strong>KRaft 컨트롤러 영역</strong>
          <p>브로커 등록, 파티션 리더 등 클러스터 메타데이터를 관리합니다. 컨트롤러 쿼럼과 위의 이벤트 저장 영역은 역할이 다릅니다. Kafka 4.0 이상에서는 ZooKeeper 없이 KRaft를 사용합니다.</p>
        </aside>
      </section>

      <section id="groups" className="scroll-mt-4 rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold">03 · 같은 그룹은 분담, 다른 그룹은 독립 소비</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {[["배송 그룹 · shipping", ["Consumer A ← Partition 0, 1", "Consumer B ← Partition 2"], "배송 작업을 두 소비자가 나눠 처리합니다. 소비자가 나가거나 들어오면 파티션이 재할당될 수 있습니다."], ["분석 그룹 · analytics", ["Consumer C ← Partition 0, 1, 2"], "배송 그룹과 같은 주문 이벤트를 독립적으로 읽어 통계를 만듭니다. 읽는 위치도 배송 그룹과 별도로 관리합니다."]].map(([title, assignments, description]) => (
            <article key={title as string} className="rounded-xl border bg-muted/20 p-4">
              <h3 className="font-semibold">{title}</h3>
              <ul className="my-3 space-y-2 text-sm">{(assignments as string[]).map((assignment) => <li key={assignment} className="rounded-lg border bg-background p-3">{assignment}</li>)}</ul>
              <p className="text-sm leading-7 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">이 설명은 일반 Kafka Consumer Group 기준입니다. 같은 파티션 안의 로그 순서가 보장되어도, 애플리케이션이 여러 스레드로 병렬 처리하면 업무 완료 순서는 달라질 수 있습니다.</p>
        <div className="mt-4 rounded-lg border bg-muted/20 p-4 text-sm leading-7">
          <h3 className="font-semibold">주문 하나의 순서와 느린 소비자를 구분하기</h3>
          <p className="mt-2 text-muted-foreground">같은 주문의 생성·취소 순서가 중요하다면 주문 ID를 키로 사용하는 전략을 검토합니다. 동일 키의 배치는 파티셔너와 파티션 수가 유지된다는 전제가 필요합니다. 한 키에 부하가 몰리면 소비자 수만 늘려도 그 파티션의 병목은 해소되지 않습니다.</p>
          <p className="mt-2 text-muted-foreground">Consumer lag은 읽을 수 있는 로그의 끝과 소비 위치 사이의 차이를 보는 지표입니다. 커밋 기준으로 측정한다면 커밋 주기의 영향도 받습니다. lag이 크다고 곧바로 유실을 뜻하지는 않지만, 처리가 보존 정책보다 뒤처지면 다시 읽을 데이터가 사라질 수 있습니다.</p>
        </div>
      </section>

      <section id="offsets" className="scroll-mt-4 rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold">04 · Offset은 위치, 커밋은 재시작 지점</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-muted/20 p-4">
            <h3 className="font-semibold">Partition 0의 로그 예시</h3>
            <ol className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              {[40, 41, 42].map((offset) => <li key={offset} className="rounded-lg border bg-background p-3"><span className="block text-xs text-muted-foreground">offset</span><strong>{offset}</strong></li>)}
            </ol>
            <p className="mt-3 text-sm leading-7">41번까지 처리했다면 다음에 읽을 위치인 <strong>42</strong>를 커밋합니다. Offset은 파티션마다 별도로 존재합니다.</p>
          </div>
          <div className="space-y-3 text-sm leading-7">
            <p><strong>처리 후 커밋:</strong> 처리 성공 뒤 커밋 전에 장애가 나면 같은 이벤트를 다시 받을 수 있습니다. 주문 ID 같은 업무 키로 중복 처리를 막는 멱등성이 필요합니다.</p>
            <p><strong>처리 전 커밋:</strong> 커밋 뒤 실제 처리 전에 장애가 나면 재시작 시 해당 작업을 건너뛸 수 있습니다.</p>
            <p><strong>다시 읽기:</strong> 오프셋을 되돌려도 보존 기간이 지나 삭제되었거나 압축 정책으로 제거된 이벤트는 복구되지 않습니다. 소비와 삭제는 별개의 동작입니다.</p>
          </div>
        </div>
      </section>

      <section id="questions" className="scroll-mt-4 rounded-xl border bg-card p-5">
        <h2 className="text-xl font-semibold">05 · 설명할 수 있는지 확인하기</h2>
        <p className="mt-2 text-sm text-muted-foreground">먼저 답을 떠올린 뒤 펼쳐 비교해 보세요.</p>
        <div className="mt-4 space-y-2">{questions.map(([question, answer]) => (
          <details key={question} className="rounded-lg border p-4">
            <summary className="cursor-pointer font-medium">{question}</summary>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{answer}</p>
          </details>
        ))}</div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">이어서 학습하기 · 출처</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link className="underline underline-offset-4" href="/messaging/kafka">Kafka 기초 · 키와 파티션 선택</Link>
          <Link className="underline underline-offset-4" href="/messaging/kafka-config">Kafka 설정 옵션 · 전달 보장</Link>
          <Link className="underline underline-offset-4" href="/messaging/saga-outbox">Saga / Outbox · DB와 이벤트 발행</Link>
        </div>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">원문 캡션의 구성 요소와 면접 질문을 확인하고 공식 문서와 프로젝트 구현 기준으로 보완했습니다. 영상 전체의 전사는 아닙니다. 배치도는 설명용 예시이며 API 실습도 실제 Kafka 클러스터에 연결하지 않습니다.</p>
        <ul className="mt-3 space-y-2 text-sm">{sources.map(([label, url]) => <li key={url}><a className="underline underline-offset-4" href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ul>
      </section>
    </ReferencePage>
  );
}
