package com.lumos.lab.concept.rag;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record RagSearchRequest(
        @NotBlank
        String query,

        @Min(1)
        @Max(8)
        Integer topK
) {
    public int normalizedTopK() {
        return topK == null ? 3 : topK;
    }
}
