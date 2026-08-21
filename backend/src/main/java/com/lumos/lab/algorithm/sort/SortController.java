package com.lumos.lab.algorithm.sort;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/algorithms/sort")
public class SortController {
    private final SortService sortService;

    public SortController(SortService sortService) {
        this.sortService = sortService;
    }

    @GetMapping("/types")
    public ApiResponse<List<SortType>> types() {
        return ApiResponse.ok(Arrays.asList(SortType.values()));
    }

    @PostMapping
    public ApiResponse<SortResponse> sort(@Valid @RequestBody SortRequest request) {
        return ApiResponse.ok(sortService.sort(request));
    }
}
