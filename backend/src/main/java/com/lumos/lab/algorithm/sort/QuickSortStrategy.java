package com.lumos.lab.algorithm.sort;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class QuickSortStrategy implements SortStrategy {

    @Override
    public SortType supports() {
        return SortType.QUICK;
    }

    @Override
    public SortResult sort(List<Integer> numbers) {
        List<String> steps = new ArrayList<>();
        List<Integer> sorted = quickSort(new ArrayList<>(numbers), steps, 0);
        return new SortResult(sorted, steps);
    }

    private List<Integer> quickSort(List<Integer> numbers, List<String> steps, int depth) {
        if (numbers.size() <= 1) {
            steps.add(indent(depth) + "return " + numbers);
            return numbers;
        }

        int pivot = numbers.get(numbers.size() / 2);
        List<Integer> left = new ArrayList<>();
        List<Integer> equal = new ArrayList<>();
        List<Integer> right = new ArrayList<>();

        for (Integer number : numbers) {
            if (number < pivot) {
                left.add(number);
            } else if (number > pivot) {
                right.add(number);
            } else {
                equal.add(number);
            }
        }

        steps.add(indent(depth) + "pivot=" + pivot + ", left=" + left + ", equal=" + equal + ", right=" + right);

        List<Integer> result = new ArrayList<>();
        result.addAll(quickSort(left, steps, depth + 1));
        result.addAll(equal);
        result.addAll(quickSort(right, steps, depth + 1));

        steps.add(indent(depth) + "merged -> " + result);
        return result;
    }

    private String indent(int depth) {
        return "  ".repeat(depth);
    }
}
