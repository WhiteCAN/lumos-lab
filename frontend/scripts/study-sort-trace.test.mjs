import test from 'node:test';
import assert from 'node:assert/strict';
import { createSortTrace, parseSortInput } from '../src/lib/sort-trace.ts';

for (const type of ['BUBBLE', 'SELECTION', 'INSERTION', 'QUICK', 'MERGE', 'HEAP']) {
  test(`${type}: 순서, 중복 항목 보존, 확정 위치, 계수 검증`, () => {
    const cases = [[3, 1, 2], [0], [2, 2, 2], [-3, 0, -3, 8], [-2147483648, 2147483647, 0], Array.from({ length: 100 }, (_, i) => 99 - i)];
    // 고정 시드 대신 작은 값 영역의 모든 4원소 조합을 확인합니다.
    for (let code = 0; code < 81; code++) cases.push(Array.from({ length: 4 }, (_, i) => Math.floor(code / 3 ** i) % 3 - 1));
    for (const input of cases) {
      const original = [...input];
      const frames = createSortTrace(input, type);
      const sorted = [...input].sort((a, b) => a - b);
      assert.deepEqual(input, original);
      assert.deepEqual(frames[0].items.map(x => x.value), input);
      assert.deepEqual(frames.at(-1).items.map(x => x.value), sorted);
      let comparisons = 0;
      let swaps = 0;
      for (const [index, frame] of frames.entries()) {
        assert.deepEqual(frame.items.map(x => x.id).sort((a, b) => a - b), input.map((_, i) => i));
        for (const item of frame.items) assert.equal(item.value, input[item.id]);
        if (frame.kind === 'compare') comparisons++;
        if (frame.kind === 'swap') {
          swaps++;
          const before = frames[index - 1].items;
          const [a, b] = frame.active;
          assert.equal(frame.items[a].id, before[b].id);
          assert.equal(frame.items[b].id, before[a].id);
        }
        assert.equal(frame.comparisons, comparisons);
        assert.equal(frame.swaps, swaps);
        for (const pos of frame.fixed) {
          assert.equal(frame.items[pos].value, sorted[pos]);
          assert.equal(frame.items[pos].id, frames.at(-1).items[pos].id);
        }
      }
      if (['BUBBLE', 'INSERTION', 'MERGE'].includes(type)) {
        const result = frames.at(-1).items;
        for (let i = 1; i < result.length; i++) if (result[i - 1].value === result[i].value) assert.ok(result[i - 1].id < result[i].id);
      }
    }
  });
}

test('입력은 Java 정수 계약과 개수 제한을 지키며 잘못된 값을 조용히 버리지 않는다', () => {
  assert.deepEqual(parseSortInput(' -3, 0, 2, 2 '), [-3, 0, 2, 2]);
  for (const text of ['', ' ', '1,', ',1', '1,,2', '1,a', '1.5', 'Infinity', '1e3', '2147483648', '-2147483649', Array(101).fill('1').join(',')]) assert.throws(() => parseSortInput(text));
  for (const values of [[], [NaN], [1.1], [Infinity], Array(101).fill(1)]) assert.throws(() => createSortTrace(values, 'BUBBLE'));
});
