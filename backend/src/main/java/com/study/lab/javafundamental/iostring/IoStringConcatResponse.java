package com.study.lab.javafundamental.iostring;

import java.util.List;

public record IoStringConcatResponse(
        String stringBuilderResult,
        String stringBufferResult,
        int resultLength,
        List<String> observations,
        String codeExample
) {
}
