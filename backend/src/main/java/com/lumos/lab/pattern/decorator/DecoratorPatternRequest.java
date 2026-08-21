package com.lumos.lab.pattern.decorator;

public record DecoratorPatternRequest(String option) {
    public String normalizedOption() {
        if (option == null || option.isBlank()) {
            return "milk";
        }
        return option.trim();
    }
}
