import test from 'node:test';
import assert from 'node:assert/strict';
import { runEventLoop, runPromisePair } from '../src/lib/browser-debug-labs.ts';
import { debugLabs } from '../src/lib/debug-lab-catalog.ts';
import { studyPages } from '../src/lib/study-pages.ts';
import { readFileSync } from 'node:fs';

test('이벤트 루프 실습은 실제 콜백에서 기록한 순서를 반환한다', async () => {
  assert.deepEqual(await runEventLoop(), ['동기 A', '동기 B', 'Promise C', 'microtask D', 'microtask E', 'timer T']);
});

test('Promise.all은 즉시 실패를 알리지만 실습은 나머지 요청의 종료도 기다린다', async () => {
  let finish;
  let rejected;
  let completed = false;
  const observed = new Promise(resolve => { rejected = resolve; });
  const second = new Promise(resolve => { finish = resolve; });
  const run = runPromisePair('parallel', () => Promise.reject(new Error('실패')), () => second, rejected)
    .catch(error => { completed = true; return error.message; });
  await observed;
  assert.equal(completed, false);
  finish('나중 응답');
  assert.equal(await run, '실패');
});

test('모든 학습 페이지에 기존 API 실행 또는 새 실습 연결이 있다', () => {
  for (const page of studyPages) {
    const file = new URL(`../src/app${page.href === '/' ? '' : page.href}/page.tsx`, import.meta.url);
    const source = readFileSync(file, 'utf8');
    assert.ok(debugLabs[page.href] || source.includes('import { requestJson }') || /await fetch\s*\(/.test(source), `${page.href}: 실행 연결 누락`);
    if (debugLabs[page.href]) assert.ok(source.includes('<ReferencePage') || source.includes('<PageDebugLab') || source.includes('<BookPatternPage'), page.href);
  }
});
