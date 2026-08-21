package com.study.lab.database.bulk;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class BulkInsertServiceTest {

    private final BulkInsertService service = new BulkInsertService(null);

    @Test
    void simulateBatchInsertReducesRoundTripsComparedWithSingleInsert() {
        BulkInsertSimulationResponse single = service.simulate(new BulkInsertSimulationRequest(1_000, 100, "SINGLE_INSERT"));
        BulkInsertSimulationResponse batch = service.simulate(new BulkInsertSimulationRequest(1_000, 100, "BATCH_INSERT"));

        assertThat(single.roundTrips()).isEqualTo(1_000);
        assertThat(batch.roundTrips()).isEqualTo(10);
        assertThat(batch.recommendation()).contains("batch");
        assertThat(batch.codeExample()).contains("jdbcTemplate.batchUpdate");
    }
}
