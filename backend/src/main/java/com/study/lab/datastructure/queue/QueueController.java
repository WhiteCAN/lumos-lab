package com.study.lab.datastructure.queue;

import com.study.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/datastructures/queue")
public class QueueController {
    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping
    public ApiResponse<QueueResponse> current() {
        return ApiResponse.ok(queueService.current());
    }

    @PostMapping("/offer")
    public ApiResponse<QueueResponse> offer(@Valid @RequestBody QueueOfferRequest request) {
        return ApiResponse.ok(queueService.offer(request.value()));
    }

    @PostMapping("/poll")
    public ApiResponse<QueueResponse> poll() {
        return ApiResponse.ok(queueService.poll());
    }

    @PostMapping("/peek")
    public ApiResponse<QueueResponse> peek() {
        return ApiResponse.ok(queueService.peek());
    }

    @DeleteMapping
    public ApiResponse<QueueResponse> clear() {
        return ApiResponse.ok(queueService.clear());
    }
}
