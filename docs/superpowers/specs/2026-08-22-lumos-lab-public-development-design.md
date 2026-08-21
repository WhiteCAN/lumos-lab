# Lumos Lab 공개 저장소 및 개발 배포 설계

## 1. 목적

기존 Study Lab을 Lumos Lab으로 일관되게 변경하고, 현재의 `backend` / `frontend` / `docs` 구조와 학습 기능을 유지한다. 프로젝트는 GitHub 공개 저장소에서 누구나 내려받아 로컬로 실행할 수 있어야 하며, 기존 Lumos 프로젝트와 동일한 GitHub Actions, GHCR, Kubernetes, Argo CD 흐름으로 개발 서버에 배포할 수 있어야 한다.

## 2. 범위

### 포함

- 프로젝트 표시 이름과 저장소 이름을 `Lumos Lab` / `lumos-lab`으로 변경
- Java 기본 패키지를 `com.study.lab`에서 `com.lumos.lab`으로 변경
- gRPC proto 패키지, 서비스 식별자, 테마 저장 키 등 내부 식별자를 새 이름에 맞게 변경
- 루트 Git 저장소와 공개 저장소용 제외 규칙 구성
- 개인 PC 절대 경로와 로컬 전용 파일을 공개 문서 및 추적 대상에서 제거
- 로컬 실행 환경과 개발 서버 환경을 분리
- backend/frontend 컨테이너 이미지와 Kubernetes/Argo CD 개발 배포 설정 추가
- GitHub Actions에서 검증 및 GHCR 이미지 발행 구성
- 공개 사용자를 위한 한글 README 정비

### 제외

- 기존 학습 페이지, API, 데이터 구조의 재설계
- `backend`, `frontend`, `docs` 최상위 구조 변경
- Docker Compose 도입
- 운영 환경 배포
- GitHub 원격 저장소 생성, DNS 변경, Kubernetes Secret 값 등록 및 Argo CD 실제 적용
- Lumos 프로젝트의 도메인 코드, 데이터 또는 비밀값 복사

## 3. 기존 구조 유지

```text
lumos-lab/
├─ backend/    Spring Boot REST API, gRPC, JPA 학습 기능
├─ frontend/   Next.js App Router 학습 화면
└─ docs/       프로젝트 문서
```

배포 파일은 각 애플리케이션의 소유권이 드러나도록 `backend`와 `frontend` 내부에 둔다.

```text
backend/
├─ Dockerfile
├─ k8s/dev/
└─ argocd/dev/

frontend/
├─ Dockerfile
├─ k8s/dev/
└─ argocd/dev/
```

공통 CI 워크플로는 루트 `.github/workflows/`에 둔다.

## 4. 이름 변경

- 화면 및 문서 표시 이름: `Lumos Lab`
- 폴더 및 GitHub 저장소 이름: `lumos-lab`
- 백엔드 애플리케이션 이름: `lumos-lab-backend`
- 프런트엔드 패키지 및 서비스 이름: `lumos-lab-frontend`
- Java 패키지: `com.lumos.lab`
- proto Java 패키지: `com.lumos.lab.grpc.proto`
- 내부 학습 URI와 브라우저 저장 키도 `lumos-lab` 접두어를 사용한다.

기존 API 경로와 화면 URL은 호환성을 위해 변경하지 않는다.

## 5. 로컬 실행 환경

### 필수 도구

- Java 21
- 프로젝트에 포함된 Gradle Wrapper
- Node.js 22 LTS
- npm

현재 개발 PC의 Node.js가 24 계열이더라도 공개 프로젝트의 기준 버전은 Lumos 배포 환경과 맞춘 Node.js 22 LTS로 문서화한다. 저장소 루트에 버전 힌트를 제공한다.

### 데이터베이스

기본 프로필은 현재와 같이 H2 인메모리 DB를 사용한다. 따라서 공개 저장소 사용자는 PostgreSQL이나 MariaDB를 설치하지 않고 백엔드를 실행할 수 있다. 애플리케이션을 재시작하면 H2 데이터가 초기화되는 학습 환경임을 README에 명시한다.

Supabase PostgreSQL은 선택형 개발 서버 프로필로 유지한다. 접속 URL, 사용자명, 비밀번호, 풀 크기는 환경변수로만 제공하며 실제 값은 저장소에 포함하지 않는다.

### 실행 방식

Docker Compose 없이 터미널 두 개에서 Gradle과 npm 명령으로 backend와 frontend를 직접 실행한다. README 명령은 특정 사용자 절대 경로가 아닌 저장소 루트 기준 상대 경로를 사용한다.

## 6. 공개 저장소 안전성

루트 `.gitignore`는 다음을 제외한다.

- IntelliJ IDEA 및 에디터 개인 설정
- Gradle 캐시와 빌드 결과
- `node_modules`, `.next`, 프런트엔드 빌드 결과
- 로그와 임시 파일
- `.env`, `.env.local` 등 실제 환경 파일
- 개인 데이터소스 설정과 인증서

실제 설정 파일 대신 필요한 키만 설명하는 `.env.example`을 유지한다. 하드코딩된 학습용 JWT 비밀값도 환경변수로 이동하고, 로컬 전용 기본값은 실제 인증 용도로 사용할 수 없음을 명시한다. 공개 개발 서버에서는 Kubernetes Secret으로 값을 주입한다.

첫 공개 커밋 전에 비밀값 패턴, 개인 절대 경로, 빌드 산출물이 추적 대상에 포함되지 않았는지 검사한다.

## 7. 개발 서버 배포

### 이미지

- backend: Java 21 빌드 단계와 JRE 21 실행 단계로 구성한 다단계 이미지
- frontend: Node.js 22 기반 다단계 이미지
- 이미지 주소: `ghcr.io/whitecan/lumos-lab-backend`, `ghcr.io/whitecan/lumos-lab-frontend`
- 이미지 태그: Git 커밋 SHA

### Kubernetes

개발 환경은 `lumos-lab-dev` 네임스페이스를 사용한다. backend와 frontend를 각각 Deployment와 ClusterIP Service로 실행한다. 프런트엔드는 서버 내부 환경변수로 backend Service를 호출한다.

Ingress 호스트는 실제 DNS 확정 전까지 명시적인 교체 항목으로 관리한다. 매니페스트에는 비밀값 원문을 넣지 않고 사전에 등록된 Kubernetes Secret 참조만 둔다.

backend는 Kubernetes health probe가 사용할 Actuator health endpoint를 제공하고, frontend도 HTTP probe를 둔다. gRPC 포트는 backend Pod 내부 기능에 필요한 범위만 노출하고 외부 Ingress에는 공개하지 않는다.

### Argo CD

하나의 GitHub 모노레포의 `development` 브랜치를 참조하는 backend/frontend Application을 둔다. 각 Application은 해당 `k8s/dev` 경로를 동기화하며 자동 동기화, self-heal, prune 정책을 사용한다. Argo CD Image Updater가 GHCR의 커밋 SHA 태그를 추적한다.

## 8. CI/CD

Pull Request와 주요 브랜치 push에서 다음을 검증한다.

- backend: Gradle 테스트
- frontend: ESLint와 Next.js production build

`development` 브랜치 push에서는 검증 성공 후 변경된 애플리케이션 이미지를 GHCR에 발행한다. backend와 frontend 경로 필터를 사용해 불필요한 이미지 빌드를 줄인다. 워크플로 권한은 `contents: read`, `packages: write`로 제한한다.

## 9. 오류 처리와 운영 안전장치

- 프런트엔드는 개발 서버용 backend 주소가 없을 때 빌드 단계에서 비밀값을 요구하지 않는다.
- backend는 기본 H2 프로필로 독립 실행 가능해야 한다.
- Supabase 프로필에서 필수 환경변수가 없으면 조용히 잘못된 DB에 연결하지 않고 시작에 실패하도록 유지한다.
- 배포 probe 실패 시 Kubernetes가 준비되지 않은 Pod로 트래픽을 보내지 않게 한다.
- 공개된 학습용 인증 API는 실제 사용자 인증이나 중요 데이터 보호에 사용하지 않는다는 제한을 문서화한다.

## 10. 검증 기준

작업 완료 조건은 다음과 같다.

1. `Study Lab`, `study-lab`, `com.study.lab`의 의도하지 않은 잔여 참조가 없다.
2. Java 21로 `backend\\gradlew.bat test`가 통과한다.
3. `frontend`에서 `npm run lint`와 `npm run build`가 통과한다.
4. 기본 H2 프로필로 backend가 기동되고 health endpoint가 응답한다.
5. frontend가 로컬 backend 주소로 API를 호출할 수 있다.
6. Git 추적 후보에 `.env.local`, `.idea`, `.next`, `node_modules`, `build`, 로그가 포함되지 않는다.
7. Kubernetes 및 Argo CD YAML을 로컬 도구로 가능한 범위에서 구문 검증한다.
8. README만 보고 새 사용자가 DB 설치 없이 로컬 실행 절차를 이해할 수 있다.

## 11. 외부 적용 전 필요한 값

실제 개발 서버 적용에는 다음 값이 별도로 필요하다.

- GitHub 공개 저장소 URL
- frontend와 backend 개발 도메인
- GHCR 공개 또는 pull secret 정책
- Supabase 접속정보가 담긴 Kubernetes Secret 이름과 키
- Argo CD에 저장소 접근 권한이 필요한 경우 해당 credential

이 값이 확정되지 않아도 저장소 내 배포 템플릿과 검증까지는 완료할 수 있다. 실제 GitHub 저장소 생성, DNS 및 클러스터 변경은 별도 승인 후 수행한다.
