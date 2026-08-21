package com.lumos.lab.datastructure.graph;

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
@RequestMapping("/api/datastructures/graph")
public class GraphTraversalController {

    private final GraphTraversalService service;

    public GraphTraversalController(GraphTraversalService service) {
        this.service = service;
    }

    @GetMapping("/types")
    public ApiResponse<List<GraphTraversalType>> types() {
        return ApiResponse.ok(Arrays.asList(GraphTraversalType.values()));
    }

    @PostMapping("/traverse")
    public ApiResponse<GraphTraversalResponse> traverse(@Valid @RequestBody GraphTraversalRequest request) {
        return ApiResponse.ok(service.traverse(request));
    }
}
