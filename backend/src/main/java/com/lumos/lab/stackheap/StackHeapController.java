package com.lumos.lab.stackheap;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StackHeapController {
    private final StackHeapService service;
    public StackHeapController(StackHeapService service) { this.service = service; }

    public record Request(@NotNull @Min(0) @Max(150) Integer initialAge,
                          @NotNull @Min(0) @Max(150) Integer nextAge, boolean reassign) {}

    @PostMapping("/api/labs/stack-heap")
    public ApiResponse<StackHeapService.Result> run(@Valid @RequestBody Request request) {
        return ApiResponse.ok(service.run(request.initialAge(), request.nextAge(), request.reassign()));
    }
}
