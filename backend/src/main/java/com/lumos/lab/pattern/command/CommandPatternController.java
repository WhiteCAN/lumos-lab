package com.lumos.lab.pattern.command;

import com.lumos.lab.common.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patterns/command")
public class CommandPatternController {

    private final CommandPatternService service;

    public CommandPatternController(CommandPatternService service) {
        this.service = service;
    }

    @PostMapping("/run")
    public ApiResponse<CommandPatternResponse> run(@RequestBody(required = false) CommandPatternRequest request) {
        return ApiResponse.ok(service.run(request == null ? new CommandPatternRequest(null) : request));
    }
}
