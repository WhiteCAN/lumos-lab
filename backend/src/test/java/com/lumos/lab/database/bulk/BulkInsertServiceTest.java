package com.lumos.lab.database.bulk;

import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import static org.assertj.core.api.Assertions.assertThat;

class BulkInsertServiceTest {

    private final BulkInsertService service = new BulkInsertService(null);

    @Test
    void localH2CreatesTableAndExecutesBatchInsert() {
        var datasource = new DriverManagerDataSource("jdbc:h2:mem:bulk-profile-check", "sa", "");
        var jdbc = new JdbcTemplate(datasource);
        // 메모리 DB를 테스트 동안 유지하고 종료 시 자동 정리한다.
        jdbc.execute((org.springframework.jdbc.core.ConnectionCallback<Void>) connection -> {
            var result = new BulkInsertService(jdbc).run(new BulkInsertRunRequest(3, 2, "BATCH_INSERT"));
            assertThat(result.insertedRows()).isEqualTo(3);
            assertThat(jdbc.queryForObject("select count(*) from bulk_insert_lab", Integer.class)).isEqualTo(3);
            return null;
        });
    }

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
