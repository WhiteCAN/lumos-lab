# 로컬 및 개발계 DB 설정

## 환경 구분

| 프로필 | DB | 스키마 변경 | 비밀값 |
| --- | --- | --- | --- |
| `local` (기본) | H2 메모리 DB | Hibernate `update` | 로컬 전용 기본값 |
| `dev` | 기존 Lumos MariaDB / `LUMOS_LAB` | 검토한 SQL 적용, Hibernate `validate` | 환경변수 / Kubernetes Secret 필수 |
| `supabase` (기존 선택 기능) | PostgreSQL | 기존 `update` 유지 | `SUPABASE_DB_*`, JWT 환경변수 |

`application.properties`는 공통 설정, `application-local.properties`와 `application-dev.properties`는 환경별 설정입니다. 개발계는 H2나 로컬 JWT 비밀값으로 대체하지 않습니다. Hikari catalog와 Hibernate default catalog를 `LUMOS_LAB`으로 지정합니다.

## 2026-09-24 적용 결과

- 기존 Lumos MariaDB에 `LUMOS_LAB` 스키마를 생성했습니다.
- 문자셋은 `utf8mb4`, collation은 `utf8mb4_unicode_ci`입니다.
- `transaction_log`, `bulk_insert_lab` 테이블을 생성했습니다.
- 기존 `LMB`, `LMC`, `LMP`, `LMR`, `LMU`, `LMV`의 테이블이나 권한은 변경하지 않았습니다.
- 초기 연결 검증 후 배포용 전용 계정 `lumos_lab_dev`를 생성했습니다. `LUMOS_LAB`에만 `SELECT/INSERT/UPDATE/DELETE/CREATE`를 부여했으며 기존 `LMP` 접근 거부를 확인했습니다.
- DB 연결 도구의 읽기 전용 설정은 생성 작업 동안만 해제하고 다시 활성화했습니다.
- `lumos-lab-dev` 네임스페이스에 DB/JWT Secret과 GHCR pull Secret을 반영했습니다. 실제 값은 저장소에 저장하지 않습니다. Argo CD 동기화 및 서비스 검증 결과는 후속 배포 기록을 참고합니다.

## 초기 스키마

`backend/db/mariadb/001-lumos-lab.sql`을 올바른 서버에 적용합니다. 모든 생성 대상은 `LUMOS_LAB`으로 한정되어 있으며 기존 테이블을 삭제하지 않습니다. `IF NOT EXISTS`는 기존 구조를 수정하지 않으므로, 이후 컬럼 변경은 별도 검토한 SQL로 적용해야 합니다.

현재 서버는 MariaDB 10.3.32이며 앱의 Hibernate는 7.1.8입니다. 기본 MariaDB dialect의 지원 범위보다 오래된 DB여서 `hibernate-community-dialects`의 `MariaDBLegacyDialect`를 적용했습니다. 커뮤니티 dialect는 공식 핵심 dialect와 지원 수준이 다르므로 DB 업그레이드 이후 기본 dialect 전환을 검토합니다. [Hibernate 공식 dialect 안내](https://docs.hibernate.org/orm/7.1/dialect/)

대량 삽입 실습의 자동 증가 컬럼은 MariaDB/MySQL에서 `AUTO_INCREMENT`, H2/PostgreSQL에서는 기존 identity 문법을 사용합니다. 실습 실행 시 `bulk_insert_lab`의 기존 실습 데이터를 지우므로 이 테이블에는 보존할 데이터를 넣지 않습니다.

## 로컬 실행

```powershell
Set-Location backend
.\gradlew.bat bootRun
```

별도로 `SPRING_PROFILES_ACTIVE`를 설정한 터미널에서는 `local`로 변경하거나 해당 환경변수를 해제해야 합니다. H2는 메모리 DB라 프로세스를 종료하면 데이터가 사라집니다.

프론트는 기존 `frontend/.env.example`의 `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`을 사용합니다. 프론트 설정은 이번 DB 작업에서 변경하지 않았습니다.

gRPC는 로컬에서 `localhost:9090`, 개발계에서 같은 Pod의 `127.0.0.1:9090`을 기본값으로 사용합니다. 두 프로필 모두 `GRPC_SERVER_PORT`, `GRPC_CLIENT_HOST`, `GRPC_CLIENT_PORT`로 재정의할 수 있습니다. gRPC는 외부 DNS나 Ingress를 만들지 않습니다. 프론트의 개발계 API 주소는 이미지 빌드 시 `https://api.lab.dev.lumosgraphy.com`으로 주입합니다.

## 개발계 실행 변수

`backend/.env.example`은 예시입니다. 파일 복사만으로 자동 로딩되지 않으며 실행 프로세스 환경변수로 주입합니다.

| 변수 | 용도 |
| --- | --- |
| `SPRING_PROFILES_ACTIVE=dev` | 개발계 프로필 |
| `LUMOS_LAB_DB_URL` | `/LUMOS_LAB`을 가리키는 MariaDB JDBC URL |
| `LUMOS_LAB_DB_USERNAME` | DB 사용자 |
| `LUMOS_LAB_DB_PASSWORD` | DB 비밀번호 |
| `LUMOS_LAB_JWT_SECRET` | 로컬 기본값이 아닌 별도 비밀값 |
| `LUMOS_LAB_DB_POOL_SIZE` | 선택, 기본 3 |
| `APP_CORS_ALLOWED_ORIGINS` | 개발계 기본값은 `https://lab.dev.lumosgraphy.com` |

로컬 브라우저에서 `dev` 백엔드를 테스트할 때는 CORS를 로컬 프론트 주소로 설정합니다. 기존 Supabase 변수는 `dev`에서 사용하지 않습니다. 실제 주소·비밀번호·JWT 비밀값은 저장소에 기록하지 않습니다.

## Kubernetes / Argo CD

- 리소스 기본 이름은 `lumos-lab`, URL은 `lab.dev.lumosgraphy.com` 및 `api.lab.dev.lumosgraphy.com`입니다.
- `argocd/dev/project.yaml`의 전용 AppProject를 먼저 적용한 뒤 frontend/backend의 `argocd/dev/application.yaml`을 적용합니다.
- 두 Application 이름은 `lumos-lab-frontend-dev`, `lumos-lab-backend-dev`로 서버의 기존 `lumos-*-dev` 이미지 갱신 규칙에 포함됩니다.
- 이미지 게시 워크플로는 공통 CI를 호출하고 백엔드 테스트와 프론트 lint/build가 모두 성공한 뒤에 이미지를 게시합니다.

- `backend/k8s/dev/deployment.yaml`은 `SPRING_PROFILES_ACTIVE=dev`를 사용합니다.
- `backend/k8s/dev/secret.example.yaml`은 필요한 Secret 키의 안내이며 Kustomize 리소스에 포함되지 않습니다.
- 실제 `lumos-lab-backend-secret`에 위 네 가지 필수 접속·JWT 값을 준비한 뒤 배포해야 합니다. 기존 Secret의 Supabase 변수만으로는 시작되지 않습니다.
- 클러스터에서 DB 네트워크 접근 가능 여부와 TLS 설정도 별도로 확인합니다.
- 가능하면 Lab 전용 계정에 `LUMOS_LAB` 범위의 권한만 부여합니다. 실습의 테이블 생성에는 `CREATE`, CRUD에는 `SELECT/INSERT/UPDATE/DELETE`가 필요합니다. 실제 권한 정책은 배포 전에 검토합니다.
- Supabase 설정으로 되돌릴 때는 프로필뿐 아니라 Secret 구성과 데이터 위치까지 함께 검토합니다. 이 작업은 기존 Supabase 데이터를 이전하지 않았습니다.

## 검증

일반 테스트는 외부 DB 없이 실행합니다.

```powershell
Set-Location backend
.\gradlew.bat test
```

실제 MariaDB 검증은 **다른 사용자가 접근하지 않는 비어 있는 Lab 테이블**에서만 명시적으로 실행합니다. 실제 접속 변수와 JWT를 주입한 뒤:

```powershell
$env:LUMOS_LAB_DB_CHECK = "true"
try {
    .\gradlew.bat test --tests com.lumos.lab.config.MariaDbConnectionTest --rerun-tasks
} finally {
    Remove-Item Env:LUMOS_LAB_DB_CHECK
}
```

테스트는 대상 catalog가 `LUMOS_LAB`인지, 두 테이블이 비어 있는지 먼저 확인합니다. 개발계 프로필로 실제 앱을 시작하여 스키마 검증, JPA 생성 ID·한글/이모지 저장·조회, 3건 batch insert를 확인하고 행 변경을 롤백합니다. AUTO_INCREMENT 번호 증가는 되돌리지 않으며 실습 DDL에는 암묵적 커밋 특성이 있으므로 운영 중인 공유 테이블에서 실행하지 않습니다. 일반 CI에서는 이 테스트를 건너뜁니다.
