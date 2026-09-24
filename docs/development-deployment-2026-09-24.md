# Lumos Lab 개발계 배포 기록

검증 시각: 2026-09-24 22:29 KST.

## 배포 결과

- 프론트: https://lab.dev.lumosgraphy.com
- API: https://api.lab.dev.lumosgraphy.com
- 배포 브랜치: `development`
- 애플리케이션 및 이미지 커밋: `42e972d68a17cc58ae8f4b1721dab75ae3a72a42`
- AppProject: `lumos-lab`, Namespace: `lumos-lab-dev`
- Argo CD 앱: `lumos-lab-frontend-dev`, `lumos-lab-backend-dev` 모두 `Synced / Healthy`.
- 두 Deployment 모두 `1/1` 준비 완료, SHA 태그 이미지를 사용합니다.
- 기존 ImageUpdater의 `lumos-*-dev` 규칙으로 자동 갱신 대상에 포함됐습니다. 전체 6개 앱·이미지, Ready=True를 확인했습니다.
- 두 도메인의 TLS 인증서 Ready=True 및 인증서 검증을 유지한 HTTPS 200 응답을 확인했습니다. 기존 DNS/Ingress 경로를 사용해 가비아 설정은 추가 변경하지 않았습니다.
- 기존 Lumos/Admin 4개 앱도 모두 `Synced / Healthy` 상태를 유지했습니다.

## DB와 환경

- 로컬은 기본 `local` 프로필과 H2, 개발계는 `dev` 프로필과 기존 MariaDB의 `LUMOS_LAB`을 사용합니다.
- 전용 계정 `lumos_lab_dev`는 Lab 스키마의 SELECT/INSERT/UPDATE/DELETE/CREATE 권한만 갖습니다. `LMP` 접근 거부를 확인했습니다.
- 실제 DB/JWT 값은 Kubernetes Secret에만 보관하며 저장소에는 넣지 않았습니다.
- 스키마 및 전용 계정 구성 뒤 DB 연결 도구는 읽기 전용으로 복구했습니다.
- gRPC는 외부에 공개하지 않고 백엔드 Pod 내부의 `127.0.0.1:9090`으로 호출합니다.

## 검증 근거

- 격리한 배포 파일 스냅샷에서 backend `test bootJar` 성공: 39개 중 38개 통과, 명시적 외부 DB 테스트 1개 건너뜀.
- 같은 스냅샷에서 frontend 의존성 설치·lint·build 성공, 정적 페이지 56개 생성.
- [CI 36005054297](https://github.com/WhiteCAN/lumos-lab/actions/runs/36005054297): 성공.
- [이미지 게시 36005054797](https://github.com/WhiteCAN/lumos-lab/actions/runs/36005054797): 공통 CI 및 프론트/백엔드 이미지 게시 모두 성공.
- `/actuator/health`: `UP`.
- `/api/database/info`: MariaDB 10.3.32, `LUMOS_LAB`, 전용 사용자, 활성 프로필 `dev` 확인.
- `/api/concepts/grpc/explain` POST: 성공, `HTTP/2 + Protocol Buffers` 응답과 실제 gRPC executor 스레드 확인.
- CORS 사전 요청: `Access-Control-Allow-Origin: https://lab.dev.lumosgraphy.com` 확인.
- 실제 개발계 브라우저에서 정렬 API를 호출해 `[7,3,9,1,5]`가 `[1,3,5,7,9]`로 표시되는 것을 확인했습니다.

## 범위와 주의사항

- 기존 미커밋 학습 페이지·사이드바 작업은 보존했고 이번 이미지에 포함하지 않았습니다.
- 문서 후속 커밋은 배포 검증 기록이며 위 애플리케이션 이미지 SHA와 구분합니다.
- MariaDB 10.3 호환을 위해 커뮤니티 legacy dialect를 사용합니다. DB 업그레이드는 별도 작업입니다.
- 실습용 테이블에 보존할 데이터를 넣지 않습니다. 대량 삽입 실습은 기존 실습 행을 삭제합니다.
- 전체 학습 기능의 전수 검증은 아니며, 이번 검증 범위는 배포·환경 분리·DB 연결·대표 API·gRPC 경로입니다.
