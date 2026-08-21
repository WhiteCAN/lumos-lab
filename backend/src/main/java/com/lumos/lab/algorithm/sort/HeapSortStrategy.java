package com.lumos.lab.algorithm.sort;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class HeapSortStrategy implements SortStrategy {

    @Override
    public SortType supports() {
        return SortType.HEAP;
    }

    @Override
    public SortResult sort(List<Integer> numbers) {
        List<Integer> sorted = new ArrayList<>(numbers);
        List<String> steps = new ArrayList<>();
        int size = sorted.size();

        for (int i = size / 2 - 1; i >= 0; i--) {
            heapify(sorted, size, i, steps);
            steps.add("build max heap at index " + i + " -> " + sorted);
        }

        for (int end = size - 1; end > 0; end--) {
            swap(sorted, 0, end);
            steps.add("move max to index " + end + " -> " + sorted);
            heapify(sorted, end, 0, steps);
            steps.add("restore heap size " + end + " -> " + sorted);
        }

        return new SortResult(sorted, steps);
    }

    private void heapify(List<Integer> numbers, int heapSize, int rootIndex, List<String> steps) {
        int largest = rootIndex;
        int left = rootIndex * 2 + 1;
        int right = rootIndex * 2 + 2;

        if (left < heapSize && numbers.get(left) > numbers.get(largest)) {
            largest = left;
        }

        if (right < heapSize && numbers.get(right) > numbers.get(largest)) {
            largest = right;
        }

        if (largest != rootIndex) {
            steps.add("heapify swap root index " + rootIndex + " with child index " + largest);
            swap(numbers, rootIndex, largest);
            heapify(numbers, heapSize, largest, steps);
        }
    }

    private void swap(List<Integer> numbers, int first, int second) {
        int temp = numbers.get(first);
        numbers.set(first, numbers.get(second));
        numbers.set(second, temp);
    }
}
