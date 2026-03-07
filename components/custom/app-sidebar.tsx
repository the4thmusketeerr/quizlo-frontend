"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { goeyToast } from "@/components/ui/goey-toaster";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  Zap,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Quizzes",
    href: "/dashboard/quizzes",
    icon: BookOpen,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { state, isMobile } = useSidebar();

  const isCollapsed = state === "collapsed" && !isMobile;

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      goeyToast.success("Logged out successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (error) {
      goeyToast.error("Logout failed, but you have been signed out locally");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header: Contains Hamburger Toggle & Branding */}
      <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Hamburger toggle integrated at the top left of the sidebar */}
          <SidebarTrigger className="h-8 w-8 shrink-0 hover:bg-sidebar-accent/50" />

          <div
            className={cn(
              "flex items-center gap-2 overflow-hidden transition-all duration-300",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="whitespace-nowrap text-sm font-bold leading-tight text-sidebar-foreground">
                Quizlo
              </span>
              <span className="whitespace-nowrap text-[10px] uppercase tracking-wider text-muted-foreground">
                Learn Smart
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  size="default"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/10",
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg bg-primary/10" />
                    )}
                    <Icon className="relative z-10 h-5 w-5 shrink-0" />
                    <span className="relative z-10 truncate font-medium">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer / Logout */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isLoggingOut ? "Logging out..." : "Log Out"}
              size="default"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn(
                "text-sidebar-foreground transition-all duration-200",
                "hover:bg-destructive/10 hover:text-destructive",
                isCollapsed && "justify-center",
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="truncate font-medium">
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
