package com.study.lab.javafundamental.iostring;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record IoStringConcatRequest(
        @NotBlank String word,
        @Min(1) @Max(10000) int repeatCount
) {
}
