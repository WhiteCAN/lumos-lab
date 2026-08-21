package com.study.lab.javafundamental.exception;

import com.study.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/java/exception")
public class JavaExceptionController {

    private final JavaExceptionService service;

    public JavaExceptionController(JavaExceptionService service) {
        this.service = service;
    }

    @PostMapping("/demo")
    public ApiResponse<ExceptionDemoResponse> demo(@Valid @RequestBody ExceptionDemoRequest request) {
        return ApiResponse.ok(service.demo(request));
    }
}
