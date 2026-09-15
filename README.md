# Lumos Lab

[![CI](https://github.com/WhiteCAN/lumos-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/WhiteCAN/lumos-lab/actions/workflows/ci.yml)

Spring Boot와 Next.js를 함께 실행하며 Java, 웹 개발, 데이터베이스, 메시징, 디자인 패턴, AI 애플리케이션 구조를 실험하는 학습용 웹사이트입니다.

완성된 서비스를 제공하는 것이 아니라, 화면에서 API를 호출하고 코드 흐름을 디버깅하며 개념을 익히는 데 목적이 있습니다.

> 인증, OAuth, Redis, Kafka, RAG 등 일부 기능은 학습용 mock 또는 시뮬레이션입니다. 운영 서비스의 보안·인증 구현으로 그대로 사용하지 마세요.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Backend | Java 21, Spring Boot 4, Spring Data JPA, REST, gRPC |
| Frontend | Node.js 22, Next.js 16, React 19, TypeScript, Tailwind CSS |
| Local DB | H2 인메모리 데이터베이스 |
| Optional DB | Supabase PostgreSQL |
| CI/CD | GitHub Actions, GHCR, Kubernetes, Argo CD |

## 프로젝트 구조

```text
lumos-lab/
├─ backend/            Spring Boot REST API와 gRPC 서버
│  ├─ k8s/dev/         Backend Kubernetes manifest
│  └─ argocd/dev/      Backend Argo CD Application
├─ frontend/           Next.js 웹 UI
│  ├─ k8s/dev/         Frontend Kubernetes manifest
│  └─ argocd/dev/      Frontend Argo CD Application
├─ docs/               작업 및 확장 가이드
└─ .github/workflows/  GitHub Actions 워크플로
```

백엔드와 프론트엔드는 하나의 GitHub 저장소에서 함께 관리합니다. Docker Compose는 사용하지 않습니다.

## 빠른 시작

### 준비물

- Git
- Java 21
- Node.js 22 이상과 npm

로컬에서는 H2를 사용하므로 PostgreSQL, MariaDB, Docker를 별도로 설치할 필요가 없습니다.

### 1. 저장소 내려받기

```bash
git clone https://github.com/WhiteCAN/lumos-lab.git
cd lumos-lab
```

### 2. 백엔드 실행

Windows PowerShell:

```powershell
Set-Location backend
.\gradlew.bat bootRun
```

macOS/Linux:

```bash
cd backend
./gradlew bootRun
```

백엔드를 실행하면 REST API `8080`과 내부 gRPC 서버 `9090`이 함께 시작됩니다.

### 3. 프론트엔드 실행

새 터미널에서 실행합니다.

Windows PowerShell:

```powershell
Set-Location frontend
Copy-Item .env.example .env.local
npm ci
npm run dev
```

macOS/Linux:

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다. 서버는 각 터미널에서 `Ctrl+C`로 종료합니다.

## 로컬 접속 주소

| 용도 | 주소 |
| --- | --- |
| 웹사이트 | [http://localhost:3000](http://localhost:3000) |
| Backend health | [http://localhost:8080/api/health](http://localhost:8080/api/health) |
| DB 연결 정보 | [http://localhost:8080/api/database/info](http://localhost:8080/api/database/info) |
| Swagger UI | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) |
| OpenAPI JSON | [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) |
| H2 Console | [http://localhost:8080/h2-console](http://localhost:8080/h2-console) |
| gRPC REST bridge | [http://localhost:8080/api/concepts/grpc/explain](http://localhost:8080/api/concepts/grpc/explain) |

H2 Console 접속 정보:

```text
JDBC URL: jdbc:h2:mem:lumoslab
User Name: sa
Password: 비워둠
```

H2는 메모리 DB이므로 백엔드를 종료하면 저장된 데이터가 초기화됩니다.

## 실행 흐름

```text
Browser
  -> Next.js frontend :3000
     -> Spring Boot REST API :8080
        -> H2 또는 Supabase PostgreSQL
        -> internal gRPC client
           -> gRPC server :9090
```

브라우저는 gRPC를 직접 호출하지 않습니다. Next.js가 REST API를 호출하고, 필요한 기능에서 Spring Boot 내부 gRPC 클라이언트가 protobuf 메시지를 사용합니다.

## 학습 콘텐츠

| 분야 | 화면 |
| --- | --- |
| Dashboard | `/dashboard` |
| 알고리즘 | `/`, `/search` |
| 자료구조 | `/datastructures/stack`, `/datastructures/queue`, `/datastructures/heap`, `/datastructures/graph` |
| Java 기초 | `/java/collections`, `/java/concurrency`, `/java/equality-exception`, `/java/io-string` |
| Spring·Backend | `/sync-async`, `/transactional`, `/grpc`, `/circuit-breaker`, `/spring-bean-di`, `/http-errors` |
| DB·성능 | `/backend/bulk-insert`, `/backend/db-index-transaction`, `/backend/redis-cache` |
| 인증 | `/backend/security-auth` |
| 메시징 | `/messaging/kafka`, `/messaging/kafka-config`, `/messaging/saga-outbox` |
| 디자인 패턴 | `/patterns`, `/patterns/strategy`, `/patterns/factory`, `/patterns/observer`, `/patterns/decorator`, `/patterns/command` |
| RAG·AI | `/rag/concepts`, `/rag/documents`, `/rag/vector-search`, `/rag/ask`, `/ai-concepts`, `/llm-app-structure` |
| Frontend | `/frontend-basics`, `/frontend/react`, `/frontend/nextjs` |
| 설계·테스트 | `/architecture`, `/testing-basics`, `/tdd`, `/dto-entity-vo`, `/rest-api-design` |
| 네트워크·API | `/api-vs-rest`, `/tcp-vs-udp` |
| 프로젝트 참고 | `/project-structure` |

각 화면에는 개념 설명, 비교표, 요청 예시 또는 API 실행 UI가 포함되어 있습니다.

`/api-vs-rest`에서는 REST·GraphQL·gRPC의 계약, 캐싱, 스트리밍, 요청 예시와 쇼핑몰 적용 기준을 비교합니다.

`/rag/concepts`에서는 RAG 계열 개념과 Naive·Advanced·Modular·Graph·Corrective·Self·Adaptive·Agentic RAG의 흐름, 적용 상황과 평가 기준을 정리합니다.

## 환경 설정

### 프론트엔드 API 주소

`frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

기본값도 `http://localhost:8080`이므로 일반적인 로컬 실행에서는 추가 변경이 필요하지 않습니다.

### Supabase PostgreSQL 사용

Supabase는 선택 사항입니다. `backend/.env.example`을 참고해 환경변수를 설정한 뒤 `supabase` 프로필로 실행합니다.

```powershell
Set-Location backend
$env:SPRING_PROFILES_ACTIVE = "supabase"
$env:SUPABASE_DB_URL = "jdbc:postgresql://..."
$env:SUPABASE_DB_USERNAME = "postgres.project-ref"
$env:SUPABASE_DB_PASSWORD = "your-password"
$env:LUMOS_LAB_JWT_SECRET = "change-this-secret"
.\gradlew.bat bootRun
```

비밀번호와 JWT 비밀값이 포함된 `.env` 파일은 Git에 커밋하지 않습니다.

## 검증

Backend:

```powershell
Set-Location backend
.\gradlew.bat test
```

Frontend:

```powershell
Set-Location frontend
npm ci
npm run lint
npm run build
```

GitHub Actions에서도 같은 백엔드 테스트와 프론트엔드 설치·lint·build를 수행합니다.

## 개발 환경 배포 구성

Spring 핵심 학습은 레퍼런스의 `/spring-bean-di`에 모았습니다. Bean·DI·IoC부터 Boot 시작·자동 구성·생명주기·AOP 내부 호출 함정까지 이어서 볼 수 있습니다.

레퍼런스 메뉴의 `/ci-cd`에서 커밋부터 스테이징 검증까지 실습 9개와 운영 주의점을 볼 수 있습니다. 기존 테스트 학습 화면과 연결되며, 실제 배포 실행 기능은 아닙니다. `/circuit-breaker`도 정적 개념 가이드이므로 레퍼런스에 배치합니다. 개념 실험에는 실행 결과를 확인하는 동기/비동기·트랜잭션·gRPC 화면을 둡니다.

`development` 브랜치와 다음 배포 구성이 준비되어 있습니다.

- GitHub Actions CI
- Backend·Frontend 컨테이너 이미지 빌드 및 GHCR 발행
- Kubernetes manifest: `backend/k8s/dev`, `frontend/k8s/dev`
- Argo CD Application: `backend/argocd/dev`, `frontend/argocd/dev`
- 개발 도메인: `lab.dev.lumosgraphy.com`, `api.lab.dev.lumosgraphy.com`

실제 개발 서버 배포에는 DNS, GHCR 접근 권한, Kubernetes Secret, Argo CD Application 등록이 별도로 필요합니다. DB는 서버에 직접 설치하지 않고 Supabase 접속 정보를 Secret으로 주입합니다.

## 문서

- [작업 이어가기 가이드](docs/continuation-guide.md)
- [DB·CRUD·JPA 확장 가이드](docs/future-db-crud-jpa.md)
- [공개 저장소 및 개발 배포 설계](docs/superpowers/specs/2026-08-22-lumos-lab-public-development-design.md)

## 이용 안내

이 저장소는 소스 열람과 직접 내려받아 실행하는 학습을 위해 공개되어 있습니다. 별도의 오픈소스 라이선스는 제공하지 않으며, 저장소가 공개되어 있다는 사실만으로 코드의 수정·재배포 권한이 부여되는 것은 아닙니다.
