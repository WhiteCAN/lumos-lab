package com.lumos.lab.concept.transactional;

import com.lumos.lab.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/concepts/transactional")
public class TransactionalController {

    private final TransactionalService service;

    public TransactionalController(TransactionalService service) {
        this.service = service;
    }

    @GetMapping("/logs")
    public ApiResponse<List<TransactionalLogResponse>> logs() {
        return ApiResponse.ok(service.findLogs());
    }

    @DeleteMapping("/logs")
    public ApiResponse<List<TransactionalLogResponse>> clearLogs() {
        return ApiResponse.ok(service.clearLogs());
    }

    @PostMapping("/run/{scenario}")
    public ApiResponse<TransactionalResponse> run(
            @PathVariable TransactionalScenario scenario,
            @RequestBody(required = false) TransactionalRunRequest request
    ) {
        String label = request == null ? "frontend-test" : request.normalizedLabel();
        return ApiResponse.ok(service.run(scenario, label));
    }
}
