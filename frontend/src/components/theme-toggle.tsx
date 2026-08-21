"use client";

import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

const themes = [
  { value: "light", label: "화이트 모드", icon: SunIcon },
  { value: "dark", label: "다크 모드", icon: MoonIcon },
  { value: "system", label: "시스템 모드", icon: MonitorIcon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const ActiveIcon =
    themes.find((item) => item.value === theme)?.icon ?? MonitorIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <ActiveIcon />
        <span className="sr-only">테마 변경</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => setTheme(item.value)}
              className="justify-between"
            >
              <span className="flex items-center gap-2">
                <Icon />
                {item.label}
              </span>
              {theme === item.value ? <CheckIcon /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
