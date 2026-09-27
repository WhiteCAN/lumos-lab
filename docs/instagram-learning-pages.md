# Instagram 자료 기반 학습 페이지

2026-09-27 요청한 다섯 자료를 주제별 페이지로 연결했습니다. 원문의 확인 범위와 공식 문서로 보완한 설명을 각 페이지에서 구분합니다. 추적용 URL 쿼리는 보관하지 않습니다.

| 원문 | 학습 경로 | 반영 방식·확인 범위 |
| --- | --- | --- |
| [시스템 설계](https://www.instagram.com/p/DducXU_DeRJ/?img_index=19) | `/system-design-roadmap` | 신규 학습 지도. 캡션의 전체 주제와 19번 Security Part1 슬라이드 확인. 전체 슬라이드·별도 PDF는 미확인 |
| [마이크로서비스](https://www.instagram.com/p/DcbvaoljcOg/?img_index=4) | `/architecture/microservices` | 기존 아키텍처 개요에서 상세 페이지 분리. 캡션과 4번 Gateway·Discovery 슬라이드 확인 |
| [Stack·Heap](https://www.instagram.com/reels/DdweGPXuI0y/) | `/java/stack-heap` | 신규 페이지와 실제 Java 참조 실습. 원문 캡션 확인, 영상 전체 전사는 아님 |
| [DevOps 도구](https://www.instagram.com/reels/DdwqRFhN3pr/) | `/devops-toolchain` | CI/CD 심화 설명과 분리한 도구별 역할 지도. 원문 캡션 확인, 영상 전체 전사는 아님 |
| [Kafka](https://www.instagram.com/reels/DdwlpNOOqiP/) | `/messaging/kafka-architecture` | 기존 구성도 유지, 파티션 실습·순서·lag·실패 경로 보완. 원문 캡션 확인, 영상 전체 전사는 아님 |

## 실행 범위

- 시스템 설계: 기존 `/api/labs/examples/cache`의 요청 내부 캐시 모형. 전체 설계 구성 요소를 실행하지 않습니다.
- 마이크로서비스: 기존 `/api/labs/examples/outbox`의 요청 내부 주문·이벤트 모형. 실제 DB 트랜잭션·브로커·분산 서비스는 실행하지 않습니다.
- Stack·Heap: 신규 `POST /api/labs/stack-heap`. `initialAge`, `nextAge`는 필수 정수 0~150, `reassign`은 참조 재할당 여부입니다. 실제 Java 메서드 호출·필드 수정·참조 비교를 실행하고 GC·메모리 주소는 측정하지 않습니다.
- DevOps: 기존 `/api/labs/examples/pipeline`의 합계 검증 게이트. 배포 단계는 로그이며 실제 외부 인프라를 변경하지 않습니다.
- Kafka: 기존 `/api/labs/examples/broker`의 키 나머지 분배와 파티션별 offset. 실제 Kafka 해시·브로커·복제·ACK는 실행하지 않습니다.

실습은 `frontend/src/lib/debug-lab-catalog.ts`에서 연결하며 공통 패널의 요청 편집·로딩·오류·응답 표시를 사용합니다. 새 Java API 구현은 `backend/src/main/java/com/lumos/lab/stackheap/`, 검증은 대응하는 `src/test/java` 패키지에 있습니다.

## 검증 방법

프론트엔드에서 `npm run test:study`, `npm run test:labs`, `npm run lint`, `npm run build`를 실행합니다. 백엔드에서는 `gradlew.bat test`를 실행합니다. 각 페이지에서 정상 입력과 오류 입력을 보내고, 모바일·데스크톱의 내용과 가로 넘침을 확인합니다. 페이지별 공식 참고 링크는 각 페이지의 출처 절에서 유지합니다.
