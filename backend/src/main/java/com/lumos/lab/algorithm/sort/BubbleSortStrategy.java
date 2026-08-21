package com.lumos.lab.algorithm.sort;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BubbleSortStrategy implements SortStrategy {

    @Override
    public SortType supports() {
        return SortType.BUBBLE;
    }

    @Override
    public SortResult sort(List<Integer> numbers) {
        List<Integer> sorted = new ArrayList<>(numbers);
        List<String> steps = new ArrayList<>();

        for (int i = 0; i < sorted.size() - 1; i++) {
            for (int j = 0; j < sorted.size() - i - 1; j++) {
                steps.add("compare index " + j + " and " + (j + 1) + ": " + sorted);
                if (sorted.get(j) > sorted.get(j + 1)) {
                    int temp = sorted.get(j);
                    sorted.set(j, sorted.get(j + 1));
                    sorted.set(j + 1, temp);
                    steps.add("swap -> " + sorted);
                }
            }
        }

        return new SortResult(sorted, steps);
    }
}
