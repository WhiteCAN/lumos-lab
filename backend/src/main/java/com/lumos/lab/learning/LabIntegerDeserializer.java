package com.lumos.lab.learning;

import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;

/** 새 학습 API의 정수 계약: 문자열·소수를 자동 변환하지 않습니다. */
public class LabIntegerDeserializer extends ValueDeserializer<Integer> {
    @Override
    public Integer deserialize(JsonParser parser, DeserializationContext context) {
        if (!parser.isExpectedNumberIntToken()) {
            return context.reportInputMismatch(Integer.class, "JSON 정수만 입력하세요. 문자열·소수는 허용하지 않습니다.");
        }
        return parser.getIntValue();
    }
}
