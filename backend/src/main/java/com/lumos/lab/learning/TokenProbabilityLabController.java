package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class TokenProbabilityLabController {
    public record Request(@NotEmpty @Size(max=10) List<@NotNull @DecimalMin("-20") @DecimalMax("20") Double> logits,
                          @NotNull @DecimalMin("0.1") @DecimalMax("2.0") Double temperature) {}
    @PostMapping("/api/labs/token-probabilities")
    public ApiResponse<Map<String,Object>> run(@Valid @RequestBody Request request) {
        if (!Double.isFinite(request.temperature()) || request.logits().stream().anyMatch(v -> !Double.isFinite(v)))
            throw new IllegalArgumentException("유한한 숫자를 입력하세요.");
        double max = Collections.max(request.logits());
        var weights = request.logits().stream().map(v -> Math.exp((v-max)/request.temperature())).toList();
        double sum = weights.stream().mapToDouble(Double::doubleValue).sum();
        return ApiResponse.ok(Map.of("probabilities",weights.stream().map(v -> v/sum).toList(),
                "scope","주어진 후보 점수의 softmax 확률만 실제 Java로 계산합니다. 토크나이저·모델 추론·샘플링·학습은 실행하지 않습니다."));
    }
}
