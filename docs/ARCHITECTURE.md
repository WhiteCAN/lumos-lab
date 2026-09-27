# 시스템 아키텍처

## 구성과 데이터 흐름

```text
브라우저
  ├─ Next.js 학습 페이지·검색·시각화
  ├─ localStorage: 학습 진행도·테마
  └─ HTTP JSON → Spring Boot REST API
                    ├─ Java 학습 로직·메모리 기반 모형
                    ├─ JPA/JDBC → 프로필별 DB
                    └─ gRPC 학습 클라이언트 → gRPC 서버
```

설명 화면의 Redis·Kafka·LLM 노드는 실제 인프라 구성 증거가 아닙니다. 각 실습의 구현과 화면 고지를 기준으로 실제 실행 범위를 판단합니다.

## 기술과 폴더

| 영역 | 현재 구성 | 소스 기준 |
| --- | --- | --- |
| `frontend` | Node.js 22, Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Lucide, React Flow | [package.json](../frontend/package.json) |
| `backend` | Java 21, Spring Boot 4, Gradle Wrapper, MVC·Validation·JPA·JDBC·gRPC | [build.gradle](../backend/build.gradle) |
| `docs` | 기준 문서·상세 가이드·계획·검증 기록 | [문서 지도](README.md) |
| `.github/workflows` | CI와 컨테이너 이미지 게시 | [CI](../.github/workflows/ci.yml), [이미지 게시](../.github/workflows/publish-images.yml) |

## 프론트엔드 책임

`src/app`은 라우트, `src/components`는 공통 화면, `src/lib`는 목록·검색·진행도·실습 메타데이터, `src/services`는 HTTP 호출을 담당합니다. 상세 지도는 [frontend/AGENTS](../frontend/AGENTS.md)에 유지합니다.

정적 설명은 서버 컴포넌트를 우선하고 상태·브라우저 실행이 필요한 영역만 클라이언트 경계로 둡니다. `ReferencePage`가 공통 학습 레이아웃을, `SidebarInset`이 main 랜드마크를 제공합니다. React Flow 구성도는 [별도 가이드](react-flow-diagrams.md)를 따릅니다.

API 주소는 `NEXT_PUBLIC_API_BASE_URL`이며 브라우저에서 공개되는 값입니다. 호출 흐름과 응답 제약은 [API 계약](API.md)을 따릅니다. 진행도와 테마의 브라우저 저장은 서버 계정 동기화가 아닙니다.

## 백엔드와 저장소

기능별 패키지의 Controller가 요청 DTO를 받고 Service가 학습 로직을 수행합니다. 공통 응답과 일부 오류 처리는 `common`, CORS 등 설정은 `config`에 있습니다. JPA의 `TransactionLog`와 JDBC 대량 삽입 테이블, 메모리 기반 모의 실습을 구분합니다. 프로필과 모델은 [DATABASE](DATABASE.md)가 담당합니다.

실제 회원 로그인은 후속 과제이며 보안 학습용 토큰 API가 제품 전체 인증을 제공하지는 않습니다. [SECURITY](SECURITY.md)에 현재 경계를 기록합니다.

## 배포 구성과 확인 범위

저장소에는 GitHub Actions → GHCR 이미지 → Kubernetes/Argo CD 개발계 구성이 있습니다. frontend/backend의 `k8s/dev`와 `argocd/dev` 리소스 및 이미지 게시 워크플로가 기준입니다. gRPC는 기본적으로 내부 연결이며 외부 Ingress와 구분합니다.

이 문서는 소스의 배포 구조를 설명하며 현재 클러스터의 정상 동작을 확인한 보고서가 아닙니다. 환경변수·DB 연결은 [DB 환경 가이드](database-environments.md), 과거 검증은 [배포 기록](development-deployment-2026-09-24.md)을 참고하고 새 배포는 별도 검증합니다.
