package com.study.lab.concept.transactional;

public record TransactionalRunRequest(String label) {
    public String normalizedLabel() {
        if (label == null || label.isBlank()) {
            return "frontend-test";
        }
        return label.trim();
    }
}
