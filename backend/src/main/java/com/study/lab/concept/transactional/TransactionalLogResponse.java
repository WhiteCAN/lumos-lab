package com.study.lab.concept.transactional;

public record TransactionalLogResponse(
        Long id,
        String scenario,
        String message,
        String createdAt
) {
    public static TransactionalLogResponse from(TransactionLog log) {
        return new TransactionalLogResponse(
                log.getId(),
                log.getScenario(),
                log.getMessage(),
                log.getCreatedAt().toString()
        );
    }
}
