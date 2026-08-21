package com.lumos.lab.algorithm.sort;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record SortRequest(
        @NotNull SortType type,
        @NotEmpty List<Integer> numbers
) {
}
