# Lumos Lab 작업 가이드

이 저장소는 다음 세 영역의 기존 구조를 유지합니다.

- `backend`: Java 21, Spring Boot, Gradle Wrapper
- `frontend`: Node.js 22, Next.js, React, TypeScript
- `docs`: 학습 내용과 프로젝트 작업 문서

## 작업 규칙

1. 요청과 직접 관련 없는 API, 화면 URL, 폴더 구조를 변경하지 않습니다.
2. 실제 환경변수, 인증정보, 개인 PC 경로와 빌드 산출물을 커밋하지 않습니다.
3. backend 변경 후 `backend\gradlew.bat test`를 실행합니다.
4. frontend 변경 후 `npm run lint`와 `npm run build`를 실행합니다.
5. 작업 완료 전 관련 README와 문서를 현재 코드에 맞게 갱신합니다.
6. 커밋 메시지와 프로젝트 문서는 한글로 작성합니다.

하위 폴더에 별도 `AGENTS.md`가 있으면 해당 지침을 함께 적용합니다.
