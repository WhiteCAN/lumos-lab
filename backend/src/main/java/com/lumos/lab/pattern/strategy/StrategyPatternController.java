package com.lumos.lab.pattern.strategy;

import com.lumos.lab.common.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patterns/strategy")
public class StrategyPatternController {

    private final StrategyPatternService service;

    public StrategyPatternController(StrategyPatternService service) {
        this.service = service;
    }

    @PostMapping("/run")
    public ApiResponse<StrategyPatternResponse> run(@RequestBody(required = false) StrategyPatternRequest request) {
        return ApiResponse.ok(service.run(request == null ? new StrategyPatternRequest(null, 10_000) : request));
    }
}
