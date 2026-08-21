package com.lumos.lab.javafundamental.collection;

import java.util.List;

public record CollectionDemoResponse(
        String collectionType,
        String operation,
        List<String> finalState,
        List<String> steps,
        String codeExample
) {
}
