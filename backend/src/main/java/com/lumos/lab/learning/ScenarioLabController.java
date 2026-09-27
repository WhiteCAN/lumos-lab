package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.constraints.*;
import java.util.Map;

@RestController
@RequestMapping("/api/labs")
public class ScenarioLabController {
    private final ScenarioLabService service;
    private final ApplicationContext context;
    private final IndexLabService indexes;
    public ScenarioLabController(ScenarioLabService service, ApplicationContext context, IndexLabService indexes) {
        this.service=service; this.context=context; this.indexes=indexes;
    }

    @PostMapping("/examples/{scenario}")
    public ApiResponse<ScenarioLabService.Result> run(@PathVariable("scenario") String scenario,
            @Valid @RequestBody ScenarioLabService.Input input) {
        return ApiResponse.ok(service.run(scenario, input));
    }

    @PostMapping("/beans")
    public ApiResponse<Map<String, Object>> beans() {
        var first = context.getBean(ScenarioLabService.class);
        var second = context.getBean(ScenarioLabService.class);
        return ApiResponse.ok(Map.of("sameInstance", first == second,
                "sameAsInjected", first == service, "className", first.getClass().getName(),
                "scope", "singleton"));
    }

    public record IndexInput(@Min(1) @Max(1000) int rowCount, int key) {}
    @PostMapping("/index")
    public ApiResponse<Map<String, Object>> index(@Valid @RequestBody IndexInput input) throws java.sql.SQLException {
        return ApiResponse.ok(indexes.run(input.rowCount(), input.key()));
    }

    public record HttpInput(int status) {}
    @PostMapping("/http")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> http(@RequestBody HttpInput input) {
        if (!java.util.Set.of(200,201,400,404,409,500).contains(input.status()))
            throw new IllegalArgumentException("status는 200·201·400·404·409·500 중 선택하세요.");
        var body = input.status() < 400 ? ApiResponse.ok(Map.of("status", input.status()))
                : ApiResponse.<Map<String, Integer>>fail("학습용 HTTP " + input.status());
        return ResponseEntity.status(input.status()).body(body);
    }
}
