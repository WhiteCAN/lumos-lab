package com.lumos.lab.pattern.book;

// Hiroshi Yuki (2001, 2004, 2021)의 MIT 예제 17~23장 구조를 HTTP 실습으로 각색했습니다.
// 라이선스 전문: docs/third-party/design-patterns-MIT.txt
import org.springframework.stereotype.Service;
import java.util.*;

/** 17~23장 예제를 요청 안에서 독립적으로 실행합니다. GUI와 파일 입출력은 상태 데이터로 치환합니다. */
@Service
public class BookChapters17To23 {
    public BookPatternResult run(String slug, BookPatternRequest request) {
        if (request == null || request.text() == null || request.text().length() > 500
                || request.count() < 1 || request.count() > 20 || request.value() < 0 || request.value() > 100)
            throw new IllegalArgumentException("text는 500자 이하, count는 1~20, value는 0~100입니다.");
        return switch (slug) {
            case "observer" -> observer(request);
            case "memento" -> memento(request);
            case "state" -> state(request);
            case "flyweight" -> flyweight(request);
            case "proxy" -> proxy(request);
            case "command" -> command(request);
            case "interpreter" -> interpreter(request);
            default -> throw new IllegalArgumentException("지원하지 않는 패턴: " + slug);
        };
    }

    private interface Observer { void update(NumberGenerator generator); }
    private static class NumberGenerator {
        private final List<Observer> observers = new ArrayList<>();
        private int number;
        void addObserver(Observer observer) { observers.add(observer); }
        void deleteObserver(Observer observer) { observers.remove(observer); }
        void notifyObservers() { // 브레이크포인트: 동일 발행자를 두 표현 객체에 전달
            for (Observer observer : observers) observer.update(this);
        }
    }
    private static class DigitObserver implements Observer {
        private final List<Integer> values = new ArrayList<>();
        public void update(NumberGenerator generator) { values.add(generator.number); }
    }
    private static class GraphObserver implements Observer {
        private final List<String> graphs = new ArrayList<>();
        public void update(NumberGenerator generator) { graphs.add("*".repeat(generator.number)); }
    }
    private BookPatternResult observer(BookPatternRequest r) {
        if (!Set.of("random", "incremental").contains(r.text())) throw new IllegalArgumentException("text는 random 또는 incremental입니다.");
        var generator = new NumberGenerator();
        var digits = new DigitObserver(); var graph = new GraphObserver();
        generator.addObserver(digits); generator.addObserver(graph);
        var steps = new ArrayList<String>();
        if (r.fail()) { generator.deleteObserver(graph); steps.add("GraphObserver 등록 해제"); }
        var random = new Random(r.seed());
        for (int i = 0; i < r.count(); i++) {
            generator.number = r.text().equals("incremental") ? r.value() + i : random.nextInt(50);
            generator.notifyObservers();
            steps.add("NumberGenerator → notifyObservers: " + generator.number);
        }
        return new BookPatternResult("Observer", steps, Map.of("digits", digits.values, "graphs", graph.graphs, "observers", generator.observers.size()));
    }

    private record Memento(int money, List<String> fruits) {
        Memento { fruits = List.copyOf(fruits); }
    }
    private static class Gamer {
        private int money;
        private List<String> fruits = new ArrayList<>();
        private final Random random;
        Gamer(int money, long seed) { this.money = money; random = new Random(seed); }
        int bet() {
            int dice = random.nextInt(6) + 1;
            if (dice == 1) money += 100;
            else if (dice == 2) money /= 2;
            else if (dice == 6) {
                String fruit = List.of("사과", "포도", "바나나", "오렌지").get(random.nextInt(4));
                fruits.add((random.nextBoolean() ? "맛있는 " : "") + fruit);
            }
            return dice;
        }
        Memento createMemento() { // 브레이크포인트: 원본 목록과 스냅샷의 참조 분리
            return new Memento(money, fruits.stream().filter(f -> f.startsWith("맛있는 ")).toList());
        }
        void restoreMemento(Memento m) { money = m.money(); fruits = new ArrayList<>(m.fruits()); }
    }
    private BookPatternResult memento(BookPatternRequest r) {
        var gamer = new Gamer(r.value(), r.seed()); var saved = gamer.createMemento();
        var steps = new ArrayList<String>();
        for (int i = 0; i < r.count(); i++) {
            int dice = gamer.bet(); steps.add("Gamer.bet dice=" + dice + ", money=" + gamer.money + ", fruits=" + gamer.fruits);
            if (gamer.money > saved.money()) { saved = gamer.createMemento(); steps.add("createMemento: 소지금 증가 저장"); }
            else if (gamer.money < saved.money() / 2) { gamer.restoreMemento(saved); steps.add("restoreMemento: 감소 복구"); }
        }
        if (r.fail()) { gamer.money = 0; gamer.fruits.clear(); gamer.restoreMemento(saved); steps.add("restoreMemento: 강제 손실 후 저장 상태 복구"); }
        return new BookPatternResult("Memento", steps, Map.of("money", gamer.money, "fruits", gamer.fruits, "savedMoney", saved.money(), "savedFruits", saved.fruits()));
    }

    private interface State {
        void doClock(SafeContext context, int hour);
        void doUse(SafeContext context);
    }
    private static class DayState implements State {
        public void doClock(SafeContext c, int hour) { if (hour < 9 || hour >= 17) c.changeState(new NightState()); }
        public void doUse(SafeContext c) { c.steps.add("recordLog: 금고사용(주간)"); }
    }
    private static class NightState implements State {
        public void doClock(SafeContext c, int hour) { if (hour >= 9 && hour < 17) c.changeState(new DayState()); }
        public void doUse(SafeContext c) { c.steps.add("callSecurityCenter: 비상 야간 금고 사용"); }
    }
    private static class SafeContext {
        private State state = new DayState();
        private final List<String> steps = new ArrayList<>();
        void changeState(State next) { // 브레이크포인트: Context가 상태 객체를 교체
            steps.add(state.getClass().getSimpleName() + " → " + next.getClass().getSimpleName()); state = next;
        }
        void useAt(int hour) { steps.add("시각=" + hour); state.doClock(this, hour); state.doUse(this); }
    }
    private BookPatternResult state(BookPatternRequest r) {
        var context = new SafeContext();
        String[] hours = r.text().split(",", -1);
        if (hours.length > 24) throw new IllegalArgumentException("시각은 최대 24개입니다.");
        for (String token : hours) {
            int hour;
            try { hour = Integer.parseInt(token.trim()); } catch (NumberFormatException ex) { throw new IllegalArgumentException("쉼표로 구분한 0~23 시각을 입력하세요."); }
            if (hour < 0 || hour > 23) throw new IllegalArgumentException("시각은 0~23입니다.");
            context.useAt(hour);
        }
        return new BookPatternResult("State", context.steps, Map.of("state", context.state.getClass().getSimpleName()));
    }

    private static class BigChar {
        private final char character;
        BigChar(char character) { this.character = character; }
    }
    private static class BigCharFactory {
        private final Map<Character, BigChar> pool = new LinkedHashMap<>();
        BigChar getBigChar(char character) { // 브레이크포인트: 풀의 기존 참조 재사용
            return pool.computeIfAbsent(character, BigChar::new);
        }
    }
    private BookPatternResult flyweight(BookPatternRequest r) {
        if (!r.text().matches("[0-9-]{1,100}")) throw new IllegalArgumentException("text는 숫자와 -로 구성된 1~100자입니다.");
        var factory = new BigCharFactory();
        var identities = new IdentityHashMap<BigChar, Integer>();
        var ids = new ArrayList<Integer>(); var steps = new ArrayList<String>();
        for (char ch : r.text().toCharArray()) {
            BigChar glyph = r.fail() ? new BigChar(ch) : factory.getBigChar(ch);
            int id = identities.computeIfAbsent(glyph, ignored -> identities.size() + 1);
            ids.add(id); steps.add("BigString 문자=" + glyph.character + " → BigChar #" + id);
        }
        return new BookPatternResult("Flyweight", steps, Map.of("instances", identities.size(), "references", ids, "shared", !r.fail()));
    }

    private interface Printable { void setPrinterName(String name); void print(String text); }
    private static class Printer implements Printable {
        private String name; private final List<String> steps;
        Printer(String name, List<String> steps) { this.name = name; this.steps = steps; steps.add("Printer 생성: " + name); }
        public void setPrinterName(String name) { this.name = name; }
        public void print(String text) { steps.add("Printer[" + name + "]: " + text); }
    }
    private static class PrinterProxy implements Printable {
        private String name; private Printer real; private final List<String> steps;
        PrinterProxy(String name, List<String> steps) { this.name = name; this.steps = steps; }
        public void setPrinterName(String name) { this.name = name; if (real != null) real.setPrinterName(name); }
        public void print(String text) { realize(); real.print(text); }
        private void realize() { // 브레이크포인트: 첫 print에서만 본인 생성
            if (real == null) real = new Printer(name, steps);
        }
    }
    private BookPatternResult proxy(BookPatternRequest r) {
        var steps = new ArrayList<String>(); var proxy = new PrinterProxy("Alice", steps);
        proxy.setPrinterName(r.text()); steps.add("이름 변경 후 real 존재=" + (proxy.real != null));
        if (!r.fail()) for (int i = 0; i < r.count(); i++) proxy.print("문서 " + (i + 1));
        else steps.add("출력 생략: 지연 생성 유지");
        return new BookPatternResult("Proxy", steps, Map.of("name", proxy.name, "constructions", proxy.real == null ? 0 : 1));
    }

    private interface Command { void execute(); }
    private static class DrawCanvas {
        private final List<List<Integer>> points = new ArrayList<>();
        void draw(int x, int y) { points.add(List.of(x, y)); }
    }
    private record DrawCommand(DrawCanvas drawable, int x, int y) implements Command {
        public void execute() { drawable.draw(x, y); }
    }
    private static class MacroCommand implements Command {
        private final Deque<Command> commands = new ArrayDeque<>();
        void append(Command command) { if (command == this) throw new IllegalArgumentException("자기 자신은 등록할 수 없습니다."); commands.push(command); }
        void undo() { if (!commands.isEmpty()) commands.pop(); }
        public void execute() { // 브레이크포인트: 원본 Sample처럼 최신 명령부터 재생
            for (Command command : commands) command.execute();
        }
    }
    private BookPatternResult command(BookPatternRequest r) {
        var canvas = new DrawCanvas(); var history = new MacroCommand(); var steps = new ArrayList<String>();
        for (int i = 0; i < r.count(); i++) { history.append(new DrawCommand(canvas, r.value() + i, r.value() + i)); steps.add("append DrawCommand(" + (r.value() + i) + ")"); }
        if (r.fail()) { history.undo(); steps.add("undo: 마지막 명령 삭제"); }
        history.execute(); steps.add("MacroCommand.execute → DrawCommand → DrawCanvas.draw");
        return new BookPatternResult("Command", steps, Map.of("points", canvas.points, "historySize", history.commands.size()));
    }

    private interface Node { int cost(); void execute(Turtle turtle); }
    private record PrimitiveCommandNode(String name) implements Node {
        public int cost() { return 1; }
        public void execute(Turtle t) {
            if (name.equals("right")) t.direction = (t.direction + 1) % 4;
            else if (name.equals("left")) t.direction = (t.direction + 3) % 4;
            else { t.x += new int[]{0, 1, 0, -1}[t.direction]; t.y += new int[]{-1, 0, 1, 0}[t.direction]; }
            t.executed++; t.steps.add(name + " → (" + t.x + "," + t.y + ") " + t.directionName());
        }
    }
    private record CommandListNode(List<Node> nodes, int cost) implements Node {
        public void execute(Turtle t) { for (Node node : nodes) node.execute(t); }
    }
    private record RepeatCommandNode(int count, CommandListNode body) implements Node {
        public int cost() { return count * body.cost(); }
        public void execute(Turtle t) { for (int i = 0; i < count; i++) body.execute(t); }
    }
    private static class Turtle {
        private int x, y, direction, executed;
        private final List<String> steps = new ArrayList<>();
        String directionName() { return List.of("N", "E", "S", "W").get(direction); }
    }
    private static class Context {
        private final String[] tokens; private int index;
        Context(String text) { tokens = text.trim().isEmpty() ? new String[0] : text.trim().split("\\s+"); }
        String next() { if (index >= tokens.length) throw new IllegalArgumentException("명령 또는 end가 필요합니다."); return tokens[index++]; }
        CommandListNode parseList(int depth) { // 브레이크포인트: 재귀 하강으로 문법 트리 생성
            if (depth > 8) throw new IllegalArgumentException("repeat 중첩은 최대 8단계입니다.");
            var nodes = new ArrayList<Node>(); int cost = 0;
            while (true) {
                String token = next(); if (token.equals("end")) return new CommandListNode(List.copyOf(nodes), cost);
                Node node;
                if (token.equals("repeat")) {
                    int count;
                    try { count = Integer.parseInt(next()); } catch (NumberFormatException ex) { throw new IllegalArgumentException("repeat 횟수는 1~20 정수입니다."); }
                    if (count < 1 || count > 20) throw new IllegalArgumentException("repeat 횟수는 1~20입니다.");
                    node = new RepeatCommandNode(count, parseList(depth + 1));
                } else if (Set.of("go", "right", "left").contains(token)) node = new PrimitiveCommandNode(token);
                else throw new IllegalArgumentException("알 수 없는 명령: " + token);
                // 빈 반복도 작업량에 포함하여 중첩된 빈 루프의 지수적 실행을 방지합니다.
                int budget = node instanceof RepeatCommandNode repeat ? repeat.count() * Math.max(1, repeat.body().cost()) : node.cost();
                cost += budget;
                if (cost > 200) throw new IllegalArgumentException("확장된 실행 예산은 최대 200입니다.");
                nodes.add(node);
            }
        }
    }
    private BookPatternResult interpreter(BookPatternRequest r) {
        var context = new Context(r.text());
        if (!context.next().equals("program")) throw new IllegalArgumentException("program으로 시작하세요.");
        var program = context.parseList(0);
        if (context.index != context.tokens.length) throw new IllegalArgumentException("최종 end 뒤에는 토큰을 넣을 수 없습니다.");
        var turtle = new Turtle(); program.execute(turtle);
        return new BookPatternResult("Interpreter", turtle.steps, Map.of("x", turtle.x, "y", turtle.y, "direction", turtle.directionName(), "executed", turtle.executed, "executionBudget", program.cost(), "syntaxTree", program.toString()));
    }
}
