package com.study.lab.pattern.command;

public record CommandPatternRequest(String action) {
    public String normalizedAction() {
        if (action == null || action.isBlank()) {
            return "on";
        }
        return action.trim();
    }
}
