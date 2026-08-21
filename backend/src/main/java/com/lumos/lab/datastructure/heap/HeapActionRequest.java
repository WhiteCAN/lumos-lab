package com.lumos.lab.datastructure.heap;

import jakarta.validation.constraints.NotNull;

public record HeapActionRequest(
        @NotNull HeapType type
) {
}
