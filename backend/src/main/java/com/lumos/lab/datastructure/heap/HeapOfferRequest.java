package com.lumos.lab.datastructure.heap;

import jakarta.validation.constraints.NotNull;

public record HeapOfferRequest(
        @NotNull HeapType type,
        @NotNull Integer value
) {
}
