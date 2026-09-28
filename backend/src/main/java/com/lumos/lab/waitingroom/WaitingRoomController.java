package com.lumos.lab.waitingroom;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.math.BigDecimal;

@RestController
public class WaitingRoomController {
    private final WaitingRoomService service;
    public WaitingRoomController(WaitingRoomService service) { this.service = service; }

    public record Operation(
            @NotNull @Pattern(regexp = "JOIN|CHECK|LEAVE|ADVANCE") String type,
            @NotNull @Pattern(regexp = "[A-Za-z0-9_-]{0,16}") String visitor,
            @NotNull @Min(0) @Max(120) @Digits(integer = 3, fraction = 0) BigDecimal seconds) {}
    public record Request(
            @NotNull @Min(1) @Max(5) @Digits(integer = 1, fraction = 0) BigDecimal capacity,
            @NotNull @Min(5) @Max(120) @Digits(integer = 3, fraction = 0) BigDecimal ttlSeconds,
            @NotNull @Size(max = 80) List<@NotNull @Valid Operation> operations) {}

    @PostMapping("/api/labs/waiting-room")
    public ApiResponse<WaitingRoomService.Result> run(@Valid @RequestBody Request request) {
        return ApiResponse.ok(service.run(request));
    }
}
