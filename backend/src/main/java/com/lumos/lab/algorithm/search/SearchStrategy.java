package com.lumos.lab.algorithm.search;

import java.util.List;

public interface SearchStrategy {
    SearchType supports();

    SearchResult search(List<Integer> numbers, int target);
}
