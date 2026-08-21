package com.lumos.lab.database.bulk;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/database/bulk-insert")
public class BulkInsertController {

    private final BulkInsertService service;

    public BulkInsertController(BulkInsertService service) {
        this.service = service;
    }

    @PostMapping("/simulate")
    public ApiResponse<BulkInsertSimulationResponse> simulate(@Valid @RequestBody BulkInsertSimulationRequest request) {
        return ApiResponse.ok(service.simulate(request));
    }

    @PostMapping("/run")
    public ApiResponse<BulkInsertRunResponse> run(@Valid @RequestBody BulkInsertRunRequest request) {
        return ApiResponse.ok(service.run(request));
    }
}
