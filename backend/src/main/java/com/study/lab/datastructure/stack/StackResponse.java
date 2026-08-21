package com.study.lab.datastructure.stack;

import java.util.List;

public record StackResponse(
        List<Integer> values,
        Integer top,
        int size,
        String lastAction,
        List<String> steps
) {
}
