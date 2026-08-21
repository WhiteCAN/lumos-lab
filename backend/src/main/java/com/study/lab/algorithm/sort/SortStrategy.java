package com.study.lab.algorithm.sort;

import java.util.List;

public interface SortStrategy {
    SortType supports();

    SortResult sort(List<Integer> numbers);
}
