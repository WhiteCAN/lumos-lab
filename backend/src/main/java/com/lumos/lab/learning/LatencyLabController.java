package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class LatencyLabController {
    public record Request(@NotEmpty @Size(max=100) List<@NotNull @Min(0) @Max(60000) Integer> samplesMs,
                          @NotNull @Min(0) @Max(60000) Integer thresholdMs) {}
    @PostMapping("/api/labs/latency")
    public ApiResponse<Map<String,Object>> run(@Valid @RequestBody Request request) {
        var sorted = request.samplesMs().stream().sorted().toList();
        double mean = sorted.stream().mapToInt(Integer::intValue).average().orElseThrow();
        long slow = sorted.stream().filter(v -> v > request.thresholdMs()).count();
        return ApiResponse.ok(Map.of("count",sorted.size(),"meanMs",mean,"p50Ms",percentile(sorted,.5),
                "p95Ms",percentile(sorted,.95),"p99Ms",percentile(sorted,.99),"overThreshold",slow,
                "overThresholdRate",(double)slow/sorted.size(),"scope","입력 표본의 nearest-rank 통계. 실시간 계측·Prometheus 히스토그램 추정·부하 테스트는 아닙니다."));
    }
    private int percentile(List<Integer> sorted, double fraction) {
        return sorted.get((int)Math.ceil(sorted.size()*fraction)-1);
    }
}
