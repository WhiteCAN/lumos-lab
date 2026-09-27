# 코드 작성과 검증 기준

## 공통 원칙

요청과 관련된 코드만 바꾸고 기존 URL·API·폴더 구조·사용자 변경을 보존합니다. 문서와 커밋 메시지는 한국어로 작성합니다. 구현 위치 지도는 [루트 AGENTS](../AGENTS.md)와 [frontend/AGENTS](../frontend/AGENTS.md)가 담당합니다.

## 프론트엔드

- TypeScript와 함수형 React 컴포넌트를 사용합니다. `tsconfig.json`의 `strict`와 `@/*` → `src/*` 별칭을 따릅니다.
- 컴포넌트 이름은 PascalCase, 함수·변수는 camelCase를 사용합니다. 파일은 기존 `reference-page.tsx`, `system-diagram.tsx` 같은 kebab-case 관례와 App Router의 `page.tsx`, `layout.tsx`를 유지합니다.
- ESLint 기준은 [eslint.config.mjs](../frontend/eslint.config.mjs)입니다. Prettier는 현재 package.json에 없으므로 설치된 공통 도구처럼 기술하거나 새 설정을 강제하지 않습니다.
- 들여쓰기·따옴표·import는 대상 파일의 주변 코드에 맞춥니다. 관련 없는 파일 전체를 재포맷하지 않습니다.
- 기존 UI·HTTP·실습 컴포넌트를 우선 재사용합니다. 상태나 브라우저 기능이 필요한 영역에만 `use client`를 둡니다.
- 요청·응답 타입과 입력 제한을 실제 API와 맞춥니다. 로딩·오류 상태를 생략하지 않습니다.

## 백엔드

Java 21과 Gradle Wrapper를 사용합니다. 기능별 `com.lumos.lab` 패키지와 기존 Controller·Service·요청/응답 record·Repository 관례를 따릅니다. 생성자 주입, Bean Validation, `ApiResponse`와 기존 예외 처리를 먼저 확인합니다. 모든 API를 새 추상 계층이나 다른 응답 규격으로 일괄 변경하지 않습니다.

DB 접근은 기존 JPA/JDBC 패턴과 [DATABASE](DATABASE.md), API 변경은 [API](API.md), 보안 관련 변경은 [SECURITY](SECURITY.md)를 함께 확인합니다.

## 명령과 완료 기준

| 변경 영역 | 실행 위치 | 검증 |
| --- | --- | --- |
| 프론트 코드 | `frontend` | `npm run lint`, `npm run build` |
| 페이지·목록·실습 | `frontend` | 관련 `npm run test:study`, `npm run test:labs` |
| 팀 이동·단축키 | `frontend` | `npm run test:team-navigation` |
| FlowSection 재생 | `frontend` | `node --experimental-strip-types --test tests/flow-playback.test.mjs` |
| 백엔드 코드 | `backend` | `.\gradlew.bat test` |
| Markdown만 변경 | 저장소 | 파일 경로·내부 링크·내용·`git diff --check`; 빌드 재실행 불필요 |

설치는 `frontend`에서 `npm ci`, 개발 실행은 `npm run dev`입니다. 백엔드는 `backend`에서 `.\gradlew.bat bootRun`을 사용합니다. 존재하지 않는 일반 `npm test` 명령을 가정하지 않습니다. 저장소 CI는 백엔드 테스트와 프론트 lint/build를 수행하며 추가 학습 검사는 변경 범위에 맞게 로컬에서 실행합니다.

주석은 설계 이유·제약·학습 포인트를 설명합니다. 문서는 실제 변경을 반영하고, 미실행 테스트나 실제 인프라 미검증 상태를 성공으로 기록하지 않습니다.
