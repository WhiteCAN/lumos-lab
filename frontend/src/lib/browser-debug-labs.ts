export function runEventLoop(): Promise<string[]> {
  const events: string[] = [];
  return new Promise((resolve) => {
    events.push("동기 A"); // 브라우저 Sources에서 이 줄에 브레이크포인트
    setTimeout(() => { events.push("timer T"); resolve(events); }, 0);
    Promise.resolve().then(() => {
      events.push("Promise C");
      queueMicrotask(() => events.push("microtask E"));
    });
    queueMicrotask(() => events.push("microtask D"));
    events.push("동기 B");
  });
}

export async function runPromisePair<T>(mode: string, first: () => Promise<T>, second: () => Promise<T>, onRejected: (error: unknown) => void) {
  if (mode === "sequential") return [await first(), await second()];
  const pending = [first(), second()];
  if (mode === "settled") return (await Promise.allSettled(pending)).map(result =>
    result.status === "fulfilled" ? result : { status: result.status, reason: String(result.reason) });
  try { return await Promise.all(pending); }
  catch (error) {
    onRejected(error); // Promise.all 자체는 여기서 이미 실패했습니다.
    await Promise.allSettled(pending); // 실습 화면은 취소되지 않은 요청도 관찰합니다.
    throw error;
  }
}
