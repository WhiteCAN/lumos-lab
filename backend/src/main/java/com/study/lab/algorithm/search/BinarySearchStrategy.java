package com.study.lab.algorithm.search;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class BinarySearchStrategy implements SearchStrategy {

    @Override
    public SearchType supports() {
        return SearchType.BINARY;
    }

    @Override
    public SearchResult search(List<Integer> numbers, int target) {
        List<Integer> sorted = new ArrayList<>(numbers);
        Collections.sort(sorted);

        List<String> steps = new ArrayList<>();
        int comparisons = 0;
        int left = 0;
        int right = sorted.size() - 1;

        steps.add("Binary Search 시작: 먼저 배열을 오름차순 정렬합니다.");
        steps.add("정렬된 배열: " + sorted);

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int current = sorted.get(mid);
            comparisons++;

            steps.add("left=" + left + ", mid=" + mid + ", right=" + right + ", value=" + current + " 비교");

            if (current == target) {
                steps.add("target " + target + " 발견: 정렬된 배열 기준 index " + mid);
                return new SearchResult(List.copyOf(sorted), true, mid, comparisons, steps);
            }

            if (current < target) {
                steps.add(current + " < " + target + " 이므로 왼쪽 절반을 버리고 오른쪽을 탐색합니다.");
                left = mid + 1;
            } else {
                steps.add(current + " > " + target + " 이므로 오른쪽 절반을 버리고 왼쪽을 탐색합니다.");
                right = mid - 1;
            }
        }

        steps.add("탐색 범위가 비어서 target " + target + "을 찾지 못했습니다.");
        return new SearchResult(List.copyOf(sorted), false, -1, comparisons, steps);
    }
}
