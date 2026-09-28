# 프로젝트 문서 지도

## 어디부터 읽을까요?

실행 방법은 [루트 README](../README.md), 작업 규칙은 [루트 AGENTS](../AGENTS.md)가 시작점입니다. 작업마다 아래 문서를 모두 읽는 대신 관련 기준 문서와 수정 대상 소스를 확인합니다.

| 기준 문서 | 답하는 질문 | 갱신할 때 |
| --- | --- | --- |
| [PRD](PRD.md) | 누구를 위해 무엇을 만드는가? | 제품 범위·학습 완료 기준 변경 |
| [AGENTS](../AGENTS.md) | 에이전트가 어떻게 작업하는가? | 명령·작업 규칙·탐색 경로 변경 |
| [DESIGN_SYSTEM](DESIGN_SYSTEM.md) | 화면을 어떻게 표현하는가? | 공통 UI·테마·반응형 정책 변경 |
| [ARCHITECTURE](ARCHITECTURE.md) | 시스템이 어떻게 연결되는가? | 계층·저장소·배포 구조 변경 |
| [SECURITY](SECURITY.md) | 현재 보안 경계와 지켜야 할 규칙은? | 인증·입력 검증·공개 범위 변경 |
| [CODE_STYLE](CODE_STYLE.md) | 기존 코드 관례와 검증 명령은? | 언어·도구·공통 패턴 변경 |
| [DATABASE](DATABASE.md) | 데이터 위치·모델·변경 절차는? | 프로필·테이블·SQL 변경 |
| [API](API.md) | 요청·응답·오류 계약은? | API 또는 통신 규약 변경 |

`AGENTS.md`는 자동 탐색 위치인 저장소 루트와 필요한 하위 폴더에 유지합니다. `docs/AGENTS.md`를 복제하지 않습니다. 프론트 상세 지도는 [frontend/AGENTS](../frontend/AGENTS.md), Claude 진입 파일은 기존 [frontend/CLAUDE](../frontend/CLAUDE.md)를 사용합니다.

## 상세 구현과 운영

- [접속 대기열·가상 대기실](waiting-room.md): 실행 순서, API 입력 제한, Java 디버깅, 운영 설계와 모형의 경계

- [React Flow 시스템 다이어그램](react-flow-diagrams.md): 적용 페이지, 경로 데이터, 왕복 연결점, 확장 제약
- [학습 흐름 애니메이션](flow-animation.md): FlowSection 재생·경로·아이콘
- [책 예제 지도](book-examples-map.md): 원본과 학습 페이지·실습 매핑
- [DB 환경 설정](database-environments.md): 프로필·환경변수·MariaDB 검증 절차
- [작업 인계](continuation-guide.md): 이어서 할 작업과 기존 구현 맥락

## 계획과 시점별 기록

- [후속 DB·CRUD·JPA 과제](future-db-crud-jpa.md), [후속 실제 로그인·JWT 과제](future-jwt-auth.md): 미완료 계획이며 구현된 기능이 아님
- [2026-09-24 개발계 배포](development-deployment-2026-09-24.md), [2026-09-27 통합 기록](integration-2026-09-27.md): 해당 시점의 기록이며 현재 운영 상태의 실시간 증거가 아님
- [기존 설계 기록](superpowers/specs/), [기존 실행 계획](superpowers/plans/): 결정 배경을 보존하며 현재 기준 문서를 대체하지 않음

## 문서 관리 기준

2026-09-27에 제공된 `Vibe_Coding_MD_Files_Guide.ko.md`와 `vibe_coding_md_files_beginner_guide.ko.md`의 역할 분리 방식을 적용했습니다. 가이드의 예시 서비스·인증·데이터 모델은 복사하지 않고 이 저장소의 소스와 설정을 기준으로 작성했습니다. 제공 원본은 수정하지 않았습니다.

README는 실행과 문서 진입점, 기준 문서는 안정적인 규칙과 현재 구조, 상세 가이드는 구현 방법, 계획·배포 기록은 시점별 맥락을 담당합니다. 기존 문서를 삭제하거나 이동하지 않고 링크로 연결합니다. 문서의 중복 표보다 실제 설정·소스 링크를 우선하며, 충돌을 발견하면 구현 사실과 의도한 요구사항을 구분해 관련 기준 문서를 함께 갱신합니다.

문서 정리는 인증 구현·배포·DB 변경을 뜻하지 않습니다. 제품 수치 목표나 운영 현황을 근거 없이 추가하지 않습니다. Markdown만 수정하면 링크·내용·diff를 검증하고 빌드를 반복하지 않습니다.

- [Instagram 자료별 학습 페이지](instagram-learning-pages.md): 다섯 원문의 확인 범위, 페이지 분리와 API 실습 범위
