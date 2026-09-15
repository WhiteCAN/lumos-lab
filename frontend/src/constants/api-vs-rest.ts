import {
  CloudIcon,
  DatabaseIcon,
  Globe2Icon,
  KeyRoundIcon,
  LaptopIcon,
  LightbulbIcon,
  ServerIcon,
  ShoppingCartIcon,
} from "lucide-react";
import type {
  ApiRestComparison,
  ApiRestSection,
  ApiStyleGuide,
  HttpMethodGuide,
} from "@/types/api-vs-rest";

export const apiRestSections: ApiRestSection[] = [
  {
    title: "API란?",
    description:
      "API는 Application Programming Interface의 약자로, 두 애플리케이션이 서로 요청과 응답을 주고받도록 해주는 연결 규칙입니다.",
    bullets: ["앱과 서버 연결", "외부 서비스 연동", "결제, 지도, 날씨 API 같은 기능 제공"],
    icon: CloudIcon,
    colorClass: "border-sky-200 bg-sky-50/70 dark:border-sky-900/70 dark:bg-sky-950/30",
  },
  {
    title: "REST API란?",
    description:
      "REST API는 REST 아키텍처 원칙을 따르는 API입니다. 보통 HTTP 메서드, URL, JSON 데이터를 사용해 웹에서 자원을 다룹니다.",
    bullets: ["HTTP 메서드 사용", "URL로 자원 표현", "대부분 JSON으로 응답"],
    icon: Globe2Icon,
    colorClass: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/70 dark:bg-emerald-950/30",
  },
  {
    title: "핵심 포인트",
    description:
      "모든 REST API는 API지만, 모든 API가 REST API는 아닙니다. API는 더 넓은 개념이고 REST API는 그중 웹 통신에 특화된 방식입니다.",
    bullets: ["API는 일반 개념", "REST API는 특정 스타일", "REST는 웹 기반 통신에 많이 사용"],
    icon: LightbulbIcon,
    colorClass: "border-amber-200 bg-amber-50/70 dark:border-amber-900/70 dark:bg-amber-950/30",
  },
];

export const apiRestComparisons: ApiRestComparison[] = [
  { api: "일반적인 통신 개념", rest: "특정한 API 설계 방식" },
  { api: "여러 프로토콜 사용 가능", rest: "주로 HTTP 사용" },
  { api: "XML, JSON 등 다양함", rest: "대부분 JSON 사용" },
  { api: "더 넓고 유연함", rest: "가볍고 웹 친화적" },
  { api: "항상 웹 기반은 아님", rest: "대부분 웹 기반" },
];

export const httpMethods: HttpMethodGuide[] = [
  {
    method: "GET",
    purpose: "데이터 조회",
    example: "GET /users",
    colorClass: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  },
  {
    method: "POST",
    purpose: "데이터 생성",
    example: "POST /users",
    colorClass: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200",
  },
  {
    method: "PUT",
    purpose: "데이터 전체 수정",
    example: "PUT /users/1",
    colorClass: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  },
  {
    method: "DELETE",
    purpose: "데이터 삭제",
    example: "DELETE /users/1",
    colorClass: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
  },
];

export const restFlow = [
  { label: "사용자 요청", icon: LaptopIcon },
  { label: "API 엔드포인트", icon: Globe2Icon },
  { label: "서버 처리", icon: ServerIcon },
  { label: "데이터베이스", icon: DatabaseIcon },
  { label: "JSON 응답", icon: KeyRoundIcon },
];

export const restBenefits = [
  "빠른 웹 통신에 적합합니다.",
  "프론트엔드와 백엔드를 분리하기 쉽습니다.",
  "URL과 HTTP 메서드만 봐도 의도를 파악하기 쉽습니다.",
  "브라우저, 모바일 앱, 서버 간 통합이 쉽습니다.",
];

export const realLifeExample = {
  title: "음식 주문 앱 예시",
  icon: ShoppingCartIcon,
  steps: [
    "고객이 앱에서 음식을 주문합니다.",
    "앱이 REST API로 주문 요청을 보냅니다.",
    "식당 서버가 주문을 저장하고 처리합니다.",
    "서버가 주문 결과를 JSON 응답으로 돌려줍니다.",
  ],
};

export const summaryLine =
  "API는 연결 계약, REST는 자원 중심의 아키텍처 스타일";

export const apiStyles: ApiStyleGuide[] = [
  {
    name: "REST API",
    summary:
      "HTTP 메서드와 URL로 자원을 다루는 가장 널리 쓰이는 웹 API 스타일입니다.",
    bestFor: "일반 웹/모바일 앱, CRUD, 공개 API, 프론트엔드-백엔드 통신",
    watchOut: "응답 설계에 따라 불필요한 필드나 추가 요청이 생길 수 있습니다. OpenAPI로 계약을 명시할 수 있고 JSON은 필수가 아닙니다.",
    example: "GET /users, POST /orders",
    colorClass:
      "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/70 dark:bg-emerald-950/30",
  },
  {
    name: "gRPC",
    summary:
      "함수를 원격으로 호출하듯 통신하는 고성능 RPC 방식입니다. 보통 Protocol Buffers로 계약을 정의하고 HTTP/2 기반 통신을 사용합니다.",
    bestFor: "마이크로서비스 내부 통신, 고성능 서버 간 통신, 스트리밍, 강한 타입 계약",
    watchOut: "브라우저에서 바로 쓰기엔 REST보다 진입 장벽이 있고, proto 파일과 코드 생성 흐름을 이해해야 합니다.",
    example: "UserService.GetUser(request)",
    colorClass:
      "border-indigo-200 bg-indigo-50/70 dark:border-indigo-900/70 dark:bg-indigo-950/30",
  },
  {
    name: "FastAPI",
    summary:
      "Python으로 API를 빠르게 만들 수 있는 웹 프레임워크입니다. 타입 힌트 기반 검증과 OpenAPI/Swagger 자동 문서화가 강점입니다.",
    bestFor: "Python 백엔드, AI/ML 모델 서빙, 빠른 API 프로토타입, 데이터 서비스",
    watchOut: "FastAPI 자체는 REST의 대체 개념이 아니라 API를 구현하는 프레임워크입니다.",
    example: "@app.get('/users/{user_id}')",
    colorClass:
      "border-cyan-200 bg-cyan-50/70 dark:border-cyan-900/70 dark:bg-cyan-950/30",
  },
  {
    name: "GraphQL",
    summary:
      "클라이언트가 필요한 필드를 직접 지정해서 가져오는 API 쿼리 방식입니다.",
    bestFor: "화면마다 필요한 데이터 모양이 자주 달라지는 앱, 여러 리소스를 한 번에 조회하는 화면",
    watchOut: "캐싱, 권한, 복잡한 쿼리 비용 제어를 신경 써야 합니다.",
    example: "query { user { name orders { id } } }",
    colorClass:
      "border-pink-200 bg-pink-50/70 dark:border-pink-900/70 dark:bg-pink-950/30",
  },
];

export const protocolComparison = [
  { topic: "설계 중심", values: ["자원과 HTTP 메서드", "스키마에 대한 필드 선택", "서비스 메서드의 원격 호출"] },
  { topic: "데이터·전송", values: ["JSON·XML 등 / HTTP 버전 고정 아님", "주로 JSON / 보통 HTTP", "기본적으로 Protobuf 바이너리 / HTTP/2"] },
  { topic: "계약", values: ["OpenAPI로 명세·코드 생성 가능", "타입이 있는 GraphQL 스키마", ".proto로 메시지·서비스 정의 및 코드 생성"] },
  { topic: "응답 선택", values: ["서버가 기본 형태 결정, 필드 선택 기능도 설계 가능", "클라이언트가 스키마 범위에서 선택", "정의된 응답 메시지 계약에 따름"] },
  { topic: "캐싱", values: ["HTTP 캐시·ETag·CDN 활용", "쿼리·변수·권한을 고려한 캐시 설계", "애플리케이션 캐시를 주로 설계"] },
  { topic: "스트리밍", values: ["SSE·WebSocket 등 별도 방식과 조합", "Subscription, 전송 방식은 구현에 따라 결정", "단건·서버·클라이언트·양방향 스트리밍"] },
  { topic: "브라우저", values: ["표준 HTTP 도구와 연동 용이", "HTTP 기반 클라이언트 도구 활용", "gRPC-Web 등 연동 계층과 지원 범위 확인"] },
];

export const protocolExamples = [
  { title: "REST · 고객 자원 조회", code: `GET /customers/123
GET /customers/123/orders

// 응답 형태와 포함 필드는 API 설계에 따라 결정
{"id":123,"name":"민수","email":"minsu@example.com"}`, note: "필요 이상의 필드를 받으면 over-fetching, 주문을 얻기 위해 추가 요청이 필요하면 under-fetching입니다. 복합 응답이나 필드 선택 API로 개선할 수도 있습니다." },
  { title: "GraphQL · 필요한 필드 요청", code: `query {
  customer(id: "123") {
    name
    orders { id status }
  }
}

// 응답
{"data":{"customer":{"name":"민수","orders":[
  {"id":"101","status":"DELIVERED"}
]}}}`, note: "한 HTTP 요청 안에서도 resolver가 여러 DB 조회를 할 수 있습니다. 고객 100명의 주문을 각각 조회하면 1+100번이 될 수 있어 배치 조회나 요청 범위 DataLoader를 검토합니다." },
  { title: "gRPC · 조회 계약 정의", code: `syntax = "proto3";

service CustomerService {
  rpc GetCustomer (CustomerRequest) returns (CustomerReply);
}
message CustomerRequest { string id = 1; }
message CustomerReply {
  string id = 1;
  string name = 2;
}`, note: "계약으로 생성한 클라이언트 stub이 원격 메서드를 호출합니다. 필드 번호와 타입의 호환성을 관리하고 deadline·오류 처리도 설계합니다." },
];

export const protocolDecisions = [
  { title: "외부 파트너 · REST", detail: "주문 생성과 조회를 공개할 때 HTTP 호환성, 문서화, 운영 도구가 중요하면 REST를 우선 검토합니다." },
  { title: "상품 상세 화면 · GraphQL", detail: "웹·모바일마다 상품, 리뷰, 재고의 필요한 필드가 다르면 GraphQL로 조회 형태를 유연하게 구성할 수 있습니다." },
  { title: "내부 재고 서비스 · gRPC", detail: "정의된 계약과 코드 생성, 낮은 지연이나 스트리밍이 필요하면 gRPC를 검토하고 실제 부하로 효과를 측정합니다." },
];

export const protocolTraps = [
  ["gRPC가 항상 더 빠른가요?", "직렬화 크기뿐 아니라 DB, 네트워크, 압축, 호출량과 구현에 좌우됩니다. 같은 조건에서 지연 시간과 처리량을 측정합니다."],
  ["GraphQL이면 N+1이 사라지나요?", "응답 필드 선택과 DB 실행 횟수는 별개입니다. resolver의 배치 조회와 캐시 범위를 점검합니다."],
  ["REST는 JSON 또는 HTTP/1.1만 쓰나요?", "REST는 특정 직렬화 형식이나 HTTP 버전을 강제하지 않습니다. JSON은 흔히 사용하는 표현 형식입니다."],
  ["gRPC는 스트리밍이 되나요?", "단건 요청·응답 외에 서버 스트리밍, 클라이언트 스트리밍, 양방향 스트리밍을 지원합니다. gRPC-Web의 지원은 별도로 확인합니다."],
  ["GraphQL은 엔드포인트가 반드시 하나인가요?", "하나의 진입점이 흔한 구성입니다. 서비스별로 여러 진입점을 둘 수도 있고, 한 진입점이 DB 하나나 쿼리 한 번을 의미하지도 않습니다."],
  ["마이크로서비스는 모두 gRPC여야 하나요?", "클라이언트 지원, 팀의 운영 경험, 성능 요구에 따라 REST도 적합합니다. 서비스 개수만으로 결정하지 않습니다."],
  ["GraphQL은 프론트엔드 전용인가요?", "서버 간 조회나 여러 데이터 소스 통합에도 사용할 수 있습니다. 유연한 조회가 실제로 필요한지 판단합니다."],
  ["세 가지를 같이 써도 되나요?", "외부 REST, 화면용 GraphQL, 내부 gRPC를 조합할 수 있습니다. 프로토콜마다 관측·인증·오류 변환 비용이 생기므로 필요한 경계에 도입합니다."],
  ["GraphQL이 더 안전한가요?", "방식 자체가 보안을 보장하지 않습니다. 인증·객체 및 필드 권한·입력 검증이 필요하고, GraphQL은 쿼리 깊이·비용과 요청량도 제한합니다."],
];
