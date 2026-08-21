# Lumos Lab Public Repository and Development Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 Study Lab의 기능과 `backend` / `frontend` / `docs` 구조를 유지하면서 Lumos Lab으로 일관되게 이름을 바꾸고, 공개 GitHub 저장소의 로컬 실행과 Lumos 방식 개발 배포를 준비한다.

**Architecture:** 하나의 Git 저장소 안에서 Spring Boot backend와 Next.js frontend를 독립적으로 빌드하고 검증한다. 로컬 backend는 H2 인메모리 DB를 기본으로 사용하고 개발 서버는 Supabase PostgreSQL 환경변수를 사용하며, 각 앱의 컨테이너 이미지를 GHCR에 게시해 Kubernetes/Argo CD가 배포한다.

**Tech Stack:** Java 21, Spring Boot 4, Gradle Wrapper, H2, PostgreSQL, gRPC, Node.js 22, Next.js 16, React 19, TypeScript, GitHub Actions, GHCR, Kubernetes, Kustomize, Argo CD

**Spec:** `docs/superpowers/specs/2026-08-22-lumos-lab-public-development-design.md`

## Global Constraints

- 기존 `backend`, `frontend`, `docs` 최상위 구조와 API/화면 URL을 유지한다.
- Docker Compose는 로컬과 개발 서버 모두 사용하지 않는다.
- 로컬 기본 DB는 설치가 필요 없는 H2 인메모리 DB다.
- 개발 DB 접속정보와 JWT secret은 환경변수 및 Kubernetes Secret으로만 주입한다.
- 공개 저장소에 `.env.local`, `.idea`, `.next`, `node_modules`, `build`, 로그, 개인 절대 경로를 포함하지 않는다.
- 기준 런타임은 Java 21과 Node.js 22 LTS다.
- 실제 GitHub 저장소 생성, DNS 변경, Kubernetes Secret 등록, Argo CD 적용은 이 계획의 로컬 변경 범위에 포함하지 않는다.
- 커밋 메시지는 한글로 작성한다.

---

### Task 1: 공개 Git 저장소 기준선 구성

**Files:**
- Create: `.gitignore`
- Create: `.gitattributes`
- Create: `.nvmrc`
- Create: `AGENTS.md`
- Modify: `frontend/.gitignore`
- Track: `README.md`, `backend/**`, `frontend/**`, `docs/**`

**Interfaces:**
- Consumes: 현재 루트 Git 저장소와 하위 프로젝트별 ignore 규칙
- Produces: 안전하게 `git add .`을 실행할 수 있는 공개 저장소 기준선과 Java 21/Node 22 개발 규칙

- [ ] **Step 1: 현재 공개 제외 검사를 실행해 실패를 확인한다**

Run:

```powershell
git check-ignore .idea/workspace.xml
git check-ignore .fastRequest/config/fastRequestCurrentProjectConfig.json
```

Expected: 루트 `.gitignore`가 없으므로 두 명령 중 하나 이상이 exit code 1을 반환한다.

- [ ] **Step 2: 루트 공개 제외 및 줄바꿈 규칙을 작성한다**

`.gitignore`에 다음 범주를 명시한다.

```gitignore
.idea/
.fastRequest/
.vscode/
**/.gradle/
**/build/
**/out/
**/node_modules/
**/.next/
**/coverage/
**/.env
**/.env.*
!**/.env.example
*.log
*.pem
*.p12
*.jks
.DS_Store
Thumbs.db
```

`.gitattributes`에는 `* text=auto`, `*.bat text eol=crlf`, `*.sh text eol=lf`를 둔다. `.nvmrc`에는 `22`를 기록한다. 루트 `AGENTS.md`에는 기존 구조 유지, Java 21, Node 22, 변경 후 backend test와 frontend lint/build, 관련 문서 업데이트 규칙을 한글로 기록한다. `frontend/.gitignore`에는 `!.env.example` 예외를 추가한다.

- [ ] **Step 3: 제외 규칙과 추적 후보를 검증한다**

Run:

```powershell
git check-ignore .idea/workspace.xml
git check-ignore .fastRequest/config/fastRequestCurrentProjectConfig.json
git check-ignore frontend/.env.local
git check-ignore frontend/.next/trace
git check-ignore backend/build/test-results/test
git add --dry-run .
```

Expected: 첫 다섯 명령이 성공하고 dry-run 출력에 `.idea`, `.fastRequest`, `.env.local`, `.next`, `node_modules`, `.gradle`, `build`, `*.log`가 없다.

- [ ] **Step 4: 현재 소스 기준선을 커밋한다**

Run:

```powershell
git add .
git status --short
git commit -m "구성: Lumos Lab 공개 저장소 기준선 추가"
```

Expected: 공개 제외 대상 없이 기존 backend/frontend/docs 소스와 구성 파일이 커밋된다.

---

### Task 2: backend 이름과 Java 패키지 변경

**Files:**
- Modify: `backend/build.gradle`
- Modify: `backend/settings.gradle`
- Modify: `backend/src/main/resources/application.properties`
- Rename: `backend/src/main/proto/study_lab.proto` → `backend/src/main/proto/lumos_lab.proto`
- Move: `backend/src/main/java/com/study/lab/**` → `backend/src/main/java/com/lumos/lab/**`
- Move: `backend/src/test/java/com/study/lab/**` → `backend/src/test/java/com/lumos/lab/**`
- Modify: all moved Java source package/import declarations
- Modify: `backend/src/main/java/com/lumos/lab/health/HealthController.java`
- Test: `backend/src/test/java/com/lumos/lab/BackendApplicationTests.java`

**Interfaces:**
- Consumes: 기존 API URL, Spring component scan, proto `ConceptService` 계약
- Produces: `com.lumos.lab` Java namespace, `com.lumos.lab.grpc.proto` generated types, `lumos-lab-backend` service identity

- [ ] **Step 1: 애플리케이션 이름 회귀 테스트를 먼저 추가한다**

`BackendApplicationTests`에 다음 필드를 추가한다.

```java
@Value("${spring.application.name}")
private String applicationName;

@Test
void applicationNameIsLumosLabBackend() {
    assertThat(applicationName).isEqualTo("lumos-lab-backend");
}
```

`org.springframework.beans.factory.annotation.Value`, `org.junit.jupiter.api.Test`, `org.assertj.core.api.Assertions.assertThat` import를 추가한다.

- [ ] **Step 2: 새 테스트가 현재 이름 때문에 실패하는지 확인한다**

Run:

```powershell
$env:JAVA_HOME='C:\workspace\jdk-21'
Set-Location backend
.\gradlew.bat test --tests com.study.lab.BackendApplicationTests
```

Expected: `backend`가 `lumos-lab-backend`와 같지 않다는 assertion failure가 발생한다.

- [ ] **Step 3: backend 식별자와 패키지를 일괄 변경한다**

다음 매핑을 소스와 테스트에 기계적으로 적용한다.

```text
com.study.lab             -> com.lumos.lab
study.lab.grpc            -> lumos.lab.grpc
StudyLabProto             -> LumosLabProto
study-lab-backend         -> lumos-lab-backend
Study Lab Backend         -> Lumos Lab Backend
study-lab://              -> lumos-lab://
```

Java main/test 디렉터리를 `com/lumos/lab`으로 이동하고 빈 `com/study` 경로를 제거한다. proto 파일을 `lumos_lab.proto`로 이동한다. `settings.gradle`의 root project name, `build.gradle` description, `application.properties`의 application name, health 응답의 service 이름을 변경한다. API 경로는 변경하지 않는다.

- [ ] **Step 4: 새 패키지 테스트와 잔여 참조 검사를 실행한다**

Run:

```powershell
$env:JAVA_HOME='C:\workspace\jdk-21'
Set-Location backend
.\gradlew.bat clean test --tests com.lumos.lab.BackendApplicationTests
Set-Location ..
rg -n "com\.study\.lab|study\.lab\.grpc|StudyLabProto|study-lab-backend" backend -g '!backend/build/**' -g '!backend/.gradle/**'
```

Expected: 테스트가 통과하고 `rg` 결과가 없다.

- [ ] **Step 5: backend 이름 변경을 커밋한다**

Run:

```powershell
git add backend
git commit -m "변경: backend를 Lumos Lab 이름으로 통일"
```

---

### Task 3: 학습용 JWT secret 외부화

**Files:**
- Modify: `backend/src/main/java/com/lumos/lab/concept/securityauth/SecurityAuthService.java`
- Modify: `backend/src/main/resources/application.properties`
- Modify: `backend/.env.example`
- Create: `backend/src/test/java/com/lumos/lab/concept/securityauth/SecurityAuthServiceTest.java`

**Interfaces:**
- Consumes: `SecurityAuthService.login(JwtLoginRequest)` 및 `accessProtected(String, String)`
- Produces: 생성자 `SecurityAuthService(String secret)`, 속성 `app.security.jwt-secret`, 환경변수 `LUMOS_LAB_JWT_SECRET`

- [ ] **Step 1: 서로 다른 secret의 토큰을 교차 검증할 수 없다는 테스트를 작성한다**

```java
package com.lumos.lab.concept.securityauth;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SecurityAuthServiceTest {

    @Test
    void tokenSignedByAnotherSecretIsRejected() {
        SecurityAuthService issuer = new SecurityAuthService("issuer-secret-for-test");
        SecurityAuthService verifier = new SecurityAuthService("verifier-secret-for-test");
        AuthTokenResponse token = issuer.login(new JwtLoginRequest("demo", "password", "USER", 300));

        assertThatThrownBy(() -> verifier.accessProtected("Bearer " + token.accessToken(), "USER"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("signature");
    }
}
```

- [ ] **Step 2: 생성자 미지원으로 테스트가 실패하는지 확인한다**

Run:

```powershell
Set-Location backend
.\gradlew.bat test --tests com.lumos.lab.concept.securityauth.SecurityAuthServiceTest
```

Expected: `SecurityAuthService(String)` 생성자가 없어 test compilation이 실패한다.

- [ ] **Step 3: secret을 Spring 속성으로 주입한다**

`SecurityAuthService`의 상수를 인스턴스 필드로 바꾸고 다음 생성자를 추가한다.

```java
public SecurityAuthService(@Value("${app.security.jwt-secret}") String secret) {
    if (secret == null || secret.isBlank()) {
        throw new IllegalArgumentException("JWT secret must not be blank");
    }
    this.secret = secret;
}
```

서명 메서드는 `secret` 필드를 사용한다. issuer는 `lumos-lab`으로 변경한다. `application.properties`에는 다음 값을 추가한다.

```properties
app.security.jwt-secret=${LUMOS_LAB_JWT_SECRET:lumos-lab-local-only-secret-change-me}
```

`backend/.env.example`에는 실제 값 없이 `LUMOS_LAB_JWT_SECRET=change-me-for-development` 예시를 추가한다.

- [ ] **Step 4: 보안 테스트와 전체 backend 테스트를 실행한다**

Run:

```powershell
Set-Location backend
.\gradlew.bat test --tests com.lumos.lab.concept.securityauth.SecurityAuthServiceTest
.\gradlew.bat test
```

Expected: 두 명령이 모두 성공한다.

- [ ] **Step 5: secret 외부화를 커밋한다**

Run:

```powershell
git add backend
git commit -m "보안: 학습용 JWT 비밀값을 환경변수로 분리"
```

---

### Task 4: frontend 명칭과 환경 설정 변경

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/package-lock.json`
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/components/app-sidebar.tsx`
- Modify: `frontend/src/components/theme-provider.tsx`
- Create: `frontend/.env.example`
- Modify: frontend source files containing `Study Lab` or `study-lab`

**Interfaces:**
- Consumes: 기존 `NEXT_PUBLIC_API_BASE_URL` 기반 API 호출
- Produces: `lumos-lab-frontend` package identity, `Lumos Lab` metadata/UI, 환경별 `NEXT_PUBLIC_API_BASE_URL`

- [ ] **Step 1: 현재 frontend 이름 참조를 기준선으로 기록한다**

Run:

```powershell
rg -n "Study Lab|study-lab" frontend -g '!frontend/node_modules/**' -g '!frontend/.next/**'
```

Expected: package metadata, layout, sidebar, theme storage key 및 문서의 기존 이름이 출력된다.

- [ ] **Step 2: 표시 이름과 내부 브라우저 키를 변경한다**

다음 매핑을 frontend source, package metadata와 문서에 적용한다.

```text
Study Lab              -> Lumos Lab
study-lab-theme        -> lumos-lab-theme
"name": "frontend"   -> "name": "lumos-lab-frontend"
```

`npm install --package-lock-only`로 lockfile의 root package 이름을 동기화한다. 기존 라우트와 메뉴 순서는 유지한다.

- [ ] **Step 3: 공개 환경변수 예시를 추가한다**

`frontend/.env.example`을 다음 내용으로 생성한다.

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

개발 배포 이미지에서는 `https://api.lab.dev.lumosgraphy.com`을 build argument로 주입한다.

- [ ] **Step 4: frontend 검증과 잔여 이름 검사를 실행한다**

Run:

```powershell
Set-Location frontend
npm run lint
npm run build
Set-Location ..
rg -n "Study Lab|study-lab-theme|\"name\": \"frontend\"" frontend -g '!frontend/node_modules/**' -g '!frontend/.next/**'
```

Expected: lint/build가 성공하고 `rg` 결과가 없다.

- [ ] **Step 5: frontend 변경을 커밋한다**

Run:

```powershell
git add frontend
git commit -m "변경: frontend를 Lumos Lab 이름으로 통일"
```

---

### Task 5: backend/frontend 컨테이너 이미지 구성

**Files:**
- Create: `backend/Dockerfile`
- Create: `backend/.dockerignore`
- Create: `frontend/Dockerfile`
- Create: `frontend/.dockerignore`
- Modify: `frontend/next.config.ts`

**Interfaces:**
- Consumes: `backend/gradlew`, backend bootJar, frontend `npm ci`/`npm run build`
- Produces: port 8080/9090 backend image와 port 3000 Next standalone image

- [ ] **Step 1: backend 다단계 Dockerfile을 작성한다**

builder는 `eclipse-temurin:21-jdk`, runner는 `eclipse-temurin:21-jre`를 사용한다. builder에서 Gradle Wrapper로 `bootJar --no-daemon`을 실행하고 runner는 `/app/app.jar`를 `java -jar`로 실행한다. `8080`, `9090`을 expose하고 non-root user `app`으로 실행한다.

`.dockerignore`는 `.gradle`, `build`, `.env*`, `*.log`, `.idea`를 제외하되 `.env.example`은 이미지에 복사하지 않는다.

- [ ] **Step 2: frontend standalone Dockerfile을 작성한다**

`next.config.ts`에 `output: "standalone"`을 설정한다. Dockerfile의 deps/builder/runner 단계는 `node:22-alpine`을 사용하고 `NEXT_PUBLIC_API_BASE_URL` build argument 기본값을 `http://localhost:8080`으로 둔다. runner는 non-root `nextjs` 사용자로 `.next/standalone`, `.next/static`, `public`을 실행하며 port 3000을 expose한다.

`.dockerignore`는 `node_modules`, `.next`, `.env*`, 로그, `.idea`를 제외한다.

- [ ] **Step 3: 로컬 Docker 사용 가능 여부에 따라 이미지를 검증한다**

Run:

```powershell
docker version
docker build -t lumos-lab-backend:test backend
docker build --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.lab.dev.lumosgraphy.com -t lumos-lab-frontend:test frontend
```

Expected: Docker Engine이 있으면 두 이미지가 성공적으로 빌드된다. Engine이 없는 경우 `backend` Gradle test와 `frontend` production build를 대신 재실행하고, 실제 이미지 빌드는 GitHub Actions 검증 항목으로 남긴다.

- [ ] **Step 4: 이미지 구성을 커밋한다**

Run:

```powershell
git add backend/Dockerfile backend/.dockerignore frontend/Dockerfile frontend/.dockerignore frontend/next.config.ts
git commit -m "배포: backend와 frontend 컨테이너 이미지 구성"
```

---

### Task 6: GitHub Actions 검증 및 GHCR 발행 구성

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/publish-images.yml`

**Interfaces:**
- Consumes: Java 21 Gradle test, Node 22 npm lint/build, backend/frontend Dockerfile
- Produces: PR 검증과 SHA 태그 `ghcr.io/whitecan/lumos-lab-{backend,frontend}` 이미지

- [ ] **Step 1: PR 및 push CI 워크플로를 작성한다**

`ci.yml`은 `pull_request`와 `main`, `development` push에서 실행한다. backend job은 `actions/checkout@v4`, `actions/setup-java@v4` Temurin 21, `./gradlew test`를 사용한다. frontend job은 `actions/setup-node@v4` Node 22와 npm cache, `npm ci`, `npm run lint`, `npm run build`를 사용하며 working-directory를 각각 지정한다.

- [ ] **Step 2: development 이미지 발행 워크플로를 작성한다**

`publish-images.yml`은 `development` push와 수동 실행에서 동작한다. 권한은 `contents: read`, `packages: write`로 제한한다. `docker/login-action@v3`, `docker/setup-buildx-action@v3`, `docker/build-push-action@v6`를 사용해 backend/frontend 이미지를 커밋 SHA 태그로 push한다. frontend build args에는 다음 값을 넣는다.

```text
NEXT_PUBLIC_API_BASE_URL=https://api.lab.dev.lumosgraphy.com
```

- [ ] **Step 3: 워크플로 구조와 참조 파일을 검사한다**

Run:

```powershell
rg -n "actions/checkout@v4|actions/setup-java@v4|java-version: '21'|actions/setup-node@v4|node-version: '22'" .github/workflows/ci.yml
rg -n "packages: write|docker/login-action@v3|docker/build-push-action@v6|ghcr.io/whitecan/lumos-lab-backend|ghcr.io/whitecan/lumos-lab-frontend" .github/workflows/publish-images.yml
Test-Path backend/Dockerfile
Test-Path frontend/Dockerfile
```

Expected: 모든 패턴과 파일이 확인된다.

- [ ] **Step 4: CI/CD 구성을 커밋한다**

Run:

```powershell
git add .github
git commit -m "배포: GitHub Actions 검증과 GHCR 발행 추가"
```

---

### Task 7: Kubernetes 및 Argo CD 개발 배포 구성

**Files:**
- Create: `backend/k8s/dev/namespace.yaml`
- Create: `backend/k8s/dev/deployment.yaml`
- Create: `backend/k8s/dev/service.yaml`
- Create: `backend/k8s/dev/ingress.yaml`
- Create: `backend/k8s/dev/kustomization.yaml`
- Create: `backend/argocd/dev/application.yaml`
- Create: `frontend/k8s/dev/deployment.yaml`
- Create: `frontend/k8s/dev/service.yaml`
- Create: `frontend/k8s/dev/ingress.yaml`
- Create: `frontend/k8s/dev/kustomization.yaml`
- Create: `frontend/argocd/dev/application.yaml`

**Interfaces:**
- Consumes: GHCR images, repository `https://github.com/WhiteCAN/lumos-lab.git`, branch `development`
- Produces: `lumos-lab-dev` namespace의 backend/frontend Deployments, Services, Ingresses와 Argo CD Applications

- [ ] **Step 1: 공통 namespace와 backend 리소스를 작성한다**

`lumos-lab-dev` namespace를 생성한다. backend Deployment는 `ghcr.io/whitecan/lumos-lab-backend` 이미지, ports 8080/9090, profile `supabase`, CORS origin `https://lab.dev.lumosgraphy.com`, `lumos-lab-backend-secret`의 `SUPABASE_DB_URL`, `SUPABASE_DB_USERNAME`, `SUPABASE_DB_PASSWORD`, `SUPABASE_DB_POOL_SIZE`, `LUMOS_LAB_JWT_SECRET` 키를 사용한다. `/actuator/health` readiness/liveness probe와 보수적인 CPU/memory request/limit를 둔다. Service는 HTTP 80→8080과 내부 gRPC 9090→9090을 제공한다. Ingress는 `api.lab.dev.lumosgraphy.com`과 cert-manager TLS를 사용하고 HTTP만 외부에 노출한다.

- [ ] **Step 2: frontend 리소스를 작성한다**

frontend Deployment는 `ghcr.io/whitecan/lumos-lab-frontend` 이미지와 port 3000을 사용한다. `/` HTTP readiness/liveness probe를 둔다. Service는 80→3000으로 연결한다. Ingress는 `lab.dev.lumosgraphy.com`과 cert-manager TLS를 사용한다. namespace 파일은 backend kustomization에서만 생성하고 frontend kustomization은 같은 namespace를 참조한다.

- [ ] **Step 3: Argo CD Applications를 작성한다**

backend application name은 `lumos-lab-backend-dev`, source path는 `backend/k8s/dev`로 한다. frontend는 `lumos-lab-frontend-dev`, path `frontend/k8s/dev`로 한다. 둘 다 repository `https://github.com/WhiteCAN/lumos-lab.git`, revision `development`, destination namespace `lumos-lab-dev`, automated prune/selfHeal을 사용한다. Image Updater annotation은 각 GHCR 이미지와 SHA 태그 정규식 `^[0-9a-f]{7,40}$`을 사용한다.

- [ ] **Step 4: Kustomize 렌더링과 비밀값 원문 부재를 검증한다**

Run:

```powershell
kubectl kustomize backend/k8s/dev
kubectl kustomize frontend/k8s/dev
rg -n "password:|secret:|SUPABASE_DB_PASSWORD=.*|LUMOS_LAB_JWT_SECRET=.*" backend/k8s frontend/k8s
```

Expected: 두 kustomization이 YAML을 렌더링하고, 마지막 검색에 비밀값 원문이 없다. `kubectl`이 설치되지 않았다면 `kustomize build`로 같은 두 경로를 검증한다.

- [ ] **Step 5: 개발 배포 템플릿을 커밋한다**

Run:

```powershell
git add backend/k8s backend/argocd frontend/k8s frontend/argocd
git commit -m "배포: Lumos Lab 개발 Kubernetes와 Argo CD 구성"
```

---

### Task 8: 공개 README와 프로젝트 문서 정리

**Files:**
- Modify: `README.md`
- Modify: `frontend/README.md`
- Modify: `frontend/AGENTS.md`
- Modify: `docs/continuation-guide.md`
- Modify: `docs/future-db-crud-jpa.md`
- Modify: `docs/superpowers/specs/2026-08-22-lumos-lab-public-development-design.md`

**Interfaces:**
- Consumes: 확정된 Java/Node 버전, H2/Supabase 프로필, 로컬 명령, 배포 경로
- Produces: 공개 사용자가 DB 설치 없이 재현 가능한 한글 실행 문서와 개발 배포 제약 설명

- [ ] **Step 1: 루트 README를 Lumos Lab 기준으로 수정한다**

README 첫 부분에 학습·실험용이며 실제 인증/운영 보안 구현의 참고본이 아니라는 제한을 명시한다. 다음 실행 절차를 저장소 상대 경로로 제공한다.

```powershell
git clone https://github.com/WhiteCAN/lumos-lab.git
cd lumos-lab\backend
.\gradlew.bat bootRun
```

```powershell
cd lumos-lab\frontend
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Java 21, Node 22, 기본 H2는 DB 설치 불필요, H2 재시작 시 초기화, Supabase는 선택형 개발 프로필, Docker Compose 미사용을 설명한다. 개발 배포는 GitHub Actions → GHCR → Argo CD → Kubernetes 순서와 실제 외부 설정이 필요한 항목을 기록한다.

- [ ] **Step 2: 내부 문서와 에이전트 지침의 이름 및 절대 경로를 정리한다**

`Study Lab`은 `Lumos Lab`, `study-lab`은 `lumos-lab`, `com.study.lab`은 `com.lumos.lab`으로 변경한다. `C:\Users\skw0329\...` 형태의 개인 절대 경로는 저장소 상대 경로 또는 일반 명령으로 교체한다. 학습 API/화면 URL은 유지한다.

- [ ] **Step 3: 이름, 경로, 비밀값 및 추적 대상 검사를 실행한다**

Run:

```powershell
rg -n "Study Lab|study-lab|com\.study\.lab|C:\\Users\\skw0329" . -g '!.git/**' -g '!backend/build/**' -g '!backend/.gradle/**' -g '!frontend/node_modules/**' -g '!frontend/.next/**'
git status --short --ignored
git ls-files | rg "(^|/)(\.env|\.env\.local|\.idea|\.next|node_modules|build|\.gradle)(/|$)|\.log$"
```

Expected: 첫 검색에는 과거 명칭을 설명하는 설계 문서의 변경 매핑 외에 의도하지 않은 결과가 없고, `git ls-files` 검색 결과가 없다.

- [ ] **Step 4: 전체 검증을 실행한다**

Run:

```powershell
$env:JAVA_HOME='C:\workspace\jdk-21'
Set-Location backend
.\gradlew.bat clean test
Set-Location ..\frontend
npm ci
npm run lint
npm run build
Set-Location ..
```

Expected: Gradle test, ESLint, Next production build가 모두 성공한다.

- [ ] **Step 5: 문서와 최종 상태를 커밋한다**

Run:

```powershell
git add README.md frontend/README.md frontend/AGENTS.md docs
git commit -m "문서: Lumos Lab 공개 실행과 개발 배포 안내 정리"
git status --short
```

Expected: 커밋 후 working tree가 clean이다.

---

### Task 9: 프로젝트 폴더 이름 변경 및 최종 확인

**Files:**
- Move directory: `C:\Users\skw0329\IdeaProjects\study-lab` → `C:\Users\skw0329\IdeaProjects\lumos-lab`

**Interfaces:**
- Consumes: clean Git working tree와 새 프로젝트 이름
- Produces: 실제 로컬 프로젝트 경로 `C:\Users\skw0329\IdeaProjects\lumos-lab`

- [ ] **Step 1: 이동 전 절대 경로와 대상 충돌을 검증한다**

Run from `C:\Users\skw0329\IdeaProjects`:

```powershell
$sourcePath = (Resolve-Path -LiteralPath 'C:\Users\skw0329\IdeaProjects\study-lab').Path
$targetPath = 'C:\Users\skw0329\IdeaProjects\lumos-lab'
$sourcePath
$targetPath
Test-Path -LiteralPath $targetPath
git -C $sourcePath status --short
```

Expected: source가 정확히 `study-lab`, target이 같은 `IdeaProjects` 아래 `lumos-lab`, target은 존재하지 않고 Git 상태는 clean이다.

- [ ] **Step 2: 프로젝트 폴더를 이동한다**

```powershell
Move-Item -LiteralPath 'C:\Users\skw0329\IdeaProjects\study-lab' -Destination 'C:\Users\skw0329\IdeaProjects\lumos-lab'
```

- [ ] **Step 3: 새 경로의 저장소와 최종 이름을 확인한다**

Run:

```powershell
git -C 'C:\Users\skw0329\IdeaProjects\lumos-lab' status --short --branch
git -C 'C:\Users\skw0329\IdeaProjects\lumos-lab' log --oneline -10
rg -n "Study Lab|study-lab|com\.study\.lab|C:\\Users\\skw0329" 'C:\Users\skw0329\IdeaProjects\lumos-lab' -g '!.git/**' -g '!backend/build/**' -g '!backend/.gradle/**' -g '!frontend/node_modules/**' -g '!frontend/.next/**'
```

Expected: branch는 main이고 clean하며, 과거 명칭을 설명하는 설계/계획 문서 외에 의도하지 않은 기존 이름이나 개인 절대 경로가 없다.

---

## Final Verification Checklist

- [ ] Java 21 backend 전체 테스트 통과
- [ ] frontend `npm run lint` 통과
- [ ] frontend production build 통과
- [ ] 기본 H2 프로필에서 별도 DB 설치가 필요하지 않음
- [ ] 실제 환경 파일과 빌드 산출물이 Git 추적 대상이 아님
- [ ] backend/frontend Kustomize 렌더링 성공
- [ ] Docker Engine 사용 가능 시 backend/frontend 이미지 빌드 성공
- [ ] 공개 README에 한글 로컬 실행 및 개발 배포 제약이 명시됨
- [ ] 프로젝트 폴더와 표시 이름이 Lumos Lab으로 변경됨
