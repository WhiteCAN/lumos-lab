export type SortType = "BUBBLE" | "SELECTION" | "INSERTION" | "QUICK" | "MERGE" | "HEAP";
export type SortItem = { id: number; value: number };
export type SortFrame = {
  items: SortItem[];
  active: number[];
  fixed: number[];
  kind: "ready" | "compare" | "swap" | "merge" | "fixed" | "done";
  message: string;
  comparisons: number;
  swaps: number;
};

export function parseSortInput(text: string): number[] {
  const parts = text.split(",").map((part) => part.trim());
  if (parts.length > 100 || parts.some((part) => !/^-?\d+$/.test(part))) {
    throw new Error("쉼표로 구분한 정수 1~100개를 입력하세요. 빈 항목은 허용하지 않습니다.");
  }
  const values = parts.map(Number);
  if (values.some((value) => !Number.isInteger(value) || value < -2147483648 || value > 2147483647)) {
    throw new Error("정수는 -2147483648~2147483647 범위로 입력하세요.");
  }
  return values;
}

// API 로그를 해석하지 않는 브라우저 학습용 실행 기록입니다.
export function createSortTrace(values: number[], type: SortType): SortFrame[] {
  if (!values.length || values.length > 100 || values.some((v) => !Number.isInteger(v) || v < -2147483648 || v > 2147483647)) {
    throw new Error("애니메이션은 32비트 정수 1~100개를 지원합니다.");
  }
  const items = values.map((value, id) => ({ id, value }));
  const frames: SortFrame[] = [];
  const fixed = new Set<number>();
  let comparisons = 0;
  let swaps = 0;
  function record(kind: SortFrame["kind"], active: number[], message: string) {
    frames.push({ items: [...items], active, fixed: [...fixed], kind, message, comparisons, swaps });
  }
  function compare(a: number, b: number) {
    comparisons++;
    record("compare", [a, b], `위치 ${a + 1}의 ${items[a].value}와 위치 ${b + 1}의 ${items[b].value} 비교`);
    return items[a].value - items[b].value;
  }
  function swap(a: number, b: number) {
    if (a === b) return;
    [items[a], items[b]] = [items[b], items[a]];
    swaps++;
    record("swap", [a, b], `위치 ${a + 1}과 ${b + 1} 교환`);
  }
  function finalize(index: number) {
    fixed.add(index);
    record("fixed", [index], `위치 ${index + 1}의 ${items[index].value} 확정`);
  }
  record("ready", [], "재생 또는 다음 단계로 정렬을 시작하세요.");
  const n = items.length;
  if (type === "BUBBLE") {
    for (let end = n - 1; end > 0; end--) {
      for (let j = 0; j < end; j++) if (compare(j, j + 1) > 0) swap(j, j + 1);
      finalize(end);
    }
  } else if (type === "SELECTION") {
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) if (compare(j, min) < 0) min = j;
      swap(i, min);
      finalize(i);
    }
  } else if (type === "INSERTION") {
    // 값의 정체성을 보존하며 이동을 보여주기 위해 인접 교환 방식 사용.
    for (let i = 1; i < n; i++) {
      for (let j = i; j > 0; j--) {
        if (compare(j - 1, j) <= 0) break;
        swap(j - 1, j);
      }
    }
  } else if (type === "QUICK") {
    function quick(lo: number, hi: number) {
      if (lo > hi) return;
      if (lo === hi) { finalize(lo); return; }
      let boundary = lo;
      for (let j = lo; j < hi; j++) {
        if (compare(j, hi) < 0) swap(j, boundary++);
      }
      swap(boundary, hi);
      finalize(boundary);
      quick(lo, boundary - 1);
      quick(boundary + 1, hi);
    }
    quick(0, n - 1);
  } else if (type === "MERGE") {
    function merge(lo: number, hi: number) {
      if (hi - lo < 2) return;
      const mid = Math.floor((lo + hi) / 2);
      merge(lo, mid);
      merge(mid, hi);
      let left = lo;
      let right = mid;
      const merged: SortItem[] = [];
      while (left < mid && right < hi) {
        merged.push(compare(left, right) <= 0 ? items[left++] : items[right++]);
      }
      merged.push(...items.slice(left, mid), ...items.slice(right, hi));
      items.splice(lo, hi - lo, ...merged);
      record("merge", Array.from({ length: hi - lo }, (_, i) => lo + i), `위치 ${lo + 1}~${hi} 병합 결과 반영 (교환 아님)`);
    }
    merge(0, n);
  } else if (type === "HEAP") {
    function heapify(size: number, root: number) {
      let largest = root;
      const left = root * 2 + 1;
      const right = left + 1;
      if (left < size && compare(left, largest) > 0) largest = left;
      if (right < size && compare(right, largest) > 0) largest = right;
      if (largest !== root) { swap(root, largest); heapify(size, largest); }
    }
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
    for (let end = n - 1; end > 0; end--) {
      swap(0, end);
      finalize(end);
      heapify(end, 0);
    }
  }
  items.forEach((_, i) => fixed.add(i));
  record("done", [], "정렬 완료 · 모든 위치가 확정되었습니다.");
  return frames;
}
