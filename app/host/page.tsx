"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Share2,
  Pencil,
  Settings,
  Play,
  Minus,
  Plus,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

// ── Mock data ────────────────────────────────────────────────────────────────

const mockQuiz = {
  title: "Science Giants",
  description: "Explore the minds that changed our world.",
  totalQuestions: 10,
  category: "Science",
  difficulty: "Medium",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateRoomCode(): string {
  const part1 = Math.floor(100 + Math.random() * 900).toString();
  const part2 = Math.floor(100 + Math.random() * 900).toString();
  return `${part1}-${part2}`;
}

const questionOptions = [5, 10, 15, "All"] as const;
type QuestionOption = (typeof questionOptions)[number];

const timerOptions = [10, 20, 30] as const;
type TimerOption = (typeof timerOptions)[number];

// ── Component ────────────────────────────────────────────────────────────────

export default function HostGamePage() {
  const [roomCode] = useState(generateRoomCode);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionOption>(10);
  const [selectedTimer, setSelectedTimer] = useState<TimerOption>(20);
  const [maxPlayers, setMaxPlayers] = useState(25);
  const [isPublicRoom, setIsPublicRoom] = useState(true);
  const [playerCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(roomCode.replace("-", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roomCode]);

  const shareCode = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join my Quizlo game!",
        text: `Join my live quiz session! Room code: ${roomCode}`,
        url: window.location.origin + `/live?code=${roomCode}`,
      });
    } else {
      copyCode();
    }
  }, [roomCode, copyCode]);

  const decrementPlayers = () => setMaxPlayers((p) => Math.max(2, p - 1));
  const incrementPlayers = () => setMaxPlayers((p) => Math.min(100, p + 1));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8 pb-20">
        {/* ── Breadcrumb / Back ── */}
        <Link
          href="/home"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* ── Page Header ── */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Host a Game
          </h1>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">
            Set up your live quiz session
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            MAIN 2-COLUMN LAYOUT
            LEFT  : Quiz Card  +  Game Settings  (stacked)
            RIGHT : Room Lobby (tall)  +  Start Live Game button
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-slide-up">
          {/* ────────────────────────────────────────────────────────────────
              LEFT COLUMN  (3 of 5)
             ──────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* ── Selected Quiz Card ── */}
            <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
              <div className="flex gap-5">
                {/* Quiz thumbnail */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300 to-teal-500 dark:from-teal-600 dark:to-teal-800 shadow-lg">
                  <span className="text-4xl select-none">🧪</span>
                </div>

                {/* Quiz info */}
                <div className="min-w-0 flex-1">
                  {/* Tags */}
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                      {mockQuiz.category}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      {mockQuiz.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-foreground leading-tight">
                    {mockQuiz.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-snug">
                    {mockQuiz.totalQuestions} Questions · {mockQuiz.description}
                  </p>

                  {/* Change Quiz button */}
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/70 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Change Quiz
                  </button>
                </div>
              </div>
            </div>

            {/* ── Game Settings Card ── */}
            <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
              {/* Section title */}
              <div className="mb-7 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                  <Settings className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  Game Settings
                </h2>
              </div>

              {/* ── Questions ── */}
              <div className="mb-7">
                <label className="mb-3 block text-sm font-semibold text-foreground">
                  Questions
                </label>
                <div className="flex gap-3">
                  {questionOptions.map((opt) => (
                    <button
                      key={String(opt)}
                      type="button"
                      onClick={() => setSelectedQuestions(opt)}
                      className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 ${
                        selectedQuestions === opt
                          ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
                          : "border border-border/60 text-foreground hover:border-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Timer per Question ── */}
              <div className="mb-7">
                <label className="mb-3 block text-sm font-semibold text-foreground">
                  Timer per Question
                </label>
                <div className="flex gap-3">
                  {timerOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedTimer(opt)}
                      className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 ${
                        selectedTimer === opt
                          ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
                          : "border border-border/60 text-foreground hover:border-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                    >
                      {opt}s
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Max Players & Public Room ── */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground">
                    Max Players
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={decrementPlayers}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-base font-bold text-foreground tabular-nums">
                      {maxPlayers}
                    </span>
                    <button
                      type="button"
                      onClick={incrementPlayers}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    Public Room
                  </span>
                  <Switch
                    checked={isPublicRoom}
                    onCheckedChange={setIsPublicRoom}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              RIGHT COLUMN  (2 of 5)
             ──────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* ── Room Lobby Card ── */}
            <div className="rounded-2xl border-2 border-purple-200 dark:border-purple-800/60 bg-card p-7 shadow-sm flex-1 flex flex-col">
              <div className="text-center flex-1 flex flex-col">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500 dark:text-purple-400">
                  Room Lobby
                </p>
                <p className="mt-1 text-sm text-muted-foreground font-medium">
                  Room Code
                </p>

                {/* Room Code — big & prominent */}
                <div className="mt-5 flex items-center justify-center gap-3">
                  <span className="text-5xl font-extrabold tracking-widest text-foreground tabular-nums">
                    {roomCode}
                  </span>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={copyCode}
                      className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                      title="Copy code"
                    >
                      <Copy
                        className={`h-5 w-5 transition-colors ${
                          copied ? "text-green-500" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={shareCode}
                      className="rounded-lg p-2 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                      title="Share"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Players count */}
                <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground px-1">
                  <span className="font-semibold">Players</span>
                  <span className="font-bold text-foreground">
                    {playerCount}/{maxPlayers}
                  </span>
                </div>

                {/* Waiting area — grows to fill */}
                <div className="mt-4 flex-1 rounded-2xl bg-muted/40 px-5 py-6 flex items-center justify-center">
                  {playerCount === 0 ? (
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-purple-500" />
                        <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-purple-400 animation-delay-100" />
                      </div>
                      <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
                        Waiting for players to join…
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Share the code above to start the fun!
                      </p>
                    </div>
                  ) : (
                    <p className="text-base font-semibold text-green-600 dark:text-green-400">
                      {playerCount} player{playerCount > 1 ? "s" : ""}{" "}
                      connected!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Start Live Game CTA ── */}
            <button
              type="button"
              className="w-full rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-violet-500 px-8 py-4 text-center text-base font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 animate-scale-in animation-delay-300"
            >
              <Play className="h-5 w-5 fill-white" />
              Start Live Game
            </button>

            {/* ── Host Guidelines ── */}
            <p className="text-center text-xs text-muted-foreground">
              By starting, you agree to our{" "}
              <Link
                href="#"
                className="text-purple-600 dark:text-purple-400 underline underline-offset-2 hover:text-purple-700 dark:hover:text-purple-300"
              >
                host guidelines
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
