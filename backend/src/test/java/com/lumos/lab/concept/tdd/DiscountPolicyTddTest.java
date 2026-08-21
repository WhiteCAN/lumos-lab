package com.lumos.lab.concept.tdd;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.Timeout;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("TDD 예제 - 할인 정책")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class DiscountPolicyTddTest {

    private DiscountPolicy discountPolicy;

    // @BeforeAll: 이 테스트 클래스의 모든 테스트가 시작되기 전에 한 번만 실행됩니다.
    // DB 연결 준비, 공통 fixture 생성처럼 비용이 큰 준비 작업에 씁니다.
    @BeforeAll
    static void beforeAll() {
        assertThat(Duration.ofSeconds(1)).isNotNull();
    }

    // @AfterAll: 이 테스트 클래스의 모든 테스트가 끝난 뒤 한 번만 실행됩니다.
    // 외부 리소스 정리, 임시 파일 삭제, 연결 해제 같은 마무리에 씁니다.
    @AfterAll
    static void afterAll() {
        assertThat(true).isTrue();
    }

    @BeforeEach
    void setUp() {
        discountPolicy = new DiscountPolicy();
    }

    // @AfterEach: 각 테스트가 끝난 뒤 매번 실행됩니다.
    // 테스트마다 변경된 상태를 정리하거나 로그를 확인할 때 씁니다.
    @AfterEach
    void tearDown() {
        discountPolicy = null;
    }

    @Test
    @Order(1)
    @Tag("red")
    @DisplayName("VIP 회원은 20% 할인을 받는다")
    void vipMemberGetsTwentyPercentDiscount() {
        // 시나리오:
        // Given: 주문 금액 10,000원과 회원 등급 VIP가 주어졌을 때
        // When: 할인 정책을 적용하면
        // Then: 최종 결제 금액은 8,000원이어야 합니다.
        int actual = discountPolicy.discountPrice(10_000, "VIP");

        assertThat(actual).isEqualTo(8_000);
    }

    @ParameterizedTest
    @Order(2)
    @Tag("green")
    @ValueSource(strings = {"VIP", "vip", "Vip"})
    @DisplayName("VIP 등급은 대소문자와 상관없이 20% 할인이다")
    void vipGradeIsCaseInsensitive(String grade) {
        int actual = discountPolicy.discountPrice(10_000, grade);

        assertThat(actual).isEqualTo(8_000);
    }

    @ParameterizedTest
    @Order(3)
    @Tag("green")
    @NullAndEmptySource
    @ValueSource(strings = {"BASIC", "UNKNOWN", " "})
    @DisplayName("VIP가 아닌 등급은 할인하지 않는다")
    void nonVipGradeDoesNotGetDiscount(String grade) {
        // 같은 규칙에 대한 여러 시나리오는 @ParameterizedTest로 묶으면 중복을 줄일 수 있습니다.
        int actual = discountPolicy.discountPrice(10_000, grade);

        assertThat(actual).isEqualTo(10_000);
    }

    @RepeatedTest(3)
    @Order(4)
    @Tag("refactor")
    @DisplayName("같은 입력은 반복 실행해도 같은 결과를 반환한다")
    void sameInputAlwaysReturnsSameResult() {
        int actual = discountPolicy.discountPrice(15_000, "VIP");

        assertThat(actual).isEqualTo(12_000);
    }

    @Test
    @Order(5)
    @Timeout(1)
    @Tag("refactor")
    @DisplayName("계산은 1초 안에 끝난다")
    void calculationFinishesWithinOneSecond() {
        int actual = discountPolicy.discountPrice(20_000, "VIP");

        assertThat(actual).isEqualTo(16_000);
    }

    @Test
    @Order(6)
    @Tag("edge-case")
    @DisplayName("금액이 음수이면 예외가 발생한다")
    void negativePriceThrowsException() {
        assertThatThrownBy(() -> discountPolicy.discountPrice(-1, "VIP"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("금액은 음수일 수 없습니다.");
    }

    private static class DiscountPolicy {

        int discountPrice(int price, String grade) {
            if (price < 0) {
                throw new IllegalArgumentException("금액은 음수일 수 없습니다.");
            }
            if (grade != null && "VIP".equalsIgnoreCase(grade.trim())) {
                return (int) (price * 0.8);
            }
            return price;
        }
    }
}
