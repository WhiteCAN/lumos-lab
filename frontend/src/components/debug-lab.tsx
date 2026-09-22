"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/constants/api";
import { runEventLoop, runPromisePair } from "@/lib/browser-debug-labs";

import { debugLabs, type Lab } from "@/lib/debug-lab-catalog";

export function DebugLab({ lab }: { lab: Lab }) {
  const [input, setInput] = useState(JSON.stringify(lab.initial, null, 2));
  const [mode, setMode] = useState("parallel");
  const [busy, setBusy] = useState(false);
  const [output, setOutput] = useState<unknown>(null);
  const [error, setError] = useState("");

  async function execute() {
    setBusy(true); setError(""); setOutput(null);
    const events: string[] = [];
    const responses: unknown[] = [];
    const started = performance.now();
    try {
      const body = JSON.parse(input);
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("JSON 객체를 입력하세요.");
      async function call(payload: unknown) {
        const response = await fetch(`${API_BASE_URL}${lab.endpoint}`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        const data = await response.json();
        responses.push({ request: payload, status: response.status, body: data });
        if (!response.ok || !data.success) throw new Error(data.message ?? `HTTP ${response.status}`);
        return { status: response.status, data: data.data };
      }
      let result: unknown;
      if (lab.browser === "event-loop") {
        events.push(...await runEventLoop());
        result = await call(body);
        events.push("API 응답 완료");
      } else if (lab.browser === "promise") {
        const first = () => call(body.first);
        const second = () => call(body.second);
        result = await runPromisePair(mode, first, second, caught => {
          events.push(`Promise.all 실패 시점: ${Math.round(performance.now() - started)}ms · 나머지 요청 관찰 중`);
          setError(String(caught));
          setOutput({ events: [...events], responses: [...responses] });
        });
      } else result = await call(body);
      setOutput({ elapsedMs: Math.round(performance.now() - started), events, responses: [...responses], result });
    } catch (caught) {
      setOutput({ elapsedMs: Math.round(performance.now() - started), events, responses: [...responses] });
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally { setBusy(false); }
  }

  return <section className="min-w-0 rounded-xl border border-emerald-300 bg-card p-5 dark:border-emerald-800" aria-label="실행·디버깅 실습">
    <h2 className="text-xl font-semibold">{lab.title}</h2>
    <p className="mt-3 text-sm leading-7">{lab.note}</p>
    <p className="mt-2 break-all font-mono text-xs">POST {API_BASE_URL}{lab.endpoint}</p>
    <label className="mt-4 block text-sm font-medium">요청 JSON
      <textarea value={input} onChange={e => setInput(e.target.value)} disabled={busy} rows={7} spellCheck={false} className="mt-2 w-full rounded-md border bg-background p-3 font-mono text-sm" />
    </label>
    {lab.browser === "promise" && <label className="mt-3 block text-sm">실행 방식 <select value={mode} onChange={e => setMode(e.target.value)} disabled={busy} className="rounded border bg-background p-2"><option value="parallel">Promise.all</option><option value="sequential">순차 await</option><option value="settled">Promise.allSettled</option></select></label>}
    <Button className="mt-3" onClick={execute} disabled={busy}>{busy ? "실행 중…" : "API 실행"}</Button>
    <div className="mt-3 text-sm" role="status" aria-live="polite">{busy ? "응답을 기다립니다. 디버거에서 멈췄다면 실행을 재개하세요." : output ? "실행 완료" : "입력값을 바꿔 실행하세요."}</div>
    {error && <p role="alert" className="mt-3 break-words text-sm text-red-600 dark:text-red-400">{error} · 연결 실패라면 백엔드 실행과 CORS 허용 출처를 확인하세요.</p>}
    {output !== null && <pre className="mt-3 max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs" aria-label="실행 결과">{JSON.stringify(output, null, 2)}</pre>}
    <details className="mt-4 text-sm"><summary className="cursor-pointer font-semibold">디버깅 위치와 실행 방법</summary><p className="mt-2 break-words leading-7">{lab.breakpoint}</p><p className="mt-2 leading-7">IntelliJ에서 BackendApplication을 Debug로 실행하고 위 메서드에 브레이크포인트를 설정한 뒤 API 실행을 누르세요. Java 파일 경로는 backend/src/main/java/com/lumos/lab/ 기준입니다. 브라우저 코드는 개발 서버의 DevTools → Sources에서 확인합니다. 전체 시간은 디버거 정지 시간을 포함하므로 성능 비교 때는 브레이크포인트를 해제하세요.</p></details>
  </section>;
}

export function PageDebugLab({ href }: { href: string }) {
  const lab = debugLabs[href];
  return lab ? <DebugLab key={href} lab={lab} /> : null;
}
