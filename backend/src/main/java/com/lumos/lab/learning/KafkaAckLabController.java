package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import tools.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;

@RestController
public class KafkaAckLabController {
    public record Request(@NotNull @Pattern(regexp="0|1|all") String acks,
                          @JsonDeserialize(using=LabIntegerDeserializer.class) @NotNull @Min(1) @Max(5) Integer replicas, @JsonDeserialize(using=LabIntegerDeserializer.class) @NotNull @Min(1) @Max(5) Integer inSyncReplicas,
                          @JsonDeserialize(using=LabIntegerDeserializer.class) @NotNull @Min(1) @Max(5) Integer minInSyncReplicas,
                          @JsonDeserialize(using=LabIntegerDeserializer.class) @NotNull @Min(0) @Max(5) Integer replicasWithRecord, boolean leaderFailed) {}
    public record Result(String producerResult, int requiredCopies, int acceptedCopies,
                         int survivingCopies, String observation, String scope) {}

    @PostMapping("/api/labs/kafka-acks")
    public ApiResponse<Result> run(@Valid @RequestBody Request r) {
        if (r.inSyncReplicas() > r.replicas() || r.minInSyncReplicas() > r.replicas()
                || r.replicasWithRecord() > r.inSyncReplicas()) {
            throw new IllegalArgumentException("ISR·minISR는 복제 수 이하, 기록 보유 수는 ISR 이하여야 합니다.");
        }
        boolean rejected = r.acks().equals("all") && r.inSyncReplicas() < r.minInSyncReplicas();
        int copies = rejected ? 0 : r.replicasWithRecord();
        int required = switch (r.acks()) { case "0" -> 0; case "1" -> 1; default -> r.inSyncReplicas(); };
        String status = rejected ? "NOT_ENOUGH_REPLICAS" : r.acks().equals("0") ? "NO_ACK"
                : copies >= required ? "ACKNOWLEDGED" : "WAITING";
        int survivors = Math.max(0, copies - (r.leaderFailed() ? 1 : 0));
        String observation = survivors == 0 ? "이 스냅샷에 남은 사본 없음" : "남은 사본이 있으나 읽기 가능·선출 성공을 보장하지 않음";
        return ApiResponse.ok(new Result(status, required, copies, survivors, observation,
                "고정 ISR에서 쓰기 판정 후 리더 1대 손실을 적용한 모형. 0보다 큰 보유 수는 리더를 포함. 네트워크·타임아웃·디스크 flush·ISR 변동·ELR·리더 선출·소비자는 실행하지 않습니다."));
    }
}
