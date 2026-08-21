package com.study.lab.concept.grpc;

public record GrpcExplainRequest(String keyword) {
    public String normalizedKeyword() {
        if (keyword == null || keyword.isBlank()) {
            return "grpc";
        }
        return keyword.trim();
    }
}
