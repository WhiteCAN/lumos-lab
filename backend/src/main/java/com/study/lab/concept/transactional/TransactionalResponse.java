package com.study.lab.concept.transactional;

import java.util.List;

public record TransactionalResponse(
        TransactionalScenario scenario,
        String result,
        int beforeCount,
        int afterCount,
        List<TransactionalLogResponse> beforeLogs,
        List<TransactionalLogResponse> afterLogs,
        List<String> steps
) {
}
