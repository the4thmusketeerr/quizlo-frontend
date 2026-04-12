"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/quiz-logo.png"
            alt="Quizlo Logo"
            width={106}
            height={106}
            className="rounded-lg object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-sm font-semibold text-foreground hover:bg-[#A855F7]/10 hover:text-[#A855F7]"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            className="rounded-full bg-gradient-to-r from-[#A855F7] to-indigo-600 px-6 font-bold text-white shadow-lg shadow-purple-500/25 transition-smooth hover:scale-105 hover:shadow-purple-500/40 active:scale-95"
            asChild
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
