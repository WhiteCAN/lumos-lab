import Link from "next/link";
import { LayersIcon } from "lucide-react";
import { ReferencePage, CodeBlock, FlowSection } from "@/components/reference-page";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/messaging/kafka-acks");
const cards = [
  [
    "acks=0 · 확인 없이 전송",
    "브로커 응답을 기다리지 않습니다. 전송 호출이 끝났다는 사실을 서버 저장 성공으로 해석하면 안 됩니다.",
    "NO_ACK는 ACKNOWLEDGED와 다릅니다. 네트워크 오류·버퍼·재시도 설정은 별도입니다."
  ],
  [
    "acks=1 · 리더 기록 확인",
    "리더의 로컬 로그 기록 후 응답합니다. 팔로워 복제 완료까지 기다리지 않습니다.",
    "리더에만 있던 기록은 리더 손실 시 남은 사본이 0일 수 있습니다."
  ],
  [
    "acks=all · 현재 ISR 확인",
    "현재 ISR 전체의 확인을 기다립니다. 설정된 모든 복제본을 뜻하지 않습니다.",
    "min.insync.replicas는 쓰기 허용 하한입니다. ISR이 3이면 minISR=2라도 3개 확인을 기다립니다."
  ],
  [
    "입장 조건과 완료 조건",
    "acks=all일 때 ISR 수가 minISR보다 작으면 이 실습은 쓰기 전에 거절합니다.",
    "실제 Kafka는 기록 후 ISR 축소 등 다른 실패 시점도 있습니다. 이 실습은 ISR을 고정합니다."
  ],
  [
    "ACK와 소비는 다른 단계",
    "ACK는 프로듀서가 받은 쓰기 확인입니다. 소비자 업무 처리가 끝났다는 증거가 아닙니다.",
    "중복·재시도·멱등성·트랜잭션·offset 커밋은 추가 설계가 필요합니다."
  ],
  [
    "손실 뒤 남는 사본",
    "leaderFailed=true는 쓰기 판정 후 리더 한 대를 잃는 사건입니다.",
    "남은 사본 수만 계산합니다. 선출·디스크 flush·복구·가용성을 보장하지 않습니다."
  ]
];
const scenarios = [
  "기본값: ISR=3, 보유=2, acks=all → WAITING. 보유=3 → ACKNOWLEDGED.",
  "acks=1·보유=1·leaderFailed=true → ACKNOWLEDGED 뒤 survivingCopies=0.",
  "ISR=1·minISR=2·acks=all → NOT_ENOUGH_REPLICAS와 acceptedCopies=0.",
  "ISR>replicas 또는 보유>ISR → HTTP 400. 개수 범위는 1~5, 보유는 0~ISR."
];
const related = [["/messaging/kafka-config","Kafka 설정 전체"],["/messaging/kafka-architecture","Kafka 아키텍처"]];
export default function Page() {
  return <ReferencePage pageHref="/messaging/kafka-acks" label="개념 · 흐름 · 실행 검증" description="acks=0·1·all과 ISR·min.insync.replicas를 비교하고 리더 손실 후 남는 사본을 실험합니다." icon={LayersIcon} colorClass="border-sky-200 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20">

    <section className="grid gap-4 xl:grid-cols-3" aria-label="핵심 개념">{cards.map(([title, body, caution], index) => <article key={title} className="min-w-0 rounded-xl border bg-card p-5"><p className="text-sm font-medium text-sky-700 dark:text-sky-300">0{index + 1}</p><h2 className="mt-2 text-lg font-semibold [overflow-wrap:anywhere]">{title}</h2><p className="mt-3 text-sm leading-6">{body}</p><p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">{caution}</p></article>)}</section>
    <FlowSection title="대표 실행 흐름" steps={["입력과 복제 수 검사","all이면 최소 ISR 검사","요청 ACK 조건 판정","선택적으로 리더 손실 적용","남은 사본과 한계 확인"]} />
    <CodeBlock title="Java · 핵심 분기와 사용 예시" code={"// 실제 Kafka 설정 예시: 이 페이지의 API는 Kafka에 연결하지 않습니다.\nprops.put(\"acks\", \"all\");\n// 토픽 설정 예시: replication.factor=3, min.insync.replicas=2\n// ISR=3, 기록 보유=2라면 고정 ISR 모형에서는 아직 WAITING.\n// ISR=1, minISR=2라면 쓰기 거절.\n// acks=1, 기록 보유=1, 리더 손실이면 남은 사본=0."} />
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">입력을 바꿔 확인하기</h2><ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-6 [overflow-wrap:anywhere]">{scenarios.map(item => <li key={item}>{item}</li>)}</ol></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">출처와 이어서 보기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">원문에서 확인한 주제를 학습용으로 재구성했습니다. 코드·실패 실험·설계 주의점은 프로젝트에서 보완한 내용입니다.</p><ul className="mt-3 space-y-2 text-sm"><li><a className="underline" href="https://www.instagram.com/reels/Dd8FgbUhs3r/">Instagram 원문</a></li><li><a className="underline" href="https://kafka.apache.org/41/javadoc/constant-values.html">공식 문서 · 세부 계약 확인</a></li>{related.map(([href, title]) => <li key={href}><Link className="underline" href={href}>{title}</Link></li>)}</ul></section>
  </ReferencePage>;
}
