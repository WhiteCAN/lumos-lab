package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class ConsumerGroupLabController {
    public record Request(@NotNull @Min(1) @Max(10) Integer partitions,
                          @NotEmpty @Size(max=10) List<@NotBlank @Size(max=30) String> groupIds) {}

    @PostMapping("/api/labs/consumer-groups")
    public ApiResponse<Map<String, Object>> run(@Valid @RequestBody Request request) {
        Map<String, List<Integer>> members = new LinkedHashMap<>();
        for (int i=0; i<request.groupIds().size(); i++) {
            members.computeIfAbsent(request.groupIds().get(i), key -> new ArrayList<>()).add(i);
        }
        Map<String, List<Integer>> assignments = new LinkedHashMap<>();
        for (int i=0; i<request.groupIds().size(); i++) assignments.put("consumer-"+i, new ArrayList<>());
        members.forEach((group, indices) -> {
            for (int p=0; p<request.partitions(); p++) assignments.get("consumer-"+indices.get(p % indices.size())).add(p);
        });
        return ApiResponse.ok(Map.of("assignments", assignments, "groups", members,
                "idleConsumers", assignments.entrySet().stream().filter(e -> e.getValue().isEmpty()).map(Map.Entry::getKey).toList(),
                "scope", "동일한 토픽을 구독하는 일반 소비자 그룹의 순환 배정 모형. 실제 Kafka assignor·리밸런스 프로토콜·offset 커밋은 실행하지 않습니다."));
    }
}
