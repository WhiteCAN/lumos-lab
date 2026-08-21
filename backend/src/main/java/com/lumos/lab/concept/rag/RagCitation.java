package com.lumos.lab.concept.rag;

public record RagCitation(
        int documentId,
        String title,
        String source,
        int chunkIndex,
        String quote
) {
}
