import type { FolderGuide, StructureSection } from "@/types/project-structure";

export const frontendStructure: StructureSection = {
  title: "프론트엔드 구조",
  subtitle: "React / Next.js / Vue 공통 참고 구조",
  items: [
    {
      name: "frontend/",
      description: "프론트엔드 루트",
      children: [
        {
          name: "public/",
          description: "정적 파일",
          children: [
            { name: "images/", description: "공개 이미지" },
            { name: "icons/", description: "공개 아이콘" },
          ],
        },
        {
          name: "src/",
          description: "애플리케이션 소스",
          children: [
            { name: "app/", description: "Next.js 라우트와 페이지" },
            { name: "pages/", description: "Pages Router, Vue views, 일반 페이지 폴더" },
            { name: "assets/", description: "소스에서 import하는 이미지, 폰트, 스타일 자원" },
            { name: "components/", description: "재사용 UI 컴포넌트" },
            { name: "components/common/", description: "버튼, 카드, 모달 같은 공통 컴포넌트" },
            { name: "components/ui/", description: "shadcn/ui 기본 컴포넌트" },
            { name: "components/layout/", description: "사이드바, 헤더, 화면 뼈대" },
            { name: "features/", description: "기능 단위 모듈" },
            { name: "hooks/", description: "커스텀 React 훅" },
            { name: "context/", description: "전역 Context Provider" },
            { name: "services/", description: "API 호출과 외부 서비스 연동" },
            { name: "utils/", description: "공통 유틸 함수" },
            { name: "constants/", description: "상수와 설정값" },
            { name: "types/", description: "공통 TypeScript 타입" },
            { name: "styles/", description: "전역 스타일, 테마 관련 파일" },
          ],
        },
        { name: ".env.local", description: "로컬 환경 변수" },
        { name: "package.json", description: "의존성과 스크립트" },
        { name: "next.config.ts", description: "Next.js 설정 파일" },
        { name: "README.md", description: "프론트엔드 문서" },
      ],
    },
  ],
};

export const backendStructure: StructureSection = {
  title: "백엔드 구조",
  subtitle: "Node.js / Express 기준 예시",
  items: [
    {
      name: "backend/",
      description: "백엔드 루트",
      children: [
        {
          name: "src/",
          description: "백엔드 소스 루트",
          children: [
            { name: "config/", description: "DB, 환경, 앱 설정" },
            { name: "controllers/", description: "요청과 응답 처리" },
            { name: "models/", description: "DB 모델과 스키마" },
            { name: "routes/", description: "API 엔드포인트 라우팅" },
            { name: "middleware/", description: "인증, 에러 처리, 로깅" },
            { name: "services/", description: "비즈니스 로직" },
            { name: "utils/", description: "공통 유틸 함수" },
            { name: "validations/", description: "요청 값 검증 스키마" },
            { name: "uploads/", description: "업로드 파일 저장 위치" },
            { name: "app.js", description: "Express 앱 설정" },
            { name: "server.js", description: "서버 시작 진입점" },
          ],
        },
        { name: ".env", description: "환경 변수" },
        { name: "package.json", description: "의존성과 스크립트" },
        { name: "README.md", description: "백엔드 문서" },
      ],
    },
  ],
};

export const folderGuides: FolderGuide[] = [
  {
    name: "components/",
    purpose: "재사용 UI 컴포넌트를 둡니다. 여러 화면에서 반복되는 버튼, 카드, 모달, 레이아웃을 분리합니다.",
    examples: "Button, Modal, Header, Sidebar",
  },
  {
    name: "pages/ 또는 app/",
    purpose: "사용자가 접근하는 화면과 라우트를 둡니다. Next.js App Router라면 app 폴더를 씁니다.",
    examples: "home, dashboard, product, auth",
  },
  {
    name: "services/",
    purpose: "API 호출과 외부 서비스 연동을 담당합니다. 화면 컴포넌트에서 fetch 로직이 너무 커지는 것을 막습니다.",
    examples: "api.ts, auth-service.ts, product-service.ts",
  },
  {
    name: "models/",
    purpose: "백엔드에서 데이터 모델과 DB 스키마를 정의합니다.",
    examples: "User, Product, Order",
  },
  {
    name: "middleware/",
    purpose: "인증, 권한, 에러 처리, 요청 로깅처럼 요청 흐름 중간에 끼어드는 로직을 둡니다.",
    examples: "auth, error-handler, logger",
  },
  {
    name: "utils/",
    purpose: "여러 곳에서 쓰는 작은 유틸 함수와 헬퍼를 둡니다.",
    examples: "formatDate, parseNumber, createResponse",
  },
];

export const bestPractices = [
  "기능 기준으로 폴더를 나누면 프로젝트가 커져도 찾기 쉽습니다.",
  "컴포넌트 이름과 파일 이름은 역할이 바로 보이게 짓습니다.",
  "API 호출은 services 폴더로 분리해서 화면 코드를 가볍게 유지합니다.",
  "공통 UI와 기능 전용 UI를 섞지 않습니다.",
  "환경 변수와 보안 값은 .env에 두고 코드에 직접 적지 않습니다.",
  "README에는 실행 방법, 폴더 설명, 환경 변수 예시를 남깁니다.",
];

export const benefits = [
  "처음 보는 개발자도 구조를 빠르게 이해할 수 있습니다.",
  "기능 추가와 유지보수가 쉬워집니다.",
  "프론트엔드와 백엔드 역할이 분명해집니다.",
  "테스트, 리팩터링, 배포 준비가 편해집니다.",
];
