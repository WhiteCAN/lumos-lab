package com.study.lab.datastructure.queue;

import java.util.List;

public record QueueResponse(
        List<Integer> values,
        Integer front,
        Integer rear,
        int size,
        String lastAction,
        List<String> steps
) {
}
