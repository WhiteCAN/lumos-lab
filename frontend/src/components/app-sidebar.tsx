"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { PageSearch } from "@/components/page-search"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  BrainCircuitIcon, BracketsIcon, ChartNoAxesColumnIncreasingIcon,
  Code2Icon, DatabaseIcon, FolderTreeIcon, GalleryVerticalEndIcon,
  KeyRoundIcon, NetworkIcon, RouteIcon, ScrollTextIcon, SearchIcon,
} from "lucide-react"
import { studyCategories, studyPages } from "@/lib/study-pages"

const categoryIcons = [ChartNoAxesColumnIncreasingIcon, Code2Icon, GalleryVerticalEndIcon, KeyRoundIcon,
  DatabaseIcon, NetworkIcon, BracketsIcon, FolderTreeIcon, BrainCircuitIcon]
const navMain = studyCategories.map((title, index) => {
  const Icon = categoryIcons[index]
  return { title, icon: <Icon />, items: studyPages.filter((page) => page.category === title)
    .map((page) => ({ title: page.title, url: page.href })) }
})

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
  const [searchOpen, setSearchOpen] = React.useState(false)
  const searchTrigger = React.useRef<HTMLButtonElement>(null)
  const { setOpenMobile } = useSidebar()
  const onSearchOpenChange = React.useCallback((open: boolean) => {
    if (open) setOpenMobile(false)
    setSearchOpen(open)
  }, [setOpenMobile])
  return (
    <>
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <SidebarMenuButton ref={searchTrigger} tooltip="페이지 검색 (Ctrl/⌘ K)" aria-label="페이지 검색" aria-haspopup="dialog" onClick={() => onSearchOpenChange(true)} className="border border-sidebar-border">
          <SearchIcon /><span>페이지 검색</span><kbd className="ml-auto text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">Ctrl/⌘ K</kbd>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <PageSearch open={searchOpen} onOpenChange={onSearchOpenChange} triggerRef={searchTrigger} />
    </>
  )
}
