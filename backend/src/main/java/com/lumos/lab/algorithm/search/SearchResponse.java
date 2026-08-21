package com.lumos.lab.algorithm.search;

import java.util.List;

public record SearchResponse(
        SearchType type,
        List<Integer> original,
        List<Integer> searchedArray,
        int target,
        boolean found,
        int index,
        int comparisons,
        List<String> steps,
        long elapsedNanos
) {
}
