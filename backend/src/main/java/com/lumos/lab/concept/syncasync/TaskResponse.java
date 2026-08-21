package com.lumos.lab.concept.syncasync;

import java.util.List;

public record TaskResponse(
        String mode,
        List<Integer> delaysMillis,
        List<TaskResult> results,
        List<String> steps,
        long elapsedMillis
) {
}
