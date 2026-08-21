package com.study.lab.algorithm.search;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class SearchService {

    private final Map<SearchType, SearchStrategy> strategies = new EnumMap<>(SearchType.class);

    public SearchService(List<SearchStrategy> strategies) {
        for (SearchStrategy strategy : strategies) {
            this.strategies.put(strategy.supports(), strategy);
        }
    }

    public SearchResponse search(SearchRequest request) {
        SearchStrategy strategy = strategies.get(request.type());
        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported search type: " + request.type());
        }

        long startedAt = System.nanoTime();
        SearchResult result = strategy.search(request.numbers(), request.target());
        long elapsedNanos = System.nanoTime() - startedAt;

        return new SearchResponse(
                request.type(),
                List.copyOf(request.numbers()),
                result.searchedArray(),
                request.target(),
                result.found(),
                result.index(),
                result.comparisons(),
                result.steps(),
                elapsedNanos
        );
    }
}
