# 2026-10-04 콘텐츠 점검

최근 추가한 6개 페이지와 관련 기존 페이지를 소스·API 계약·공식 문서에 대조했습니다. 발견한 설명 오류와 기존 요청에 어긋난 구성도를 수정했습니다. 모든 문장의 무오류를 보증하는 전수 의미 검증은 아닙니다.

## 수정 사항

| 항목 | 수정 결과 |
| --- | --- |
| Kafka 파티션 구성도 | 기존 카드 구성도를 공통 React Flow로 전환. Producer → 라우팅 → 파티션의 좌→우 흐름과 예시 매핑을 표시 |
| Kafka 같은 키의 파티션 | 파티션 수·직렬화·파티셔너가 같다는 조건과 명시적 파티션 지정의 우선순위를 설명 |
| Kafka ACK·offset | ACK 0은 브로커 응답을 기다리지 않음. auto.offset.reset은 유효한 커밋 위치가 없거나 보존 범위를 벗어났을 때 적용 |
| Java 예제 | Agent 두 페이지의 독립 컴파일 불가능한 분기 요약은 Java 형태 의사코드로 명시. 실행은 연결된 실제 Java API로 구분 |
| Collection 상속 그림 | 자식→부모 화살표는 extends 관계이며 시간 흐름과 다름을 명시 |
| API 문서 | boolean 생략을 false 기본값으로 단정하던 문장을 실제 HTTP 역직렬화 계약에 맞게 수정 |
| 모바일 화면 | Kafka 설정 표의 그리드 최소 너비로 인한 페이지 넘침 수정. 320px에서 문서 너비 305px 확인 |
| 운영 의존성 | CSS 빌드에만 사용하는 shadcn을 개발 의존성으로 이동하고 기존 설치 버전 4.14.0으로 고정. brace-expansion 패치 반영 |

Kafka 설명은 [4.1 Producer 설정](https://kafka.apache.org/41/configuration/producer-configs/)과 [4.1 Consumer 설정](https://kafka.apache.org/41/configuration/consumer-configs/)을 기준으로 확인했습니다. 버전별 기본 파티셔너 차이를 일반화하지 않습니다. Enum은 [Java 21 Enum 계약](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Enum.html), MCP는 [공식 아키텍처](https://modelcontextprotocol.io/docs/learn/architecture)를 참조했습니다.

## 검증 범위

- 등록된 학습 페이지 104개의 경로 구조와 실행 기능 연결 검사. 정적 문자열 내부 링크 91개의 대상 경로 확인(동적 링크·모든 앵커 전수 검사는 아님).
- 공통 실습 카탈로그에 연결된 81개 페이지의 기본 요청을 중복 제거한 55건을 로컬 API로 실행: 모두 성공 응답. 나머지 페이지의 모든 입력 조합을 실행했다는 뜻은 아님.
- 백엔드 테스트 109건 중 108건 통과, 1건 건너뜀. 신규 API 정상·범위·타입·실패 분기는 OctoberLearningLabsTest로 검증.
- 프론트 study 테스트 17건, labs 검사 4건, 팀 내비게이션 검사 4건 통과. lint와 production build 실행.
- FastAPI 다운로드 예제는 실제 Python TestClient 정상·범위·타입 오류 확인. 웹의 가격 계산 실습은 기존 Java API이며 Python 상시 서비스 배포가 아님.
- 첫 CI에서 npm 10이 요구하는 선택 의존성 잠금 항목 누락을 발견했습니다. node_modules가 없는 임시 디렉터리에서 npm 10으로 잠금 파일을 보완하고 npm ci dry-run을 확인했습니다. 로컬 npm 11 빌드 성공만으로 Linux 설치 재현성을 판단하지 않습니다.

## 남은 제약과 위험

- Instagram 확인 범위는 [원문별 기록](instagram-learning-2026-10-04.md)과 같습니다. 영상 음성 전체나 비공개 자료를 확인한 것으로 표현하지 않습니다.
- Kafka ACK는 고정 ISR 모형, Agent는 결정적 Java 모형, RAG는 고정 문서 키워드 검색입니다. 실제 Kafka 장애·LLM·벡터 검색·MCP 통신을 실행한 것으로 표현하지 않습니다.
- npm 운영 의존성 감사는 0건입니다. 전체 감사에는 braces 계열을 포함한 개발·빌드 의존성 high 경고 8건이 남습니다. 호환 가능한 해결판이 없는 경로를 강제 다운그레이드하지 않았습니다. 해당 도구들은 현재 standalone 실행 산출물에 포함되지 않으며, 빌드 환경의 잔여 위험은 별도로 남습니다.
- 배포 완료는 development 커밋의 CI 및 이미지 발행 성공 후, 캐시 우회 개발계 화면과 신규 API 응답으로 판단합니다.
