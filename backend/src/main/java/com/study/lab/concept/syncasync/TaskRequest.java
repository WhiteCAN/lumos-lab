package com.study.lab.concept.syncasync;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record TaskRequest(
        @NotEmpty List<@Min(100) @Max(3000) Integer> delaysMillis
) {
}
