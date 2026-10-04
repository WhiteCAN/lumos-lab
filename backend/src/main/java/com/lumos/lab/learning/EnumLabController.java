package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class EnumLabController {
    public enum Day {
        MONDAY("MON"), TUESDAY("TUE"), WEDNESDAY("WED"), THURSDAY("THU"), FRIDAY("FRI"), SATURDAY("SAT"), SUNDAY("SUN");
        private final String code;
        Day(String code) { this.code = code; }
        public String code() { return code; }
        public boolean weekend() { return switch (this) { case SATURDAY, SUNDAY -> true; default -> false; }; }
    }
    public record Request(@NotBlank @Size(max=12) String day,
                          @NotEmpty @Size(max=20) List<@NotBlank @Size(max=12) String> selectedDays) {}
    public record Result(String name, int ordinal, String code, boolean weekend, List<Day> allValues,
                         List<Day> orderedDistinct, Map<Day,Integer> counts) {}
    @PostMapping("/api/labs/enums")
    public ApiResponse<Result> run(@Valid @RequestBody Request r) {
        Day day = parse(r.day());
        EnumSet<Day> set = EnumSet.noneOf(Day.class);
        EnumMap<Day,Integer> counts = new EnumMap<>(Day.class);
        for (String name : r.selectedDays()) { Day item = parse(name); set.add(item); counts.merge(item, 1, Integer::sum); }
        return ApiResponse.ok(new Result(day.name(), day.ordinal(), day.code(), day.weekend(),
                List.of(Day.values()), List.copyOf(set), counts));
    }
    private Day parse(String name) {
        try { return Day.valueOf(name); }
        catch (IllegalArgumentException e) { throw new IllegalArgumentException("요일은 MONDAY~SUNDAY의 정확한 대문자 이름으로 입력하세요."); }
    }
}
