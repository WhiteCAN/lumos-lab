package com.study.lab.pattern.factory;

public record FactoryPatternRequest(String channel) {
    public String normalizedChannel() {
        if (channel == null || channel.isBlank()) {
            return "email";
        }
        return channel.trim();
    }
}
