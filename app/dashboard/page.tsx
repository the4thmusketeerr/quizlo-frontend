"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedCard } from "@/components/custom/animated-card";
import { QuizCard } from "@/components/dashboard/quiz-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  Zap, 
  Plus, 
  Users, 
  Search, 
  Pencil, 
  PlayCircle,
  Layout,
  CheckCircle2,
  Trophy,
  Settings,
  BookOpen,
  ChevronLeft
} from "lucide-react";
import { getDashboardData, DashboardData, getLevelLabel } from "@/lib/user";
import { formatDistanceToNow } from "date-fns";

// Tier colour map
const TIER_COLORS: Record<string, string> = {
  Beginner: "#9ca3af",
  Bronze:   "#b45309",
  Silver:   "#6b7280",
  Gold:     "#d97706",
  Platinum: "#0891b2",
  Diamond:  "#7c3aed",
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getDashboardData();
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message || "Failed to load dashboard data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <p className="text-xl font-semibold text-destructive">{error || "No data available"}</p>
        <Button onClick={() => window.location.reload()} className="rounded-full bg-purple-600 px-8 font-bold text-white hover:bg-purple-700">
          Retry
        </Button>
      </div>
    );
  }

  const { profile, statistics, recentActivity, myQuizzes, goals } = data;

  // Use server-provided xpProgress if available, else fall back
  const xpProgress = goals?.xpProgress;
  const progressPercent = xpProgress?.progressPercentage ?? Math.min((profile.xp / 3000) * 100, 100);
  const isMaxLevel = xpProgress?.xpToNextLevel === null;
  const levelLabel = xpProgress?.label ?? getLevelLabel(profile.level);
  const tierName = xpProgress?.tier ?? "";
  const tierColor = TIER_COLORS[tierName] ?? "#9ca3af";
  const xpIntoLevel = xpProgress?.xpIntoLevel ?? 0;
  const xpTotal = xpProgress ? (isMaxLevel ? xpIntoLevel : xpIntoLevel + (xpProgress.xpToNextLevel ?? 0)) : profile.xp;

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8 pb-12">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="group h-10 rounded-full px-4 font-bold text-muted-foreground hover:bg-accent hover:text-purple-600 hover:shadow-sm"
          >
            <ChevronLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </div>

        {/* Profile Banner — keeps its own gradient, always looks great */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#9333ea] to-[#a855f7] p-8 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 bg-purple-100/10 shadow-inner">
                  <img 
                    src={profile.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                    alt={profile.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 right-0 rounded-xl bg-[#fcd34d] px-2.5 py-1 text-[10px] font-black text-black shadow-lg ring-2 ring-[#9333ea] whitespace-nowrap">
                  LVL {profile.level}
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-black tracking-tight">{profile.username}</h1>
                <p className="mt-1 text-sm font-semibold text-white/70 italic">{levelLabel}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-3 md:justify-start">
                  <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur-md">
                    <Zap className="h-4 w-4 fill-[#fcd34d] text-[#fcd34d]" />
                    <span>{profile.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur-md">
                    <Flame className="h-4 w-4 fill-[#f97316] text-[#f97316]" />
                    <span>{profile.streak} Day Streak</span>
                  </div>
                  {tierName && (
                    <div
                      className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-black backdrop-blur-md"
                      style={{ backgroundColor: `${tierColor}30`, color: tierColor, border: `1.5px solid ${tierColor}60` }}
                    >
                      {tierName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl"></div>
          <div className="absolute right-10 bottom-0 opacity-10">
             <Trophy size={160} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* Level Progress Card */}
            <AnimatedCard className="overflow-hidden rounded-[2.5rem] border-none p-8 shadow-sm ring-1 ring-border/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-foreground">Level Progress</h3>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-muted-foreground">
                      Level {profile.level} · <span className="text-foreground font-semibold">{levelLabel}</span>
                    </p>
                    {tierName && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest"
                        style={{ backgroundColor: `${tierColor}18`, color: tierColor, border: `1px solid ${tierColor}50` }}
                      >
                        {tierName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 px-4 py-2 text-sm font-black text-purple-600 dark:text-purple-400">
                  {isMaxLevel ? "MAX" : `${Math.round(progressPercent)}%`}
                </div>
              </div>
              
              <div className="mt-8">
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 transition-all duration-1000 ease-out"
                    style={{ width: isMaxLevel ? "100%" : `${progressPercent}%` }}
                  />
                  {isMaxLevel && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-black text-white tracking-widest uppercase">Max Level</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>{xpIntoLevel} XP</span>
                  {!isMaxLevel && (
                    <span className="rounded-full bg-purple-500/10 dark:bg-purple-500/20 px-3 py-1 text-purple-600 dark:text-purple-400">
                      {xpProgress ? `${xpProgress.xpToNextLevel} XP to Level ${profile.level + 1}` : ""}
                    </span>
                  )}
                  <span>{isMaxLevel ? "∞" : `${xpTotal} XP`}</span>
                </div>
              </div>
            </AnimatedCard>

            {/* Stats Summary Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <AnimatedCard className="flex flex-col items-center border-none p-6 text-center shadow-sm ring-1 ring-border/50 transition-all hover:shadow-md">
                <p className="mt-4 text-2xl font-black text-foreground">{statistics.totalQuizzesPlayed || 0}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quizzes Played</p>
              </AnimatedCard>

              <AnimatedCard className="flex flex-col items-center border-none p-6 text-center shadow-sm ring-1 ring-border/50 transition-all hover:shadow-md">
                <p className="mt-4 text-2xl font-black text-foreground">{statistics.totalQuizzesCreated || 0}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quizzes Created</p>
              </AnimatedCard>

              <AnimatedCard className="flex flex-col items-center border-none p-6 text-center shadow-sm ring-1 ring-border/50 transition-all hover:shadow-md">
                <p className="mt-4 text-2xl font-black text-foreground">{statistics.averageAccuracy.toFixed(0) || 0}%</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Avg Accuracy</p>
              </AnimatedCard>

              <AnimatedCard className="flex flex-col items-center border-none p-6 text-center shadow-sm ring-1 ring-border/50 transition-all hover:shadow-md">
                <p className="mt-4 text-2xl font-black text-foreground">{statistics.totalXPEarned || 0}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total XP</p>
              </AnimatedCard>
            </div>

            {/* Quizzes Created Section */}
            <div>
              <div className="flex items-center justify-between pb-6 px-2">
                <h2 className="text-2xl font-black text-foreground">Quizzes Created</h2>
                <Link href="/dashboard/quizzes" className="text-sm font-black text-purple-600 dark:text-purple-400 transition-colors hover:text-purple-700 dark:hover:text-purple-300">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myQuizzes.map((quiz) => (
                  <QuizCard 
                    key={quiz.id} 
                    id={quiz.id}
                    title={quiz.title}
                    description={quiz.description}
                    questionCount={quiz._count.questions}
                    difficulty={quiz.difficulty as 'Easy' | 'Medium' | 'Hard'}
                    category={quiz.category.name}
                    plays={quiz.plays}
                    timeAllocated={quiz.timeAllocated}
                    isPrivate={quiz.isPrivate}
                    isDraft={quiz.isDraft}
                    creationMode={quiz.creationMode}
                    updatedAt={formatDistanceToNow(new Date(quiz.updatedAt)) + " ago"}
                  />
                ))}
                {myQuizzes.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground bg-card rounded-[2.5rem] ring-1 ring-border/50 shadow-sm">
                    <BookOpen size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">You haven't created any quizzes yet</p>
                    <Button asChild variant="link" className="text-purple-600 dark:text-purple-400 font-bold mt-2">
                      <Link href="/create">Create your first quiz</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div>
              <div className="flex items-center justify-between pb-6 px-2">
                <h2 className="text-2xl font-black text-foreground">Recent Activity</h2>
                <Link href="/dashboard/activity" className="text-sm font-black text-purple-600 dark:text-purple-400 transition-colors hover:text-purple-700 dark:hover:text-purple-300">View All</Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <AnimatedCard key={activity.id} className="flex items-center justify-between border-none p-5 shadow-sm ring-1 ring-border/50 transition-all hover:shadow-md">
                    <div className="flex items-center gap-5">
                      {/* <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
                        <Layout className="h-6 w-6 text-white" />
                      </div> */}
                      <div className="min-w-0">
                        <h4 className="truncate text-lg font-black text-foreground">{activity.quiz.title}</h4>
                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                          <span className="text-blue-500">Medium</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(activity.completedAt))} ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <div className="text-2xl font-black text-green-500">{activity.accuracy.toFixed(0)}%</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accuracy</div>
                    </div>
                  </AnimatedCard>
                ))}
                {recentActivity.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Layout size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">No recent activity yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions Sidebar */}
            <div className="space-y-4">
              <h3 className="px-2 text-xl font-black text-foreground">Quick Actions</h3>
              <Button asChild className="h-16 w-full justify-start rounded-[2.5rem] bg-[#9333ea] px-6 text-lg font-black shadow-xl shadow-purple-200/50 dark:shadow-purple-900/40 transition-all hover:scale-[1.02] hover:bg-purple-700 active:scale-[0.98]">
                <Link href="/create">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  Create a Quiz
                </Link>
              </Button>
              <Button asChild className="h-16 w-full justify-start rounded-[2.5rem] bg-[#fcd34d] px-6 text-lg font-black text-black shadow-xl shadow-yellow-200/50 dark:shadow-yellow-900/30 transition-all hover:scale-[1.02] hover:bg-yellow-400 active:scale-[0.98]">
                <Link href="/join">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5">
                    <Users className="h-6 w-6" />
                  </div>
                  Join a Room
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 w-full justify-start rounded-[2.5rem] border-none bg-muted px-6 text-lg font-black text-foreground shadow-sm ring-1 ring-border/50 transition-all hover:bg-accent hover:text-foreground hover:scale-[1.02] active:scale-[0.98]">
                <Link href="/explore">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-2xl">
                    <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  Explore Quizzes
                </Link>
              </Button>
            </div>

            {/* Leaderboard Sidebar Card */}
            <AnimatedCard className="overflow-hidden rounded-[2.5rem] border-none p-8 shadow-sm ring-1 ring-border/50">
              <div className="flex items-center justify-between pb-8">
                <h3 className="text-xl font-black text-foreground">Leaderboard</h3>
                <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-700 dark:text-yellow-400 ring-1 ring-yellow-200 dark:ring-yellow-800">
                  PRO LEAGUE
                </Badge>
              </div>
              
              <div className="space-y-6">
                {[
                  { rank: 1, name: "QuizMaster_99", xp: 3420, seed: "Felix" },
                  { rank: 2, name: "SaraBrainy", xp: 2980, seed: "Aneka" },
                ].map((user) => (
                  <div key={user.rank} className="group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="w-4 text-xs font-black text-muted-foreground/50">{user.rank}</span>
                      <div className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-border transition-all group-hover:ring-purple-300 shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.seed}`} alt={user.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{user.name}</span>
                    </div>
                    <span className="text-sm font-black text-purple-600 dark:text-purple-400">{user.xp} XP</span>
                  </div>
                ))}
                
                {/* Current User Row */}
                <div className="flex items-center justify-between rounded-[1.5rem] bg-purple-500/10 dark:bg-purple-500/20 p-3 ring-1 ring-purple-200 dark:ring-purple-800">
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-xs font-black text-purple-400">3</span>
                    <div className="h-11 w-11 overflow-hidden rounded-full ring-4 ring-background shadow-md">
                      <img 
                        src={profile.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                        alt="You" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-black text-foreground underline decoration-purple-400 decoration-2 underline-offset-4">You</span>
                  </div>
                  <span className="text-sm font-black text-purple-600 dark:text-purple-400">{profile.xp} XP</span>
                </div>
              </div>

              <div className="mt-10 text-center">
                <Link href="/leaderboard" className="text-sm font-black text-muted-foreground transition-colors hover:text-foreground">
                  See full rankings
                </Link>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </main>
  );
}
