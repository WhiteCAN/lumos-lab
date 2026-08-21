package com.study.lab.pattern.strategy;

public record StrategyPatternRequest(String grade, int amount) {
    public String normalizedGrade() {
        if (grade == null || grade.isBlank()) {
            return "basic";
        }
        return grade.trim();
    }

    public int normalizedAmount() {
        return Math.max(amount, 0);
    }
}
