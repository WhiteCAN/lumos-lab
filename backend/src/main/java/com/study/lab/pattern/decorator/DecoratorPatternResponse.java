package com.study.lab.pattern.decorator;

import java.util.List;

public record DecoratorPatternResponse(
        String title,
        String result,
        int cost,
        List<String> decorators,
        List<String> steps,
        long elapsedNanos
) {
}
