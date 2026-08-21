package com.study.lab.javafundamental.concurrency;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JavaConcurrencyServiceTest {

    private final JavaConcurrencyService service = new JavaConcurrencyService();

    @Test
    void completableFutureScenarioReturnsParallelTimeline() {
        ConcurrencyDemoResponse response = service.demo(new ConcurrencyDemoRequest("COMPLETABLE_FUTURE", 3));

        assertThat(response.scenario()).isEqualTo("COMPLETABLE_FUTURE");
        assertThat(response.steps()).hasSizeGreaterThanOrEqualTo(3);
        assertThat(response.codeExample()).contains("CompletableFuture");
    }
}
