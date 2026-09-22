package com.lumos.lab.learning;

import jakarta.validation.constraints.*;
import org.springframework.stereotype.Service;
import java.util.*;

/** 요청마다 새 상태로 실행하는 로컬 알고리즘·설계 실습. 외부 Redis/Kafka를 사용하지 않습니다. */
@Service
public class ScenarioLabService {
    public record Input(@NotEmpty @Size(max=30) List<@NotNull @Min(-10000) @Max(10000) Integer> values,
                        @Min(-10000) @Max(10000) int parameter, boolean fail) {}
    public record Result(Object result, List<String> steps) {}

    public Result run(String scenario, Input input) {
        if (input.values() == null || input.values().isEmpty() || input.values().size() > 30
                || input.values().stream().anyMatch(Objects::isNull))
            throw new IllegalArgumentException("values에는 정수 1~30개가 필요합니다.");
        return switch (scenario) {
            case "two-sum" -> twoSum(input);
            case "cache" -> cache(input);
            case "sharding", "broker" -> partition(input, scenario.equals("broker"));
            case "outbox" -> outbox(input);
            case "circuit" -> circuit(input);
            case "pipeline" -> pipeline(input);
            case "pricing" -> pricing(input);
            case "packets" -> packets(input);
            default -> throw new IllegalArgumentException("지원하지 않는 실습: " + scenario);
        };
    }

    private Result twoSum(Input input) {
        var seen = new HashMap<Integer, Integer>();
        var steps = new ArrayList<String>();
        for (int index=0; index<input.values().size(); index++) {
            int value = input.values().get(index);
            int complement = input.parameter() - value;
            steps.add("i=" + index + ", value=" + value + ", complement=" + complement + ", seen=" + seen);
            if (seen.containsKey(complement)) return new Result(List.of(seen.get(complement), index), steps);
            seen.put(value, index);
        }
        return new Result(List.of(), steps);
    }

    private Result cache(Input input) {
        capacity(input.parameter());
        var cache = new LinkedHashMap<Integer, Integer>(16, 0.75f, true);
        var steps = new ArrayList<String>();
        int loads = 0;
        for (int key : input.values()) {
            if (cache.containsKey(key)) { cache.get(key); steps.add("HIT " + key); }
            else {
                loads++;
                cache.put(key, key * key); // 외부 DB 대신 로컬 계산을 원본 조회로 사용
                steps.add("MISS " + key);
                if (cache.size() > input.parameter()) {
                    int evicted = cache.firstEntry().getKey();
                    cache.remove(evicted);
                    steps.add("EVICT " + evicted);
                }
            }
            steps.add("LRU → MRU: " + cache.keySet());
        }
        return new Result(Map.of("sourceLoads", loads, "keys", List.copyOf(cache.keySet())), steps);
    }

    private Result partition(Input input, boolean broker) {
        capacity(input.parameter());
        var partitions = new TreeMap<Integer, List<Integer>>();
        var steps = new ArrayList<String>();
        for (int key : input.values()) {
            int partition = Math.floorMod(key, input.parameter());
            var entries = partitions.computeIfAbsent(partition, ignored -> new ArrayList<>());
            if (broker) steps.add("key=" + key + " → partition=" + partition + ", offset=" + entries.size());
            else steps.add("key=" + key + " → shard=" + partition);
            entries.add(key);
        }
        return new Result(partitions, steps);
    }

    private Result outbox(Input input) {
        var stagedOrders = new ArrayList<Integer>(input.values());
        var stagedEvents = new ArrayList<Integer>(input.values());
        var steps = new ArrayList<String>();
        steps.add("임시 주문·이벤트 작성: " + stagedOrders);
        if (input.fail()) {
            stagedOrders.clear(); stagedEvents.clear();
            steps.add("실패 주입: 임시 변경 폐기, 발행하지 않음");
        } else steps.add("로컬 커밋 모형: 주문·이벤트 확정");
        var published = new LinkedHashSet<Integer>();
        for (int event : stagedEvents) steps.add("event=" + event + (published.add(event) ? " 발행" : " 중복 처리 방지"));
        return new Result(Map.of("orders", stagedOrders, "published", published), steps);
    }

    private Result circuit(Input input) {
        capacity(input.parameter());
        int failures=0, calls=0;
        var steps = new ArrayList<String>();
        for (int outcome : input.values()) {
            if (failures >= input.parameter()) { steps.add("OPEN: 호출 차단"); continue; }
            calls++;
            if (outcome == 0) { failures++; steps.add("CLOSED: 호출 실패, 연속 실패=" + failures); }
            else { failures=0; steps.add("CLOSED: 호출 성공, 연속 실패 초기화"); }
        }
        return new Result(Map.of("calls", calls, "state", failures >= input.parameter() ? "OPEN" : "CLOSED"), steps);
    }

    private Result pipeline(Input input) {
        var steps = new ArrayList<String>();
        int actual = input.values().stream().mapToInt(Integer::intValue).sum() + (input.fail() ? 1 : 0);
        int expected = input.parameter();
        steps.add("합계 계산: " + actual);
        boolean passed = actual == expected;
        steps.add("검증: expected=" + expected + ", actual=" + actual + ", passed=" + passed);
        if (passed) steps.add("배포 단계 실행");
        else steps.add("검증 실패: 다음 단계 중단");
        return new Result(Map.of("passed", passed, "actual", actual, "expected", expected), steps);
    }

    public record PriceDto(int quantity, int unitPrice) {}
    public record Money(long amount) {
        public Money { if (amount < 0) throw new IllegalArgumentException("금액은 음수일 수 없습니다."); }
    }
    private Result pricing(Input input) {
        // DTO → 도메인 값 객체. 클라이언트가 전달한 합계를 신뢰하지 않고 직접 계산합니다.
        var dto = new PriceDto(input.values().getFirst(), input.parameter());
        if (dto.quantity() < 1 || dto.quantity() > 100 || dto.unitPrice() < 0)
            throw new IllegalArgumentException("수량은 1~100, 단가는 0 이상입니다.");
        var total = new Money((long) dto.quantity() * dto.unitPrice());
        return new Result(total, List.of("요청 DTO: " + dto, "업무 규칙 검증", "값 객체 계산: " + total));
    }

    private Result packets(Input input) {
        var sequenceNumbers = new ArrayList<Integer>();
        for (int i=0;i<input.values().size();i++) sequenceNumbers.add(i);
        var steps = new ArrayList<String>();
        if (input.fail()) { sequenceNumbers.removeFirst(); steps.add("첫 번째 데이터그램 손실 주입"); }
        Collections.reverse(sequenceNumbers);
        var delivered = sequenceNumbers.stream().map(input.values()::get).toList();
        var recovered = new TreeMap<Integer,Integer>();
        for (int sequence : sequenceNumbers) recovered.put(sequence,input.values().get(sequence));
        for (int sequence=0;sequence<input.values().size();sequence++) {
            if (!recovered.containsKey(sequence)) {
                recovered.put(sequence,input.values().get(sequence));
                steps.add("누락 seq=" + sequence + " 재전송 성공을 모형에 반영");
            }
        }
        steps.add("도착 순서: " + delivered);
        return new Result(Map.of("sent", input.values(), "udpObserved", delivered,
                "tcpAfterSuccessfulRecovery", List.copyOf(recovered.values())), steps);
    }

    private void capacity(int value) {
        if (value < 1 || value > 10) throw new IllegalArgumentException("용량·분할 수·임계값은 1~10입니다.");
    }
}
