package com.lumos.lab.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;

import java.sql.Driver;
import java.sql.DriverManager;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DatabaseProfileTest {
    private StandardEnvironment environment(String profile, Map<String, Object> variables) {
        StandardEnvironment environment = new StandardEnvironment();
        environment.getPropertySources().remove(StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME);
        environment.getPropertySources().addFirst(new MapPropertySource("test-input", variables));
        environment.getPropertySources().addFirst(new MapPropertySource("config-location", Map.of(
                "spring.config.location", "file:src/main/resources/",
                "spring.profiles.active", profile
        )));
        ConfigDataEnvironmentPostProcessor.applyTo(environment);
        return environment;
    }

    @Test
    void localProfileConnectsWithoutExternalCredentials() throws Exception {
        var env = environment("local", Map.of());
        Class.forName(env.getRequiredProperty("spring.datasource.driver-class-name"));
        try (var connection = DriverManager.getConnection(env.getRequiredProperty("spring.datasource.url"),
                env.getRequiredProperty("spring.datasource.username"), env.getRequiredProperty("spring.datasource.password"))) {
            assertThat(connection.getMetaData().getDatabaseProductName()).isEqualTo("H2");
        }
    }

    @Test
    void devUsesMariaDbDriverAndProvidedCredentialsWithoutLocalFallback() throws Exception {
        var env = environment("dev", Map.of(
                "LUMOS_LAB_DB_URL", "jdbc:mariadb://localhost:3306/LUMOS_LAB",
                "LUMOS_LAB_DB_USERNAME", "lab-test-user",
                "LUMOS_LAB_DB_PASSWORD", "test-only-password",
                "LUMOS_LAB_JWT_SECRET", "test-only-jwt-secret"
        ));
        Driver driver = (Driver) Class.forName(env.getRequiredProperty("spring.datasource.driver-class-name"))
                .getConstructor().newInstance();
        assertThat(driver.acceptsURL(env.getRequiredProperty("spring.datasource.url"))).isTrue();
        assertThat(env.getRequiredProperty("spring.datasource.url")).startsWith("jdbc:mariadb:");
        assertThat(env.getRequiredProperty("spring.datasource.username")).isEqualTo("lab-test-user");
        assertThat(env.getRequiredProperty("spring.datasource.password")).isEqualTo("test-only-password");
        assertThat(env.getProperty("spring.h2.console.enabled", Boolean.class)).isFalse();
        assertThat(env.getProperty("app.security.jwt-secret")).isEqualTo("test-only-jwt-secret");
        Class.forName(env.getRequiredProperty("spring.jpa.database-platform"));
    }

    @Test
    void devMissingSecretsFailsInsteadOfUsingLocalDefaults() {
        var env = environment("dev", Map.of());
        assertThatThrownBy(() -> env.getRequiredProperty("spring.datasource.url"))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> env.getRequiredProperty("spring.datasource.password"))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> env.getRequiredProperty("app.security.jwt-secret"))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
