package com.study.lab.common;

/**
 * 공통 API 응답 규격 레코드입니다.
 */
public record ApiResponse<T>(
        boolean success,
        T data,
        String message
) {
    /**
     * 성공 응답 객체를 생성합니다.
     */
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null);
    }

    /**
     * 실패 응답 객체를 생성합니다.
     */
    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(false, null, message);
    }
}
