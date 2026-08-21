package com.study.lab.concept.rag;

import com.study.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rag")
public class RagController {
    private final RagService ragService;

    public RagController(RagService ragService) {
        this.ragService = ragService;
    }

    @GetMapping("/documents")
    public ApiResponse<List<RagDocumentResponse>> documents() {
        return ApiResponse.ok(ragService.documents());
    }

    @PostMapping("/documents")
    public ApiResponse<RagDocumentResponse> addDocument(@Valid @RequestBody RagDocumentRequest request) {
        return ApiResponse.ok(ragService.addDocument(request));
    }

    @DeleteMapping("/documents")
    public ApiResponse<List<RagDocumentResponse>> resetDocuments() {
        return ApiResponse.ok(ragService.resetDocuments());
    }

    @PostMapping("/vector-search")
    public ApiResponse<RagSearchResponse> vectorSearch(@Valid @RequestBody RagSearchRequest request) {
        return ApiResponse.ok(ragService.search(request));
    }

    @PostMapping("/ask")
    public ApiResponse<RagAnswerResponse> ask(@Valid @RequestBody RagQuestionRequest request) {
        return ApiResponse.ok(ragService.ask(request));
    }
}
