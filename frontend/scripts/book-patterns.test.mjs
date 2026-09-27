import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { studyPages } from '../src/lib/study-pages.ts';

test('책 23장이 원본 위치·입력·설명·페이지와 빠짐없이 연결된다', () => {
  const chapters = ['01-08','09-16','17-23'].flatMap(group =>
    JSON.parse(readFileSync(new URL(`../src/lib/book-chapters-${group}.json`, import.meta.url), 'utf8')));
  assert.deepEqual(chapters.map(c => c.chapter), Array.from({length:23},(_,i)=>i+1));
  assert.equal(new Set(chapters.map(c => c.slug)).size,23);
  for (const chapter of chapters) {
    const href = `/patterns/${chapter.slug === 'factory-method' ? 'factory' : chapter.slug}`;
    assert.ok(studyPages.some(p=>p.href===href), href);
    assert.ok(chapter.roles.length >= 2, chapter.slug);
    assert.ok(chapter.flow.length >= 2, chapter.slug);
    assert.ok(chapter.adaptation && chapter.inputHelp && chapter.breakpoint, chapter.slug);
    assert.ok(!chapter.sourceDir.includes(':') && !chapter.sourceDir.includes('..'));
    assert.ok(chapter.request.count>=1 && chapter.request.count<=20, chapter.slug);
    const source=readFileSync(new URL(`../src/app${href}/page.tsx`,import.meta.url),'utf8');
    assert.match(source, /BookPattern(Page|Content)/, href);
  }
});
