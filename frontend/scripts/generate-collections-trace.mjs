import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

// frontend 디렉터리에서 실행. JDK 21 이상 필요.
const output = execFileSync('java', ['-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', 'public/examples/CollectionsDebugLab.java'], { encoding: 'utf8' });
writeFileSync('src/app/java/collections/traces.json', JSON.stringify(JSON.parse(output), null, 2) + '\n');
