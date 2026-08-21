package com.lumos.lab.javafundamental.exception;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class JavaExceptionService {

    public ExceptionDemoResponse demo(ExceptionDemoRequest request) {
        String scenario = request.scenario().trim().toUpperCase(Locale.ROOT);
        if ("UNCHECKED".equals(scenario)) {
            return new ExceptionDemoResponse(
                    "UNCHECKED",
                    List.of("RuntimeException 계열입니다.", "컴파일러가 try/catch를 강제하지 않습니다.", "프로그래밍 오류나 복구 어려운 상황에 자주 사용합니다."),
                    "잘못된 인자, 상태 오류, 비즈니스 규칙 위반을 API 에러로 바꿀 때 많이 씁니다.",
                    """
                    if (amount <= 0) {
                        throw new IllegalArgumentException("amount must be positive");
                    }
                    """
            );
        }

        return new ExceptionDemoResponse(
                "CHECKED",
                List.of("Exception 계열 중 RuntimeException이 아닌 예외입니다.", "컴파일 단계에서 처리 여부를 강제합니다.", "호출자가 복구할 수 있는 외부 자원 오류에 어울립니다."),
                "파일, 네트워크, 외부 시스템처럼 호출자가 재시도/대체 흐름을 선택할 수 있을 때 고려합니다.",
                """
                String read(Path path) throws IOException {
                    return Files.readString(path);
                }
                """
        );
    }
}
