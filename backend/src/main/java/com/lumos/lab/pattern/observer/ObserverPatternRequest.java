package com.lumos.lab.pattern.observer;

public record ObserverPatternRequest(String event) {
    public String normalizedEvent() {
        if (event == null || event.isBlank()) {
            return "새 게시글 등록";
        }
        return event.trim();
    }
}
