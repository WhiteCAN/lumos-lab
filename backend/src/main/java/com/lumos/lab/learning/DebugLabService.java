package com.lumos.lab.learning;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DebugLabService {
    public record MapResult(List<Integer> sortedKeys, List<Integer> insertionKeys,
                            List<Integer> accessKeys, Integer floor, Integer ceiling, List<String> steps) {}
    public record RetryResult(boolean success, int attempts, List<String> steps) {}

    public MapResult orderedMaps(List<Integer> keys, int accessKey, int boundary) {
        if (keys == null || keys.isEmpty() || keys.size() > 30 || keys.stream().anyMatch(Objects::isNull))
            throw new IllegalArgumentException("키는 1~30개의 정수여야 합니다.");
        var sorted = new TreeMap<Integer, String>();
        var insertion = new LinkedHashMap<Integer, String>();
        var access = new LinkedHashMap<Integer, String>(16, 0.75f, true);
        var steps = new ArrayList<String>();
        for (int key : keys) {
            sorted.put(key, "value-" + key); // 브레이크포인트: put 전후 순서 비교
            insertion.put(key, "value-" + key);
            access.put(key, "value-" + key);
            steps.add("put(" + key + "): tree=" + sorted.keySet() + ", insertion=" + insertion.keySet() + ", access=" + access.keySet());
        }
        access.get(accessKey); // 브레이크포인트: 접근 순서 변경 확인
        steps.add("get(" + accessKey + "): access=" + access.keySet());
        return new MapResult(List.copyOf(sorted.keySet()), List.copyOf(insertion.keySet()),
                List.copyOf(access.keySet()), sorted.floorKey(boundary), sorted.ceilingKey(boundary), steps);
    }

    public RetryResult retry(int failures, int maxAttempts) {
        if (failures < 0 || failures > 5 || maxAttempts < 1 || maxAttempts > 5)
            throw new IllegalArgumentException("실패 횟수는 0~5, 최대 시도는 1~5입니다.");
        var steps = new ArrayList<String>();
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                callDependency(attempt, failures); // 브레이크포인트: 실패를 실제 예외로 주입
                steps.add(attempt + "번째 호출 성공");
                return new RetryResult(true, attempt, steps);
            } catch (IllegalStateException ex) {
                steps.add(attempt + "번째 호출 실패: " + ex.getMessage());
            }
        }
        return new RetryResult(false, maxAttempts, steps);
    }

    private void callDependency(int attempt, int failures) {
        if (attempt <= failures) throw new IllegalStateException("학습용 일시 장애");
    }
}
