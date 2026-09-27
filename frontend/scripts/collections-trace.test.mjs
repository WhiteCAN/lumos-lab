import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = JSON.parse(execFileSync('java', ['-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', 'public/examples/CollectionsDebugLab.java'], { encoding: 'utf8' }));
assert.ok(!JSON.stringify(data).includes('\uFFFD'), '한글 출력이 손상되면 안 됩니다');
assert.equal(data.scenarios.length, 14);
const scenario = name => data.scenarios.find(s => s.name === name);
const step = (name, code) => scenario(name).steps.findLast(s => s.code === code);
assert.equal(step('ArrayList', 'list.remove(1)').after, '[10, 20, 30]');
assert.equal(step('ArrayList', 'list.remove(Integer.valueOf(20))').after, '[10, 30]');
assert.equal(step('ArrayList', 'list.get(99)').result, 'IndexOutOfBoundsException');
assert.equal(step('Vector', 'vector.add(30)').after, '[10, 20, 30] | size=3, capacity=4');
assert.equal(step('HashSet', 'set.add(20)').result, 'false');
assert.equal(step('PriorityQueue', 'queue.poll()').result, '10');
assert.equal(step('HashMap', 'map.put("B", 9)').result, '2');
assert.equal(step('ConcurrentHashMap', 'map.put(null, 1)').result, 'NullPointerException');
for (const s of data.scenarios) {
  assert.ok(s.steps.length >= 3, s.name);
  for (let i = 1; i < s.steps.length; i++) assert.equal(s.steps[i].before, s.steps[i - 1].after, s.name);
}
const saved = JSON.parse(readFileSync('src/app/java/collections/traces.json', 'utf8'));
assert.deepEqual(saved.scenarios, data.scenarios, '화면 기록과 실제 Java 실행이 일치해야 합니다');
console.log('14개 컬렉션: 실제 실행, 경계값, 단계 연결 및 화면 기록 일치 검증 통과');
