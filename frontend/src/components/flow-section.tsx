"use client";

import { useEffect, useId, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { type FlowIconName } from "@/components/technology-icon";
import { initialPlayback, updatePlayback, type PlaybackAction } from "@/lib/flow-playback";
import { LearningFlowCanvas, type LearningGraph } from "./learning-flow-canvas";
import styles from "./flow-section.module.css";

export type FlowStep = string | { label: string; icon?: FlowIconName; detail?: string };
type FlowProps = {
  title: string;
  steps: FlowStep[];
  colorClass?: string;
  paths?: { label: string; steps: FlowStep[] }[];
  defaultPathLabel?: string;
  orientation?: "horizontal" | "vertical";
};

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function FlowSection({ title, steps, colorClass = "bg-card", paths = [], defaultPathLabel = "기본 경로", orientation = "horizontal" }: FlowProps) {
  const [selected, setSelected] = useState(0);
  const [width, setWidth] = useState(0);
  const pathsRoot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pathsRoot.current) return;
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    observer.observe(pathsRoot.current);
    return () => observer.disconnect();
  }, []);
  const id = useId();
  const choices = [{ label: defaultPathLabel, steps }, ...paths];
  return (
    <section aria-labelledby={id} data-orientation={orientation} className={`${styles.section} rounded-xl border p-4 shadow-sm ${colorClass}`}>
      <h2 id={id} className="text-lg font-semibold">{title}</h2>
      {(paths.length > 0 || orientation === "vertical") && <div className="mt-3 flex min-h-9 flex-wrap gap-2" role={paths.length ? "group" : undefined} aria-label={paths.length ? "흐름 경로 선택" : undefined}>
        {paths.length > 0 && choices.map((choice, index) => <button key={choice.label} type="button" aria-pressed={selected === index}
          onClick={() => setSelected(index)} className={styles.pathButton}>{choice.label}</button>)}
      </div>}
      <div ref={pathsRoot} className={styles.paths}>
        {choices.map((choice, index) => (
          <div key={choice.label} className={styles.path} data-selected={selected === index} aria-hidden={selected !== index} inert={selected !== index}>
            <FlowPlayback key={selected} width={width} title={title} steps={choice.steps} enabled={selected === index} orientation={orientation} maxSteps={Math.max(...choices.map(c => c.steps.length))} />
          </div>
        ))}
      </div>
    </section>
  );
}

function FlowPlayback({ width, title, steps, enabled, orientation, maxSteps }: { width: number; title: string; steps: FlowStep[]; enabled: boolean; orientation: "horizontal" | "vertical"; maxSteps: number }) {
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [state, dispatch] = useReducer((current: typeof initialPlayback, action: PlaybackAction) => updatePlayback(current, action, steps.length), initialPlayback);
  const root = useRef<HTMLDivElement>(null);
  const autoplayed = useRef(false);
  const running = enabled && state.playing && visible && pageVisible && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting && !autoplayed.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        autoplayed.current = true;
        dispatch("play");
      }
    }, { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, [enabled]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => dispatch("tick"), 1100);
    return () => window.clearTimeout(timer);
  }, [running, state.index]);

  const columns = orientation === "vertical" || width < 680 || maxSteps > 3 ? 1 : 3;
  const canvasHeight = columns === 1 ? Math.max(340, maxSteps * 180) : Math.max(340, Math.ceil(maxSteps / 3) * 220);
  const graph: LearningGraph = {
    nodes: steps.map((item, index) => {
      const step = typeof item === "string" ? {label:item} : item;
      const row = Math.floor(index / columns);
      const column = index % columns;
      return {id:String(index),label:step.label,detail:step.detail,icon:step.icon ?? "step",x:column * 290,y:row * 240,active:!reducedMotion && state.started && !state.finished && index===state.index,completed:!reducedMotion && state.started && (state.finished || index<state.index)};
    }),
    edges: steps.slice(1).map((_,i)=>({source:String(i),target:String(i+1),label:String(i+1)})),
  };
  const status = reducedMotion ? "동작 줄이기 · 전체 단계 표시" : state.finished ? "흐름 완료" : !state.started ? "개념 흐름 · 화면에 보이면 재생" : `${state.index + 1} / ${steps.length} 단계 · ${running ? "재생 중" : "일시정지"}`;
  return (
    <div ref={root} data-running={running} data-reduced-motion={reducedMotion} className={styles.player}>
      <div className="my-3 flex min-h-9 flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground" data-flow-status>{status}</p>
        {!reducedMotion && steps.length > 0 && <div className="flex gap-2">
          {!state.finished && <button type="button" className={styles.control} onClick={() => dispatch(state.playing ? "pause" : "play")}>
            {state.playing ? <PauseIcon /> : <PlayIcon />}{state.playing ? "일시정지" : "재생"}
          </button>}
          <button type="button" className={styles.control} onClick={() => dispatch("restart")}><RotateCcwIcon />다시 보기</button>
        </div>}
      </div>
      <div style={{minHeight: canvasHeight + 34}}>
        {enabled && <LearningFlowCanvas title={title} graph={graph} height={canvasHeight} />}
      </div>
    </div>
  );
}
