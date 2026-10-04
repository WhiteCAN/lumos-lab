package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import tools.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class ArrayPipelineLabController {
    public record Request(@JsonDeserialize(contentUsing=LabIntegerDeserializer.class) @NotEmpty @Size(max=30) List<@NotNull @Min(-10000) @Max(10000) Integer> values) {}
    public record Result(List<Integer> numericSorted, List<Integer> doubled, List<Integer> evens, int sum) {}
    @PostMapping("/api/labs/array-pipeline")
    public ApiResponse<Result> run(@Valid @RequestBody Request r) {
        return ApiResponse.ok(new Result(r.values().stream().sorted().toList(),
                r.values().stream().map(n -> n * 2).toList(),
                r.values().stream().filter(n -> n % 2 == 0).toList(), r.values().stream().mapToInt(Integer::intValue).sum()));
    }
}
