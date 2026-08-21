package com.study.lab.concept.rag;

import java.time.Instant;
import java.util.List;

public record RagDocumentResponse(
        int id,
        String title,
        String source,
        String content,
        List<String> chunks,
        List<String> keywords,
        Instant createdAt,
        List<String> steps
) {
}
