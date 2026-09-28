# 접속 대기열·가상 대기실

## 실행

페이지 `/backend/waiting-room`에서 백엔드에 연결한 뒤 **방문자 5명 예제**를 누릅니다. 기본 정원 2명·유효기간 10초에서는 A·B가 입장하고 C·D·E가 기다립니다. C의 권한 확인은 거절, A 퇴장 후 C 입장, +10초 후 B·C 만료와 D·E 입장을 확인합니다. ID를 바꾸어 중복 진입·대기 취소·재진입을 비교할 수 있습니다.

설정은 초기화 후 변경합니다. 예제 버튼은 이력을 교체합니다. 화면은 넓은 폭에서 대기·입장·종료 3열, 좁은 폭에서 1열입니다. React Flow 구성도·단계 흐름·Java 코드 예제가 이어집니다.

## API 계약

`POST /api/labs/waiting-room`은 기존 `ApiResponse`를 반환합니다.

```json
{"capacity":2,"ttlSeconds":10,"operations":[
  {"type":"JOIN","visitor":"A","seconds":0},
  {"type":"JOIN","visitor":"B","seconds":0},
  {"type":"JOIN","visitor":"C","seconds":0},
  {"type":"CHECK","visitor":"C","seconds":0},
  {"type":"ADVANCE","visitor":"","seconds":10}
]}
```

| 입력 | 제한 |
| --- | --- |
| capacity | 필수 정수 1~5 |
| ttlSeconds | 필수 정수 5~120, 입장 승인부터 고정 유효기간 |
| operations | 필수 목록, 0~80개, null 원소 불가 |
| type | JOIN / CHECK / LEAVE / ADVANCE |
| visitor | JOIN·CHECK·LEAVE는 영문·숫자·`_`·`-` 1~16자, ADVANCE는 빈 문자열 |
| seconds | 방문자 동작은 0, ADVANCE는 정수 1~120 |

모든 동작 필드는 필수입니다. 범위·필드·조합 오류는 HTTP 400으로 거절합니다. 대기+활성 20명 초과 진입은 정상 실행 응답의 거절 로그로 남습니다. 미입장 방문자의 CHECK도 HTTP 403이 아닌 **모형 안의 거절 로그**입니다. 이 엔드포인트 자체는 학습용 공개 API입니다.

응답 `data`는 `now`, `capacity`, `visitors`, `events`, `scope`입니다. 방문자는 `visitor`, `state`(WAITING/ACTIVE/LEFT/EXPIRED), `position`(대기는 1부터, 나머지는 0), `expiresAt`(가상 초)를 가집니다. 로그는 발생 시각과 설명을 담습니다. 재진입 시 방문자의 현재 상태를 교체하며 과거 변화는 로그로 보존합니다.

## 처리 규칙과 한계

- 요청의 이력을 처음부터 Java 컬렉션으로 재실행합니다. 서버 간·사용자 간 공유 상태나 영속 저장은 없습니다. 브라우저 새로고침으로 이력이 사라집니다.
- JOIN은 활성·대기 티켓이 있으면 순번과 만료를 유지합니다. 재요청은 유효기간을 연장하지 않습니다. 종료한 방문자의 재진입은 큐 끝에 추가합니다.
- LEAVE는 자리 반환 또는 대기 취소입니다. 빈자리는 즉시 FIFO로 채웁니다.
- ADVANCE는 시계를 이동한 **도착 시점에 한 번** 만료 정리와 입장을 처리합니다. `expiresAt <= now`면 만료입니다. 이동 중간 시점의 반복 승인은 생략합니다.
- 대기 티켓 만료, heartbeat, 폴링, ETA, 서명 티켓, 인증, Redis, 분산 경쟁·장애는 구현하지 않습니다. 방문자 ID는 인증 정보가 아닙니다.
- 이력과 시계를 클라이언트가 제공하므로 운영용 권한 판단에 사용할 수 없습니다. 운영 게이트는 서버 시간·공유 상태·위변조 방지 티켓·보호 API 검사·원자적인 자리 배정이 필요합니다.

## 소스와 검증

- 서버: `backend/src/main/java/com/lumos/lab/waitingroom/WaitingRoomController.java`, `WaitingRoomService.java`
- 브레이크포인트: `run()`의 JOIN/CHECK/LEAVE 분기, `expire()`의 만료 비교, `admit()`의 FIFO 꺼내기와 자리 배정
- 화면: `frontend/src/components/waiting-room-lab.tsx`; 실패 시 마지막 성공 상태 보존, 요청 중 동작 잠금, 15초 요청 제한
- 연결: `debug-lab-catalog.ts`의 `interactive: waiting-room` → `PageDebugLab` 지연 로드
- 테스트: `WaitingRoomTest`에서 FIFO, 중복 진입, 만료 경계, 취소·재진입, 정원 상한, 요청 격리, HTTP 정상·오류 계약을 검사합니다.
- 명령: backend에서 `gradlew.bat test`; frontend에서 `npm run test:labs`, `npm run test:study`, `npm run lint`, `npm run build`

## 공식 참고

- [Cloudflare 대기 순서 정책](https://developers.cloudflare.com/waiting-room/reference/queueing-methods/)
- [Cloudflare 대기실 쿠키](https://developers.cloudflare.com/waiting-room/reference/waiting-room-cookie/)
- [Redis Sorted sets](https://redis.io/docs/latest/develop/data-types/sorted-sets/)
- [Redis Lua의 원자적 실행](https://redis.io/docs/latest/develop/interact/programmability/eval-intro/)

제품별 정책을 이 실습과 동일하게 구현했다고 간주하지 않습니다.
