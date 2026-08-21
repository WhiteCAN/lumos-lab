package com.lumos.lab.javafundamental.exception;

import java.util.List;

public record ExceptionDemoResponse(
        String kind,
        List<String> steps,
        String whenToUse,
        String codeExample
) {
}
