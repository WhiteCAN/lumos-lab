package com.study.lab.pattern.decorator;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DecoratorPatternService {

    public DecoratorPatternResponse run(DecoratorPatternRequest request) {
        long startedAt = System.nanoTime();
        List<String> steps = new ArrayList<>();
        List<String> decorators = new ArrayList<>();
        String option = request.normalizedOption().toLowerCase();

        Beverage beverage = new Americano();
        steps.add("기본 객체 Americano 생성: 3000원");

        beverage = new MilkDecorator(beverage);
        decorators.add("MilkDecorator");
        steps.add("MilkDecorator로 감싸 우유 옵션을 추가합니다.");

        if (option.contains("shot") || option.contains("샷")) {
            beverage = new ShotDecorator(beverage);
            decorators.add("ShotDecorator");
            steps.add("ShotDecorator로 한 번 더 감싸 샷 옵션을 추가합니다.");
        }

        steps.add("상속 조합을 늘리지 않고 런타임에 기능을 조합합니다.");

        return new DecoratorPatternResponse(
                "Decorator Pattern",
                beverage.description(),
                beverage.cost(),
                decorators,
                steps,
                System.nanoTime() - startedAt
        );
    }

    private interface Beverage {
        String description();

        int cost();
    }

    private static class Americano implements Beverage {
        public String description() {
            return "Americano";
        }

        public int cost() {
            return 3000;
        }
    }

    private abstract static class BeverageDecorator implements Beverage {
        protected final Beverage beverage;

        BeverageDecorator(Beverage beverage) {
            this.beverage = beverage;
        }
    }

    private static class MilkDecorator extends BeverageDecorator {
        MilkDecorator(Beverage beverage) {
            super(beverage);
        }

        public String description() {
            return beverage.description() + " + Milk";
        }

        public int cost() {
            return beverage.cost() + 700;
        }
    }

    private static class ShotDecorator extends BeverageDecorator {
        ShotDecorator(Beverage beverage) {
            super(beverage);
        }

        public String description() {
            return beverage.description() + " + Shot";
        }

        public int cost() {
            return beverage.cost() + 500;
        }
    }
}
