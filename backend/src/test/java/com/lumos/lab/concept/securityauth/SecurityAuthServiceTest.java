package com.lumos.lab.concept.securityauth;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SecurityAuthServiceTest {

    @Test
    void tokenSignedByAnotherSecretIsRejected() {
        SecurityAuthService issuer = new SecurityAuthService("issuer-secret-for-test");
        SecurityAuthService verifier = new SecurityAuthService("verifier-secret-for-test");
        AuthTokenResponse token = issuer.login(new JwtLoginRequest("demo", "password", "USER", 300));

        assertThatThrownBy(() -> verifier.accessProtected("Bearer " + token.accessToken(), "USER"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("signature");
    }
}
