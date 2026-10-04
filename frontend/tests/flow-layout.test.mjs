import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getFlowLayout } from '../src/lib/flow-layout.ts';

test('단계 수별 실제 영역 너비 경계에서 한 줄 가로 흐름으로 전환한다', () => {
  for (const [steps, boundary] of [[2,680],[3,720],[4,960],[5,1200]]) {
    assert.equal(getFlowLayout(boundary-1,steps,'horizontal').columns,1);
    const wide=getFlowLayout(boundary,steps,'horizontal');
    assert.equal(wide.columns,steps);
    assert.ok((steps-1)*wide.columnGap+200 <= boundary, '카드가 영역 너비 안에 들어간다');
    assert.equal(wide.height,340);
  }
});

test('모바일·명시적 세로 비교·6단계 이상은 세로로 유지한다', () => {
  assert.equal(getFlowLayout(320,5,'horizontal').columns,1);
  assert.equal(getFlowLayout(1920,5,'vertical').columns,1);
  assert.equal(getFlowLayout(1920,6,'horizontal').columns,1);
  assert.equal(getFlowLayout(0,5,'horizontal').columns,1);
});
