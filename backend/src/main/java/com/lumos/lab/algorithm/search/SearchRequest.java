package com.lumos.lab.algorithm.search;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SearchRequest(
        @NotNull SearchType type,
        @NotEmpty List<Integer> numbers,
        @NotNull Integer target
) {
}
