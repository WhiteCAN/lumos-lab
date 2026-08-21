package com.lumos.lab.javafundamental.exception;

import jakarta.validation.constraints.NotBlank;

public record ExceptionDemoRequest(@NotBlank String scenario) {
}
