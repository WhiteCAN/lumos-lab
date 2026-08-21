package com.lumos.lab.pattern.factory;

import com.lumos.lab.common.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patterns/factory")
public class FactoryPatternController {

    private final FactoryPatternService service;

    public FactoryPatternController(FactoryPatternService service) {
        this.service = service;
    }

    @PostMapping("/run")
    public ApiResponse<FactoryPatternResponse> run(@RequestBody(required = false) FactoryPatternRequest request) {
        return ApiResponse.ok(service.run(request == null ? new FactoryPatternRequest(null) : request));
    }
}
