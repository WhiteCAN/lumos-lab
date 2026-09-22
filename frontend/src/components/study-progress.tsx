"use client";

import { useSyncExternalStore, useState } from "react";
import { usePathname } from "next/navigation";
import { studyPages } from "@/lib/study-pages";
import { parseProgress, PROGRESS_KEY } from "@/lib/study-progress";

const CHANGE_EVENT = "study-progress-change";
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}
function snapshot() {
  try { return localStorage.getItem(PROGRESS_KEY) ?? "[]"; }
  catch { return "[]"; }
}
const serverSnapshot = () => "[]";

export function useStudyProgress() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const completed = new Set(parseProgress(raw).filter(href => studyPages.some(page => page.href === href)));
  return completed;
}

export function StudyProgress() {
  const pathname = usePathname();
  const completed = useStudyProgress();
  const [error, setError] = useState("");
  if (!studyPages.some(page => page.href === pathname)) return null;
  function toggle(checked: boolean) {
    try {
      const next = new Set(parseProgress(localStorage.getItem(PROGRESS_KEY)));
      if (checked) next.add(pathname); else next.delete(pathname);
      localStorage.setItem(PROGRESS_KEY, JSON.stringify([...next]));
      window.dispatchEvent(new Event(CHANGE_EVENT));
      setError("");
    } catch { setError("학습 기록을 저장하지 못했습니다. 브라우저의 저장소 설정을 확인하세요."); }
  }
  const percent = Math.round(completed.size / studyPages.length * 100);
  return <section aria-label="학습 진행도" className="border-b bg-muted/30 px-4 py-3 text-sm">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <label className="flex cursor-pointer items-center gap-2 font-medium">
        <input type="checkbox" className="size-4 accent-emerald-600" checked={completed.has(pathname)} onChange={event => toggle(event.target.checked)} />
        이 페이지 학습 완료
      </label>
      <span role="status">전체 {completed.size}/{studyPages.length}개 완료 · {percent}%</span>
    </div>
    <progress aria-label="전체 학습 진행률" className="mt-2 h-1.5 w-full accent-emerald-600" value={completed.size} max={studyPages.length} />
    <p className="mt-1 text-xs text-muted-foreground">이 브라우저에 저장됩니다. 체크를 해제하면 다시 학습할 수 있습니다.</p>
    {error && <p role="alert" className="mt-2 text-red-600">{error}</p>}
  </section>;
}
