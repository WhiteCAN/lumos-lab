package com.study.lab.pattern.strategy;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class StrategyPatternService {

    public StrategyPatternResponse run(StrategyPatternRequest request) {
        long startedAt = System.nanoTime();
        List<String> steps = new ArrayList<>();
        String grade = request.normalizedGrade();
        int amount = request.normalizedAmount();

        steps.add("클라이언트가 grade=" + grade + ", amount=" + amount + " 할인을 요청합니다.");
        DiscountStrategy strategy = selectStrategy(grade, steps);
        int discountAmount = strategy.discount(amount);
        int finalAmount = amount - discountAmount;
        steps.add("선택된 전략의 discount()를 호출합니다.");
        steps.add("원금 " + amount + "원 - 할인 " + discountAmount + "원 = 최종 " + finalAmount + "원");

        return new StrategyPatternResponse(
                "Strategy Pattern",
                strategy.getClass().getSimpleName(),
                amount,
                discountAmount,
                finalAmount,
                steps,
                System.nanoTime() - startedAt
        );
    }

    private DiscountStrategy selectStrategy(String grade, List<String> steps) {
        String normalized = grade.toLowerCase();
        if (normalized.contains("vip")) {
            steps.add("VIP 고객이라 VipDiscountStrategy를 선택합니다.");
            return new VipDiscountStrategy();
        }
        if (normalized.contains("gold")) {
            steps.add("Gold 고객이라 GoldDiscountStrategy를 선택합니다.");
            return new GoldDiscountStrategy();
        }
        steps.add("기본 고객이라 BasicDiscountStrategy를 선택합니다.");
        return new BasicDiscountStrategy();
    }

    private interface DiscountStrategy {
        int discount(int amount);
    }

    private static class BasicDiscountStrategy implements DiscountStrategy {
        public int discount(int amount) {
            return amount / 100;
        }
    }

    private static class GoldDiscountStrategy implements DiscountStrategy {
        public int discount(int amount) {
            return amount / 10;
        }
    }

    private static class VipDiscountStrategy implements DiscountStrategy {
        public int discount(int amount) {
            return amount / 5;
        }
    }
}
