package com.lumos.lab.algorithm.sort;

import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class SortService {
    private final Map<SortType, SortStrategy> strategies = new EnumMap<>(SortType.class);

    public SortService(List<SortStrategy> strategies) {
        for (SortStrategy strategy : strategies) {
            this.strategies.put(strategy.supports(), strategy);
        }
    }

    public SortResponse sort(SortRequest request) {
        SortStrategy strategy = strategies.get(request.type());
        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported sort type: " + request.type());
        }

        long startedAt = System.nanoTime();
        SortResult result = strategy.sort(request.numbers());
        long elapsedNanos = System.nanoTime() - startedAt;

        return new SortResponse(
                request.type(),
                List.copyOf(request.numbers()),
                result.sorted(),
                result.steps(),
                elapsedNanos
        );
    }
}
