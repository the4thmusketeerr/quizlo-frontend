"use client";

import React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="transition-all duration-300 ease-in-out">
        {/*
          Content Header: 
          On Desktop, the hamburger is inside the sidebar.
          On Mobile, the sidebar is hidden, so we show a hamburger here to open it.
        */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 bg-background/80 backdrop-blur-md px-4 md:h-0 md:border-none md:bg-transparent md:backdrop-blur-none">
          <SidebarTrigger
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/10"
            aria-label="Open Sidebar"
          />
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
