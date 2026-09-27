# API 계약과 통신 기준

## 기본 주소와 구현 위치

프론트는 [API_BASE_URL](../frontend/src/constants/api.ts)의 `NEXT_PUBLIC_API_BASE_URL`을 사용하며 미설정 시 `http://localhost:8080`입니다. 기존 경로는 `/api/...`이고 공통 `/api/v1` 접두사를 새로 도입하지 않습니다. 공개 개발계 주소와 주입 방법은 [환경 가이드](database-environments.md)에 있습니다.

REST API는 Spring MVC Controller와 요청·응답 record가 계약 원본입니다. gRPC는 [lumos_lab.proto](../backend/src/main/proto/lumos_lab.proto)가 별도 계약이며 JSON 응답 규칙을 그대로 적용하지 않습니다.

## 공통 JSON 응답

[ApiResponse](../backend/src/main/java/com/lumos/lab/common/ApiResponse.java)는 `success`, `data`, `message`를 사용합니다. 템플릿의 `error.code`·`error.message` 구조는 현재 계약이 아닙니다.

성공 형태의 예시:

```json
{
  "success": true,
  "data": { "status": "UP", "service": "lumos-lab-backend", "checkedAt": "실행 시각" },
  "message": null
}
```

`GET /api/health`는 실제로 위 data 필드를 생성하며 `checkedAt`은 실행 시 ISO 시각 문자열입니다. 위 문자열은 형태 설명용 자리표시자이며 실제 응답 기록이 아닙니다.

검증 실패 형태:

```json
{ "success": false, "data": null, "message": "필드 또는 요청에 대한 오류 설명" }
```

[GlobalExceptionHandler](../backend/src/main/java/com/lumos/lab/common/GlobalExceptionHandler.java)는 Bean Validation 실패와 `IllegalArgumentException`을 HTTP 400으로 반환합니다. 첫 필드 오류 또는 예외 메시지를 사용하며, 그 밖의 JSON 파싱 오류·미처리 예외·404까지 동일 형식을 보장하지는 않습니다. 실제 실패 계약은 해당 Controller·Service와 테스트를 함께 확인합니다.

프론트 공통 [requestJson](../frontend/src/services/http.ts)은 `response.ok`, `body.success`, truthy `body.data`를 모두 요구합니다. `false`, `0`, 빈 문자열, `null`을 정상 data로 반환하는 새 API에는 이 헬퍼를 그대로 사용할 수 없습니다. 일부 페이지의 개별 fetch 구현도 수정 대상에서 직접 확인합니다.

## 대표 엔드포인트

| 메서드·경로 | 역할 | 계약 원본 |
| --- | --- | --- |
| `GET /api/health` | 서비스 상태 응답 | [HealthController](../backend/src/main/java/com/lumos/lab/health/HealthController.java) |
| `GET /api/database/info` | DB 정보 확인 | [DatabaseInfoController](../backend/src/main/java/com/lumos/lab/database/DatabaseInfoController.java) |
| `GET /api/algorithms/search/types` | 검색 알고리즘 종류 | [SearchController](../backend/src/main/java/com/lumos/lab/algorithm/search/SearchController.java) |
| `POST /api/algorithms/search` | 입력 배열 검색 | 같은 Controller 및 SearchRequest·SearchResponse |
| `GET/POST/DELETE /api/rag/documents` | 모의 문서 목록·등록·전체 삭제 | [RagController](../backend/src/main/java/com/lumos/lab/concept/rag/RagController.java) |
| `POST /api/rag/vector-search`, `/api/rag/ask` | 모의 검색·답변 | 같은 RAG Controller |
| `POST /api/backend/security-auth/login`, `/oauth/callback` | JWT·OAuth 학습 | [SecurityAuthController](../backend/src/main/java/com/lumos/lab/concept/securityauth/SecurityAuthController.java) |
| `GET /api/backend/security-auth/protected` | Authorization·requiredRole 학습 | 같은 보안 학습 Controller |

전체 API 목록을 이 표에 중복 관리하지 않습니다. 학습 패널 연결은 [debug-lab-catalog.ts](../frontend/src/lib/debug-lab-catalog.ts), 엔드포인트 계약은 해당 백엔드 Controller가 기준입니다.

검색 요청 DTO는 필수 `type`, 비어 있지 않은 정수 목록 `numbers`, 필수 정수 `target`입니다. `type`의 허용 값은 `/types`와 실제 enum을 확인합니다. 응답 data에는 `type`, `original`, `searchedArray`, `target`, `found`, `index`, `comparisons`, `steps`, `elapsedNanos`가 있습니다. 입력 전처리·검색 실패의 상세 의미는 Service와 테스트를 기준으로 하며 수치 결과를 문서에서 고정하지 않습니다.

## 인증·실행 경계

보안 학습 API를 사이트 전체 로그인 체계로 취급하지 않습니다. RAG API는 실제 외부 LLM·벡터 DB 호출 계약이 아닙니다. 문서 삭제 등 변경 작업은 실습 상태에 영향을 주므로 검증 시 데이터 범위를 확인합니다. 현재 보안 범위와 환경변수 규칙은 [SECURITY](SECURITY.md)를 따릅니다.

새 API는 기존 경로와 응답 구조를 보존하고 요청·성공·실패·입력 제한·로딩 표시·디버깅 위치를 연결합니다. 보호가 필요한 새 기능은 서버 인증·인가를 별도로 구현해야 하며, 가이드의 상태 코드 표나 요청 제한 예시를 구현된 기능으로 복사하지 않습니다.

## Java 참조 실습

`POST /api/labs/stack-heap`은 `{"initialAge":20,"nextAge":30,"reassign":false}` 형태의 JSON 요청을 받습니다. 두 나이는 필수 정수 0~150이며 누락·null·범위 밖 값은 HTTP 400입니다. reassign 생략 시 false입니다. 응답 data에는 callerAgeAfter, calleeAgeBeforeReturn, sameReferenceBeforeReturn, steps, scope가 있습니다. 실제 Java 참조를 비교하며 메모리 주소나 GC를 측정하지 않습니다. 구현: [StackHeapController](../backend/src/main/java/com/lumos/lab/stackheap/StackHeapController.java), [StackHeapService](../backend/src/main/java/com/lumos/lab/stackheap/StackHeapService.java).
