package com.lumos.lab.concept.grpc;

import com.lumos.lab.common.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/concepts/grpc")
public class GrpcConceptController {

    private final GrpcConceptClientService clientService;

    public GrpcConceptController(GrpcConceptClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping("/explain")
    public ApiResponse<GrpcExplainResponse> explain(@RequestBody(required = false) GrpcExplainRequest request) {
        String keyword = request == null ? "grpc" : request.normalizedKeyword();
        return ApiResponse.ok(clientService.explain(keyword));
    }
}
