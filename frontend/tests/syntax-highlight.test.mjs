import { test } from 'node:test';
import assert from 'node:assert/strict';
import { highlightCode } from '../src/lib/syntax-highlight.ts';

test('Java 키워드·문자열·주석을 문법별 토큰으로 구분한다', () => {
  const html = highlightCode('public class Demo { String text = "hello"; // 설명\n}', 'java');
  for (const token of ['hljs-keyword', 'hljs-string', 'hljs-comment']) assert.ok(html.includes(token));
});
test('예제 HTML은 실행 가능한 태그 대신 이스케이프된 텍스트로 보존한다', () => {
  for (const language of ['java', 'xml', 'plaintext', undefined]) {
    const html = highlightCode('<img src=x onerror="alert(1)"> & <script>alert(1)</script>', language);
    assert.ok(!html.includes('<img') && !html.includes('<script'));
    assert.ok(html.includes('&lt;') && html.includes('&amp;'));
  }
});
