package com.lumos.lab.datastructure.graph;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class GraphTraversalService {

    public GraphTraversalResponse traverse(GraphTraversalRequest request) {
        long startedAt = System.nanoTime();
        String start = request.start().trim();
        Map<String, List<String>> adjacencyList = buildAdjacencyList(request.edges(), request.directed());

        if (!adjacencyList.containsKey(start)) {
            throw new IllegalArgumentException("Start node does not exist in graph: " + start);
        }

        TraversalResult result = switch (request.type()) {
            case BFS -> bfs(adjacencyList, start);
            case DFS -> dfs(adjacencyList, start);
        };

        long elapsedNanos = System.nanoTime() - startedAt;
        return new GraphTraversalResponse(
                request.type(),
                start,
                request.directed(),
                adjacencyList,
                result.visitedOrder(),
                result.visitedOrder().size(),
                result.steps(),
                elapsedNanos
        );
    }

    private Map<String, List<String>> buildAdjacencyList(List<GraphEdge> edges, boolean directed) {
        Map<String, Set<String>> graph = new LinkedHashMap<>();

        for (GraphEdge rawEdge : edges) {
            GraphEdge edge = rawEdge.normalized();
            graph.computeIfAbsent(edge.from(), ignored -> new LinkedHashSet<>());
            graph.computeIfAbsent(edge.to(), ignored -> new LinkedHashSet<>());
            graph.get(edge.from()).add(edge.to());
            if (!directed) {
                graph.get(edge.to()).add(edge.from());
            }
        }

        Map<String, List<String>> adjacencyList = new LinkedHashMap<>();
        graph.forEach((node, neighbors) -> {
            List<String> sortedNeighbors = new ArrayList<>(neighbors);
            Collections.sort(sortedNeighbors);
            adjacencyList.put(node, sortedNeighbors);
        });
        return adjacencyList;
    }

    private TraversalResult bfs(Map<String, List<String>> graph, String start) {
        List<String> steps = new ArrayList<>();
        List<String> visitedOrder = new ArrayList<>();
        Set<String> visited = new LinkedHashSet<>();
        Deque<String> queue = new ArrayDeque<>();

        queue.addLast(start);
        visited.add(start);
        steps.add("BFS 시작: Queue에 " + start + " 추가");

        while (!queue.isEmpty()) {
            String current = queue.removeFirst();
            visitedOrder.add(current);
            steps.add("Queue에서 " + current + " 꺼냄, 방문 순서: " + visitedOrder);

            for (String neighbor : graph.getOrDefault(current, List.of())) {
                if (visited.contains(neighbor)) {
                    steps.add(current + " -> " + neighbor + " 이미 방문해서 건너뜀");
                    continue;
                }
                visited.add(neighbor);
                queue.addLast(neighbor);
                steps.add(current + " -> " + neighbor + " 발견, Queue: " + queue);
            }
        }

        return new TraversalResult(visitedOrder, steps);
    }

    private TraversalResult dfs(Map<String, List<String>> graph, String start) {
        List<String> steps = new ArrayList<>();
        List<String> visitedOrder = new ArrayList<>();
        Set<String> visited = new LinkedHashSet<>();
        Deque<String> stack = new ArrayDeque<>();

        stack.push(start);
        steps.add("DFS 시작: Stack에 " + start + " 추가");

        while (!stack.isEmpty()) {
            String current = stack.pop();
            steps.add("Stack에서 " + current + " 꺼냄");

            if (visited.contains(current)) {
                steps.add(current + "는 이미 방문해서 건너뜀");
                continue;
            }

            visited.add(current);
            visitedOrder.add(current);
            steps.add(current + " 방문, 방문 순서: " + visitedOrder);

            List<String> neighbors = graph.getOrDefault(current, List.of());
            for (int index = neighbors.size() - 1; index >= 0; index--) {
                String neighbor = neighbors.get(index);
                if (!visited.contains(neighbor)) {
                    stack.push(neighbor);
                    steps.add(current + " -> " + neighbor + " 후보 추가, Stack: " + stack);
                }
            }
        }

        return new TraversalResult(visitedOrder, steps);
    }

    private record TraversalResult(List<String> visitedOrder, List<String> steps) {
    }
}
