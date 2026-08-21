package com.lumos.lab.concept.syncasync;

public record TaskResult(
        int taskNumber,
        int delayMillis,
        String message
) {
}
