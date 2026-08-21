package com.lumos.lab.javafundamental.iostring;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/java/io-string")
public class JavaIoStringController {

    private final JavaIoStringService service;

    public JavaIoStringController(JavaIoStringService service) {
        this.service = service;
    }

    @PostMapping("/parse")
    public ApiResponse<IoStringParseResponse> parse(@Valid @RequestBody IoStringParseRequest request) {
        return ApiResponse.ok(service.parse(request));
    }

    @PostMapping("/concat")
    public ApiResponse<IoStringConcatResponse> concat(@Valid @RequestBody IoStringConcatRequest request) {
        return ApiResponse.ok(service.concat(request));
    }
}
