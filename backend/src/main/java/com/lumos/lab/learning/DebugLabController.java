package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@RestController
@RequestMapping("/api/labs")
public class DebugLabController {
    private final DebugLabService service;
    public DebugLabController(DebugLabService service) { this.service = service; }

    public record MapRequest(@NotEmpty @Size(max=30) List<@NotNull Integer> keys,
                             int accessKey, int boundary) {}
    public record RetryRequest(@Min(0) @Max(5) int failures, @Min(1) @Max(5) int maxAttempts) {}
    public record TaskRequest(@NotBlank @Size(max=40) String name,
                              @Min(0) @Max(1500) int delayMs, boolean fail) {}

    @PostMapping("/ordered-maps")
    public ApiResponse<DebugLabService.MapResult> maps(@Valid @RequestBody MapRequest request) {
        return ApiResponse.ok(service.orderedMaps(request.keys(), request.accessKey(), request.boundary()));
    }

    @PostMapping("/retry")
    public ApiResponse<DebugLabService.RetryResult> retry(@Valid @RequestBody RetryRequest request) {
        return ApiResponse.ok(service.retry(request.failures(), request.maxAttempts()));
    }

    @PostMapping("/task")
    public ApiResponse<Map<String, Object>> task(@Valid @RequestBody TaskRequest request) {
        long started = System.nanoTime();
        try {
            Thread.sleep(request.delayMs()); // 브레이크포인트: 서로 다른 HTTP 요청의 처리 스레드 관찰
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "실습 요청 중단");
        }
        if (request.fail()) throw new IllegalArgumentException("요청한 실패: " + request.name());
        return ApiResponse.ok(Map.of("name", request.name(), "thread", Thread.currentThread().getName(),
                "elapsedMs", (System.nanoTime() - started) / 1_000_000));
    }

    @PostMapping("/cors")
    public ApiResponse<Map<String, String>> cors(@RequestHeader(value="Origin", defaultValue="없음") String origin) {
        return ApiResponse.ok(Map.of("origin", origin, "message", "실제 POST 도착: OPTIONS는 Spring CORS 처리기에서 처리됩니다."));
    }
}
