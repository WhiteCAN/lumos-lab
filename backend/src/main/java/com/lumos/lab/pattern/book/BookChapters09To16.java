package com.lumos.lab.pattern.book;

import org.springframework.stereotype.Service;
import java.util.*;

/** 책 9~16장의 협력 객체. 모든 가변 상태는 요청 안에서만 생성한다.
 * Adapted from Java Design Patterns examples, Copyright (c) 2001,2004,2021 Hiroshi Yuki.
 * MIT license: docs/third-party/design-patterns-MIT.txt
 */
@Service
public class BookChapters09To16 {
    public BookPatternResult run(String slug, BookPatternRequest request) {
        List<String> steps = new ArrayList<>();
        Map<String, Object> result = switch (slug) {
            case "bridge" -> bridge(request, steps);
            case "strategy" -> strategy(request, steps);
            case "composite" -> composite(request, steps);
            case "decorator" -> decorator(request, steps);
            case "visitor" -> visitor(request, steps);
            case "chain-of-responsibility" -> chain(request, steps);
            case "facade" -> new PageMaker(steps).makeWelcomePage(request.text(), request.fail());
            case "mediator" -> mediator(request, steps);
            default -> throw new IllegalArgumentException("지원하지 않는 책 패턴: " + slug);
        };
        return new BookPatternResult(slug, List.copyOf(steps), result);
    }

    private Map<String, Object> bridge(BookPatternRequest r, List<String> steps) {
        var impl = new StringDisplayImpl(r.text(), steps);
        new CountDisplay(impl).multiDisplay(r.count());
        return Map.of("lines", impl.lines, "count", r.count());
    }
    interface DisplayImpl { void rawOpen(); void rawPrint(); void rawClose(); }
    static class Display {
        final DisplayImpl impl;
        Display(DisplayImpl impl) { this.impl = impl; }
        void open() { impl.rawOpen(); }
        void print() { impl.rawPrint(); }
        void close() { impl.rawClose(); }
    }
    static final class CountDisplay extends Display {
        CountDisplay(DisplayImpl impl) { super(impl); }
        void multiDisplay(int times) {
            open();
            // 중단점: 기능 계층은 구현의 구체 타입을 모른 채 반복을 제어한다.
            for (int i = 0; i < times; i++) print();
            close();
        }
    }
    static final class StringDisplayImpl implements DisplayImpl {
        final String text; final List<String> steps; final List<String> lines = new ArrayList<>();
        StringDisplayImpl(String text, List<String> steps) { this.text = text; this.steps = steps; }
        public void rawOpen() { lines.add("+" + "-".repeat(text.length()) + "+"); steps.add("StringDisplayImpl.rawOpen → 테두리 열기"); }
        public void rawPrint() { lines.add("|" + text + "|"); steps.add("StringDisplayImpl.rawPrint → " + text); }
        public void rawClose() { lines.add("+" + "-".repeat(text.length()) + "+"); steps.add("StringDisplayImpl.rawClose → 테두리 닫기"); }
    }

    private Map<String, Object> strategy(BookPatternRequest r, List<String> steps) {
        Player first = new Player(new WinningStrategy(r.seed()));
        Player second = new Player(new ProbStrategy(r.seed() ^ 0x5DEECE66DL));
        List<String> rounds = new ArrayList<>();
        String[] hands = {"바위", "가위", "보"};
        for (int i = 0; i < r.count(); i++) {
            int a = first.nextHand(), b = second.nextHand();
            int outcome = a == b ? 0 : (a + 1) % 3 == b ? 1 : -1;
            first.finish(outcome); second.finish(-outcome);
            String round = (i + 1) + "회: " + hands[a] + " / " + hands[b] + " → " + (outcome == 0 ? "무승부" : outcome > 0 ? "Winning 승리" : "Prob 승리");
            rounds.add(round); steps.add(round + (outcome == 0 ? " (study 생략)" : " (양쪽 study 호출)"));
        }
        return Map.of("rounds", rounds, "wins", first.wins, "losses", first.losses, "draws", first.draws,
                "probHistory", second.strategy instanceof ProbStrategy p ? Arrays.stream(p.history).map(row -> Arrays.stream(row).boxed().toList()).toList() : List.of());
    }
    interface Strategy { int nextHand(); void study(boolean win); }
    static final class WinningStrategy implements Strategy {
        final Random random; boolean won; int previous;
        WinningStrategy(long seed) { random = new Random(seed); }
        public int nextHand() { if (!won) previous = random.nextInt(3); return previous; }
        public void study(boolean win) { won = win; }
    }
    static final class ProbStrategy implements Strategy {
        final Random random; int previous; int current;
        final int[][] history = {{1,1,1},{1,1,1},{1,1,1}};
        ProbStrategy(long seed) { random = new Random(seed); }
        public int nextHand() {
            int[] weights = history[current];
            int bet = random.nextInt(weights[0] + weights[1] + weights[2]);
            previous = current;
            current = bet < weights[0] ? 0 : bet < weights[0] + weights[1] ? 1 : 2;
            return current;
        }
        public void study(boolean win) {
            // 중단점: 이전 손에서 현재 손으로 이동한 가중치가 결과에 따라 바뀐다.
            if (win) history[previous][current]++;
            else { history[previous][(current + 1) % 3]++; history[previous][(current + 2) % 3]++; }
        }
    }
    static final class Player {
        final Strategy strategy; int wins; int losses; int draws;
        Player(Strategy strategy) { this.strategy = strategy; }
        int nextHand() { return strategy.nextHand(); }
        void finish(int outcome) {
            if (outcome == 0) { draws++; return; }
            strategy.study(outcome > 0);
            if (outcome > 0) wins++; else losses++;
        }
    }

    abstract static class Entry {
        final String name; Directory parent;
        Entry(String name) { this.name = name; }
        String path() { return (parent == null ? "" : parent.path()) + "/" + name; }
        abstract int getSize(List<String> steps);
        abstract void accept(Visitor visitor);
    }
    static final class File extends Entry {
        final int size;
        File(String name, int size) { super(name); this.size = size; }
        int getSize(List<String> steps) { steps.add("File.getSize " + path() + " = " + size); return size; }
        void accept(Visitor visitor) { visitor.visit(this); }
    }
    static final class Directory extends Entry {
        final List<Entry> children = new ArrayList<>();
        Directory(String name) { super(name); }
        void add(Entry entry) { entry.parent = this; children.add(entry); }
        int getSize(List<String> steps) {
            int total = 0;
            // 중단점: File과 Directory를 동일한 Entry.getSize로 처리한다.
            for (Entry child : children) total += child.getSize(steps);
            steps.add("Directory.getSize " + path() + " = " + total);
            return total;
        }
        void accept(Visitor visitor) { visitor.visit(this); }
    }
    private Directory tree(String name, int count, int size) {
        Directory root = new Directory("root"), docs = new Directory(name);
        root.add(docs);
        for (int i = 1; i <= count; i++) docs.add(new File("file-" + i + (i % 2 == 1 ? ".txt" : ".html"), size));
        return root;
    }
    private Map<String, Object> composite(BookPatternRequest r, List<String> steps) {
        Directory root = tree(r.text().isBlank() ? "docs" : r.text().replace('/', '_'), r.count(), r.value());
        int size = root.getSize(steps);
        return Map.of("totalSize", size, "leafPaths", ((Directory) root.children.getFirst()).children.stream().map(Entry::path).toList());
    }
    interface Visitor { void visit(File file); void visit(Directory directory); }
    static final class FileFindVisitor implements Visitor {
        final String suffix; final List<String> found = new ArrayList<>(); final List<String> steps;
        FileFindVisitor(String suffix, List<String> steps) { this.suffix = suffix; this.steps = steps; }
        public void visit(File file) {
            // 중단점: File.accept에서 구체 타입 visit(File)로 두 번째 디스패치한다.
            boolean match = file.name.endsWith(suffix);
            steps.add("File.accept → FileFindVisitor.visit(File) " + file.path() + " 일치=" + match);
            if (match) found.add(file.path());
        }
        public void visit(Directory directory) {
            steps.add("Directory.accept → FileFindVisitor.visit(Directory) " + directory.path());
            for (Entry child : directory.children) child.accept(this);
        }
    }
    private Map<String, Object> visitor(BookPatternRequest r, List<String> steps) {
        Directory root = tree("docs", r.count(), r.value());
        FileFindVisitor visitor = new FileFindVisitor(r.text(), steps);
        root.accept(visitor);
        return Map.of("suffix", r.text(), "found", visitor.found, "fileCount", r.count());
    }

    interface TextDisplay { int getColumns(); int getRows(); String getRowText(int row); }
    record StringDisplay(String text) implements TextDisplay {
        public int getColumns() { return text.length(); }
        public int getRows() { return 1; }
        public String getRowText(int row) { return text; }
    }
    abstract static class Border implements TextDisplay {
        final TextDisplay display;
        Border(TextDisplay display) { this.display = display; }
    }
    static final class SideBorder extends Border {
        SideBorder(TextDisplay display) { super(display); }
        public int getColumns() { return display.getColumns() + 2; }
        public int getRows() { return display.getRows(); }
        public String getRowText(int row) { return "#" + display.getRowText(row) + "#"; }
    }
    static final class FullBorder extends Border {
        FullBorder(TextDisplay display) { super(display); }
        public int getColumns() { return display.getColumns() + 2; }
        public int getRows() { return display.getRows() + 2; }
        public String getRowText(int row) {
            // 중단점: 바깥 장식이 안쪽 장식에 행 번호를 조정해서 위임한다.
            return row == 0 || row == getRows() - 1 ? "+" + "-".repeat(display.getColumns()) + "+" : "|" + display.getRowText(row - 1) + "|";
        }
    }
    private Map<String, Object> decorator(BookPatternRequest r, List<String> steps) {
        TextDisplay display = new StringDisplay(r.text());
        for (int i = 0; i < r.count(); i++) {
            display = i % 2 == 0 ? new SideBorder(display) : new FullBorder(display);
            steps.add(display.getClass().getSimpleName() + " 연결 → " + display.getColumns() + "열, " + display.getRows() + "행");
        }
        List<String> lines = new ArrayList<>();
        for (int row = 0; row < display.getRows(); row++) lines.add(display.getRowText(row));
        return Map.of("lines", lines, "columns", display.getColumns(), "rows", display.getRows());
    }

    record Trouble(int number) {}
    abstract static class Support {
        final String name; Support next;
        Support(String name) { this.name = name; }
        Support setNext(Support next) { this.next = next; return next; }
        abstract boolean resolve(Trouble trouble);
        String support(Trouble trouble, List<String> steps) {
            // 중단점: 처음 처리 가능한 객체에서 사슬을 중단한다.
            boolean handled = resolve(trouble);
            steps.add(name + ".resolve(" + trouble.number + ") → " + handled);
            if (handled) return name;
            if (next != null) return next.support(trouble, steps);
            steps.add("사슬 끝 → 미해결"); return "미해결";
        }
    }
    static final class NoSupport extends Support {
        NoSupport(String name) { super(name); } boolean resolve(Trouble t) { return false; }
    }
    static final class LimitSupport extends Support {
        final int limit; LimitSupport(String name, int limit) { super(name); this.limit = limit; }
        boolean resolve(Trouble t) { return t.number < limit; }
    }
    static final class SpecialSupport extends Support {
        final int number; SpecialSupport(String name, int number) { super(name); this.number = number; }
        boolean resolve(Trouble t) { return t.number == number; }
    }
    static final class OddSupport extends Support {
        OddSupport(String name) { super(name); } boolean resolve(Trouble t) { return t.number % 2 == 1; }
    }
    private Map<String, Object> chain(BookPatternRequest r, List<String> steps) {
        Support alice = new NoSupport("Alice");
        alice.setNext(new LimitSupport("Bob", 20)).setNext(new SpecialSupport("Charlie", 42))
            .setNext(new LimitSupport("Diana", 40)).setNext(new OddSupport("Elmo")).setNext(new LimitSupport("Fred", 60));
        return Map.of("number", r.value(), "handler", alice.support(new Trouble(r.value()), steps));
    }

    static final class Database {
        Map<String, String> getProperties(String username) { return Map.of("member@example.test", username); }
    }
    static final class HtmlWriter {
        final StringBuilder html = new StringBuilder();
        void title(String title) { html.append("<!doctype html><html><head><title>").append(escape(title)).append("</title></head><body>"); }
        void paragraph(String text) { html.append("<p>").append(escape(text)).append("</p>"); }
        void mailto(String email, String name) { html.append("<a href=\"mailto:").append(escape(email)).append("\">").append(escape(name)).append("</a>"); }
        String close() { return html.append("</body></html>").toString(); }
        static String escape(String text) { return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;"); }
    }
    static final class PageMaker {
        final List<String> steps;
        PageMaker(List<String> steps) { this.steps = steps; }
        Map<String, Object> makeWelcomePage(String username, boolean missing) {
            // 중단점: Facade가 데이터 조회와 HTML 출력 순서를 조정한다.
            String email = missing ? "missing@example.test" : "member@example.test";
            String member = new Database().getProperties(username).get(email);
            steps.add("PageMaker → Database.getProperties → " + (member == null ? "회원 없음" : "회원 조회"));
            if (member == null) return Map.of("status", "회원 없음", "html", "");
            HtmlWriter writer = new HtmlWriter();
            writer.title(member + "'s web page"); steps.add("HtmlWriter.title");
            writer.paragraph("Welcome to " + member + "'s web page!"); steps.add("HtmlWriter.paragraph");
            writer.mailto(email, member); steps.add("HtmlWriter.mailto");
            String html = writer.close(); steps.add("HtmlWriter.close → 메모리 문자열 반환");
            return Map.of("status", "생성 완료", "html", html);
        }
    }

    interface Mediator { void colleagueChanged(); }
    static class Colleague {
        final Mediator mediator; boolean enabled;
        Colleague(Mediator mediator) { this.mediator = mediator; }
        void setColleagueEnabled(boolean enabled) { this.enabled = enabled; }
    }
    static final class ColleagueTextField extends Colleague {
        String text = "";
        ColleagueTextField(Mediator mediator) { super(mediator); }
        void setText(String text) { this.text = text; mediator.colleagueChanged(); }
    }
    static final class ColleagueCheckbox extends Colleague {
        boolean guest = true;
        ColleagueCheckbox(Mediator mediator) { super(mediator); }
        void selectGuest(boolean guest) { this.guest = guest; mediator.colleagueChanged(); }
    }
    static final class LoginFrame implements Mediator {
        final ColleagueCheckbox checkGuest = new ColleagueCheckbox(this);
        final ColleagueTextField textUser = new ColleagueTextField(this), textPass = new ColleagueTextField(this);
        final Colleague buttonOk = new Colleague(this);
        final int minimum; final List<String> steps;
        LoginFrame(boolean exercise, List<String> steps) { minimum = exercise ? 4 : 1; this.steps = steps; colleagueChanged(); }
        public void colleagueChanged() {
            // 중단점: 각 동료의 이벤트가 이 한 곳의 활성화 규칙을 실행한다.
            boolean guest = checkGuest.guest;
            textUser.setColleagueEnabled(!guest);
            textPass.setColleagueEnabled(!guest && !textUser.text.isEmpty());
            buttonOk.setColleagueEnabled(guest || textUser.text.length() >= minimum && textPass.text.length() >= minimum);
            steps.add("LoginFrame.colleagueChanged → guest=" + guest + ", user=" + textUser.enabled + ", pass=" + textPass.enabled + ", OK=" + buttonOk.enabled);
        }
    }
    private Map<String, Object> mediator(BookPatternRequest r, List<String> steps) {
        LoginFrame frame = new LoginFrame(r.fail(), steps);
        frame.checkGuest.selectGuest(r.value() == 0);
        frame.textUser.setText(r.text());
        frame.textPass.setText("*".repeat(r.count()));
        return Map.of("guest", frame.checkGuest.guest, "userEnabled", frame.textUser.enabled, "passEnabled", frame.textPass.enabled,
                "okEnabled", frame.buttonOk.enabled, "minimumLength", frame.minimum);
    }
}
