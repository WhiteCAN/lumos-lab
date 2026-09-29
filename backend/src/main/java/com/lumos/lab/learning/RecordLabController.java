package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class RecordLabController {
    public record Request(@NotBlank @Size(max=30) String name,
                          @NotNull @Size(max=10) List<@NotBlank @Size(max=20) String> tags,
                          @NotBlank @Size(max=20) String append, boolean defensiveCopy) {}
    public record Profile(String name, List<String> tags) {}
    public record SafeProfile(String name, List<String> tags) {
        public SafeProfile { name = name.trim(); tags = List.copyOf(tags); }
    }
    public record Result(boolean equalBefore, boolean equalAfter, List<String> before, List<String> after,
                         String accessor, String printed, boolean sameReference, String scope) {}
    @PostMapping("/api/labs/records")
    public ApiResponse<Result> run(@Valid @RequestBody Request request) {
        List<String> source = new ArrayList<>(request.tags());
        List<String> before = List.copyOf(source);
        if (request.defensiveCopy()) {
            SafeProfile first = new SafeProfile(request.name(), source);
            SafeProfile second = new SafeProfile(request.name(), new ArrayList<>(source));
            boolean equalBefore = first.equals(second);
            source.add(request.append());
            return ApiResponse.ok(new Result(equalBefore, first.equals(second), before, first.tags(),
                    first.name(), first.toString(), first == second, "실제 Java record와 String 목록의 방어적 복사. 가변 원소의 깊은 복사는 다루지 않습니다."));
        }
        Profile first = new Profile(request.name(), source);
        Profile second = new Profile(request.name(), new ArrayList<>(source));
        boolean equalBefore = first.equals(second);
        source.add(request.append());
        return ApiResponse.ok(new Result(equalBefore, first.equals(second), before, List.copyOf(first.tags()),
                first.name(), first.toString(), first == second, "실제 Java record의 얕은 불변성: final 참조가 가리키는 목록은 변경될 수 있습니다."));
    }
}
