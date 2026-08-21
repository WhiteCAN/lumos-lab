package com.study.lab.concept.tdd;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("TDD 예제 - 비밀번호 정책")
class PasswordPolicyTddTest {

    private PasswordPolicy passwordPolicy;

    // @BeforeEach: 각 @Test 실행 전에 매번 호출됩니다.
    // 테스트가 서로 같은 객체 상태를 공유하지 않게 준비 단계(Given)를 새로 만듭니다.
    @BeforeEach
    void setUp() {
        passwordPolicy = new PasswordPolicy();
    }

    // @Nested: 관련 테스트를 의미 단위로 묶습니다.
    // 테스트 결과 리포트에서 요구사항 그룹을 읽기 쉬워집니다.
    @Nested
    @DisplayName("Red 단계 - 요구사항을 테스트로 먼저 표현")
    class Red {

        // @Test: JUnit이 실행할 테스트 메서드라는 뜻입니다.
        // TDD에서는 먼저 이 테스트를 작성하고 실패를 확인한 뒤 구현을 시작합니다.
        @Test
        @DisplayName("8자 이상이고 문자와 숫자를 포함하면 유효하다")
        void validPasswordPasses() {
            boolean actual = passwordPolicy.isValid("abc12345");

            assertThat(actual).isTrue();
        }

        @Test
        @DisplayName("8자 미만이면 실패한다")
        void shortPasswordFails() {
            boolean actual = passwordPolicy.isValid("a12345");

            assertThat(actual).isFalse();
        }
    }

    @Nested
    @DisplayName("Green 단계 - 최소 구현으로 테스트 통과")
    class Green {

        // @ParameterizedTest: 같은 테스트 로직을 여러 입력 값으로 반복 실행합니다.
        // @CsvSource: CSV 형태로 input과 expected 값을 제공합니다.
        @ParameterizedTest(name = "[{index}] password={0}, expected={1}")
        @CsvSource({
                "abc12345, true",
                "a12345, false",
                "abcdefgh, false",
                "12345678, false"
        })
        @DisplayName("비밀번호 정책 예시를 모두 만족한다")
        void passwordPolicyExamples(String password, boolean expected) {
            boolean actual = passwordPolicy.isValid(password);

            assertThat(actual).isEqualTo(expected);
        }
    }

    @Nested
    @DisplayName("Refactor 단계 - 테스트는 유지하고 구현만 정리")
    class Refactor {

        @Test
        @DisplayName("빈 문자열은 실패한다")
        void blankPasswordFails() {
            boolean actual = passwordPolicy.isValid("");

            assertThat(actual).isFalse();
        }

        @Test
        @DisplayName("null은 실패한다")
        void nullPasswordFails() {
            boolean actual = passwordPolicy.isValid(null);

            assertThat(actual).isFalse();
        }
    }

    private static class PasswordPolicy {

        boolean isValid(String password) {
            return password != null
                    && password.length() >= 8
                    && password.chars().anyMatch(Character::isLetter)
                    && password.chars().anyMatch(Character::isDigit);
        }
    }
}
