package com.lumos.lab.concept.securityauth;

import java.util.List;
import java.util.Map;

public record ProtectedResourceResponse(
        boolean authenticated,
        boolean authorized,
        String requiredRole,
        String username,
        String role,
        Map<String, Object> claims,
        List<String> steps
) {
}
