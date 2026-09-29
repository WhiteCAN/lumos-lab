"use client";

import { createContext, memo, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/constants/api";
import { requestJson } from "@/services/http";

const StepContext = createContext(1);
const CounterButton = memo(function CounterButton({ onAdd }: { onAdd: () => void }) {
  return <Button variant="outline" onClick={onAdd}>memo 자식에서 증가</Button>;
});
function Counter() {
  const step = useContext(StepContext);
  const [count, dispatch] = useReducer((state: number, action: number | "reset") => action === "reset" ? 0 : Math.min(100, state + action), 0);
  const add = useCallback(() => dispatch(step), [step]);
  const squares = useMemo(() => Array.from({ length: count }, (_, i) => (i + 1) ** 2).reduce((a, b) => a + b, 0), [count]);
  return <div className="space-y-3"><p>count: <strong>{count}</strong> · Context 증가량: {step} · 1²~count² 합: <strong>{squares}</strong></p><div className="flex flex-wrap gap-2"><CounterButton onAdd={add} /><Button variant="ghost" onClick={() => dispatch("reset")}>카운터 초기화</Button></div><p className="text-xs text-muted-foreground">useReducer로 최대 100까지 증가합니다. useMemo는 합을, useCallback은 자식에게 주는 함수를 캐시합니다. 이 작은 계산은 최적화가 필요하지 않으며 성능 측정용 예제가 아닙니다.</p></div>;
}

export function HooksLab() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Hooks 실습");
  const input = useRef<HTMLInputElement>(null);
  const controller = useRef<AbortController | null>(null);
  const [state, setState] = useState("대기");
  const [output, setOutput] = useState<unknown>(null);
  const [fail, setFail] = useState(false);
  const [delay, setDelay] = useState(700);
  useEffect(() => () => controller.current?.abort(), []);
  async function run() {
    controller.current?.abort();
    controller.current = null;
    setOutput(null);
    if (!name.trim() || name.length > 40 || !Number.isInteger(delay) || delay < 0 || delay > 1500) { setState("오류: 이름 1~40자, 지연 0~1500ms 정수를 입력하세요."); return; }
    const current = new AbortController(); controller.current = current;
    setState("요청 중"); setOutput(null);
    try {
      const data = await requestJson(`${API_BASE_URL}/api/labs/task`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, delayMs: delay, fail }), signal: current.signal }, "실행 실패");
      if (controller.current === current && !current.signal.aborted) { setOutput(data); setState("성공"); }
    } catch (error) {
      if (controller.current === current && !current.signal.aborted) setState(`오류: ${error instanceof Error ? error.message : String(error)}`);
    } finally { if (controller.current === current) controller.current = null; }
  }
  return <section className="min-w-0 space-y-4 rounded-xl border bg-card p-5" aria-label="Hooks 직접 실행">
    <h2 className="text-xl font-semibold">Hooks를 직접 실행해 보기</h2>
    <label className="block text-sm">Context 증가량<select value={step} onChange={e => setStep(Number(e.target.value))} className="ml-3 rounded border bg-background p-2"><option value={1}>1</option><option value={5}>5</option></select></label>
    <StepContext.Provider value={step}><Counter /></StepContext.Provider>
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">API 작업 이름<input ref={input} value={name} maxLength={40} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded border bg-background p-2" /></label><label className="text-sm">지연 시간 (ms)<input type="number" min={0} max={1500} value={delay} onChange={e => setDelay(Number(e.target.value))} className="mt-1 w-full rounded border bg-background p-2" /></label></div>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={fail} onChange={e => setFail(e.target.checked)} />서버 실패 주입</label>
    <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => input.current?.focus()}>useRef로 입력 포커스</Button><Button onClick={run}>Java API 요청</Button><Button variant="secondary" disabled={state !== "요청 중"} onClick={() => { controller.current?.abort(); controller.current = null; setState("취소됨"); }}>요청 취소</Button></div>
    <p role={state.startsWith("오류") ? "alert" : "status"}>{state}</p>
    {output !== null && <pre className="max-h-64 overflow-auto rounded bg-muted p-3 text-xs">{JSON.stringify(output, null, 2)}</pre>}
    <p className="text-sm leading-6 text-muted-foreground">useEffect의 정리 함수는 페이지를 떠날 때 요청을 중단합니다. 버튼은 명시적인 취소를 실행합니다. 브라우저 취소가 서버의 이미 시작된 작업까지 중단하는 것은 아닙니다. 요청 중 다시 실행하면 이전 응답은 화면에 반영하지 않습니다.</p>
    <p className="break-words text-xs text-muted-foreground">디버깅: hooks-lab.tsx의 run()·reducer / backend/src/main/java/com/lumos/lab/learning/DebugLabController.java의 task(). 브라우저 Network에서 POST /api/labs/task를 확인하세요.</p>
  </section>;
}

export function EffectLab() {
  const [running, setRunning] = useState(false);
  const [intervalMs, setIntervalMs] = useState(1000);
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTicks(value => value + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [running, intervalMs]);
  return <section id="effect" className="space-y-3 rounded-xl border bg-card p-5" aria-label="Effect 타이머 실습">
    <h2 className="text-xl font-semibold">useEffect · 의존성 변경과 정리</h2>
    <p className="text-sm leading-7">타이머를 시작한 뒤 간격을 바꾸세요. 이전 interval을 정리하고 새 간격으로 등록합니다. 중지하면 증가가 멈춥니다. 브라우저 스케줄링 때문에 실제 간격은 정확한 시계와 다를 수 있습니다.</p>
    <label className="block text-sm">타이머 간격<select aria-label="타이머 간격" className="ml-3 rounded border bg-background p-2" value={intervalMs} onChange={e => setIntervalMs(Number(e.target.value))}><option value={1000}>1초</option><option value={250}>0.25초</option></select></label>
    <div className="flex flex-wrap gap-2"><Button onClick={() => setRunning(value => !value)}>{running ? "타이머 중지" : "타이머 시작"}</Button><Button variant="outline" onClick={() => setTicks(0)}>횟수 초기화</Button></div>
    <p role="status">{running ? "실행 중" : "중지됨"} · 콜백 {ticks}회</p>
    <p className="text-sm leading-7 text-muted-foreground">의존성 생략은 매 커밋 후, []는 마운트 시, [running, intervalMs]는 해당 값 변경 시 동기화합니다. 재동기화 전에 이전 cleanup이 실행되고 언마운트 때도 정리합니다. []도 재마운트·개발 Strict Mode에서 다시 실행될 수 있어 ‘평생 한 번’이 아닙니다. Effect는 서버 렌더링에서 실행되지 않습니다.</p>
    <p className="text-xs text-muted-foreground">디버깅: hooks-lab.tsx → EffectLab의 setInterval·clearInterval. 서버 API 실습은 위 패널에서 별도로 실행합니다.</p>
  </section>;
}
