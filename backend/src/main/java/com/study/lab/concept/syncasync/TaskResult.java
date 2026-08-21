package com.study.lab.concept.syncasync;

public record TaskResult(
        int taskNumber,
        int delayMillis,
        String message
) {
}
