package com.lumos.lab.algorithm.search;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/algorithms/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/types")
    public ApiResponse<List<SearchType>> types() {
        return ApiResponse.ok(Arrays.asList(SearchType.values()));
    }

    @PostMapping
    public ApiResponse<SearchResponse> search(@Valid @RequestBody SearchRequest request) {
        return ApiResponse.ok(searchService.search(request));
    }
}
