"use client";

import Link from "next/link";
import { MainLayout } from "@/components/custom/main-layout";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { QuizCard } from "@/components/dashboard/quiz-card";
import { AnimatedCard } from "@/components/custom/animated-card";
import { GradientButton } from "@/components/custom/gradient-button";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Flame, TrendingUp, BookOpen, Zap } from "lucide-react";

const chartData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 78 },
  { day: "Wed", score: 72 },
  { day: "Thu", score: 85 },
  { day: "Fri", score: 90 },
  { day: "Sat", score: 88 },
  { day: "Sun", score: 92 },
];

const recentQuizzes = [
  {
    id: "1",
    title: "Biology: Photosynthesis",
    description: "Learn about light and dark reactions in photosynthesis",
    questionCount: 25,
    difficulty: "Medium" as const,
    category: "Biology",
    lastStudied: "2 days ago",
    accuracy: 85,
  },
  {
    id: "2",
    title: "Spanish Vocabulary",
    description: "Essential Spanish words for everyday conversations",
    questionCount: 50,
    difficulty: "Easy" as const,
    category: "Languages",
    lastStudied: "1 week ago",
    accuracy: 78,
  },
  {
    id: "3",
    title: "Python Advanced Concepts",
    description: "Decorators, generators, and async/await patterns",
    questionCount: 30,
    difficulty: "Hard" as const,
    category: "Programming",
    lastStudied: "3 days ago",
    accuracy: 92,
  },
];

export default function DashboardPage() {
  return (
    <MainLayout>
      <DashboardHeader />

      <main className="space-y-6 px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
          <AnimatedCard hover="scale" className="p-3 md:p-6">
            <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground md:text-sm md:normal-case md:tracking-normal">
                  Streak
                </p>
                <p className="text-lg font-bold text-foreground md:text-3xl">
                  12
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/20 md:h-12 md:w-12">
                <Flame className="h-4 w-4 text-warning md:h-6 md:w-6" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard hover="scale" className="p-3 md:p-6">
            <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground md:text-sm md:normal-case md:tracking-normal">
                  Score
                </p>
                <p className="text-lg font-bold text-foreground md:text-3xl">
                  82%
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20 md:h-12 md:w-12">
                <TrendingUp className="h-4 w-4 text-success md:h-6 md:w-6" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard hover="scale" className="p-3 md:p-6">
            <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground md:text-sm md:normal-case md:tracking-normal">
                  Quizzes
                </p>
                <p className="text-lg font-bold text-foreground md:text-3xl">
                  18
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 md:h-12 md:w-12">
                <BookOpen className="h-4 w-4 text-primary md:h-6 md:w-6" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard hover="scale" className="p-3 md:p-6">
            <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground md:text-sm md:normal-case md:tracking-normal">
                  Points
                </p>
                <p className="text-lg font-bold text-foreground md:text-3xl">
                  2.4k
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 md:h-12 md:w-12">
                <Zap className="h-4 w-4 text-accent md:h-6 md:w-6" />
              </div>
            </div>
          </AnimatedCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart */}
          <div className="lg:col-span-2">
            <AnimatedCard>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Weekly Performance
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your score progression over the last week
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="url(#gradient)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--accent)"
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </AnimatedCard>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <AnimatedCard className="mb-4">
              <h3 className="mb-4 font-semibold text-foreground">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <GradientButton className="w-full" asChild>
                  <Link href="/quiz/generator">Create New Quiz</Link>
                </GradientButton>
                <button className="w-full rounded-lg border-2 border-primary bg-transparent px-4 py-2 text-primary font-semibold transition-smooth hover:bg-primary/10">
                  Browse Quizzes
                </button>
                <button className="w-full rounded-lg border-2 border-accent bg-transparent px-4 py-2 text-accent font-semibold transition-smooth hover:bg-accent/10">
                  Join Live Game
                </button>
              </div>
            </AnimatedCard>

            <AnimatedCard hover="glow">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Premium
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upgrade for more features
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Recent Quizzes */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Your Quizzes
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage and study your favorite quizzes
              </p>
            </div>
            <GradientButton asChild>
              <Link href="/dashboard/quizzes">View All</Link>
            </GradientButton>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} {...quiz} />
            ))}
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
