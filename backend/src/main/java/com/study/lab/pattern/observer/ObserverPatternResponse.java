package com.study.lab.pattern.observer;

import java.util.List;

public record ObserverPatternResponse(
        String title,
        String result,
        List<String> subscribers,
        List<String> steps,
        long elapsedNanos
) {
}
