package com.study.lab.pattern.strategy;

import java.util.List;

public record StrategyPatternResponse(
        String title,
        String selectedStrategy,
        int originalAmount,
        int discountAmount,
        int finalAmount,
        List<String> steps,
        long elapsedNanos
) {
}
