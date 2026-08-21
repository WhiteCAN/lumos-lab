package com.lumos.lab.javafundamental.concurrency;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/java/concurrency")
public class JavaConcurrencyController {

    private final JavaConcurrencyService service;

    public JavaConcurrencyController(JavaConcurrencyService service) {
        this.service = service;
    }

    @PostMapping("/demo")
    public ApiResponse<ConcurrencyDemoResponse> demo(@Valid @RequestBody ConcurrencyDemoRequest request) {
        return ApiResponse.ok(service.demo(request));
    }
}
