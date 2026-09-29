# 보안 경계와 작업 규칙

## 현재 구현과 미구현 구분

`POST /api/labs/waiting-room`의 입장 권한 확인은 요청 내부 모형입니다. 방문자 ID·동작 이력·가상 시계를 클라이언트가 제공하며 실제 인증이나 다른 API 접근을 보호하지 않습니다. 실제 운영 게이트로 재사용하지 않습니다. [실습 경계](waiting-room.md)를 참고하세요.

Lumos Lab은 공개 학습용 사이트입니다. `backend/build.gradle`에는 Spring Security starter가 없고, 보안 학습용 Controller의 토큰·역할 실습이 제품 전체의 접근 제어를 제공하지는 않습니다. 실제 회원 로그인과 리프레시 토큰 정책은 [후속 JWT 과제](future-jwt-auth.md)입니다. UI에서 메뉴를 숨기는 것은 서버 인가가 아닙니다.

`/api/backend/security-auth/login`, `/protected`, `/oauth/callback`은 학습용 계약입니다. `/protected`라는 이름이나 Authorization 헤더 사용만으로 다른 API가 보호된다고 판단하지 않습니다. 문서 정리로 인증이나 요청 제한을 새로 구현한 것은 아닙니다.

## 비밀 정보와 환경

- 실제 환경변수 값·토큰·비밀번호·DB 접속 문자열을 소스, Markdown, 로그, 화면 캡처에 기록하지 않습니다.
- `frontend/.env.example`, `backend/.env.example`의 변수 이름과 설정 파일을 기준으로 안내합니다. 예시 파일을 복사했다는 이유만으로 백엔드에 자동 로딩된다고 가정하지 않습니다.
- `NEXT_PUBLIC_*`는 브라우저에 공개됩니다. 서버 전용 자격증명을 넣지 않습니다.
- 개발계 DB/JWT 비밀값은 환경변수와 Kubernetes Secret으로 주입합니다. 로컬 기본값을 개발계 대체값으로 사용하지 않습니다.
- 작업 지침의 비밀값·빌드 산출물·개인 PC 경로 커밋 금지를 유지합니다.

## 입력·오류·공개 범위

Bean Validation과 Service의 입력 제한을 확인하고 서버에서 검증합니다. 클라이언트 검증만으로 서버 입력이 안전하다고 간주하지 않습니다. 비용이 큰 실습은 기존 개수·범위 제한을 보존하고 새 입력의 실패 경로도 검증합니다.

현재 공통 예외 처리는 검증 오류와 `IllegalArgumentException`을 400으로 변환합니다. 모든 오류가 같은 형식으로 처리된다고 가정하지 않습니다. `IllegalArgumentException` 메시지가 응답에 들어가므로 내부 경로나 비밀값을 메시지에 넣지 않습니다. 계약은 [API](API.md)를 참고합니다.

CORS는 [CorsConfig](../backend/src/main/java/com/lumos/lab/config/CorsConfig.java)와 `APP_CORS_ALLOWED_ORIGINS`로 `/api/**`의 허용 출처를 설정합니다. CORS는 인증이나 비브라우저 요청 차단 수단이 아닙니다. 문제 해결을 위해 무조건 모든 출처를 허용하거나 검증을 우회하지 않습니다.

제품 전체 인가, 전역 요청 빈도 제한, 운영 보안 감사 완료를 확인된 기능으로 선언하지 않습니다. 실제 인증을 도입할 때 보호 대상·서버 검증·저장 방식·만료·권한 부족 처리를 함께 설계합니다.

## 데이터와 의존성

실습에는 실제 사용자·업무 데이터를 넣지 않습니다. `bulk_insert_lab`은 실행 시 기존 실습 데이터를 지울 수 있고, RAG 문서 삭제 API는 메모리 자료를 지웁니다. 공유 개발계 작업은 대상 데이터와 영향 범위를 먼저 확인합니다. 자세한 DB 경계는 [DATABASE](DATABASE.md)를 따릅니다.

의존성은 package/lockfile과 Gradle 설정으로 관리합니다. 필요 없는 도구를 템플릿에 맞추려고 추가하지 않습니다. 취약점 점검 결과는 검사 시점과 범위를 함께 기록하며, 과거 `npm audit` 통과를 현재의 보안 보장으로 재사용하지 않습니다.

2026-09-30 추가 학습 API는 제한된 입력의 요청별 계산입니다. 외부 Kubernetes·Kafka·Redis·LLM·모니터링 수집기와 연결하지 않습니다. Spring Security 상세 페이지의 Java 설정은 설명용이며 프로젝트 인증 체계를 변경하지 않습니다. 기존 HMAC 실습에는 실제 자격증명을 넣지 않습니다.
