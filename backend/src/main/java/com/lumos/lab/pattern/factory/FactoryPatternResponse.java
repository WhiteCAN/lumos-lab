package com.lumos.lab.pattern.factory;

import java.util.List;

public record FactoryPatternResponse(
        String title,
        String selectedClass,
        String result,
        List<String> participants,
        List<String> steps,
        long elapsedNanos
) {
}
