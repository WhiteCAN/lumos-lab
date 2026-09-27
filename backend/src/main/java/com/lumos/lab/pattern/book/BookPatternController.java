package com.lumos.lab.pattern.book;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patterns/book")
public class BookPatternController {
    private final BookChapters01To08 first;
    private final BookChapters09To16 second;
    private final BookChapters17To23 third;
    public BookPatternController(BookChapters01To08 first, BookChapters09To16 second, BookChapters17To23 third) {
        this.first=first; this.second=second; this.third=third;
    }
    @PostMapping("/{pattern}")
    public ApiResponse<BookPatternResult> run(@PathVariable("pattern") String pattern,
                                             @Valid @RequestBody BookPatternRequest request) {
        // 여기서 Step Into로 해당 장의 패턴 객체 협력을 따라갑니다.
        var result = switch (pattern) {
            case "iterator", "adapter", "template-method", "factory-method", "singleton", "prototype", "builder", "abstract-factory" -> first.run(pattern, request);
            case "bridge", "strategy", "composite", "decorator", "visitor", "chain-of-responsibility", "facade", "mediator" -> second.run(pattern, request);
            case "observer", "memento", "state", "flyweight", "proxy", "command", "interpreter" -> third.run(pattern, request);
            default -> throw new IllegalArgumentException("지원하지 않는 책 패턴: " + pattern);
        };
        return ApiResponse.ok(result);
    }
}
