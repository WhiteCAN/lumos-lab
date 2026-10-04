import test from "node:test";
import assert from "node:assert/strict";
import { runArrayPipeline } from "../src/lib/array-pipeline.ts";
test("기본 sort와 숫자 정렬을 구분하고 입력을 보존한다", () => {
  const result = runArrayPipeline("[10,2,1]");
  assert.deepEqual(result.original, [10,2,1]);
  assert.deepEqual(result.lexicalSorted, [1,10,2]);
  assert.deepEqual(result.numericSorted, [1,2,10]);
});
test("음수·0·중복을 처리한다", () => {
  const result = runArrayPipeline("[-2,0,3,3]");
  assert.deepEqual(result.evens, [-2,0]);
  assert.deepEqual(result.doubled, [-4,0,6,6]);
  assert.equal(result.sum, 4);
});
test("잘못된 JSON·타입·범위를 거절한다", () => {
  for (const input of ["{", "null", "[]", "[1.1]", '["2"]', "[null]", "[10001]", JSON.stringify(Array(31).fill(1))]) {
    assert.throws(() => runArrayPipeline(input));
  }
});
