"use client";
import { useState } from "react";
import { runArrayPipeline } from "@/lib/array-pipeline";
import { API_BASE_URL } from "@/constants/api";

export function ArrayBrowserLab() {
  const [input, setInput] = useState("[10,2,1]");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function run(compare: boolean) {
    setError(""); setResult(""); setLoading(true);
    try {
      const browser = runArrayPipeline(input);
      if (!compare) { setResult(JSON.stringify({ browser }, null, 2)); return; }
      const response = await fetch(`${API_BASE_URL}/api/labs/array-pipeline`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: browser.original }), signal: AbortSignal.timeout(10000),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${body.message ?? "API 요청 실패"}`);
      const fields = ["numericSorted", "doubled", "evens", "sum"] as const;
      const equal = fields.every(key => JSON.stringify(browser[key]) === JSON.stringify(body.data[key]));
      setResult(JSON.stringify({ browser, java: body.data, sameNumericResults: equal }, null, 2));
    } catch (e) { setError(e instanceof Error ? e.message : "실행 실패"); }
    finally { setLoading(false); }
  }
  return <section className="min-w-0 rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">브라우저와 Java에 같은 배열 보내기</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">기본 sort의 문자열 정렬은 브라우저에서만 확인합니다. 비교 버튼은 같은 입력을 Java에 보내 숫자 연산 네 가지가 같은지 검사합니다. 임의 코드를 평가하지 않습니다.</p><label htmlFor="array-input" className="mt-4 block text-sm font-medium">정수 JSON 배열</label><textarea id="array-input" value={input} maxLength={300} disabled={loading} onChange={e => { setInput(e.target.value); setResult(""); setError(""); }} className="mt-2 w-full rounded-md border bg-background p-3 font-mono text-sm" /><div className="mt-3 flex flex-wrap gap-2"><button disabled={loading} onClick={() => void run(false)} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">브라우저 실행</button><button disabled={loading} onClick={() => void run(true)} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">Java API와 비교</button></div><p role="status" className="mt-2 text-sm">{loading ? "실행 중…" : ""}</p>{error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}{result && <pre aria-label="배열 실행 결과" className="mt-3 max-h-96 overflow-auto rounded-md border p-3 text-xs leading-6">{result}</pre>}</section>;
}
