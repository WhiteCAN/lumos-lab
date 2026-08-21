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
  "API = 애플리케이션 간 통신, REST API = 표준화된 웹 통신 방식";

export const apiStyles: ApiStyleGuide[] = [
  {
    name: "REST API",
    summary:
      "HTTP 메서드와 URL로 자원을 다루는 가장 널리 쓰이는 웹 API 스타일입니다.",
    bestFor: "일반 웹/모바일 앱, CRUD, 공개 API, 프론트엔드-백엔드 통신",
    watchOut: "복잡한 실시간 양방향 통신이나 매우 강한 타입 계약에는 한계가 있습니다.",
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
