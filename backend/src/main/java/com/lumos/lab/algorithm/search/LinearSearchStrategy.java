package com.lumos.lab.algorithm.search;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class LinearSearchStrategy implements SearchStrategy {

    @Override
    public SearchType supports() {
        return SearchType.LINEAR;
    }

    @Override
    public SearchResult search(List<Integer> numbers, int target) {
        List<String> steps = new ArrayList<>();
        int comparisons = 0;

        steps.add("Linear Search 시작: 앞에서부터 하나씩 비교합니다.");
        for (int index = 0; index < numbers.size(); index++) {
            comparisons++;
            int current = numbers.get(index);
            steps.add("index " + index + " 값 " + current + " 비교");

            if (current == target) {
                steps.add("target " + target + " 발견: index " + index);
                return new SearchResult(List.copyOf(numbers), true, index, comparisons, steps);
            }
        }

        steps.add("마지막까지 비교했지만 target " + target + "을 찾지 못했습니다.");
        return new SearchResult(List.copyOf(numbers), false, -1, comparisons, steps);
    }
}
