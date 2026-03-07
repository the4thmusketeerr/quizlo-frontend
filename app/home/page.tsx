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

// ── Quick‑action items ───────────────────────────────────────────────────────

const quickActions = [
  {
    id: "create",
    title: "Create a Quiz",
    description: "Design your own challenges",
    icon: Plus,
    href: "/quiz/create",
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

  const [profileData, setProfileData] = useState({
    firstName: "User",
    username: "user",
    email: "user@example.com",
    avatar: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getProfile();
        console.log("Profile Data: ", response);
        if (response.success && response.data) {
          const userData = response.data;
          setProfileData((prev) => ({
            ...prev,
            firstName: userData.firstName || prev.firstName,
            username: userData.username || prev.username,
            email: userData.email || prev.email,
            avatar: userData.profilePicture || prev.avatar,
          }));
        }
      } catch (error) {
        console.log("Error fetching profile: ", error);
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col items-center pb-12 px-4">
      {/* ── Hero Banner ── */}
      <div className="relative mt-4 w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-200 via-sky-100 to-purple-200 dark:from-cyan-900/60 dark:via-sky-900/40 dark:to-purple-900/60 p-8 shadow-lg animate-fade-in">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-purple-300/20 blur-2xl" />

        {/* Emoji row */}
        <div className="relative flex items-end justify-center gap-4 py-6">
          <span
            className="text-4xl animate-float select-none"
            role="img"
            aria-label="lightbulb"
          >
            💡
          </span>
          <span
            className="text-5xl animate-float animation-delay-100 select-none"
            role="img"
            aria-label="trophy"
          >
            🏆
          </span>
          <span
            className="text-4xl animate-float animation-delay-200 select-none"
            role="img"
            aria-label="lightbulb"
          >
            💡
          </span>
        </div>
      </div>

      {/* ── Welcome text ── */}
      <div className="mt-6 text-center animate-slide-up">
        {from === "login" ? (
          <>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {profileData.firstName}!{" "}
              <span role="img" aria-label="waving hand">
                👋
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground font-medium tracking-wide">
              Ready to pick up where you left off?
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome to Quizlo, {profileData.firstName}!{" "}
              <span role="img" aria-label="party popper">
                🎉
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground font-medium tracking-wide">
              Learn. Compete. Level Up.
            </p>
          </>
        )}
      </div>

      

      {/* ── Quick Actions ── */}
      <div className="mt-10 w-full max-w-md animate-slide-up animation-delay-200">
        <h2 className="mb-4 text-lg font-bold text-foreground tracking-tight">
          Quick Actions
        </h2>

        <div className="space-y-3">
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

      {/* ── Level / XP Card ── */}
      <div className="mt-8 w-full max-w-md rounded-2xl border border-border/60 bg-card p-5 shadow-sm animate-slide-up animation-delay-300">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-foreground">
              Level {level} Explorer
            </span>
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            {currentXP} / {maxXP} XP
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        {/* Motivational text */}
        <p className="mt-3 text-center text-xs text-muted-foreground font-medium">
          Complete your first quiz to earn 100 XP!
        </p>
      </div>
    </div>
  );
}
