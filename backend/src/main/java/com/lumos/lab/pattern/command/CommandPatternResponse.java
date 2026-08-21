package com.lumos.lab.pattern.command;

import java.util.List;

public record CommandPatternResponse(
        String title,
        String status,
        List<String> history,
        List<String> steps,
        long elapsedNanos
) {
}
