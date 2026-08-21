package com.study.lab.javafundamental.equality;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class JavaEqualityService {

    public EqualityDemoResponse demo(EqualityDemoRequest request) {
        String scenario = request.scenario().trim().toUpperCase(Locale.ROOT);

        if ("OBJECT".equals(scenario)) {
            Member first = new Member(1L, "kim");
            Member second = new Member(1L, "kim");
            return new EqualityDemoResponse(
                    scenario,
                    List.of(
                            new EqualityResult("first == second", first == second, "서로 다른 객체 참조입니다."),
                            new EqualityResult("first.equals(second)", first.equals(second), "record는 값 기반 equals/hashCode를 자동 생성합니다."),
                            new EqualityResult("first.hashCode() == second.hashCode()", first.hashCode() == second.hashCode(), "equals가 같으면 hashCode도 같아야 합니다.")
                    ),
                    "엔티티는 id 기준 equals/hashCode를 직접 설계할 때 프록시와 영속성 상태를 같이 고려해야 합니다.",
                    """
                    record Member(Long id, String name) {}
                    Member first = new Member(1L, "kim");
                    Member second = new Member(1L, "kim");
                    """
            );
        }

        String a = new String("java");
        String b = new String("java");
        return new EqualityDemoResponse(
                "STRING",
                List.of(
                        new EqualityResult("a == b", a == b, "==는 참조 주소를 비교합니다."),
                        new EqualityResult("a.equals(b)", a.equals(b), "equals는 문자열 내용을 비교합니다."),
                        new EqualityResult("a.hashCode() == b.hashCode()", a.hashCode() == b.hashCode(), "같은 문자열은 같은 hashCode를 가집니다.")
                ),
                "문자열 값 비교는 == 대신 equals를 기본으로 사용하세요.",
                """
                String a = new String("java");
                String b = new String("java");
                boolean sameReference = a == b;
                boolean sameValue = a.equals(b);
                """
        );
    }

    private record Member(Long id, String name) {
    }
}
