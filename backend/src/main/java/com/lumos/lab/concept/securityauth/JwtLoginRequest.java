package com.lumos.lab.concept.securityauth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record JwtLoginRequest(
        @NotBlank String username,
        @NotBlank String password,
        String role,
        @Positive Integer ttlSeconds
) {
    public String normalizedRole() {
        if (role == null || role.isBlank()) {
            return "USER";
        }
        return role.trim().toUpperCase();
    }

    public int normalizedTtlSeconds() {
        if (ttlSeconds == null) {
            return 300;
        }
        return Math.min(Math.max(ttlSeconds, 1), 3600);
    }
}
