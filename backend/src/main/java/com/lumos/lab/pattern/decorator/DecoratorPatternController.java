package com.lumos.lab.pattern.decorator;

import com.lumos.lab.common.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patterns/decorator")
public class DecoratorPatternController {

    private final DecoratorPatternService service;

    public DecoratorPatternController(DecoratorPatternService service) {
        this.service = service;
    }

    @PostMapping("/run")
    public ApiResponse<DecoratorPatternResponse> run(@RequestBody(required = false) DecoratorPatternRequest request) {
        return ApiResponse.ok(service.run(request == null ? new DecoratorPatternRequest(null) : request));
    }
}
