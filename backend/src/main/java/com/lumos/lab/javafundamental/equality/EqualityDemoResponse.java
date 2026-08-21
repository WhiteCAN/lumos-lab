package com.lumos.lab.javafundamental.equality;

import java.util.List;

public record EqualityDemoResponse(
        String scenario,
        List<EqualityResult> results,
        String warning,
        String codeExample
) {
}
