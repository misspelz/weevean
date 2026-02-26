"use client";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggleSubMenu = () => {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-1">
        <SunMoon className="w-5 h-5 text-muted-foreground" /> Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem
          className={`${theme === "light" ? "bg-accent" : ""}`}
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`${theme === "dark" ? "bg-accent" : ""}`}
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`${theme === "system" ? "bg-accent" : ""}`}
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
