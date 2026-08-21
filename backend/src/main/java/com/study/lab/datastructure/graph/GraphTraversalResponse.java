package com.study.lab.datastructure.graph;

import java.util.List;
import java.util.Map;

public record GraphTraversalResponse(
        GraphTraversalType type,
        String start,
        boolean directed,
        Map<String, List<String>> adjacencyList,
        List<String> visitedOrder,
        int visitedCount,
        List<String> steps,
        long elapsedNanos
) {
}
