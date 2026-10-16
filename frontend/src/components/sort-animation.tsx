"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { createSortTrace, type SortType } from "@/lib/sort-trace";

const phaseNames = { ready: "준비", compare: "비교", swap: "교환", merge: "병합", fixed: "확정", done: "완료" };

export function SortAnimation({ values, type }: { values: number[]; type: SortType }) {
  const frames = useMemo(() => createSortTrace(values, type), [values, type]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [delay, setDelay] = useState(700);
  const frame = frames[index];
  const last = frames.length - 1;
  const running = playing && index < last;
  const min = Math.min(...values);
  const range = Math.max(...values) - min;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex((current) => current + 1), delay);
    return () => window.clearTimeout(timer);
  }, [running, index, delay]);

  function seek(next: number) {
    setPlaying(false);
    setIndex(next);
  }

  return (
    <section aria-labelledby="sort-animation-title" className="min-w-0 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="sort-animation-title" className="text-xl font-semibold">정렬 과정 애니메이션</h2>
          <p className="mt-1 text-sm text-muted-foreground">{type} · 브라우저에서 실행하는 학습용 모형 · API 연결 없이 실행 가능</p>
        </div>
        <span className="rounded-md bg-muted px-3 py-2 text-sm">비교 {frame.comparisons}회 · 교환 {frame.swaps}회</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        막대의 값과 위치가 함께 이동합니다. 음수를 포함한 크기 차이를 보기 위해 높이를 상대 크기로 표시합니다.
        같은 값은 #원래 순서로 구분합니다. 확정은 이후 위치가 바뀌지 않는다는 뜻입니다.
      </p>
      <div className="my-3 flex flex-wrap gap-2 text-xs" aria-label="상태 범례">
        <span className="rounded border bg-muted px-2 py-1">대기</span>
        <span className="rounded border border-amber-500 bg-amber-100 px-2 py-1 text-amber-950 dark:bg-amber-950 dark:text-amber-100">비교</span>
        <span className="rounded border border-blue-500 bg-blue-100 px-2 py-1 text-blue-950 dark:bg-blue-950 dark:text-blue-100">교환 / 병합</span>
        <span className="rounded border border-emerald-500 bg-emerald-100 px-2 py-1 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100">확정 ✓</span>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-muted/20" tabIndex={0} role="region" aria-label="정렬 막대 그래프, 항목이 많으면 가로 스크롤">
        <div className="relative h-64" style={{ minWidth: values.length * 76 }}>
          {frame.items.map((item, position) => {
            const active = frame.active.includes(position);
            const fixed = frame.fixed.includes(position);
            const label = fixed ? "확정" : active ? phaseNames[frame.kind] : "대기";
            const color = fixed ? "border-emerald-500 bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100" : active
              ? frame.kind === "compare" ? "border-amber-500 bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100" : "border-blue-500 bg-blue-100 text-blue-950 dark:bg-blue-950 dark:text-blue-100"
              : "border-border bg-muted text-foreground";
            return (
              <div key={item.id} className="absolute bottom-0 left-0 flex flex-col items-center px-1 transition-transform ease-in-out motion-reduce:transition-none"
                style={{ width: `${100 / values.length}%`, transform: `translateX(${position * 100}%)`, transitionDuration: `${Math.min(delay * 0.65, 450)}ms` }}>
                <span className="mb-1 text-xs">{label}{fixed ? " ✓" : ""}</span>
                <div className={`flex w-full flex-col items-center justify-end rounded-t-md border px-1 pb-2 ${color}`} style={{ height: 48 + (range ? (item.value - min) / range : 0.5) * 130 }}>
                  <span className="max-w-full break-all text-center font-mono text-xs font-semibold">{item.value}</span>
                  <span className="text-[10px]">#{item.id + 1}</span>
                </div>
                <span className="py-2 text-xs text-muted-foreground">위치 {position + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 min-h-12 text-sm leading-6" aria-live={running ? "off" : "polite"} aria-atomic="true">
        <strong>{phaseNames[frame.kind]}</strong> · {frame.message}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => { if (index === last) setIndex(0); setPlaying(!running); }}>{running ? "일시정지" : index === last ? "다시 재생" : "재생"}</Button>
        <Button type="button" variant="outline" disabled={index === 0} onClick={() => seek(index - 1)}>이전 단계</Button>
        <Button type="button" variant="outline" disabled={index === last} onClick={() => seek(index + 1)}>다음 단계</Button>
        <Button type="button" variant="outline" onClick={() => seek(0)}>처음으로</Button>
        <label className="flex items-center gap-2 text-sm">재생 속도
          <select aria-label="재생 속도" value={delay} onChange={(event) => setDelay(Number(event.target.value))} className="h-8 rounded-md border bg-background px-2">
            <option value={1400}>0.5배</option><option value={700}>1배</option><option value={350}>2배</option>
          </select>
        </label>
      </div>
      <label className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        단계 {index} / {last}
        <input className="min-w-0 flex-1 accent-primary" aria-label="정렬 단계" type="range" min={0} max={last} value={index} onChange={(event) => seek(Number(event.target.value))} />
      </label>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Java API 로그의 재생이 아닙니다. Quick은 마지막 값을 피벗으로 사용하는 제자리 분할, Insertion은 인접 교환 방식입니다.
        Merge는 두 구간의 비교 후 병합 결과를 한 번에 반영하며 보조 배열 쓰기는 생략합니다. 횟수는 이 모형의 값 비교와 실제 교환만 셉니다.
        동작 줄이기 설정에서는 위치 전환 애니메이션을 생략하며 자동 재생은 직접 시작해야 합니다.
      </p>
    </section>
  );
}
