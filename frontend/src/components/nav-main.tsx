"use client"

import { useStudyProgress } from "@/components/study-progress"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar,
} from "@/components/ui/sidebar"
import { ChevronRightIcon, CheckCircle2Icon } from "lucide-react"

type NavGroup = {
  title: string
  icon?: React.ReactNode
  items: { title: string; url: string }[]
}

function MenuGroup({ item, pathname, completed }: { item: NavGroup; pathname: string; completed: Set<string> }) {
  const active = item.items.some((page) => pathname === page.url)
  const [open, setOpen] = useState(active)
  const { setOpenMobile, state, isMobile, setOpen: setSidebarOpen } = useSidebar()

  return (
    <Collapsible open={open} onOpenChange={(nextOpen) => {
      if (!isMobile && state === "collapsed") {
        setSidebarOpen(true)
        setOpen(true)
      } else {
        setOpen(nextOpen)
      }
    }} className="group/collapsible" render={<SidebarMenuItem />}>
      <CollapsibleTrigger render={
        <SidebarMenuButton tooltip={item.title} isActive={active} />
      }>
        {item.icon}<span>{item.title}</span>
        <span className="ml-auto text-xs text-muted-foreground" aria-label={`${item.title} 완료 개수`}>{item.items.filter(page => completed.has(page.url)).length}/{item.items.length}</span>
        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items.map((page) => (
            <SidebarMenuSubItem key={page.url}>
              <SidebarMenuSubButton
                isActive={pathname === page.url}
                title={page.title}
                aria-current={pathname === page.url ? "page" : undefined}
                onClick={() => setOpenMobile(false)}
                render={<Link href={page.url} />}
              >
                <span>{page.title}</span>
                {completed.has(page.url) && <CheckCircle2Icon aria-label="학습 완료" className="ml-auto size-4 shrink-0 text-emerald-600" />}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function NavMain({ items }: { items: NavGroup[] }) {
  const pathname = usePathname()
  const completed = useStudyProgress()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>학습 주제</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <MenuGroup key={`${item.title}:${pathname}`} item={item} pathname={pathname} completed={completed} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
