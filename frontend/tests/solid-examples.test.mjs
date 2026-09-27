import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { solidExamples } from '../src/lib/solid-examples.ts';

const checks = {
  S: `var repo = new MemoryUserRepository();
      var service = new UserService(repo);
      service.register("Lumos");
      assert repo.count() == 1;
      try { service.register(" "); throw new AssertionError(); }
      catch (IllegalArgumentException expected) { }
      assert repo.count() == 1;`,
  O: `var calculator = new AreaCalculator();
      assert calculator.measure(new Rectangle(3, 4)) == 12;
      assert Math.abs(calculator.measure(new Circle(2)) - 4 * Math.PI) < 0.0001;
      try { new Circle(-1); throw new AssertionError(); }
      catch (IllegalArgumentException expected) { }`,
  L: `assert new Flight().launch(new Sparrow()).equals("비행 중");
      assert new Flight().launch(() -> "대체 비행").equals("대체 비행");
      assert new Ostrich().run().equals("달리는 중");`,
  I: `Printer simple = new SimplePrinter();
      assert simple.print().equals("인쇄 완료");
      var copy = new CopyMachine();
      assert copy.print().equals("인쇄 완료");
      assert copy.scan().equals("스캔 완료");`,
  D: `var order = new OrderService(amount -> "대체 결제");
      assert order.checkout(new BigDecimal("1000")).equals("대체 결제");
      assert new OrderService(new CardPayment()).checkout(new BigDecimal("1000")).equals("결제 모형: 1000");
      try { order.checkout(BigDecimal.ZERO); throw new AssertionError(); }
      catch (IllegalArgumentException expected) { }`,
};

for (const [letter, code] of Object.entries(solidExamples)) {
  test(`SOLID ${letter}: 화면의 Java 21 코드를 컴파일하고 계약을 실행한다`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'lumos-solid-'));
    try {
      const source = join(dir, 'Example.java');
      writeFileSync(source, `${code}\nclass Example { public static void main(String[] args) { ${checks[letter]} } }`, 'utf8');
      execFileSync('javac', ['--release', '21', '-encoding', 'UTF-8', '-d', dir, source], { stdio: 'pipe' });
      execFileSync('java', ['-ea', '-cp', dir, 'Example'], { stdio: 'pipe' });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}
