package com.study.lab.database.bulk;

import java.util.List;

public record BulkInsertSimulationResponse(
        String mode,
        int rowCount,
        int batchSize,
        int roundTrips,
        int transactionCount,
        List<String> steps,
        String recommendation,
        String codeExample
) {
}
