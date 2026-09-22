package com.lumos.lab.pattern.book;

import org.springframework.stereotype.Service;
import java.util.*;

/* 원형 출처: Hiroshi Yuki (2001, 2004, 2021), MIT. 라이선스: docs/third-party/design-patterns-MIT.txt */
/** 교재 1~8장의 역할을 요청 단위의 메모리 실험으로 재구성합니다. */
@Service
public class BookChapters01To08 {
    public BookPatternResult run(String slug, BookPatternRequest request) {
        List<String> steps = new ArrayList<>();
        Map<String, Object> result = switch (slug) {
            case "iterator" -> iterator(request, steps);
            case "adapter" -> adapter(request, steps);
            case "template-method" -> template(request, steps);
            case "factory-method" -> factory(request, steps);
            case "singleton" -> singleton(request, steps);
            case "prototype" -> prototype(request, steps);
            case "builder" -> builder(request, steps);
            case "abstract-factory" -> abstractFactory(request, steps);
            default -> throw new IllegalArgumentException("지원하지 않는 패턴: " + slug);
        };
        return new BookPatternResult(slug, List.copyOf(steps), result);
    }

    private Map<String, Object> iterator(BookPatternRequest r, List<String> steps) {
        BookShelf shelf = new BookShelf();
        for (int i = 1; i <= r.count(); i++) shelf.books.add(new Book(r.text() + " " + i));
        Iterator<Book> cursor = shelf.iterator();
        List<String> names = new ArrayList<>();
        while (cursor.hasNext()) {
            names.add(cursor.next().name());
            steps.add("next 후 index=" + names.size() + ", 책=" + names.getLast());
        }
        String exception = "없음";
        if (r.fail()) {
            try { cursor.next(); }
            catch (NoSuchElementException e) { exception = e.getClass().getSimpleName(); steps.add("소진 후 next: " + exception); }
        }
        return Map.of("books", names, "hasNext", cursor.hasNext(), "exhaustedException", exception);
    }
    record Book(String name) {}
    static class BookShelf implements Iterable<Book> {
        final List<Book> books = new ArrayList<>();
        public Iterator<Book> iterator() { return new BookShelfIterator(this); }
    }
    static class BookShelfIterator implements Iterator<Book> {
        final BookShelf shelf;
        int index;
        BookShelfIterator(BookShelf shelf) { this.shelf = shelf; }
        public boolean hasNext() { return index < shelf.books.size(); }
        public Book next() {
            // 중단점: index 증가 전후와 소진 시 예외를 확인합니다.
            if (!hasNext()) throw new NoSuchElementException();
            return shelf.books.get(index++);
        }
    }

    private Map<String, Object> adapter(BookPatternRequest r, List<String> steps) {
        Print printer = new PrintBanner(new Banner(r.text()), steps);
        return Map.of("weak", printer.printWeak(), "strong", printer.printStrong());
    }
    interface Print { String printWeak(); String printStrong(); }
    record Banner(String text) {
        String showWithParen() { return "(" + text + ")"; }
        String showWithAster() { return "*" + text + "*"; }
    }
    record PrintBanner(Banner banner, List<String> steps) implements Print {
        public String printWeak() {
            // 중단점: 클라이언트 Print 호출을 Banner 메서드로 위임합니다.
            steps.add("Print.printWeak → Banner.showWithParen");
            return banner.showWithParen();
        }
        public String printStrong() {
            steps.add("Print.printStrong → Banner.showWithAster");
            return banner.showWithAster();
        }
    }

    private Map<String, Object> template(BookPatternRequest r, List<String> steps) {
        AbstractDisplay display = new StringDisplay(r.text(), steps);
        return Map.of("lines", display.display(r.count()));
    }
    abstract static class AbstractDisplay {
        final List<String> steps;
        AbstractDisplay(List<String> steps) { this.steps = steps; }
        final List<String> display(int count) {
            // 중단점: final 알고리즘에서 하위 클래스의 훅으로 들어갑니다.
            List<String> lines = new ArrayList<>();
            steps.add("open"); lines.add(open());
            for (int i = 0; i < count; i++) { steps.add("print " + (i + 1)); lines.add(print()); }
            steps.add("close"); lines.add(close());
            return lines;
        }
        abstract String open(); abstract String print(); abstract String close();
    }
    static class StringDisplay extends AbstractDisplay {
        final String text;
        StringDisplay(String text, List<String> steps) { super(steps); this.text = text; }
        String open() { return "+" + "-".repeat(text.length()) + "+"; }
        String print() { return "|" + text + "|"; }
        String close() { return open(); }
    }

    private Map<String, Object> factory(BookPatternRequest r, List<String> steps) {
        IDCardFactory factory = new IDCardFactory(steps);
        List<Integer> serials = new ArrayList<>();
        for (int i = 0; i < r.count(); i++) {
            IDCard card = (IDCard) factory.create(r.text());
            serials.add(card.serial());
            steps.add(card.use());
        }
        return Map.of("serials", serials, "registered", factory.registered.size());
    }
    interface Product { String use(); }
    abstract static class Factory {
        final Product create(String owner) {
            // 중단점: 생성 → 등록 → 반환 순서를 확인합니다.
            Product product = createProduct(owner);
            registerProduct(product);
            return product;
        }
        abstract Product createProduct(String owner);
        abstract void registerProduct(Product product);
    }
    record IDCard(String owner, int serial) implements Product {
        public String use() { return owner + " 카드 사용, 번호=" + serial; }
    }
    static class IDCardFactory extends Factory {
        int nextSerial = 100;
        final List<Product> registered = new ArrayList<>();
        final List<String> steps;
        IDCardFactory(List<String> steps) { this.steps = steps; }
        Product createProduct(String owner) {
            IDCard card = new IDCard(owner, nextSerial++);
            steps.add("IDCard 생성: " + card.serial()); return card;
        }
        void registerProduct(Product product) { registered.add(product); steps.add("등록 완료: " + registered.size()); }
    }

    private Map<String, Object> singleton(BookPatternRequest r, List<String> steps) {
        Singleton first = Singleton.getInstance();
        boolean same = true;
        for (int i = 0; i < r.count(); i++) {
            same &= first == Singleton.getInstance();
            steps.add("getInstance " + (i + 1) + ": 첫 참조와 동일=" + same);
        }
        return Map.of("sameInstance", same, "lookups", r.count());
    }
    static final class Singleton {
        private static final Singleton INSTANCE = new Singleton();
        private Singleton() {}
        static Singleton getInstance() {
            // 중단점: 클래스 초기화로 안전하게 게시된 불변 참조입니다.
            return INSTANCE;
        }
    }

    private Map<String, Object> prototype(BookPatternRequest r, List<String> steps) {
        Manager manager = new Manager();
        MessageBox original = new MessageBox('*');
        manager.register("box", original);
        if (r.fail()) {
            try { manager.create("missing"); }
            catch (IllegalArgumentException e) { steps.add(e.getMessage()); return Map.of("error", e.getMessage()); }
        }
        Set<MessageBox> identities = Collections.newSetFromMap(new IdentityHashMap<>());
        List<String> rendered = new ArrayList<>();
        for (int i = 0; i < r.count(); i++) {
            MessageBox copy = manager.create("box");
            identities.add(copy); rendered.add(copy.use(r.text()));
            steps.add("원형과 별도 참조=" + (copy != original) + ", 복사본 사용 횟수=" + copy.uses);
        }
        return Map.of("distinctCopies", identities.size(), "prototypeUses", original.uses, "rendered", rendered);
    }
    static class Manager {
        final Map<String, MessageBox> showcase = new HashMap<>();
        void register(String name, MessageBox prototype) { showcase.put(name, prototype); }
        MessageBox create(String name) {
            // 중단점: 이름으로 원형을 찾고 생성자 대신 복제를 호출합니다.
            MessageBox prototype = showcase.get(name);
            if (prototype == null) throw new IllegalArgumentException("등록되지 않은 원형: " + name);
            return prototype.createCopy();
        }
    }
    static class MessageBox implements Cloneable {
        final char decoration;
        int uses;
        MessageBox(char decoration) { this.decoration = decoration; }
        MessageBox createCopy() {
            try { return (MessageBox) super.clone(); }
            catch (CloneNotSupportedException e) { throw new AssertionError(e); }
        }
        String use(String text) {
            uses++;
            String border = String.valueOf(decoration).repeat(text.length() + 2);
            return border + "\n" + decoration + text + decoration + "\n" + border;
        }
    }

    private Map<String, Object> builder(BookPatternRequest r, List<String> steps) {
        Builder text = new TextBuilder();
        Builder html = new HTMLBuilder();
        new Director(text, steps).construct(r.text(), r.count());
        new Director(html, steps).construct(r.text(), r.count());
        return Map.of("text", text.result(), "html", html.result());
    }
    interface Builder {
        void makeTitle(String title); void makeItems(List<String> items); void close(); String result();
    }
    record Director(Builder builder, List<String> steps) {
        void construct(String title, int count) {
            // 중단점: Director는 구체 Builder를 몰라도 같은 순서를 실행합니다.
            steps.add(builder.getClass().getSimpleName() + ": makeTitle → makeItems → close");
            builder.makeTitle(title);
            List<String> items = new ArrayList<>();
            for (int i = 1; i <= count; i++) items.add("항목 " + i);
            builder.makeItems(items); builder.close();
        }
    }
    static class TextBuilder implements Builder {
        final StringBuilder out = new StringBuilder();
        public void makeTitle(String title) { out.append("【").append(title).append("】\n"); }
        public void makeItems(List<String> items) { items.forEach(item -> out.append("・").append(item).append('\n')); }
        public void close() { out.append("끝\n"); }
        public String result() { return out.toString(); }
    }
    static class HTMLBuilder implements Builder {
        final StringBuilder out = new StringBuilder();
        public void makeTitle(String title) { out.append("<article><h1>").append(escape(title)).append("</h1>"); }
        public void makeItems(List<String> items) {
            out.append("<ul>"); items.forEach(item -> out.append("<li>").append(escape(item)).append("</li>")); out.append("</ul>");
        }
        public void close() { out.append("</article>"); }
        public String result() { return out.toString(); }
    }

    private Map<String, Object> abstractFactory(BookPatternRequest r, List<String> steps) {
        return Map.of("listHtml", assemble(new ListFactory(), r, steps), "divHtml", assemble(new DivFactory(), r, steps));
    }
    private String assemble(PageFactory factory, BookPatternRequest r, List<String> steps) {
        // 중단점: 같은 조립 코드가 제품군의 Link, Tray, Page를 함께 사용합니다.
        Tray tray = factory.createTray();
        for (int i = 1; i <= r.count(); i++) tray.add(factory.createLink(r.text() + " " + i));
        Page page = factory.createPage(); page.add(tray);
        steps.add(factory.getClass().getSimpleName() + ": Link " + r.count() + "개 → Tray → Page");
        return page.html();
    }
    interface Item { String html(); }
    interface Link extends Item {}
    abstract static class Tray implements Item {
        final List<Item> items = new ArrayList<>();
        void add(Item item) { items.add(item); }
        String children() { return String.join("", items.stream().map(Item::html).toList()); }
    }
    abstract static class Page extends Tray {}
    interface PageFactory { Link createLink(String caption); Tray createTray(); Page createPage(); }
    record ListLink(String caption) implements Link { public String html() { return "<li><a href=\"#\">" + escape(caption) + "</a></li>"; } }
    record DivLink(String caption) implements Link { public String html() { return "<div><a href=\"#\">" + escape(caption) + "</a></div>"; } }
    static class ListTray extends Tray { public String html() { return "<ul>" + children() + "</ul>"; } }
    static class DivTray extends Tray { public String html() { return "<section>" + children() + "</section>"; } }
    static class ListPage extends Page { public String html() { return "<main class=\"list\">" + children() + "</main>"; } }
    static class DivPage extends Page { public String html() { return "<main class=\"div\">" + children() + "</main>"; } }
    static class ListFactory implements PageFactory {
        public Link createLink(String caption) { return new ListLink(caption); }
        public Tray createTray() { return new ListTray(); }
        public Page createPage() { return new ListPage(); }
    }
    static class DivFactory implements PageFactory {
        public Link createLink(String caption) { return new DivLink(caption); }
        public Tray createTray() { return new DivTray(); }
        public Page createPage() { return new DivPage(); }
    }
    private static String escape(String value) {
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
    }
}
