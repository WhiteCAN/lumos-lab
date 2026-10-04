import { UsersIcon } from "lucide-react";
import { CodeBlock, ComparisonTable, FlowSection, ReferencePage } from "@/components/reference-page";
import { LearningFlowCanvas } from "@/components/learning-flow-canvas";
import { getStudyMetadata } from "@/lib/study-pages";

export const metadata = getStudyMetadata("/backend/waiting-room");

export default function WaitingRoomPage() {
  return <ReferencePage pageHref="/backend/waiting-room" label="트래픽 제어 · FIFO" icon={UsersIcon}
    colorClass="bg-sky-50/60 dark:bg-sky-950/20"
    description="한꺼번에 도착한 방문자를 대기시키고, 빈자리가 생길 때 순서대로 입장시킵니다. 대기 화면의 숫자보다 서버가 입장 권한을 검사하는 것이 핵심입니다.">
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-xl font-semibold">3분 실험: A가 나가면 누가 들어갈까요?</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7">
        <li>기본값(2명·10초)으로 <strong>방문자 5명 예제</strong> 실행: A·B 입장, C 1번·D 2번·E 3번.</li>
        <li>ID를 C로 바꾸고 <strong>입장 권한 확인</strong>: 아직 대기 중이므로 거절 로그. <strong>진입 / 재요청</strong>해도 C는 1번 그대로입니다.</li>
        <li>ID를 A로 바꾸고 <strong>퇴장 / 대기 취소</strong>: 빈 한 자리를 C가 이어받습니다.</li>
        <li><strong>+10초</strong>: B·C가 만료되고 D·E가 입장합니다. A의 권한 확인은 거절됩니다.</li>
        <li>A를 다시 진입시키면 맨 뒤에 등록됩니다. 초기화 후 한도를 1명·3명으로 바꿔 비교하세요.</li>
      </ol>
      <p className="mt-3 text-sm text-muted-foreground">가상 시계는 버튼을 눌러야 흐릅니다. 시간 이동 후 도착 시점에 만료 정리·입장을 한 번 실행하며 중간 시점을 재현하지 않습니다. 대기 티켓 자체의 만료·자동 폴링·예상 대기 시간은 이 실습에서 생략합니다.</p>
    </section>
    <FlowSection title="한 방문자가 통과하는 순서" steps={[
      { label: "진입 요청", icon: "user", detail: "기존 티켓 확인" },
      { label: "FIFO 대기", icon: "document", detail: "빈자리까지 순서 유지" },
      { label: "입장 승인", icon: "verify", detail: "한도 확인·유효기간 부여" },
      { label: "보호 API 검사", icon: "spring", detail: "유효한 입장 권한 확인" },
      { label: "퇴장 / 만료", icon: "done", detail: "자리 반환·다음 방문자" },
    ]} />
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-xl font-semibold">운영용 구성: 대기실을 우회해도 서버가 막아야 합니다</h2>
      <p className="my-3 text-sm leading-7 text-muted-foreground">아래는 확장 설계도입니다. 위 실습의 Java 컬렉션을 공유 저장소로 바꾸는 것 외에도 인증·원자성·장애 정책이 필요합니다. 선은 왼쪽에서 오른쪽으로 요청이 흐르고, 저장소 접근만 아래로 분기합니다.</p>
      <LearningFlowCanvas motion="flow" title="가상 대기실의 서버 경계" height={420} graph={{ nodes: [
        { id: "visitor", label: "방문자", detail: "진입·상태 조회", icon: "user", x: 0, y: 0 },
        { id: "gate", label: "입장 게이트", detail: "티켓 검증·정원 관리", icon: "verify", x: 300, y: 0 },
        { id: "app", label: "보호된 서비스", detail: "예약·주문 API", icon: "spring", x: 600, y: 0 },
        { id: "redis", label: "공유 대기 상태", detail: "FIFO·활성 세션·만료", icon: "redis", x: 300, y: 240 },
      ], edges: [
        { source: "visitor", target: "gate", label: "티켓 제출" },
        { source: "gate", target: "app", label: "유효한 입장만" },
        { source: "gate", target: "redis", label: "원자적 조회·갱신" },
      ] }} />
    </section>
    <ComparisonTable columns={["가상 대기실", "요청 속도 제한"]} rows={[
      { topic: "목적", values: ["방문자를 대기시키고 정원이 생기면 입장", "시간 구간당 요청 수 제한"] },
      { topic: "기준", values: ["입장 중인 세션 수·대기 정책", "사용자·IP·키별 요청 빈도"] },
      { topic: "함께 쓰기", values: ["입장 후에도 무거운 API의 부하를 별도 관리", "대기실 진입·폴링 폭주도 제한"] },
    ]} />
    <div className="grid min-w-0 gap-4 xl:grid-cols-3">
      <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">FIFO와 공정성</h2><p className="mt-3 text-sm leading-7">이 실습은 Java Deque에 도착한 순서대로 입장시킵니다. 운영에서는 서버가 발급한 순서 번호를 기준으로 삼고, 동시 도착의 정렬·우선순위·재접속 정책을 정해야 합니다. 사용자가 보낸 시간이나 UI 순번을 신뢰하지 않습니다.</p></section>
      <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">원자적인 자리 배정</h2><p className="mt-3 text-sm leading-7">빈자리 확인과 대기열에서 꺼내기, 활성 세션 등록이 분리되면 여러 서버가 같은 마지막 자리를 배정할 수 있습니다. Redis 스크립트 등으로 한 번에 처리하고, Cluster에서는 관련 키의 슬롯도 설계해야 합니다. 이 실습은 요청별 순차 실행이므로 분산 동시성을 검증하지 않습니다.</p></section>
      <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">만료와 악용 방지</h2><p className="mt-3 text-sm leading-7">브라우저 종료만으로 퇴장을 감지할 수 없어 만료 정리가 필요합니다. 운영 티켓은 추측하기 어려운 값으로 발급하고 사용자·이벤트·만료에 묶어 서버에서 검사합니다. 실습의 A·B는 선택용 ID이며 인증 토큰이 아닙니다. 실제 입장은 구매 성공이나 재고 확보를 보장하지 않습니다.</p></section>
    </div>
    <CodeBlock title="Java 21 · 빈자리만큼 선착순 입장 (실제 admit 메서드의 핵심)" code={`long active = activeCount(tickets);
while (active < capacity && !waiting.isEmpty()) {
    Ticket ticket = waiting.removeFirst();
    ticket.state = "ACTIVE";
    ticket.expiresAt = now + ttl;
    active++;
    // 승인 기록을 추가한 뒤 응답에 상태를 담는다.
}
// 운영에서는 이 전체 판단·변경을 공유 저장소에서 원자적으로 수행한다.
// synchronized만으로는 서로 다른 서버의 경쟁을 막을 수 없다.`} />
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-xl font-semibold">운영 전 더 필요한 것</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
        <li>대기 이탈 감지와 heartbeat TTL, 입장 후 세션 갱신·재진입 정책을 각각 설계합니다. 실습은 고정 만료이며 CHECK로 연장되지 않습니다.</li>
        <li>폴링 간격과 jitter를 두고 서버 응답에 다음 조회 간격을 안내합니다. SSE를 써도 재연결·동기화·연결 수 비용을 고려합니다.</li>
        <li>대기 길이·입장률·만료율·실제 서비스 지연과 오류율로 정원을 조정합니다. 대기 순번만으로 남은 시간을 확정할 수 없습니다.</li>
        <li>저장소 장애 때 입장을 막을지 제한적으로 허용할지 정하고, 원본 서버 직접 접근도 차단합니다. 부하·장애·중복 요청 테스트가 별도로 필요합니다.</li>
      </ul>
      <h3 className="mt-5 font-semibold">공식 자료</h3>
      <ul className="mt-2 space-y-2 text-sm underline underline-offset-4">
        <li><a href="https://developers.cloudflare.com/waiting-room/reference/queueing-methods/">Cloudflare: 대기 순서 정책</a></li>
        <li><a href="https://developers.cloudflare.com/waiting-room/reference/waiting-room-cookie/">Cloudflare: 쿠키와 재진입</a></li>
        <li><a href="https://redis.io/docs/latest/develop/data-types/sorted-sets/">Redis: Sorted sets</a> · <a href="https://redis.io/docs/latest/develop/interact/programmability/eval-intro/">Lua의 원자적 실행</a></li>
      </ul>
    </section>
  </ReferencePage>;
}
