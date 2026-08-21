package com.lumos.lab.javafundamental.equality;

public record EqualityResult(
        String expression,
        boolean value,
        String reason
) {
}
