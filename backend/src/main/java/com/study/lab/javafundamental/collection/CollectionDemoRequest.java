package com.study.lab.javafundamental.collection;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CollectionDemoRequest(
        @NotBlank String collectionType,
        @NotBlank String operation,
        @NotEmpty List<String> values
) {
}
