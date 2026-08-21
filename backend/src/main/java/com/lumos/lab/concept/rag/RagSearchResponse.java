package com.lumos.lab.concept.rag;

import java.util.List;

public record RagSearchResponse(
        String query,
        int topK,
        List<String> queryKeywords,
        List<RagSearchHit> hits,
        List<String> steps
) {
}
