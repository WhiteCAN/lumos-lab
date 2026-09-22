import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

/** Java 21: main을 Debug하고 각 step의 람다 안에 중단점을 놓으세요. */
public class CollectionsDebugLab {
    record Step(String code, String note, String before, String after, String result) {
        String json() { return "{\"code\":" + q(code) + ",\"note\":" + q(note) + ",\"before\":" + q(before)
                + ",\"after\":" + q(after) + ",\"result\":" + q(result) + "}"; }
    }
    static class Scenario {
        final String name;
        final String setup;
        final Supplier<String> state;
        final List<Step> steps = new ArrayList<>();
        Scenario(String name, String setup, Supplier<String> state) {
            this.name = name; this.setup = setup; this.state = state;
        }
        void step(String code, String note, Supplier<?> action) {
            String before = state.get();
            String result;
            try { result = String.valueOf(action.get()); }
            catch (RuntimeException e) { result = e.getClass().getSimpleName(); }
            steps.add(new Step(code, note, before, state.get(), result));
        }
        String json() { return "{\"name\":" + q(name) + ",\"setup\":" + q(setup) + ",\"steps\":["
                + String.join(",", steps.stream().map(Step::json).toList()) + "]}"; }
    }
    static String q(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t") + "\"";
    }
    static Scenario arrayList() {
        var list = new ArrayList<Integer>(List.of(10, 20, 30));
        var s = new Scenario("ArrayList", "var list = new ArrayList<Integer>(List.of(10, 20, 30));", list::toString);
        s.step("list.add(1, 15)", "인덱스 1부터 뒤로 밀어 공간을 만들고 15를 넣습니다. 중간 삽입 O(n).", () -> { list.add(1, 15); return "void"; });
        s.step("list.remove(1)", "int 인수는 값이 아닌 인덱스입니다. 15를 제거하고 뒤 원소를 당깁니다.", () -> list.remove(1));
        s.step("list.remove(Integer.valueOf(20))", "Integer 객체 인수는 값 20을 찾아 제거합니다. 성공 여부를 반환합니다.", () -> list.remove(Integer.valueOf(20)));
        s.step("list.get(1)", "인덱스로 배열의 원소를 읽습니다. O(1).", () -> list.get(1));
        s.step("list.set(1, 99)", "크기는 유지하고 값을 교체하며 이전 값을 반환합니다.", () -> list.set(1, 99));
        s.step("list.add(40)", "끝에 추가합니다. 분할 상환 O(1), 확장 시 복사 O(n). 용량은 공개 API로 조회할 수 없습니다.", () -> list.add(40));
        s.step("list.get(99)", "유효하지 않은 인덱스는 예외를 발생시키고 기존 상태는 유지합니다.", () -> list.get(99));
        return s;
    }
    static Scenario vector() {
        var vector = new Vector<Integer>(2);
        var s = new Scenario("Vector", "var vector = new Vector<Integer>(2);", () -> vector + " | size=" + vector.size() + ", capacity=" + vector.capacity());
        s.step("vector.add(10)", "size는 저장된 원소 수, capacity는 확보한 공간입니다.", () -> vector.add(10));
        s.step("vector.add(20)", "초기 용량 2를 모두 사용합니다.", () -> vector.add(20));
        s.step("vector.add(30)", "기본 증가 정책으로 용량이 2에서 4로 늘고 원소를 복사합니다.", () -> vector.add(30));
        s.step("vector.remove(0)", "앞 원소 삭제 후 이동합니다. 삭제만으로 용량이 줄지는 않습니다.", () -> vector.remove(0));
        s.step("vector.trimToSize()", "현재 size에 맞게 용량을 줄입니다. 개별 메서드 동기화가 복합 작업 전체를 원자적으로 만들지는 않습니다.", () -> { vector.trimToSize(); return "void"; });
        return s;
    }
    static Scenario linkedList() {
        var list = new LinkedList<Integer>(List.of(10, 20));
        var s = new Scenario("LinkedList", "var list = new LinkedList<Integer>(List.of(10, 20));", list::toString);
        s.step("list.addFirst(5)", "앞 노드를 연결합니다. 양끝 추가 O(1).", () -> { list.addFirst(5); return "void"; });
        s.step("list.addLast(30)", "뒤 노드를 연결합니다. List와 Deque 역할을 모두 합니다.", () -> { list.addLast(30); return "void"; });
        s.step("list.get(2)", "인덱스 조회는 가까운 끝에서 노드를 따라갑니다. O(n).", () -> list.get(2));
        s.step("list.removeFirst()", "앞 노드를 분리하고 값을 반환합니다.", list::removeFirst);
        return s;
    }
    static Scenario stack() {
        var stack = new Stack<Integer>();
        var s = new Scenario("Stack", "var stack = new Stack<Integer>();", stack::toString);
        s.step("stack.push(10)", "Vector를 상속하는 레거시 스택입니다. 오른쪽이 top입니다.", () -> stack.push(10));
        s.step("stack.push(20)", "마지막에 들어온 20이 top이 됩니다.", () -> stack.push(20));
        s.step("stack.peek()", "top을 읽기만 합니다.", stack::peek);
        s.step("stack.pop()", "20을 먼저 제거합니다. LIFO. 새 코드에서는 ArrayDeque를 우선 검토합니다.", stack::pop);
        return s;
    }
    static Scenario set(String name, Set<Integer> set) {
        var s = new Scenario(name, "var set = new " + name + "<Integer>();", set::toString);
        s.step("set.add(20)", "첫 20은 저장됩니다.", () -> set.add(20));
        s.step("set.add(10)", "HashSet은 순서 미보장, LinkedHashSet은 삽입 순서, TreeSet은 비교 순서입니다.", () -> set.add(10));
        s.step("set.add(20)", "중복 추가는 false를 반환하고 원소 수를 늘리지 않습니다.", () -> set.add(20));
        s.step("set.contains(10)", "해시 계열은 hashCode/equals, TreeSet은 비교 결과를 사용합니다.", () -> set.contains(10));
        s.step("set.remove(20)", "값 20을 제거합니다. List.remove(int)와 달리 인덱스 삭제가 아닙니다.", () -> set.remove(20));
        return s;
    }
    static Scenario priorityQueue() {
        var queue = new PriorityQueue<Integer>();
        var s = new Scenario("PriorityQueue", "var queue = new PriorityQueue<Integer>();", queue::toString);
        s.step("queue.offer(30)", "기본값은 자연 순서의 최소 힙입니다.", () -> queue.offer(30));
        s.step("queue.offer(10)", "작은 원소를 head로 올립니다. 삽입 O(log n).", () -> queue.offer(10));
        s.step("queue.offer(20)", "표시 순서는 순회 결과이며 전체 정렬을 보장하지 않습니다.", () -> queue.offer(20));
        s.step("queue.poll()", "head의 10을 제거한 뒤 힙을 복구합니다. O(log n).", queue::poll);
        s.step("queue.peek()", "현재 최솟값을 제거 없이 읽습니다. O(1).", queue::peek);
        return s;
    }
    static Scenario deque() {
        var deque = new ArrayDeque<Integer>();
        var s = new Scenario("ArrayDeque", "var deque = new ArrayDeque<Integer>();", deque::toString);
        s.step("deque.offerLast(10)", "뒤에 넣습니다. 왼쪽이 first, 오른쪽이 last입니다.", () -> deque.offerLast(10));
        s.step("deque.offerLast(20)", "큐의 입력처럼 뒤에 추가합니다.", () -> deque.offerLast(20));
        s.step("deque.pollFirst()", "앞의 10을 제거하면 FIFO 큐입니다.", deque::pollFirst);
        s.step("deque.push(5)", "앞에 추가합니다. push/pop을 함께 쓰면 LIFO 스택입니다.", () -> { deque.push(5); return "void"; });
        s.step("deque.pop()", "앞의 5를 제거합니다.", deque::pop);
        s.step("deque.offerLast(null)", "ArrayDeque는 null을 허용하지 않습니다.", () -> deque.offerLast(null));
        return s;
    }
    static Scenario map(String name, Map<String, Integer> map) {
        var s = new Scenario(name, "var map = new " + name + "<String, Integer>();", map::toString);
        s.step("map.put(\"B\", 2)", "새 키의 이전 값은 없으므로 null을 반환합니다.", () -> map.put("B", 2));
        s.step("map.put(\"A\", 1)", "LinkedHashMap은 기본 삽입 순서, TreeMap은 키 비교 순서, 나머지는 순서 미보장입니다.", () -> map.put("A", 1));
        s.step("map.put(\"B\", 9)", "같은 키는 값을 교체하고 이전 값 2를 반환합니다. 키 수는 그대로입니다.", () -> map.put("B", 9));
        s.step("map.get(\"B\")", "키로 값을 조회합니다.", () -> map.get("B"));
        s.step("map.putIfAbsent(\"B\", 7)", "기존 값 9를 유지합니다. ConcurrentHashMap에서는 이 단일 키 연산이 원자적입니다.", () -> map.putIfAbsent("B", 7));
        s.step("map.remove(\"A\")", "키와 값을 함께 제거하고 이전 값을 반환합니다.", () -> map.remove("A"));
        if (name.equals("ConcurrentHashMap") || name.equals("Hashtable"))
            s.step("map.put(null, 1)", "이 구현체는 null 키와 null 값을 허용하지 않습니다. 스레드 안전성이 여러 호출 전체의 원자성을 의미하지는 않습니다.", () -> map.put(null, 1));
        return s;
    }
    public static void main(String[] args) {
        var scenarios = List.of(arrayList(), linkedList(), vector(), stack(),
                set("HashSet", new HashSet<>()), set("LinkedHashSet", new LinkedHashSet<>()), set("TreeSet", new TreeSet<>()),
                priorityQueue(), deque(), map("HashMap", new HashMap<>()), map("LinkedHashMap", new LinkedHashMap<>()),
                map("TreeMap", new TreeMap<>()), map("Hashtable", new Hashtable<>()), map("ConcurrentHashMap", new ConcurrentHashMap<>()));
        System.out.println("{\"javaVersion\":" + q(System.getProperty("java.version")) + ",\"scenarios\":["
                + String.join(",", scenarios.stream().map(Scenario::json).toList()) + "]}");
    }
}
