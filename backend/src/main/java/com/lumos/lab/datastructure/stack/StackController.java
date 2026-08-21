package com.lumos.lab.datastructure.stack;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/datastructures/stack")
public class StackController {
    private final StackService stackService;

    public StackController(StackService stackService) {
        this.stackService = stackService;
    }

    @GetMapping
    public ApiResponse<StackResponse> current() {
        return ApiResponse.ok(stackService.current());
    }

    @PostMapping("/push")
    public ApiResponse<StackResponse> push(@Valid @RequestBody StackPushRequest request) {
        return ApiResponse.ok(stackService.push(request.value()));
    }

    @PostMapping("/pop")
    public ApiResponse<StackResponse> pop() {
        return ApiResponse.ok(stackService.pop());
    }

    @PostMapping("/peek")
    public ApiResponse<StackResponse> peek() {
        return ApiResponse.ok(stackService.peek());
    }

    @DeleteMapping
    public ApiResponse<StackResponse> clear() {
        return ApiResponse.ok(stackService.clear());
    }
}
