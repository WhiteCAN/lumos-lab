package com.study.lab.algorithm.sort;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SelectionSortStrategy implements SortStrategy {

    @Override
    public SortType supports() {
        return SortType.SELECTION;
    }

    @Override
    public SortResult sort(List<Integer> numbers) {
        List<Integer> sorted = new ArrayList<>(numbers);
        List<String> steps = new ArrayList<>();

        for (int i = 0; i < sorted.size() - 1; i++) {
            int minIndex = i;
            steps.add("start pass " + i + ", current minimum index=" + minIndex + ": " + sorted);

            for (int j = i + 1; j < sorted.size(); j++) {
                steps.add("compare min " + sorted.get(minIndex) + " with " + sorted.get(j));
                if (sorted.get(j) < sorted.get(minIndex)) {
                    minIndex = j;
                    steps.add("new minimum index=" + minIndex + ", value=" + sorted.get(minIndex));
                }
            }

            if (minIndex != i) {
                int temp = sorted.get(i);
                sorted.set(i, sorted.get(minIndex));
                sorted.set(minIndex, temp);
                steps.add("swap index " + i + " and " + minIndex + " -> " + sorted);
            } else {
                steps.add("index " + i + " already has the minimum -> " + sorted);
            }
        }

        return new SortResult(sorted, steps);
    }
}
