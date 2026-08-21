package com.lumos.lab.datastructure.heap;

import java.util.List;

public record HeapResponse(
        HeapType type,
        List<Integer> heapOrder,
        List<Integer> priorityOrder,
        Integer root,
        int size,
        String lastAction,
        List<String> steps
) {
}
