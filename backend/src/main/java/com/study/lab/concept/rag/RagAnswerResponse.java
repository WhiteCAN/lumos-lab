package com.study.lab.concept.rag;

import java.util.List;

public record RagAnswerResponse(
        String question,
        String answer,
        List<RagCitation> citations,
        RagSearchResponse retrieval,
        List<String> steps
) {
}
