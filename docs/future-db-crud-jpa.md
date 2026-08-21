# 나중에 진행할 DB / CRUD / JPA 관계 매핑 가이드

이 문서는 지금 바로 구현하지 않는 항목을 나중에 다시 시작할 때 참고하기 위한 정리입니다.

대상 작업:

- Supabase PostgreSQL 실제 연결
- CRUD 실험실
- JPA 관계 매핑 실험실

## 1. Supabase PostgreSQL 실제 연결

현재 프로젝트는 기본 실행 시 H2 메모리 DB를 사용합니다. Supabase를 사용할 때만 `supabase` 프로필로 전환합니다.

권장 구조:

```text
Next.js 화면
  -> Spring Boot API
    -> Supabase PostgreSQL
```

이 구조로 해야 Java, JPA, 트랜잭션, 서비스 계층 디버깅을 제대로 연습할 수 있습니다.

### 준비할 것

- Supabase 프로젝트
- Database password
- Supabase Dashboard의 Connection string
- 백엔드 환경변수

### 확인 위치

```text
Supabase Dashboard
  Project Settings
    Database
      Connection string
```

Spring Boot 서버에서는 Supabase API Key가 아니라 PostgreSQL 접속 정보를 사용합니다.

### 환경변수 예시

```powershell
cd C:\Users\skw0329\IdeaProjects\study-lab\backend

$env:SPRING_PROFILES_ACTIVE="supabase"
$env:SUPABASE_DB_URL="jdbc:postgresql://aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require"
$env:SUPABASE_DB_USERNAME="postgres.your-project-ref"
$env:SUPABASE_DB_PASSWORD="Supabase DB 비밀번호"

.\gradlew.bat bootRun
```

### 연결 확인

```http
GET http://localhost:8080/api/database/info
```

성공 기준:

```json
{
  "databaseProductName": "PostgreSQL"
}
```

### 주의할 점

- 비밀번호는 코드에 저장하지 않습니다.
- `.env`, `.env.*`는 `.gitignore`에 포함되어 있습니다.
- H2는 서버를 재시작하면 데이터가 사라지지만 Supabase PostgreSQL은 데이터가 유지됩니다.
- Supabase 연결 후 `@Transactional` 실험실을 다시 실행하면 실제 PostgreSQL 기준으로 커밋/롤백을 확인할 수 있습니다.

## 2. CRUD 실험실 계획

Supabase 연결 후 첫 번째 실습으로 CRUD를 만드는 것이 좋습니다.

목표는 단순 게시판 완성이 아니라, API 호출 흐름과 JPA 저장 흐름을 디버깅하는 것입니다.

### 추천 도메인

처음에는 너무 복잡한 도메인보다 아래처럼 작게 시작합니다.

```text
Member
  id
  name
  email
  createdAt

Post
  id
  title
  content
  createdAt
```

처음 CRUD에서는 관계 매핑을 넣지 않고 단일 엔티티부터 시작합니다.

### 백엔드 패키지 예시

```text
com.study.lab.crud.member
  Member
  MemberRepository
  MemberService
  MemberController
  MemberCreateRequest
  MemberUpdateRequest
  MemberResponse

com.study.lab.crud.post
  Post
  PostRepository
  PostService
  PostController
  PostCreateRequest
  PostUpdateRequest
  PostResponse
```

### API 예시

```http
GET    /api/crud/members
GET    /api/crud/members/{id}
POST   /api/crud/members
PUT    /api/crud/members/{id}
DELETE /api/crud/members/{id}
```

### 프론트 화면 예시

```text
/crud/members
  목록 조회
  생성 폼
  수정 폼
  삭제 버튼
  API 응답 JSON 보기
```

### 디버깅 포인트

- `Controller`에서 요청 DTO가 어떻게 들어오는지
- `Service`에서 트랜잭션이 어디서 시작되는지
- `Repository.save()` 호출 시 insert/update가 어떻게 나뉘는지
- 없는 id를 조회할 때 예외 처리를 어떻게 할지
- 응답 DTO로 Entity를 직접 노출하지 않는 이유

### 트랜잭션 적용 기준

조회:

```java
@Transactional(readOnly = true)
```

생성, 수정, 삭제:

```java
@Transactional
```

처음에는 Service 계층 public 메서드에만 붙입니다.

## 3. JPA 관계 매핑 실험실 계획

CRUD가 익숙해진 뒤 관계 매핑으로 넘어갑니다.

처음부터 관계를 넣으면 CRUD, 트랜잭션, 연관관계, JSON 응답 문제가 한 번에 섞여서 디버깅이 어려워집니다.

### 추천 관계

```text
Member 1:N Post
Post   1:N Comment
```

개념:

- 한 명의 회원은 여러 게시글을 작성할 수 있습니다.
- 하나의 게시글에는 여러 댓글이 달릴 수 있습니다.
- `Post`는 작성자 `Member`를 참조합니다.
- `Comment`는 작성자 `Member`와 대상 `Post`를 참조합니다.

### 엔티티 방향 추천

초반에는 실무처럼 단순하게 시작합니다.

```text
Post -> Member
Comment -> Member
Comment -> Post
```

즉, `@ManyToOne` 중심으로 먼저 시작합니다.

`@OneToMany` 양방향 매핑은 그 다음 단계에서 추가합니다.

### 1단계: ManyToOne만 사용

```text
Member
  id
  name

Post
  id
  title
  content
  member

Comment
  id
  content
  post
  member
```

배울 것:

- 외래키
- `@ManyToOne(fetch = FetchType.LAZY)`
- `@JoinColumn`
- 연관 엔티티 조회
- DTO 변환

### 2단계: OneToMany 추가

```text
Member
  posts

Post
  comments
```

배울 것:

- 양방향 연관관계
- `mappedBy`
- 연관관계 편의 메서드
- 무한 JSON 순환 문제
- Entity를 그대로 응답하면 위험한 이유

### 3단계: N+1 문제 확인

예시 API:

```http
GET /api/jpa/posts
```

게시글 목록을 조회하면서 작성자 이름까지 보여줄 때 SQL이 몇 번 나가는지 확인합니다.

비교할 방식:

- 기본 LAZY 조회
- fetch join
- EntityGraph
- DTO projection

### 디버깅 포인트

- SQL 로그에서 select 횟수 확인
- 트랜잭션 밖에서 LAZY 필드 접근 시 어떤 일이 생기는지 확인
- `@Transactional(readOnly = true)` 범위 안에서 DTO로 변환하는 이유 확인
- `cascade`와 `orphanRemoval`은 정말 필요할 때만 사용

## 나중에 구현할 순서 추천

```text
1. Supabase PostgreSQL 연결 확인
2. Member 단일 CRUD
3. Post 단일 CRUD
4. Member와 Post를 ManyToOne으로 연결
5. Comment 추가
6. OneToMany 양방향 매핑 추가
7. N+1 문제 재현
8. fetch join / EntityGraph 비교
```

## 구현 전 체크리스트

- Supabase 연결 정보가 준비되어 있는가?
- `/api/database/info`에서 PostgreSQL로 표시되는가?
- `@Transactional` 실험실이 Supabase에서 정상 동작하는가?
- CRUD는 한 엔티티부터 시작하는가?
- Entity를 API 응답으로 직접 내보내지 않을 계획인가?
- 관계 매핑은 `@ManyToOne`부터 시작하는가?
