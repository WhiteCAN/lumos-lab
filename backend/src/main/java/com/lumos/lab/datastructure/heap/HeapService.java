package com.lumos.lab.datastructure.heap;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

@Service
public class HeapService {
    private final Map<HeapType, PriorityQueue<Integer>> heaps = new EnumMap<>(HeapType.class);

    public HeapService() {
        heaps.put(HeapType.MIN, new PriorityQueue<>());
        heaps.put(HeapType.MAX, new PriorityQueue<>(Comparator.reverseOrder()));
    }

    public synchronized HeapResponse current(HeapType type) {
        return response(type, "current", List.of(
                "read internal heap array order",
                "read sorted priority order without removing values"
        ));
    }

    public synchronized HeapResponse offer(HeapType type, Integer value) {
        PriorityQueue<Integer> heap = heap(type);
        List<String> steps = new ArrayList<>();
        steps.add("before offer: " + heap);
        heap.offer(value);
        steps.add("insert " + value);
        steps.add("PriorityQueue restores heap property");
        steps.add("after offer: " + heap);
        return response(type, "offer(" + value + ")", steps);
    }

    public synchronized HeapResponse poll(HeapType type) {
        PriorityQueue<Integer> heap = heap(type);
        if (heap.isEmpty()) {
            throw new IllegalArgumentException("Heap is empty. Offer a value first.");
        }

        List<String> steps = new ArrayList<>();
        steps.add("before poll: " + heap);
        Integer removed = heap.poll();
        steps.add("remove root value: " + removed);
        steps.add("PriorityQueue moves the next priority value to root");
        steps.add("after poll: " + heap);
        return response(type, "poll() -> " + removed, steps);
    }

    public synchronized HeapResponse peek(HeapType type) {
        PriorityQueue<Integer> heap = heap(type);
        if (heap.isEmpty()) {
            throw new IllegalArgumentException("Heap is empty. Offer a value first.");
        }

        Integer root = heap.peek();
        return response(type, "peek() -> " + root, List.of(
                "read root without removing it",
                "root value: " + root,
                "heap remains: " + heap
        ));
    }

    public synchronized HeapResponse clear(HeapType type) {
        PriorityQueue<Integer> heap = heap(type);
        List<String> steps = new ArrayList<>();
        steps.add("before clear: " + heap);
        heap.clear();
        steps.add("remove every value");
        steps.add("after clear: []");
        return response(type, "clear()", steps);
    }

    private HeapResponse response(HeapType type, String lastAction, List<String> steps) {
        PriorityQueue<Integer> heap = heap(type);
        return new HeapResponse(
                type,
                List.copyOf(heap),
                priorityOrder(type),
                heap.peek(),
                heap.size(),
                lastAction,
                steps
        );
    }

    private List<Integer> priorityOrder(HeapType type) {
        PriorityQueue<Integer> copy = new PriorityQueue<>(heap(type));
        List<Integer> values = new ArrayList<>();

        while (!copy.isEmpty()) {
            values.add(copy.poll());
        }

        return values;
    }

    private PriorityQueue<Integer> heap(HeapType type) {
        PriorityQueue<Integer> heap = heaps.get(type);
        if (heap == null) {
            throw new IllegalArgumentException("Unsupported heap type: " + type);
        }

        return heap;
    }
}
