# 2026-09-30 학습 자료 순차 정리

원문을 확인한 순서대로 기존 페이지를 보완하거나 상세 페이지를 추가합니다. 확인하지 않은 게시물의 주제를 추정하지 않습니다. 각 항목은 원문 확인 → 기존 내용 비교 → 구현·실습 → 검증 순서로 진행합니다.

| 순서 | 원문 | 확인한 주제 | 반영 위치 | 상태 |
| --- | --- | --- | --- | --- |
| 1 | [Dd1tFc6t_j_](https://www.instagram.com/reels/Dd1tFc6t_j_/) | React Hooks 7가지 | `/frontend/react-hooks`, React 기초에서 연결 | 구현·lint/build·실습 성공/실패/취소 확인 |
| 2 | [Dd1xxJGuNph](https://www.instagram.com/reels/Dd1xxJGuNph/) | useEffect·의존성·cleanup | `/frontend/react-hooks#effect`에 타이머 실습 보완 | 구현·최종 검증 완료 |
| 3 | [Dd1mbLxhaem](https://www.instagram.com/reels/Dd1mbLxhaem/) | kubectl apply부터 Pod 준비까지 | `/kubernetes-deployment`, 복제 수·실행 조건 API | 구현·최종 검증 완료 |
| 4 | [Dd0CLw2KZGL](https://www.instagram.com/reels/Dd0CLw2KZGL/) | Java record, 캡션·도표 확인 | `/java/records`, 얕은 불변성·방어적 복사 API | 구현·최종 검증 완료 |
| 5 | [Ddz5snCB9Pe](https://www.instagram.com/reels/Ddz5snCB9Pe/) | Deployment·Service·Ingress YAML | `/kubernetes-deployment#network`, 라우팅 조건 API 보완 | 구현·최종 검증 완료 |
| 6 | [Dd0mLLphExt](https://www.instagram.com/reels/Dd0mLLphExt/) | Kafka Consumer Group | `/messaging/kafka-architecture`, 그룹별 배정 API 보완 | 구현·최종 검증 완료 |
| 7 | [DdgS4sKFHkI](https://www.instagram.com/p/DdgS4sKFHkI/?img_index=2) | 로드밸런싱 도표 | `/load-balancing`, 분산 알고리즘 비교 API | 구현·최종 검증 완료 |
| 8 | [DdKCmAWj38e](https://www.instagram.com/p/DdKCmAWj38e/?img_index=2) | 캐시 위치·기술 선택, 도표·캡션 | `/backend/caching-strategies#technology`, 기존 LRU API 재사용 | 구현·최종 검증 완료 |
| 9 | [DdjbVVblt_Y](https://www.instagram.com/p/DdjbVVblt_Y/?img_index=6) | LLM 핸드북 20장 | `/llm-handbook`, 기존 RAG·Agent 연결, softmax API | 구현·최종 검증 완료 |
| 10 | [DdwbAWOGkDT](https://www.instagram.com/p/DdwbAWOGkDT/?img_index=2) | 인증·인가 핸드북 15장 | `/backend/jwt-oauth#handbook`, 기존 인증 실습 연결 | 구현·최종 검증 완료 |
| 11 | [DdG-bsDFvUU](https://www.instagram.com/p/DdG-bsDFvUU/?img_index=3) | Kafka 핸드북 15장 | `/messaging/kafka-config#handbook`, 구조·그룹 실습 연결 | 구현·최종 검증 완료 |
| 12 | [Dc_GpBoDYjZ](https://www.instagram.com/p/Dc_GpBoDYjZ/?img_index=3) | Transactional 함정, 캡션·3번 카드 | `/transactional#traps`, 기존 실제 DB 롤백 실습 보완 | 구현·최종 검증 완료 |
| 13 | [DdxNedqkhO7](https://www.instagram.com/p/DdxNedqkhO7/?img_index=6) | 마이크로서비스 표지·15개 주제 | `/architecture/microservices#handbook`, 관련 실습·상세 페이지 연결 | 구현·최종 검증 완료 |
| 14 | [DdZWBVRDXxI](https://www.instagram.com/p/DdZWBVRDXxI/) | 로깅·모니터링, 캡션·표지 | `/observability`, 지연 분포 통계 API | 구현·최종 검증 완료 |
| 15 | [DdwPP8tlou4](https://www.instagram.com/p/DdwPP8tlou4/?img_index=6) | Spring Security·JWT, 1~18번 카드 주제 | `/backend/spring-security`, 기존 HMAC 실습 연결 | 구현·최종 검증 완료 |

## 1. React Hooks

로그인된 브라우저에서 원문 캡션의 useState, useEffect, useRef, useContext, useReducer, useMemo, useCallback 목록을 확인했습니다. 영상 전체의 발언을 옮긴 문서가 아닙니다. 상세 설명은 [React 공식 Hooks 문서](https://react.dev/reference/react/hooks)로 교차 확인합니다. React 실습의 실행 언어는 TypeScript/JavaScript이며 API 경계는 기존 Java `DebugLabController.task()`를 재사용합니다.


## 최종 검증

- 새 상세 페이지 7개, 기존 React·Kafka·캐싱·인증·트랜잭션·마이크로서비스 보완. 중복 내용은 기존 상세 페이지로 연결했습니다.
- frontend lint, production build(102개 정적 경로), test:study 14개, test:labs 4개 통과.
- backend 전체 Gradle 테스트 통과. 그룹별 독립 배정·유휴 소비자, 기존 연결을 반영한 분산, softmax 합·온도·평행 이동, tail latency·입력 제한을 검증했습니다.
- 새 POST 엔드포인트 7개를 로컬에서 호출해 정상 200과 필수 입력 누락 400을 확인했습니다.
- 브라우저에서 새 페이지의 API 실행, 통계 오류 표시, Hooks 성공·실패·취소와 타이머 간격 변경·중지를 확인했습니다.
- 새 페이지 7개의 320px 가로 넘침을 점검했습니다. Kubernetes 긴 제목의 줄바꿈을 수정했으며 Hooks는 768·1440px도 확인했습니다.
- 출처 확인 범위는 표에 기록했습니다. 15번은 1~18번 카드 주제를 확인했고 19~20번은 확인 범위에 포함하지 않았습니다. 확인한 내용을 재구성한 학습 문서이며 영상 전사나 원본 전체 복제물이 아닙니다.
- 실습은 Java 계산·브라우저 Hooks·기존 API입니다. 실제 외부 Kubernetes/Kafka/LLM/OAuth 환경을 구축한 것으로 표현하지 않습니다.

최초 정리는 로컬 구현·검증까지 수행했습니다. 이후 사용자 요청으로 development 배포 절차를 진행합니다. 배포 결과는 해당 커밋의 GitHub Actions와 개발계 실행 화면을 기준으로 확인합니다.
