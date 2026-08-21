package com.study.lab.concept.rag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RagDocumentRequest(
        @NotBlank
        @Size(max = 80)
        String title,

        @NotBlank
        @Size(max = 2000)
        String content,

        @Size(max = 120)
        String source
) {
    public String normalizedSource() {
        return source == null || source.isBlank() ? "manual-input" : source.trim();
    }
}
