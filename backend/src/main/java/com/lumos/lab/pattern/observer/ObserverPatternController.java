package com.lumos.lab.pattern.observer;

import com.lumos.lab.common.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patterns/observer")
public class ObserverPatternController {

    private final ObserverPatternService service;

    public ObserverPatternController(ObserverPatternService service) {
        this.service = service;
    }

    @PostMapping("/run")
    public ApiResponse<ObserverPatternResponse> run(@RequestBody(required = false) ObserverPatternRequest request) {
        return ApiResponse.ok(service.run(request == null ? new ObserverPatternRequest(null) : request));
    }
}
