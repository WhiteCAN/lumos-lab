package com.lumos.lab.javafundamental.collection;

import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.TreeSet;

@Service
public class JavaCollectionService {

    public CollectionCompareResponse compare() {
        return new CollectionCompareResponse(
                List.of(
                        new CollectionCompareItem("ArrayList", "List", "입력 순서 유지", "허용", "인덱스 조회가 많은 목록", "O(1)", "끝 O(1), 중간 O(n)", "O(n)"),
                        new CollectionCompareItem("LinkedList", "List/Deque", "입력 순서 유지", "허용", "양끝 삽입/삭제", "O(n)", "위치 탐색 후 O(1)", "O(n)"),
                        new CollectionCompareItem("HashSet", "Set", "보장 안 함", "불가", "빠른 중복 제거", "-", "O(1)", "O(1)"),
                        new CollectionCompareItem("TreeSet", "Set", "정렬 순서", "불가", "항상 정렬된 유니크 값", "-", "O(log n)", "O(log n)"),
                        new CollectionCompareItem("HashMap", "Map", "보장 안 함", "키 중복 불가", "키로 빠르게 찾기", "-", "O(1)", "O(1)"),
                        new CollectionCompareItem("TreeMap", "Map", "키 정렬 순서", "키 중복 불가", "범위 검색/정렬 키", "-", "O(log n)", "O(log n)"),
                        new CollectionCompareItem("ArrayDeque", "Queue/Deque", "입력 흐름 유지", "허용", "큐/스택 대체", "-", "양끝 O(1)", "O(n)")
                ),
                "대부분은 ArrayList로 시작하고, 중복 제거는 HashSet, 키 조회는 HashMap, 정렬 상태 유지가 필요하면 Tree 계열을 고릅니다.",
                """
                List<String> names = new ArrayList<>();
                Set<String> uniqueNames = new HashSet<>();
                Map<String, Integer> scoreByName = new HashMap<>();
                Queue<String> queue = new ArrayDeque<>();
                """
        );
    }

    public CollectionDemoResponse demo(CollectionDemoRequest request) {
        String type = request.collectionType().trim().toUpperCase(Locale.ROOT);
        List<String> steps = new ArrayList<>();
        List<String> finalState;
        String codeExample;

        if ("HASHSET".equals(type)) {
            Set<String> set = new LinkedHashSet<>();
            for (String value : request.values()) {
                boolean added = set.add(value);
                steps.add(added ? value + " 추가" : value + " 중복이라 무시");
            }
            finalState = new ArrayList<>(set);
            codeExample = "Set<String> values = new HashSet<>();\nvalues.add(\"A\");";
        } else if ("TREESET".equals(type)) {
            Set<String> set = new TreeSet<>(request.values());
            finalState = new ArrayList<>(set);
            steps.add("TreeSet은 값을 넣는 순간 정렬 순서를 유지합니다.");
            codeExample = "Set<String> values = new TreeSet<>(List.of(\"B\", \"A\"));";
        } else if ("ARRAYDEQUE".equals(type)) {
            ArrayDeque<String> deque = new ArrayDeque<>();
            request.values().forEach(value -> {
                deque.offer(value);
                steps.add(value + " offer");
            });
            finalState = new ArrayList<>(deque);
            codeExample = "Queue<String> queue = new ArrayDeque<>();\nqueue.offer(\"job\");";
        } else {
            List<String> list = new ArrayList<>();
            request.values().forEach(value -> {
                list.add(value);
                steps.add(value + " 인덱스 " + (list.size() - 1) + "에 추가");
            });
            finalState = list;
            codeExample = "List<String> values = new ArrayList<>();\nvalues.add(\"A\");";
        }

        return new CollectionDemoResponse(request.collectionType(), request.operation(), finalState, steps, codeExample);
    }
}
