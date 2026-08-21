"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BrainCircuitIcon,
  BracesIcon,
  BracketsIcon,
  ChartNoAxesColumnIncreasingIcon,
  KeyRoundIcon,
  FlaskConicalIcon,
  DatabaseIcon,
  FolderTreeIcon,
  GalleryVerticalEndIcon,
  GitBranchIcon,
  NetworkIcon,
  RouteIcon,
  ScrollTextIcon,
  Code2Icon,
} from "lucide-react"

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

const data = {
  user: {
    name: "Lumos Lab",
    email: "debug mode",
    avatar: "",
  },
  teams: [
    {
      name: "Lumos Lab",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Spring + Next",
    },
  ],
  navMain: [
    {
      title: "알고리즘",
      url: "/",
      icon: (
        <ChartNoAxesColumnIncreasingIcon
        />
      ),
      items: [
        {
          title: "정렬 실험실",
          url: "/",
        },
        {
          title: "검색 실험실",
          url: "/search",
        },
      ],
    },
    {
      title: "자료구조",
      url: "#",
      icon: (
        <BracesIcon
        />
      ),
      items: [
        {
          title: "스택",
          url: "/datastructures/stack",
        },
        {
          title: "큐",
          url: "/datastructures/queue",
        },
        {
          title: "힙",
          url: "/datastructures/heap",
        },
        {
          title: "그래프",
          url: "/datastructures/graph",
        },
      ],
    },
    {
      title: "개념 실험",
      url: "/sync-async",
      icon: (
        <FlaskConicalIcon
        />
      ),
      items: [
        {
          title: "동기 / 비동기",
          url: "/sync-async",
        },
        {
          title: "트랜잭션",
          url: "/transactional",
        },
        {
          title: "gRPC",
          url: "/grpc",
        },
      ],
    },
    {
      title: "프론트엔드",
      url: "/frontend-basics",
      icon: (
        <BracketsIcon
        />
      ),
      items: [
        {
          title: "React / Next.js 기초",
          url: "/frontend-basics",
        },
        {
          title: "React 기초",
          url: "/frontend/react",
        },
        {
          title: "Next.js 기초",
          url: "/frontend/nextjs",
        },
      ],
    },
    {
      title: "Java 기초",
      url: "/java/io-string",
      icon: (
        <Code2Icon
        />
      ),
      items: [
        {
          title: "입출력 / 문자열",
          url: "/java/io-string",
        },
        {
          title: "컬렉션",
          url: "/java/collections",
        },
        {
          title: "비교 / 예외",
          url: "/java/equality-exception",
        },
        {
          title: "동시성",
          url: "/java/concurrency",
        },
      ],
    },
    {
      title: "메시징",
      url: "/messaging/kafka",
      icon: (
        <NetworkIcon
        />
      ),
      items: [
        {
          title: "Kafka 기초",
          url: "/messaging/kafka",
        },
        {
          title: "Kafka 설정 옵션",
          url: "/messaging/kafka-config",
        },
        {
          title: "Saga / Outbox",
          url: "/messaging/saga-outbox",
        },
      ],
    },
    {
      title: "백엔드",
      url: "/backend/redis-cache",
      icon: (
        <KeyRoundIcon
        />
      ),
      items: [
        {
          title: "Redis / 캐시 / 분산락",
          url: "/backend/redis-cache",
        },
        {
          title: "Security / JWT / OAuth",
          url: "/backend/security-auth",
        },
      ],
    },
    {
      title: "DB 실습",
      url: "/backend/bulk-insert",
      icon: (
        <DatabaseIcon
        />
      ),
      items: [
        {
          title: "벌크 인서트",
          url: "/backend/bulk-insert",
        },
        {
          title: "인덱스 / 격리수준",
          url: "/backend/db-index-transaction",
        },
        {
          title: "트랜잭션",
          url: "/transactional",
        },
      ],
    },
    {
      title: "디자인 패턴",
      url: "/patterns",
      icon: (
        <GitBranchIcon
        />
      ),
      items: [
        {
          title: "전략 패턴",
          url: "/patterns/strategy",
        },
        {
          title: "팩토리 패턴",
          url: "/patterns/factory",
        },
        {
          title: "옵저버 패턴",
          url: "/patterns/observer",
        },
        {
          title: "데코레이터 패턴",
          url: "/patterns/decorator",
        },
        {
          title: "커맨드 패턴",
          url: "/patterns/command",
        },
      ],
    },
    {
      title: "RAG",
      url: "/rag/concepts",
      icon: (
        <BrainCircuitIcon
        />
      ),
      items: [
        {
          title: "RAG / CAG / MAG / GAG",
          url: "/rag/concepts",
        },
        {
          title: "문서",
          url: "/rag/documents",
        },
        {
          title: "벡터 검색",
          url: "/rag/vector-search",
        },
        {
          title: "질문하기",
          url: "/rag/ask",
        },
      ],
    },
    {
      title: "레퍼런스",
      url: "/project-structure",
      icon: (
        <FolderTreeIcon
        />
      ),
      items: [
        {
          title: "프로젝트 구조",
          url: "/project-structure",
        },
        {
          title: "AI 핵심 개념 2026",
          url: "/ai-concepts",
        },
        {
          title: "API vs REST API",
          url: "/api-vs-rest",
        },
        {
          title: "TCP vs UDP",
          url: "/tcp-vs-udp",
        },
        {
          title: "아키텍처",
          url: "/architecture",
        },
        {
          title: "HTTP 에러 처리",
          url: "/http-errors",
        },
        {
          title: "Spring Bean / DI",
          url: "/spring-bean-di",
        },
        {
          title: "테스트 기초",
          url: "/testing-basics",
        },
        {
          title: "TDD",
          url: "/tdd",
        },
        {
          title: "DTO / Entity / VO",
          url: "/dto-entity-vo",
        },
        {
          title: "REST API 설계",
          url: "/rest-api-design",
        },
        {
          title: "LLM 앱 구조",
          url: "/llm-app-structure",
        },
      ],
    },
  ],
  projects: [
    {
      name: "프론트엔드",
      url: "/",
      icon: (
        <RouteIcon
        />
      ),
    },
    {
      name: "스웨거 UI",
      url: `${apiBaseUrl}/swagger-ui.html`,
      icon: (
        <ScrollTextIcon
        />
      ),
    },
    {
      name: "백엔드 상태",
      url: `${apiBaseUrl}/api/health`,
      icon: (
        <NetworkIcon
        />
      ),
    },
    {
      name: "OpenAPI JSON",
      url: `${apiBaseUrl}/v3/api-docs`,
      icon: (
        <DatabaseIcon
        />
      ),
    },
    {
      name: "DB 연결 정보",
      url: `${apiBaseUrl}/api/database/info`,
      icon: (
        <DatabaseIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
