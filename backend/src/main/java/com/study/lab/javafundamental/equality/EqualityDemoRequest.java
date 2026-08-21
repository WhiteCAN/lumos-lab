package com.study.lab.javafundamental.equality;

import jakarta.validation.constraints.NotBlank;

public record EqualityDemoRequest(@NotBlank String scenario) {
}
