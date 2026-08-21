package com.study.lab.javafundamental.concurrency;

import java.util.List;

public record ConcurrencyDemoResponse(
        String scenario,
        List<String> steps,
        String caution,
        String codeExample
) {
}
