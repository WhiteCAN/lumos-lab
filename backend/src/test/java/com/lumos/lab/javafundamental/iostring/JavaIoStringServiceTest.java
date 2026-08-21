package com.lumos.lab.javafundamental.iostring;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JavaIoStringServiceTest {

    private final JavaIoStringService service = new JavaIoStringService();

    @Test
    void parseSplitsInputWithScannerTokenizerAndSplitExamples() {
        IoStringParseResponse response = service.parse(new IoStringParseRequest("10, 20, -3", ","));

        assertThat(response.scannerTokens()).containsExactly("10", "20", "-3");
        assertThat(response.stringTokenizerTokens()).containsExactly("10", "20", "-3");
        assertThat(response.splitTokens()).containsExactly("10", "20", "-3");
        assertThat(response.recommendation()).contains("BufferedReader");
        assertThat(response.codeExample()).contains("StringTokenizer");
    }

    @Test
    void concatComparesStringBuilderAndStringBufferForRepeatCount() {
        IoStringConcatResponse response = service.concat(new IoStringConcatRequest("ab", 4));

        assertThat(response.stringBuilderResult()).isEqualTo("abababab");
        assertThat(response.stringBufferResult()).isEqualTo("abababab");
        assertThat(response.observations()).anyMatch(value -> value.contains("StringBuilder"));
        assertThat(response.codeExample()).contains("StringBuilder builder");
    }
}
