"use client";

import { useEffect, useId, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDownIcon, CheckIcon, PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { TechnologyIcon, type FlowIconName } from "@/components/technology-icon";
import { initialPlayback, updatePlayback, type PlaybackAction } from "@/lib/flow-playback";
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
  const id = useId();
  const choices = [{ label: defaultPathLabel, steps }, ...paths];
  return (
    <section aria-labelledby={id} data-orientation={orientation} className={`${styles.section} rounded-xl border p-4 shadow-sm ${colorClass}`}>
      <h2 id={id} className="text-lg font-semibold">{title}</h2>
      {(paths.length > 0 || orientation === "vertical") && <div className="mt-3 flex min-h-9 flex-wrap gap-2" role={paths.length ? "group" : undefined} aria-label={paths.length ? "흐름 경로 선택" : undefined}>
        {paths.length > 0 && choices.map((choice, index) => <button key={choice.label} type="button" aria-pressed={selected === index}
          onClick={() => setSelected(index)} className={styles.pathButton}>{choice.label}</button>)}
      </div>}
      <div key={selected} className={styles.paths}>
        {choices.map((choice, index) => (
          <div key={choice.label} className={styles.path} data-selected={selected === index} aria-hidden={selected !== index} inert={selected !== index}>
            <FlowPlayback steps={choice.steps} enabled={selected === index} />
          </div>
        ))}
      </div>
    </section>
  );
}

function FlowPlayback({ steps, enabled }: { steps: FlowStep[]; enabled: boolean }) {
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
      <ol className={styles.steps}>
        {steps.map((item, index) => {
          const step = typeof item === "string" ? { label: item } : item;
          const active = !reducedMotion && state.started && !state.finished && index === state.index;
          const completed = !reducedMotion && state.started && (state.finished || index < state.index);
          return <li key={index} className={styles.item}>
            <div className={styles.node} data-active={active} data-completed={completed} aria-current={active ? "step" : undefined}>
              <TechnologyIcon name={step.icon ?? "step"} />
              <div className="min-w-0 flex-1"><span className="mb-1 block text-[10px] font-semibold tracking-widest text-muted-foreground">STEP {String(index + 1).padStart(2, "0")}</span><p className="text-sm font-medium leading-6">{step.label}</p>{step.detail && <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.detail}</p>}</div>
              {completed && <CheckIcon aria-label="완료" className="size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />}
            </div>
            {index < steps.length - 1 && <div aria-hidden="true" className={styles.connector} data-active={active}><span className={styles.track} /><span className={styles.packet} /><ArrowDownIcon /></div>}
          </li>;
        })}
      </ol>
    </div>
  );
}
