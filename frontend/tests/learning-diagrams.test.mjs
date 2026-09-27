import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solidGraphs, referenceGraphs } from '../src/components/learning-diagram-data.ts';

test('학습 구성도는 고유 노드와 유효한 연결을 가지며 카드가 겹치지 않는다', () => {
  for (const [name, graph] of Object.entries({ ...solidGraphs, ...referenceGraphs })) {
    const ids = new Set(graph.nodes.map(node => node.id));
    assert.equal(ids.size, graph.nodes.length, `${name}: 중복 ID`);
    for (const edge of graph.edges) {
      assert.ok(ids.has(edge.source) && ids.has(edge.target), `${name}: 없는 노드 연결`);
      assert.notEqual(edge.source, edge.target, `${name}: 의도하지 않은 자기 연결`);
    }
    for (const [index, a] of graph.nodes.entries()) {
      assert.ok(Number.isFinite(a.x) && Number.isFinite(a.y));
      for (const b of graph.nodes.slice(index + 1)) {
        assert.ok(Math.abs(a.x - b.x) >= 200 || Math.abs(a.y - b.y) >= 144, `${name}: ${a.id}/${b.id} 카드 겹침`);
      }
    }
  }
});

test('SOLID의 의존 화살표는 구현에서 계약을 향한다', () => {
  for (const graph of Object.values(solidGraphs)) {
    for (const edge of graph.edges) {
      const source = graph.nodes.find(node => node.id === edge.source);
      const target = graph.nodes.find(node => node.id === edge.target);
      assert.ok(target.y > source.y, 'SOLID의 관계 화살표는 위에서 아래로 읽는다');
    }
  }
  for (const [letter, source, target] of [['S', 'impl', 'repo'], ['O', 'circle', 'area'], ['L', 'sparrow', 'bird'], ['I', 'simple', 'print'], ['D', 'card', 'port']]) {
    assert.ok(solidGraphs[letter].edges.some(edge => edge.source === source && edge.target === target && edge.dashed));
  }
  assert.ok(referenceGraphs.collections.nodes.some(node => node.id === 'map'));
  assert.ok(referenceGraphs.collections.edges.every(edge => edge.source !== 'map' && edge.target !== 'map'), 'Map은 Collection과 별도 계층');
});
