package com.lumos.lab.config;

import com.lumos.lab.BackendApplication;
import com.lumos.lab.concept.transactional.TransactionLog;
import com.lumos.lab.concept.transactional.TransactionLogRepository;
import com.lumos.lab.database.bulk.BulkInsertRunRequest;
import com.lumos.lab.database.bulk.BulkInsertService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.sql.DriverManager;

import static org.assertj.core.api.Assertions.assertThat;

/** 명시적으로 허용한 비어 있는 Lab DB에서만 실행한다. 일반 CI에서는 실행하지 않는다. */
@EnabledIfEnvironmentVariable(named = "LUMOS_LAB_DB_CHECK", matches = "true")
class MariaDbConnectionTest {
    @Test
    void devConnectsValidatesSchemaAndRollsBackJpaAndBulkWrites() throws Exception {
        // 앱 시작 전에 잘못된 스키마와 기존 데이터가 있는 대상의 사용을 차단한다.
        try (var connection = DriverManager.getConnection(System.getenv("LUMOS_LAB_DB_URL"),
                System.getenv("LUMOS_LAB_DB_USERNAME"), System.getenv("LUMOS_LAB_DB_PASSWORD"))) {
            assertThat(connection.getCatalog()).isEqualTo("LUMOS_LAB");
            try (var statement = connection.createStatement();
                 var rows = statement.executeQuery("select (select count(*) from transaction_log) + (select count(*) from bulk_insert_lab)")) {
                assertThat(rows.next()).isTrue();
                assertThat(rows.getLong(1)).as("검증 대상 Lab 테이블은 비어 있어야 한다").isZero();
            }
        }

        try (var context = new SpringApplicationBuilder(BackendApplication.class)
                .web(WebApplicationType.NONE)
                .run("--spring.config.location=file:src/main/resources/", "--spring.profiles.active=dev",
                        "--grpc.server.enabled=false")) {
            var jdbc = context.getBean(JdbcTemplate.class);
            assertThat(jdbc.queryForObject("select database()", String.class)).isEqualTo("LUMOS_LAB");
            var transaction = new TransactionTemplate(context.getBean(PlatformTransactionManager.class));
            var repository = context.getBean(TransactionLogRepository.class);
            transaction.executeWithoutResult(status -> {
                try {
                    var saved = repository.saveAndFlush(new TransactionLog("connection-check", "한글 및 이모지 확인 📷"));
                    assertThat(saved.getId()).isNotNull();
                    assertThat(jdbc.queryForObject("select message from transaction_log where id = ?", String.class, saved.getId()))
                            .isEqualTo("한글 및 이모지 확인 📷");
                } finally {
                    status.setRollbackOnly();
                }
            });
            assertThat(repository.count()).isZero();

            transaction.executeWithoutResult(status -> {
                try {
                    var result = context.getBean(BulkInsertService.class)
                            .run(new BulkInsertRunRequest(3, 2, "BATCH_INSERT"));
                    assertThat(result.insertedRows()).isEqualTo(3);
                } finally {
                    status.setRollbackOnly();
                }
            });
            assertThat(jdbc.queryForObject("select count(*) from bulk_insert_lab", Integer.class)).isZero();
        }
    }
}
