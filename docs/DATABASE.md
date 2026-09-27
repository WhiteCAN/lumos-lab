# 데이터 저장과 변경 기준

## 환경별 저장소

| 프로필 | 저장소 | 스키마 정책 |
| --- | --- | --- |
| `local` 기본 | H2 메모리 DB | Hibernate `update`; 프로세스 종료 시 데이터 소멸 |
| `dev` | MariaDB의 `LUMOS_LAB` | 검토한 SQL 적용, Hibernate `validate` |
| `supabase` 선택 기능 | PostgreSQL | 기존 Hibernate `update` 설정 |

현재 설정의 원본은 [공통 properties](../backend/src/main/resources/application.properties)와 같은 폴더의 프로필별 파일입니다. 접속 변수·실행·개발계 검증 절차는 [database-environments.md](database-environments.md)를 기준으로 하며 중복 복사하지 않습니다. 이 문서는 DB 서버의 현재 접속 상태를 검증한 기록이 아닙니다.

## 실제 테이블과 모델

| 테이블 | 필드와 제약 | 접근·용도 |
| --- | --- | --- |
| `transaction_log` | `id` BIGINT 자동 증가 PK, `scenario` VARCHAR(255), `message` VARCHAR(255), `created_at` DATETIME(6) | JPA `TransactionLog`·`TransactionLogRepository`, 트랜잭션 학습 기록 |
| `bulk_insert_lab` | `id` BIGINT 자동 증가 PK, 필수 `name` VARCHAR(100), `payload` VARCHAR(255), `created_at` TIMESTAMP | JDBC 대량 삽입 실습 |

위 타입과 제약은 [MariaDB 초기 SQL](../backend/db/mariadb/001-lumos-lab.sql) 기준입니다. `TransactionLog`의 Java 필드는 `Long`, `String`, `Instant`이며 [엔티티](../backend/src/main/java/com/lumos/lab/concept/transactional/TransactionLog.java)가 매핑 원본입니다. 현재 초기 SQL에는 두 테이블 사이 외래 키나 별도 보조 인덱스가 없습니다. 템플릿의 User·Project 모델과 관계는 만들지 않습니다.

RAG 모의 문서·검색 같은 실습 상태와 브라우저 localStorage의 진행도·테마는 위 관계형 테이블과 다릅니다. 서비스 메모리 상태를 DB에 영구 저장한다고 설명하지 않습니다.

## 스키마 변경

1. 대상 프로필, 저장소, 테이블과 보존할 데이터를 확인합니다.
2. 엔티티·JDBC SQL·요청/응답 영향을 함께 확인합니다.
3. 개발계는 별도 검토한 SQL로 변경하고 `validate`를 유지합니다. `IF NOT EXISTS`는 기존 테이블 구조를 변경하지 않습니다.
4. 로컬 테스트 후 필요한 외부 DB 검증을 명시적으로 수행합니다.
5. SQL·환경 가이드·API와 이 문서의 관련 내용을 함께 갱신합니다.

현재 Gradle 의존성에는 Flyway·Liquibase가 없습니다. 자동 마이그레이션 체계가 구축돼 있다고 설명하거나 Prisma Migrate 명령을 도입하지 않습니다.

## 실습 데이터와 안전 범위

`bulk_insert_lab` 실행은 기존 데이터를 지우므로 보존할 데이터를 넣지 않습니다. 기존 Lumos의 다른 스키마·계정·테이블로 변경 범위를 넓히지 않습니다. 비밀값은 환경변수/Secret으로 전달하고 문서에는 저장하지 않습니다.

일반 `.\gradlew.bat test`는 외부 DB 없이 실행합니다. 실제 MariaDB 연결 검증은 환경 가이드의 명시적 조건과 비어 있는 전용 Lab 테이블에서만 수행합니다. DDL 암묵적 커밋과 자동 증가 값은 롤백으로 모두 복구되지 않습니다. 과거 적용 내역과 실제 데이터 백업·현재 권한은 별도로 확인합니다.
