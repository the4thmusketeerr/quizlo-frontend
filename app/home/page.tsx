"use client";

import Link from "next/link";
import {
  ChevronRight,
  Plus,
  Users,
  Compass,
  Star,
  Gamepad2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getProfile } from "@/lib/user";
import { useEffect, useState, Suspense } from "react";
import { useAppStore } from "@/store/useAppStore";
import { goeyToast } from "@/components/ui/goey-toaster";

// ── Quick‑action items ───────────────────────────────────────────────────────

const quickActions = [
  {
    id: "create",
    title: "Create a Quiz",
    description: "Design your own challenges",
    icon: Plus,
    href: "/create",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "join",
    title: "Join a Room",
    description: "Play with your friends live",
    icon: Users,
    href: "/join",
    bgColor: "bg-sky-50 dark:bg-sky-950/40",
    iconBg: "bg-sky-100 dark:bg-sky-900/60",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "host",
    title: "Host a Game",
    description: "Set up & host a live quiz session",
    icon: Gamepad2,
    href: "/host",
    bgColor: "bg-violet-50 dark:bg-violet-950/40",
    iconBg: "bg-violet-100 dark:bg-violet-900/60",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "explore",
    title: "Explore Quizzes",
    description: "Discover trending topics",
    icon: Compass,
    href: "/explore",
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
    iconBg: "bg-amber-100 dark:bg-amber-900/60",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from"); // "signup" | "login" | null

  const userName = "Alex";
  const currentXP = 0;
  const maxXP = 500;
  const level = 1;
  const xpPercent = Math.min((currentXP / maxXP) * 100, 100);

  const { profile: storeProfile, setProfile: setStoreProfile } = useAppStore();

  const profileData = {
    firstName: storeProfile?.firstName || "User",
    username: storeProfile?.username || "user",
    email: storeProfile?.email || "user@example.com",
    avatar: storeProfile?.profilePicture || "",
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getProfile();
        if (response.success && response.data) {
          setStoreProfile(response.data);

          // Daily login XP bonus toast
          if (response.dailyLoginXP && response.dailyLoginXP > 0) {
            goeyToast(`🎉 Daily Login Bonus! +${response.dailyLoginXP} XP`, {
              duration: 3000,
            });
          }
        }
      } catch (error) {
        console.log("Error fetching profile: ", error);
      }
    }

    fetchProfile();
  }, [setStoreProfile]);

  return (
    <div className="flex flex-col items-center pb-12 px-4">
      {/* ── Redesigned Hero section ── */}
      <div className="relative mt-6 w-full max-w-2xl overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-[#E0F2FE] via-[#F0F9FF] to-[#F5F3FF] dark:from-[#0C4A6E] dark:via-[#075985] dark:to-[#4C1D95] p-6 md:p-10 shadow-xl border border-white/20 dark:border-white/5 animate-fade-in group">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-400/10 blur-[80px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-purple-400/10 blur-[80px]" />

        <div className="relative flex items-center justify-between gap-4 md:gap-8">
          {/* Content side */}
          <div className="flex-1 text-left space-y-4 md:space-y-6">
            <div className="space-y-1.5 md:space-y-3">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-[#1E40AF] dark:text-[#BFDBFE] leading-tight whitespace-nowrap">
                {from === "login" 
                  ? `Welcome back, ${profileData.firstName}!` 
                  : `Welcome to Quizlo, ${profileData.firstName}!`}
              </h1>
              <p className="text-xs md:text-base font-semibold text-[#3B82F6] dark:text-[#60A5FA] whitespace-nowrap">
                {from === "login" 
                  ? "Ready for today's challenge?" 
                  : "Learn. Compete. Level Up."
                }
              </p>
            </div>
            
            <Link 
              href="/explore" 
              className="inline-flex items-center gap-1.5 rounded-xl md:rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-md px-4 py-2 md:px-8 md:py-3.5 text-xs md:text-base font-bold text-[#1E40AF] dark:text-white border border-white/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 transition-all duration-300 shadow-sm hover:shadow-md group/btn"
            >
              Start a Quiz
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>

          {/* Image side */}
          {/* <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-52 md:h-52 animate-float">
            
            <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 text-lg md:text-2xl animate-pulse select-none">✨</div>
            <div className="absolute top-1/2 -left-4 md:-left-6 text-base md:text-xl animate-bounce delay-150 select-none">⭐</div>
            <img 
              src="/home/owl.png" 
              alt="Quizlo Owl" 
              className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div> */}
        </div>
      </div>

      

      {/* ── Quick Actions ── */}
      <div className="mt-10 w-full max-w-2xl animate-slide-up animation-delay-200">
        <h2 className="mb-4 text-lg font-bold text-foreground tracking-tight px-1">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                href={action.href}
                className={`group flex items-center gap-4 rounded-2xl ${action.bgColor} p-4 border border-transparent hover:border-border/60 shadow-sm hover:shadow-md transition-all duration-200`}
              >
                {/* Icon circle */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${action.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {action.description}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      
    </div>
  );
}
