package com.study.lab.datastructure.graph;

import jakarta.validation.constraints.NotBlank;

public record GraphEdge(
        @NotBlank String from,
        @NotBlank String to
) {
    public GraphEdge normalized() {
        return new GraphEdge(from.trim(), to.trim());
    }
}
