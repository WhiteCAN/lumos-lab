import assert from "node:assert/strict";
import { test } from "node:test";
import { parseProgress } from "../src/lib/study-progress.ts";

test("손상되거나 다른 형식의 학습 기록은 빈 기록으로 복구한다", () => {
  for (const raw of [null, "broken", "{}", "null", "123"]) assert.deepEqual(parseProgress(raw), []);
  assert.deepEqual(parseProgress('["/patterns/iterator",3,null,"/patterns/iterator"]'), ["/patterns/iterator"]);
});
