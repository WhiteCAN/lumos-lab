package com.study.lab.concept.securityauth;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record AuthTokenResponse(
        String accessToken,
        String tokenType,
        Instant issuedAt,
        Instant expiresAt,
        Map<String, Object> decodedHeader,
        Map<String, Object> decodedPayload,
        List<String> steps
) {
}
