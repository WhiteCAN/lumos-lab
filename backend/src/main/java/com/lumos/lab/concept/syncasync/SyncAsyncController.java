package com.lumos.lab.concept.syncasync;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/concepts/sync-async")
public class SyncAsyncController {
    private final SyncAsyncService syncAsyncService;

    public SyncAsyncController(SyncAsyncService syncAsyncService) {
        this.syncAsyncService = syncAsyncService;
    }

    @PostMapping("/sync")
    public ApiResponse<TaskResponse> runSync(@Valid @RequestBody TaskRequest request) {
        return ApiResponse.ok(syncAsyncService.runSync(request));
    }

    @PostMapping("/async")
    public ApiResponse<TaskResponse> runAsync(@Valid @RequestBody TaskRequest request) {
        return ApiResponse.ok(syncAsyncService.runAsync(request));
    }
}
