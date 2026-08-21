package com.study.lab.javafundamental.collection;

import java.util.List;

public record CollectionCompareResponse(
        List<CollectionCompareItem> items,
        String recommendation,
        String codeExample
) {
}
