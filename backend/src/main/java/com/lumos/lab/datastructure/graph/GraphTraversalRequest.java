package com.lumos.lab.datastructure.graph;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GraphTraversalRequest(
        @NotNull GraphTraversalType type,
        @NotBlank String start,
        boolean directed,
        @NotEmpty List<@Valid GraphEdge> edges
) {
}
