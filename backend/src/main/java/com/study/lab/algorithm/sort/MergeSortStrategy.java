package com.study.lab.algorithm.sort;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MergeSortStrategy implements SortStrategy {

    @Override
    public SortType supports() {
        return SortType.MERGE;
    }

    @Override
    public SortResult sort(List<Integer> numbers) {
        List<String> steps = new ArrayList<>();
        List<Integer> sorted = mergeSort(new ArrayList<>(numbers), steps, 0);
        return new SortResult(sorted, steps);
    }

    private List<Integer> mergeSort(List<Integer> numbers, List<String> steps, int depth) {
        if (numbers.size() <= 1) {
            steps.add(indent(depth) + "return " + numbers);
            return numbers;
        }

        int middle = numbers.size() / 2;
        List<Integer> left = mergeSort(new ArrayList<>(numbers.subList(0, middle)), steps, depth + 1);
        List<Integer> right = mergeSort(new ArrayList<>(numbers.subList(middle, numbers.size())), steps, depth + 1);

        steps.add(indent(depth) + "merge left=" + left + ", right=" + right);
        return merge(left, right, steps, depth);
    }

    private List<Integer> merge(List<Integer> left, List<Integer> right, List<String> steps, int depth) {
        List<Integer> merged = new ArrayList<>();
        int leftIndex = 0;
        int rightIndex = 0;

        while (leftIndex < left.size() && rightIndex < right.size()) {
            if (left.get(leftIndex) <= right.get(rightIndex)) {
                merged.add(left.get(leftIndex++));
            } else {
                merged.add(right.get(rightIndex++));
            }
        }

        merged.addAll(left.subList(leftIndex, left.size()));
        merged.addAll(right.subList(rightIndex, right.size()));
        steps.add(indent(depth) + "merged -> " + merged);
        return merged;
    }

    private String indent(int depth) {
        return "  ".repeat(depth);
    }
}
