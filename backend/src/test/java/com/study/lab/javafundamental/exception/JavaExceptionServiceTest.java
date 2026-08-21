package com.study.lab.javafundamental.exception;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JavaExceptionServiceTest {

    private final JavaExceptionService service = new JavaExceptionService();

    @Test
    void checkedScenarioExplainsCompileTimeHandling() {
        ExceptionDemoResponse response = service.demo(new ExceptionDemoRequest("CHECKED"));

        assertThat(response.kind()).isEqualTo("CHECKED");
        assertThat(response.steps()).anyMatch(step -> step.contains("컴파일"));
        assertThat(response.codeExample()).contains("throws IOException");
    }
}
