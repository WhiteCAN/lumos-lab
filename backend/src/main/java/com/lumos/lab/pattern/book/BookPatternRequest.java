package com.lumos.lab.pattern.book;

import jakarta.validation.constraints.*;

/** 입력 필드의 의미는 각 패턴 페이지에서 안내합니다. */
public record BookPatternRequest(@NotNull @Size(max=500) String text,
                                 @Min(1) @Max(20) int count,
                                 @Min(0) @Max(100) int value,
                                 long seed, boolean fail) {}
