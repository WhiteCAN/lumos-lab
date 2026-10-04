package com.lumos.lab.learning;

import com.lumos.lab.common.ApiResponse;
import jakarta.validation.Valid;
import tools.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class AgentLabController {
    public record LoopRequest(@NotNull @Pattern(regexp="single-shot|reflexive|verifier-gated") String pattern,
                              @JsonDeserialize(contentUsing=LabIntegerDeserializer.class) @NotEmpty @Size(max=10) List<@NotNull @Min(-100) @Max(100) Integer> values,
                              @JsonDeserialize(using=LabIntegerDeserializer.class) @NotNull @Min(-1000) @Max(1000) Integer proposedTotal, @JsonDeserialize(using=LabIntegerDeserializer.class) @NotNull @Min(1) @Max(5) Integer maxAttempts,
                              boolean toolAllowed, boolean failTool) {}
    public record LoopResult(String status, int candidate, int attempts, List<String> trace, String scope) {}
    @PostMapping("/api/labs/agent-loop")
    public ApiResponse<LoopResult> loop(@Valid @RequestBody LoopRequest r) {
        List<String> trace = new ArrayList<>();
        int candidate = r.proposedTotal(), attempts = 1;
        trace.add("초안 입력: " + candidate);
        String status;
        if (r.pattern().equals("single-shot")) {
            status = "UNVERIFIED"; trace.add("검사 없이 종료");
        } else {
            int expected = r.values().stream().mapToInt(Integer::intValue).sum();
            trace.add("코드 검증: " + (candidate == expected ? "통과" : "실패"));
            if (candidate == expected) status = "PASSED";
            else if (r.pattern().equals("verifier-gated")) status = "REJECTED";
            else if (r.maxAttempts() == 1) status = "LIMIT_REACHED";
            else if (!r.toolAllowed()) status = "TOOL_DENIED";
            else if (r.failTool()) status = "TOOL_ERROR";
            else {
                candidate = expected; attempts++;
                trace.add("허용된 로컬 계산기로 합계를 수정: " + candidate);
                trace.add("코드 재검증: 통과"); status = "PASSED";
            }
        }
        trace.add("종료: " + status);
        return ApiResponse.ok(new LoopResult(status, candidate, attempts, trace,
                "결정적 Java 제어 흐름. LLM·자기 비평·ReAct·MCP 호출 없음. attempts는 초안 및 수정 초안 수. 도구 권한 입력은 실험 스위치이며 실제 인증이 아닙니다."));
    }

    public record ContextRequest(@NotBlank @Size(max=80) String query,
                                 @NotNull @Pattern(regexp="none|read-metrics|write-report") String tool,
                                 boolean toolAllowed, boolean userApproved, boolean failTool) {}
    public record Document(String id, String keyword, String text) {}
    private static final List<Document> DOCUMENTS = List.of(
            new Document("cache-guide", "cache", "캐시 미스 시 원본을 조회하고 TTL과 무효화 정책을 검토합니다."),
            new Document("queue-guide", "queue", "대기열은 처리량을 늘리지 않습니다. 입장률과 만료를 제한합니다."),
            new Document("rag-guide", "rag", "검색 근거를 답변에 연결하고 근거가 없으면 부족함을 표시합니다."));
    public record ContextResult(List<Document> sources, String toolStatus, String toolOutput, List<String> trace, String scope) {}
    @PostMapping("/api/labs/agent-context")
    public ApiResponse<ContextResult> context(@Valid @RequestBody ContextRequest r) {
        var sources = DOCUMENTS.stream().filter(d -> Arrays.asList(r.query().toLowerCase(Locale.ROOT).split("[^a-z]+")).contains(d.keyword())).toList();
        List<String> trace = new ArrayList<>(List.of("고정 문서의 영문 키워드 검색: " + sources.size() + "건"));
        String status, output = "";
        if (r.tool().equals("none")) status = "SKIPPED";
        else if (!r.toolAllowed()) status = "DENIED";
        else if (r.tool().equals("write-report") && !r.userApproved()) status = "APPROVAL_REQUIRED";
        else if (r.failTool()) status = "TOOL_ERROR";
        else if (r.tool().equals("write-report")) { status = "PREVIEW_ONLY"; output = "보고서 미리보기: 근거 " + sources.size() + "건. 저장하지 않음."; }
        else { status = "READ_FIXTURE"; output = "교육용 고정 표본: requests=120, errors=3 (실시간 측정 아님)"; }
        trace.add("도구 정책: " + status);
        trace.add(sources.isEmpty() ? "문서 근거 없음: 검색을 보완하거나 답변 보류" : "출처 ID와 도구 결과를 별도 컨텍스트로 반환");
        return ApiResponse.ok(new ContextResult(sources, status, output, trace,
                "고정 3문서 키워드 검색·권한 분기만 실행. 임베딩·벡터 DB·MCP 프로토콜·LLM·파일 쓰기 없음. 요청의 승인 플래그는 교육용이며 실제 인증을 대신하지 않습니다."));
    }
}
