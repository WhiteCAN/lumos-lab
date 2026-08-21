package com.study.lab.algorithm.sort;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class InsertionSortStrategy implements SortStrategy {

    /**
     * 지원하는 정렬 타입을 반환합니다.
     */
    @Override
    public SortType supports() {
        return SortType.INSERTION;
    }

    /**
     * 삽입 정렬(Insertion Sort)을 수행하고 각 단계별 과정을 기록하여 반환합니다.
     */
    @Override
    public SortResult sort(List<Integer> numbers) {
        List<Integer> sorted = new ArrayList<>(numbers);
        List<String> steps = new ArrayList<>();

        for (int i = 1; i < sorted.size(); i++) {
            int key = sorted.get(i);
            int j = i - 1;
            steps.add("pick key=" + key + " at index " + i + ": " + sorted);

            while (j >= 0 && sorted.get(j) > key) {
                sorted.set(j + 1, sorted.get(j));
                steps.add("shift " + sorted.get(j) + " right -> " + sorted);
                j--;
            }

            sorted.set(j + 1, key);
            steps.add("insert key at index " + (j + 1) + " -> " + sorted);
        }

        return new SortResult(sorted, steps);
    }
}
