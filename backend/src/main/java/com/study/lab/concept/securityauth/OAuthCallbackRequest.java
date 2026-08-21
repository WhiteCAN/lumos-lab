package com.study.lab.concept.securityauth;

import jakarta.validation.constraints.NotBlank;

public record OAuthCallbackRequest(
        @NotBlank String provider,
        @NotBlank String code
) {
}
