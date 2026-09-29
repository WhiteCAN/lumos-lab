package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class LoadBalanceLabController {
    public record Request(@NotBlank @Pattern(regexp="round-robin|least-connections") String strategy,
                          @NotEmpty @Size(max=10) List<@NotNull @Min(0) @Max(100) Integer> connections,
                          @NotNull @Min(1) @Max(30) Integer requests) {}
    @PostMapping("/api/labs/load-balance")
    public ApiResponse<Map<String,Object>> run(@Valid @RequestBody Request request) {
        var loads = new ArrayList<>(request.connections());
        var assignments = new ArrayList<Integer>();
        for(int i=0;i<request.requests();i++) {
            int selected = request.strategy().equals("round-robin") ? i % loads.size() : loads.indexOf(Collections.min(loads));
            assignments.add(selected);
            loads.set(selected, loads.get(selected)+1);
        }
        return ApiResponse.ok(Map.of("assignments", assignments,"connectionsAfter",loads,
                "scope","요청 하나가 연결 하나를 열고 실험 끝까지 유지하는 Java 모형. 동률은 낮은 서버 번호 우선. 연결 종료·장애 감지·실제 프록시는 생략합니다."));
    }
}
