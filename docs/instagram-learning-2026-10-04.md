# 2026-10-04 Instagram 학습 자료 정리

## 확인 범위와 반영

로그인된 브라우저에서 요청한 게시물의 캡션과 보이는 설명 이미지를 확인했습니다. 영상 전체 음성·모든 프레임을 전사하거나 비공개 배포 자료를 받지는 않았습니다. 원문의 주제와 프로젝트가 보완한 코드·실험·설계 주의점을 구분합니다.

| 순서 | 원문 | 확인한 주제·범위 | 반영 |
| --- | --- | --- | --- |
| 1 | [Dd8FgbUhs3r](https://www.instagram.com/reels/Dd8FgbUhs3r/) | thesravandev 캡션: Kafka acks=0·1·all | /messaging/kafka-acks 신설, 기존 kafka-config 연결 |
| 2 | [Dd8M1_yudIJ](https://www.instagram.com/reels/Dd8M1_yudIJ/) | rubalsolutions enum 설명 이미지: 상수·필드·메서드·values/valueOf | /java/enums 신설 |
| 3 | [Dd7u8xByGpm](https://www.instagram.com/reels/Dd7u8xByGpm/) | harish_rawal8126 캡션: FastAPI 치트시트 5쪽의 주제. 전체 5쪽 미확인 | /backend/fastapi 신설, 기존 구조 페이지와 상호 연결 |
| 4 | [Dd7_WYhykfy](https://www.instagram.com/reels/Dd7_WYhykfy/) | code_base_academy 치트시트 이미지: 값·변수·배열·함수·DOM·비동기 등 | /frontend/javascript-basics 신설, 비동기·Hooks 상세 재사용 |
| 5 | [Dd5q-Zty7nP](https://www.instagram.com/reels/Dd5q-Zty7nP/) | softwaredeveloper_077 캡션·그림: 5가지 agent 패턴 | 기존 /ai-agent-patterns 보완, /ai-agent-lab 실습 분리 |
| 6 | [Dd4McJIIPdW](https://www.instagram.com/p/Dd4McJIIPdW/) | decodedstack 캡션·그림: Agent·RAG·MCP 연결 | /agent-rag-mcp 신설 |
| 7 | [Dd1tFc6t_j_](https://www.instagram.com/reels/Dd1tFc6t_j_/) | 9월 30일 정리한 React Hooks와 동일 URL | 기존 /frontend/react-hooks 유지. 중복 생성하지 않음 |

## 실행 범위

- Kafka ACK: 고정 ISR 스냅샷, 쓰기 판정 이후 리더 1대 손실 계산. Kafka 연결·ISR 변동·ELR·선출·디스크 flush·소비자 실행 없음.
- Java enum: 실제 valueOf·switch·EnumSet·EnumMap 실행. 선언 순서·중복·잘못된 이름 비교.
- FastAPI: 웹 실습은 기존 Java 가격 계산 API. 별도 [Python 파일](../frontend/public/examples/fastapi_quote.py)은 FastAPI TestClient로 실제 정상·범위·타입 오류를 확인. Python 서비스 상시 배포 없음.
- JavaScript: 브라우저 기본 sort·숫자 sort·map·filter·reduce 실행. 같은 입력을 Java API에 보내 네 가지 숫자 결과 비교.
- Agent loop: single-shot·reflexive·verifier-gated의 결정적 제어 흐름만 실행. 초안·수정 횟수·도구 금지·오류 실험. ReAct·Planner-executor·LLM은 실행하지 않음.
- Agent context: 고정 3문서 키워드 검색과 읽기 표본·쓰기 미리보기 정책. 벡터 검색·MCP 통신·LLM·실제 쓰기 없음. 승인 입력은 운영 인증이 아님.
- React Hooks: 기존 브라우저 카운터·effect 정리·Java API 요청 및 취소 실습 재사용.

모든 신규 페이지는 공통 카탈로그·검색·학습 진행도·API 패널에 등록했습니다. 핵심 카드는 넓은 화면 3열, 작은 화면 1열이며 흐름은 기존 React Flow를 사용합니다. API 계약은 [API 문서](API.md)의 10월 4일 항목, 디버깅 위치는 각 페이지 패널을 참고합니다.

## 검증과 상태

- backend Gradle 테스트: 109개 중 108개 통과, 기존 1개 건너뜀, 실패 0. 신규 8개 테스트에 ACK·enum·배열·에이전트 분기와 JSON 정수 자동 변환 방지를 포함합니다.
- frontend test:study 17개, test:labs 4개 통과. lint와 production build 검증.
- 로컬 HTTP 정상·400 실패 12건 확인. 문자열·소수 배열도 400으로 거절합니다.
- 신규 6개 페이지에서 API 버튼의 완료·200 결과 확인. 브라우저와 Java 배열 결과 일치 및 소수 입력 오류, 에이전트 LIMIT_REACHED 확인.
- 320·768·1024·1440px 6개 페이지 배치 점검. 1440px 3열, 작은 화면 1열. 에이전트의 긴 실험 문자열과 공통 디버깅 패널 줄바꿈을 수정해 320px 가로 넘침을 해소했습니다.
- Python 예시의 TestClient 정상 합계·범위 오류·숫자 문자열 거절 검증 통과.
- 후속 사용자 요청으로 콘텐츠 점검 후 development 배포를 진행합니다. 수정 사항과 검증 범위는 [콘텐츠 점검 기록](content-audit-2026-10-04.md)에 정리합니다. 이 문서만으로 배포 완료를 판단하지 않고 해당 커밋의 CI·이미지 발행과 실제 개발계 응답을 함께 확인합니다.
