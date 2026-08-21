package com.lumos.lab.concept.securityauth;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SecurityAuthService {
    private static final String SECRET = "study-lab-jwt-secret-for-debug";
    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AuthTokenResponse login(JwtLoginRequest request) {
        if (!"password".equals(request.password())) {
            throw new IllegalArgumentException("학습용 비밀번호는 password 입니다.");
        }

        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plusSeconds(request.normalizedTtlSeconds());
        String role = request.normalizedRole();

        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", request.username());
        payload.put("role", role);
        payload.put("iat", issuedAt.getEpochSecond());
        payload.put("exp", expiresAt.getEpochSecond());
        payload.put("iss", "study-lab");

        String token = createToken(header, payload);

        return new AuthTokenResponse(
                token,
                "Bearer",
                issuedAt,
                expiresAt,
                header,
                payload,
                List.of(
                        "username/password를 확인합니다.",
                        "사용자 role을 결정합니다.",
                        "header와 payload를 Base64Url로 인코딩합니다.",
                        "header.payload를 HMAC SHA-256으로 서명합니다.",
                        "브라우저는 Authorization: Bearer <token> 형태로 보호 API를 호출합니다."
                )
        );
    }

    public ProtectedResourceResponse accessProtected(String authorizationHeader, String requiredRole) {
        String token = extractBearerToken(authorizationHeader);
        DecodedToken decodedToken = decodeAndVerify(token);
        String normalizedRequiredRole = requiredRole == null || requiredRole.isBlank()
                ? "USER"
                : requiredRole.trim().toUpperCase();
        String role = String.valueOf(decodedToken.payload().get("role"));
        boolean authorized = "ADMIN".equals(role) || normalizedRequiredRole.equals(role);

        if (!authorized) {
            throw new IllegalArgumentException("권한 부족: requiredRole=" + normalizedRequiredRole + ", tokenRole=" + role);
        }

        return new ProtectedResourceResponse(
                true,
                true,
                normalizedRequiredRole,
                String.valueOf(decodedToken.payload().get("sub")),
                role,
                decodedToken.payload(),
                List.of(
                        "Authorization 헤더에서 Bearer token을 꺼냅니다.",
                        "JWT를 header, payload, signature로 나눕니다.",
                        "서명을 다시 계산해서 변조 여부를 확인합니다.",
                        "exp claim으로 만료 여부를 확인합니다.",
                        "role claim으로 API 접근 권한을 확인합니다."
                )
        );
    }

    public OAuthMockResponse oauthCallback(OAuthCallbackRequest request) {
        String provider = request.provider().trim().toLowerCase();
        String providerAccessToken = "provider-token-" + provider + "-" + request.code();
        Map<String, Object> providerUserInfo = new LinkedHashMap<>();
        providerUserInfo.put("provider", provider);
        providerUserInfo.put("providerUserId", provider + "-user-1004");
        providerUserInfo.put("email", "oauth-user@" + provider + ".example");
        providerUserInfo.put("name", provider.toUpperCase() + " User");

        AuthTokenResponse serviceToken = login(new JwtLoginRequest(
                String.valueOf(providerUserInfo.get("email")),
                "password",
                "USER",
                300
        ));

        return new OAuthMockResponse(
                provider,
                request.code(),
                providerAccessToken,
                providerUserInfo,
                serviceToken,
                List.of(
                        "사용자가 " + provider + " 로그인 화면에서 인증합니다.",
                        "Provider가 authorization code를 서비스 callback URL로 보냅니다.",
                        "서버가 code를 provider access token으로 교환합니다.",
                        "서버가 provider access token으로 사용자 정보를 조회합니다.",
                        "우리 서비스 사용자로 매핑한 뒤 자체 JWT를 발급합니다."
                )
        );
    }

    private String createToken(Map<String, Object> header, Map<String, Object> payload) {
        try {
            String encodedHeader = base64Url(objectMapper.writeValueAsBytes(header));
            String encodedPayload = base64Url(objectMapper.writeValueAsBytes(payload));
            String unsignedToken = encodedHeader + "." + encodedPayload;
            String signature = sign(unsignedToken);
            return unsignedToken + "." + signature;
        } catch (Exception exception) {
            throw new IllegalStateException("JWT 생성 실패", exception);
        }
    }

    private DecodedToken decodeAndVerify(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("JWT는 header.payload.signature 형식이어야 합니다.");
            }

            String unsignedToken = parts[0] + "." + parts[1];
            String expectedSignature = sign(unsignedToken);
            if (!expectedSignature.equals(parts[2])) {
                throw new IllegalArgumentException("JWT signature가 일치하지 않습니다. 토큰이 변조되었을 수 있습니다.");
            }

            Map<String, Object> header = objectMapper.readValue(base64UrlDecode(parts[0]), MAP_TYPE);
            Map<String, Object> payload = objectMapper.readValue(base64UrlDecode(parts[1]), MAP_TYPE);
            long expiresAt = ((Number) payload.get("exp")).longValue();
            if (Instant.now().getEpochSecond() > expiresAt) {
                throw new IllegalArgumentException("JWT가 만료되었습니다.");
            }

            return new DecodedToken(header, payload);
        } catch (IllegalArgumentException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalArgumentException("JWT 검증 실패: " + exception.getMessage(), exception);
        }
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new IllegalArgumentException("Authorization 헤더가 없습니다.");
        }
        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization 헤더는 Bearer 토큰 형식이어야 합니다.");
        }
        return authorizationHeader.substring("Bearer ".length());
    }

    private String sign(String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return base64Url(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }

    private String base64Url(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private byte[] base64UrlDecode(String value) {
        return Base64.getUrlDecoder().decode(value);
    }

    private record DecodedToken(
            Map<String, Object> header,
            Map<String, Object> payload
    ) {
    }
}
