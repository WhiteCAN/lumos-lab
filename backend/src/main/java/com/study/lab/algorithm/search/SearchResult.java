package com.study.lab.algorithm.search;

import java.util.List;

public record SearchResult(
        List<Integer> searchedArray,
        boolean found,
        int index,
        int comparisons,
        List<String> steps
) {
}
