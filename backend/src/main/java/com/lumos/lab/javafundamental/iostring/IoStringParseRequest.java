package com.lumos.lab.javafundamental.iostring;

import jakarta.validation.constraints.NotBlank;

public record IoStringParseRequest(
        @NotBlank String text,
        @NotBlank String delimiter
) {
}
