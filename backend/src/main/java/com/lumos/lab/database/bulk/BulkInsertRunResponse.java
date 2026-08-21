package com.lumos.lab.database.bulk;

import java.util.List;

public record BulkInsertRunResponse(
        String mode,
        int insertedRows,
        int batchSize,
        long elapsedMillis,
        List<String> steps,
        String codeExample
) {
}
