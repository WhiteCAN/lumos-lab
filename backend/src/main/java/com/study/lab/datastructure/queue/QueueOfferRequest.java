package com.study.lab.datastructure.queue;

import jakarta.validation.constraints.NotNull;

public record QueueOfferRequest(
        @NotNull Integer value
) {
}
