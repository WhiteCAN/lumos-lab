package com.study.lab.concept.securityauth;

import java.util.List;
import java.util.Map;

public record OAuthMockResponse(
        String provider,
        String authorizationCode,
        String providerAccessToken,
        Map<String, Object> providerUserInfo,
        AuthTokenResponse serviceToken,
        List<String> steps
) {
}
