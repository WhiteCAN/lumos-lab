package com.lumos.lab.javafundamental.collection;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/java/collections")
public class JavaCollectionController {

    private final JavaCollectionService service;

    public JavaCollectionController(JavaCollectionService service) {
        this.service = service;
    }

    @GetMapping("/compare")
    public ApiResponse<CollectionCompareResponse> compare() {
        return ApiResponse.ok(service.compare());
    }

    @PostMapping("/demo")
    public ApiResponse<CollectionDemoResponse> demo(@Valid @RequestBody CollectionDemoRequest request) {
        return ApiResponse.ok(service.demo(request));
    }
}
