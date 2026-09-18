import assert from "node:assert/strict";
import test from "node:test";
import { initialPlayback, updatePlayback } from "../src/lib/flow-playback.ts";

test("순서대로 진행하고 마지막 단계에서 종료한다", () => {
  let state = updatePlayback(initialPlayback, "play", 3);
  assert.equal(state.index, 0);
  state = updatePlayback(state, "tick", 3);
  assert.equal(state.index, 1);
  state = updatePlayback(state, "tick", 3);
  assert.equal(state.index, 2);
  state = updatePlayback(state, "tick", 3);
  assert.equal(state.finished, true);
  assert.equal(state.playing, false);
  assert.deepEqual(updatePlayback(state, "tick", 3), state);
});

test("일시정지 시 진행하지 않고 이어서 재생하며 다시 보기는 처음으로 돌아간다", () => {
  let state = updatePlayback(initialPlayback, "play", 3);
  state = updatePlayback(state, "tick", 3);
  state = updatePlayback(state, "pause", 3);
  assert.deepEqual(updatePlayback(state, "tick", 3), state);
  state = updatePlayback(state, "play", 3);
  assert.equal(state.index, 1);
  state = updatePlayback(state, "restart", 3);
  assert.equal(state.index, 0);
  assert.equal(state.playing, true);
});

test("빈 흐름은 재생하지 않고 한 단계 흐름도 정상 종료한다", () => {
  assert.deepEqual(updatePlayback(initialPlayback, "play", 0), initialPlayback);
  const started = updatePlayback(initialPlayback, "play", 1);
  assert.equal(updatePlayback(started, "tick", 1).finished, true);
});
