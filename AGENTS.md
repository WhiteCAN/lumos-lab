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

## 작업 시작과 탐색 범위

- 이 파일과 작업 영역의 `AGENTS.md`를 구조 안내의 첫 기준으로 사용합니다. 매번 전체 폴더 목록, 모든 페이지, README 전체를 다시 읽지 않습니다.
- 시작 시 `git status --short`로 기존 변경을 확인하고, 요청과 직접 관련된 파일 및 적용되는 하위 지침만 읽습니다. 같은 작업에서 이미 읽은 파일은 변경되었거나 내용 확인이 필요한 경우에만 다시 읽습니다.
- 프론트엔드 페이지 추가는 `frontend/AGENTS.md`의 페이지 작성 지도를 따릅니다. 전체 저장소 탐색이나 백엔드 조사는 API 변경이 필요한 경우에만 수행합니다.
- 안내된 경로가 없거나 실제 코드와 다르거나, 요청이 구조 변경을 포함할 때만 탐색 범위를 넓힙니다. 발견한 차이는 해당 지침에 반영합니다.
- 이 문서는 탐색을 줄이는 지도입니다. 수정 대상의 현재 내용, 관련 API 계약과 사용자 변경 사항 확인은 생략하지 않습니다.
- Markdown 문서·지침만 바꾸는 경우에는 경로·내용·diff를 확인합니다. 실행 코드나 빌드 설정을 변경하지 않았다면 Gradle 테스트와 frontend lint/build를 다시 실행하지 않습니다.

## 변경 위치 빠른 안내

| 작업 | 먼저 확인할 위치 |
| --- | --- |
| 학습 페이지·메뉴·스타일 | `frontend/AGENTS.md` → 해당 `frontend/src/app/**/page.tsx` |
| API·DB 동작 | `backend`의 적용 지침과 요청에 해당하는 소스 |
| 실행 방법·학습 콘텐츠 목록 | 루트 `README.md`, `frontend/README.md` |
| 작업 인계·확장 가이드 | `docs/continuation-guide.md`, 요청에 관련된 문서 |

페이지 구조나 공통 컴포넌트 위치를 변경하면 `frontend/AGENTS.md`의 지도도 함께 갱신합니다.
