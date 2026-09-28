"use client";

import { useRef, useState } from "react";
import { Clock3Icon, DoorOpenIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/constants/api";
import { requestJson } from "@/services/http";

type Operation = { type: "JOIN" | "CHECK" | "LEAVE" | "ADVANCE"; visitor: string; seconds: number };
type Visitor = { visitor: string; state: "WAITING" | "ACTIVE" | "LEFT" | "EXPIRED"; position: number; expiresAt: number | null };
type Result = { now: number; capacity: number; visitors: Visitor[]; events: { time: number; message: string }[]; scope: string };
const labels = { WAITING: "대기 중", ACTIVE: "입장 중", LEFT: "퇴장·취소", EXPIRED: "만료" };
const sample: Operation[] = ["A", "B", "C", "D", "E"].map(visitor => ({ type: "JOIN", visitor, seconds: 0 }));

export function WaitingRoomLab() {
  const [capacity, setCapacity] = useState(2);
  const [ttl, setTtl] = useState(10);
  const [visitor, setVisitor] = useState("A");
  const [operations, setOperations] = useState<Operation[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");

  async function execute(next: Operation[]) {
    if (lock.current) return;
    setError("");
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 5 || !Number.isInteger(ttl) || ttl < 5 || ttl > 120) {
      setError("동시 입장은 1~5명, 입장 유효기간은 5~120초의 정수로 입력하세요."); return;
    }
    if (next.length > 80) { setError("한 실습은 최대 80개 동작입니다. 초기화 후 다시 시작하세요."); return; }
    lock.current = true; setBusy(true);
    try {
      const data = await requestJson<Result>(`${API_BASE_URL}/api/labs/waiting-room`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capacity, ttlSeconds: ttl, operations: next }),
        signal: AbortSignal.timeout(15000),
      }, "대기실 실행에 실패했습니다.");
      setOperations(next); setResult(data);
    } catch (caught) {
      setError(`실행 실패: ${caught instanceof Error ? caught.message : String(caught)}. 백엔드 연결을 확인하세요. 아래 결과는 마지막 성공 상태입니다.`);
    } finally { lock.current = false; setBusy(false); }
  }
  function act(type: Operation["type"], seconds = 0) {
    if (type !== "ADVANCE" && !/^[A-Za-z0-9_-]{1,16}$/.test(visitor)) {
      setError("방문자 ID는 영문·숫자·밑줄·하이픈 1~16자로 입력하세요."); return;
    }
    void execute([...operations, { type, visitor: type === "ADVANCE" ? "" : visitor, seconds }]);
  }
  function reset() { setResult(null); setOperations([]); setError(""); }
  const visitors = result?.visitors ?? [];
  const waiting = visitors.filter(v => v.state === "WAITING").sort((a, b) => a.position - b.position);
  const active = visitors.filter(v => v.state === "ACTIVE");
  const ended = visitors.filter(v => v.state === "LEFT" || v.state === "EXPIRED");
  const inputStyle = "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm";

  return <section className="min-w-0 rounded-xl border bg-card p-4 sm:p-5" aria-label="가상 대기실 실습" aria-busy={busy}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs font-semibold text-sky-700 dark:text-sky-300">JAVA API · 직접 조작</p><h2 className="mt-1 text-xl font-semibold">내 손으로 여는 대기실</h2></div>
      <span className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm"><Clock3Icon className="size-4" />가상 시간 {result?.now ?? 0}초</span>
    </div>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">먼저 ‘방문자 5명 예제’를 실행하세요. A·B가 입장하고 C·D·E는 기다립니다. A를 퇴장시키거나 10초를 진행해 다음 순서가 입장하는지 확인하세요.</p>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">요청마다 동작 이력을 Java에서 다시 계산합니다. 다른 탭·사용자와 상태를 공유하지 않으며 새로고침하면 초기화됩니다. 실제 Redis·인증 토큰·사이트 접근 차단은 실행하지 않습니다.</p>
    <fieldset disabled={busy} className="mt-5 space-y-4">
      <legend className="sr-only">대기실 설정과 동작</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm">동시 입장 한도 (1~5명)<input className={inputStyle} type="number" min={1} max={5} value={capacity} disabled={!!result} onChange={e => setCapacity(Number(e.target.value))} /></label>
        <label className="text-sm">입장 유효기간 (5~120초)<input className={inputStyle} type="number" min={5} max={120} value={ttl} disabled={!!result} onChange={e => setTtl(Number(e.target.value))} /></label>
        <label className="text-sm">방문자 ID<input className={inputStyle} maxLength={16} value={visitor} onChange={e => setVisitor(e.target.value)} placeholder="예: A" autoComplete="off" /></label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => void execute(sample)}>방문자 5명 예제</Button>
        <Button variant="outline" onClick={() => act("JOIN")}>진입 / 재요청</Button>
        <Button variant="outline" onClick={() => act("CHECK")}>입장 권한 확인</Button>
        <Button variant="outline" onClick={() => act("LEAVE")}>퇴장 / 대기 취소</Button>
        <Button variant="secondary" onClick={() => act("ADVANCE", 5)}>+5초</Button>
        <Button variant="secondary" onClick={() => act("ADVANCE", 10)}>+10초</Button>
        <Button variant="ghost" onClick={reset}>초기화</Button>
      </div>
    </fieldset>
    <p className="mt-3 text-xs text-muted-foreground">설정 변경은 초기화 후 가능합니다. 예제 버튼은 이력을 교체합니다. 최대 80개 동작 / 대기+입장 20명.</p>
    <p role="status" className="mt-2 text-sm">{busy ? "Java API 계산 중…" : result ? `동작 ${operations.length}개 실행 완료 · 대기 ${waiting.length}명 · 입장 ${active.length}/${result.capacity}명` : "아직 실행하지 않았습니다."}</p>
    {error && <p role="alert" className="mt-3 rounded-md border border-destructive p-3 text-sm text-destructive">{error}</p>}
    <div className="mt-5 grid gap-4 lg:grid-cols-3">
      {[{ title: "01 대기열", icon: UsersIcon, list: waiting, empty: "대기자가 없습니다.", color: "border-amber-500/40" },
        { title: "02 입장 중", icon: DoorOpenIcon, list: active, empty: "입장한 방문자가 없습니다.", color: "border-emerald-500/40" },
        { title: "03 종료 기록", icon: Clock3Icon, list: ended, empty: "만료·퇴장 기록이 없습니다.", color: "border-border" }].map(({ title, icon: Icon, list, empty, color }) =>
        <section key={title} className={`min-w-0 rounded-xl border bg-background/60 p-4 ${color}`}>
          <h3 className="flex items-center gap-2 font-semibold"><Icon className="size-4" />{title}<span className="ml-auto text-sm">{list.length}명</span></h3>
          <ul className="mt-3 space-y-2">{list.map(v => <li key={v.visitor} className="rounded-lg border bg-card p-3 text-sm">
            <div className="flex flex-wrap justify-between gap-2"><strong>{v.visitor}</strong><span>{labels[v.state]}</span></div>
            <p className="mt-1 text-xs text-muted-foreground">{v.state === "WAITING" ? `대기 ${v.position}번 · 앞에 ${v.position - 1}명` : v.state === "ACTIVE" ? `${v.expiresAt}초에 만료 · ${v.expiresAt! - result!.now}초 남음` : "다시 진입하면 새 순서로 등록"}</p>
          </li>)}</ul>
          {!list.length && <p className="mt-6 text-sm text-muted-foreground">{empty}</p>}
        </section>)}
    </div>
    <details className="mt-4 rounded-lg border p-3" open={!!result}>
      <summary className="cursor-pointer text-sm font-semibold">서버 처리 로그</summary>
      <ol className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">{result?.events.map((event, i) => <li key={i} className="break-words"><span className="mr-2 font-mono text-xs text-muted-foreground">{event.time}s</span>{event.message}</li>)}</ol>
    </details>
    <details className="mt-3 rounded-lg border p-3">
      <summary className="cursor-pointer text-sm font-semibold">요청·응답 JSON / 디버깅</summary>
      <p className="mt-2 break-all text-xs">POST {API_BASE_URL}/api/labs/waiting-room</p>
      <p className="mt-2 break-words text-sm">backend/src/main/java/com/lumos/lab/waitingroom/WaitingRoomService.java → run(), admit(), expire()에 브레이크포인트를 두세요. 브라우저 Network에서 POST 응답을 확인할 수 있습니다.</p>
      <pre className="mt-3 max-h-80 overflow-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify({ request: { capacity, ttlSeconds: ttl, operations }, response: result }, null, 2)}</pre>
    </details>
  </section>;
}
