package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class ReconcileLabController {
    public record RouteRequest(@NotBlank @Size(max=50) String host,
                               @NotBlank @Size(max=30) String selector,
                               @NotBlank @Size(max=30) String podLabel,
                               boolean ready, boolean controllerPresent) {}
    @PostMapping("/api/labs/kubernetes-route")
    public ApiResponse<Map<String, Object>> route(@Valid @RequestBody RouteRequest request) {
        String outcome = !request.controllerPresent() ? "Ingress를 처리할 컨트롤러 없음"
                : !request.host().equals("lab.example") ? "일치하는 host 규칙 없음"
                : !request.selector().equals(request.podLabel()) ? "selector와 Pod label 불일치"
                : !request.ready() ? "Ready endpoint 없음" : "Pod로 전달 가능";
        return ApiResponse.ok(Map.of("outcome", outcome, "routable", outcome.equals("Pod로 전달 가능"),
                "scope", "단일 host·label·Ready 조건의 Java 모형. DNS·TLS·실제 프록시·YAML 파서는 실행하지 않습니다."));
    }
    public record Request(@NotNull @Min(0) @Max(10) Integer desired,
                          @NotNull @Min(0) @Max(10) Integer current,
                          @NotNull @Min(0) @Max(10) Integer slots,
                          boolean imageAvailable, boolean readinessPass) {}
    public record Result(int create, int delete, int pending, int running, int ready, List<String> steps, String scope) {}

    @PostMapping("/api/labs/reconcile")
    public ApiResponse<Result> run(@Valid @RequestBody Request request) {
        int create = Math.max(0, request.desired() - request.current());
        int delete = Math.max(0, request.current() - request.desired());
        int assigned = Math.min(request.desired(), request.slots());
        int running = request.imageAvailable() ? assigned : 0;
        int ready = request.readinessPass() ? running : 0;
        return ApiResponse.ok(new Result(create, delete, request.desired() - assigned, running, ready, List.of(
                "API Server: 희망 복제 수를 수락하는 모형",
                "Controller: 생성 " + create + " / 삭제 " + delete,
                "Scheduler: 노드 배정 " + assigned + " / 미배정 " + (request.desired() - assigned),
                "Runtime: " + (request.imageAvailable() ? "이미지 준비 가능" : "이미지 준비 실패"),
                "Readiness: Ready " + ready + " / Running " + running),
                "한 번의 계산 모형. slots는 전체 Pod 배정 용량, current는 현재 Pod 객체 수입니다. 기존 객체도 동일한 이미지·readiness 조건을 적용합니다. 실제 클러스터·YAML·롤링 업데이트·장애 복구는 실행하지 않습니다."));
    }
}
