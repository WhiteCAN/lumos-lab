package com.study.lab.database.bulk;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record BulkInsertSimulationRequest(
        @Min(1) @Max(100000) int rowCount,
        @Min(1) @Max(5000) int batchSize,
        @NotBlank String mode
) {
}
