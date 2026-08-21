package com.lumos.lab.javafundamental.equality;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JavaEqualityServiceTest {

    private final JavaEqualityService service = new JavaEqualityService();

    @Test
    void stringScenarioShowsReferenceAndValueComparison() {
        EqualityDemoResponse response = service.demo(new EqualityDemoRequest("STRING"));

        assertThat(response.results()).anyMatch(result -> result.expression().equals("a == b") && !result.value());
        assertThat(response.results()).anyMatch(result -> result.expression().equals("a.equals(b)") && result.value());
        assertThat(response.warning()).contains("equals");
    }
}
