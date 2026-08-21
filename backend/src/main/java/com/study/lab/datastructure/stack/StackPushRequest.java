package com.study.lab.datastructure.stack;

import jakarta.validation.constraints.NotNull;

public record StackPushRequest(
        @NotNull Integer value
) {
}
