package com.study.lab.algorithm.sort;

import java.util.List;

public record SortResponse(
        SortType type,
        List<Integer> original,
        List<Integer> sorted,
        List<String> steps,
        long elapsedNanos
) {
}
