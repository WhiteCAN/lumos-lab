package com.lumos.lab.concept.securityauth;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/backend/security-auth")
public class SecurityAuthController {
    private final SecurityAuthService securityAuthService;

    public SecurityAuthController(SecurityAuthService securityAuthService) {
        this.securityAuthService = securityAuthService;
    }

    @PostMapping("/login")
    public ApiResponse<AuthTokenResponse> login(@Valid @RequestBody JwtLoginRequest request) {
        return ApiResponse.ok(securityAuthService.login(request));
    }

    @GetMapping("/protected")
    public ApiResponse<ProtectedResourceResponse> protectedResource(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestParam(defaultValue = "USER") String requiredRole
    ) {
        return ApiResponse.ok(securityAuthService.accessProtected(authorization, requiredRole));
    }

    @PostMapping("/oauth/callback")
    public ApiResponse<OAuthMockResponse> oauthCallback(@Valid @RequestBody OAuthCallbackRequest request) {
        return ApiResponse.ok(securityAuthService.oauthCallback(request));
    }
}
