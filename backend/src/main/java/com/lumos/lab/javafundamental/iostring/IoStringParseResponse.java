package com.lumos.lab.javafundamental.iostring;

import java.util.List;

public record IoStringParseResponse(
        List<String> scannerTokens,
        List<String> stringTokenizerTokens,
        List<String> splitTokens,
        String recommendation,
        String codeExample
) {
}
