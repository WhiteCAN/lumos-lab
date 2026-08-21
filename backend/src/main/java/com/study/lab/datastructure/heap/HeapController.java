package com.study.lab.datastructure.heap;

import com.study.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/datastructures/heap")
public class HeapController {
    private final HeapService heapService;

    public HeapController(HeapService heapService) {
        this.heapService = heapService;
    }

    @GetMapping
    public ApiResponse<HeapResponse> current(@RequestParam(defaultValue = "MIN") HeapType type) {
        return ApiResponse.ok(heapService.current(type));
    }

    @PostMapping("/offer")
    public ApiResponse<HeapResponse> offer(@Valid @RequestBody HeapOfferRequest request) {
        return ApiResponse.ok(heapService.offer(request.type(), request.value()));
    }

    @PostMapping("/poll")
    public ApiResponse<HeapResponse> poll(@Valid @RequestBody HeapActionRequest request) {
        return ApiResponse.ok(heapService.poll(request.type()));
    }

    @PostMapping("/peek")
    public ApiResponse<HeapResponse> peek(@Valid @RequestBody HeapActionRequest request) {
        return ApiResponse.ok(heapService.peek(request.type()));
    }

    @DeleteMapping
    public ApiResponse<HeapResponse> clear(@Valid @RequestBody HeapActionRequest request) {
        return ApiResponse.ok(heapService.clear(request.type()));
    }
}
