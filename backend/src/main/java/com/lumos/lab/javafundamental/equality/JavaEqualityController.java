package com.lumos.lab.javafundamental.equality;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/java/equality")
public class JavaEqualityController {

    private final JavaEqualityService service;

    public JavaEqualityController(JavaEqualityService service) {
        this.service = service;
    }

    @PostMapping("/demo")
    public ApiResponse<EqualityDemoResponse> demo(@Valid @RequestBody EqualityDemoRequest request) {
        return ApiResponse.ok(service.demo(request));
    }
}
