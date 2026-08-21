package com.study.lab.javafundamental.concurrency;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ConcurrencyDemoRequest(
        @NotBlank String scenario,
        @Min(1) @Max(10) int taskCount
) {
}
