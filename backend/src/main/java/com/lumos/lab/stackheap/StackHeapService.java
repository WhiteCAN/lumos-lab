package com.lumos.lab.stackheap;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class StackHeapService {
    static final class Person {
        int age;
        Person(int age) { this.age = age; }
    }

    public record Step(String stage, int callerAge, int localAge, boolean sameReference, String explanation) {}
    public record Result(int callerAgeAfter, int calleeAgeBeforeReturn, boolean sameReferenceBeforeReturn,
                         List<Step> steps, String scope) {}

    public Result run(int initialAge, int nextAge, boolean reassign) {
        if (initialAge < 0 || initialAge > 150 || nextAge < 0 || nextAge > 150) {
            throw new IllegalArgumentException("나이는 0~150 사이여야 합니다.");
        }
        Person p = new Person(initialAge);
        List<Step> steps = new ArrayList<>();
        steps.add(new Step("호출 전", p.age, p.age, true, "호출자의 p가 Person 객체를 가리킵니다."));
        Step observed = change(p, nextAge, reassign, steps);
        steps.add(new Step("호출 복귀", p.age, observed.localAge(), observed.sameReference(),
                "change 프레임은 종료되었습니다. localAge와 sameReference는 반환 직전 관찰 기록입니다."));
        return new Result(p.age, observed.localAge(), observed.sameReference(), List.copyOf(steps),
                "실제 Java 객체와 == 비교 결과입니다. 물리 메모리 주소·스택 덤프·GC 실행 시점은 측정하지 않습니다.");
    }

    private Step change(Person original, int nextAge, boolean reassign, List<Step> steps) {
        Person local = original;
        steps.add(new Step("메서드 진입", original.age, local.age, original == local,
                "참조 값이 복사되어 original과 local이 같은 객체를 가리킵니다."));
        if (reassign) {
            local = new Person(nextAge); // 브레이크포인트: local만 다른 객체를 참조
        } else {
            local.age = nextAge; // 브레이크포인트: 호출자와 공유하는 객체의 필드 변경
        }
        Step observed = new Step("반환 직전", original.age, local.age, original == local,
                reassign ? "지역 참조를 재할당해도 호출자의 p는 기존 객체를 가리킵니다."
                        : "같은 객체의 필드를 변경했으므로 호출자에게도 변경이 보입니다.");
        steps.add(observed);
        return observed;
    }
}
