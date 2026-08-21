package com.lumos.lab.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CorsConfigTest {

    @Test
    void parsesCommaSeparatedAllowedOrigins() {
        CorsConfig config = new CorsConfig(
                "https://lab.dev.lumosgraphy.com, http://localhost:3000, "
        );

        assertThat(config.allowedOrigins())
                .containsExactly("https://lab.dev.lumosgraphy.com", "http://localhost:3000");
    }
}
