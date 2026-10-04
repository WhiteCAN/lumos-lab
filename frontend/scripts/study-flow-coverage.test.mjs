import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../src/', import.meta.url));
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : path.endsWith('.tsx') ? [path] : [];
  });
}

test('학습 흐름은 자동 방향을 사용하고 별도 구성도는 움직임 의도를 명시한다', () => {
  let flows = 0;
  let diagrams = 0;
  for (const path of files(root)) {
    const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
        const tag = node.tagName.getText(source);
        const attributes = node.attributes.properties.filter(ts.isJsxAttribute);
        const attribute = name => attributes.find(item => item.name.getText(source) === name)?.initializer?.getText(source);
        if (tag === 'FlowSection') {
          flows++;
          assert.notEqual(attribute('orientation'), '"vertical"', `${path}: 순차 흐름의 세로 고정 제거`);
        }
        if (tag === 'LearningFlowCanvas' && !path.endsWith('flow-section.tsx')) {
          diagrams++;
          assert.ok(['"flow"', '"static"'].includes(attribute('motion')), `${path}: 연결선 움직임 의도 지정`);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  assert.ok(flows > 0 && diagrams > 0, '실제 학습 컴포넌트를 검사해야 한다');
});
