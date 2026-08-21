package com.study.lab.concept.rag;

import java.util.List;

public record RagSearchHit(
        int documentId,
        String title,
        String source,
        int chunkIndex,
        String chunk,
        double score,
        List<String> matchedKeywords
) {
}
