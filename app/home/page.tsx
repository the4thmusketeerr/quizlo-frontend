"use client";

import Link from "next/link";
import { Star, ChevronRight, Play } from "lucide-react";

// ── Placeholder data ──────────────────────────────────────────────────────────

const continueQuizzes = [
  {
    id: "1",
    title: "Space Explorers",
    questions: 12,
    progress: 40,
    color: "from-yellow-400 to-orange-400",
    emoji: "🚀",
  },
  {
    id: "2",
    title: "World History",
    questions: 20,
    progress: 70,
    color: "from-purple-400 to-pink-400",
    emoji: "🌍",
  },
  {
    id: "3",
    title: "Biology Basics",
    questions: 15,
    progress: 20,
    color: "from-green-400 to-teal-400",
    emoji: "🧬",
  },
];

const friends = [
  { id: "1", name: "Alice", initials: "A", color: "from-pink-400 to-rose-500" },
  { id: "2", name: "Bob", initials: "B", color: "from-blue-400 to-indigo-500" },
  {
    id: "3",
    name: "Carol",
    initials: "C",
    color: "from-amber-400 to-orange-500",
  },
  { id: "4", name: "Dan", initials: "D", color: "from-teal-400 to-green-500" },
  {
    id: "5",
    name: "Eva",
    initials: "E",
    color: "from-purple-400 to-violet-500",
  },
  { id: "6", name: "Frank", initials: "F", color: "from-red-400 to-pink-500" },
];

const categories = ["All", "Science", "Math", "Music", "History", "Coding"];

const latestQuizzes = [
  {
    id: "1",
    title: "Math Quiz",
    description: "Practice your math skills!",
    tag: "Math",
    color: "from-blue-500 to-indigo-600",
    emoji: "➗",
  },
  {
    id: "2",
    title: "Science Trivia",
    description: "Test your science knowledge",
    tag: "Science",
    color: "from-green-500 to-teal-600",
    emoji: "🔬",
  },
  {
    id: "3",
    title: "Music Theory",
    description: "Learn the notes and chords",
    tag: "Music",
    color: "from-purple-500 to-pink-600",
    emoji: "🎵",
  },
  {
    id: "4",
    title: "World Capitals",
    description: "Can you name them all?",
    tag: "History",
    color: "from-orange-500 to-amber-600",
    emoji: "🗺️",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="space-y-8 pb-10">
      {/* ── Greeting ── */}
      <section>
        <p className="text-sm font-medium text-muted-foreground">
          Hi, <span className="text-foreground font-semibold">Catlyne 👋</span>
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Let&apos;s continue a quiz!
        </h1>

        {/* XP progress bar */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-3 sm:max-w-sm shadow-sm">
          <Star className="h-5 w-5 shrink-0 text-yellow-400 fill-yellow-400" />
          <div className="flex-1 min-w-0">
            <div className="mb-1 flex items-center justify-between text-xs font-medium">
              <span className="text-muted-foreground">Level Progress</span>
              <span className="text-foreground font-semibold">323 XP</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                style={{ width: "45%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Continue Quiz Carousel ── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Continue Quiz</h2>
          <Link
            href="/dashboard/quizzes"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
          >
            See All
          </Link>
        </div>

        {/* Horizontally scrollable row */}
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {continueQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`relative flex-shrink-0 w-64 sm:w-72 rounded-2xl bg-gradient-to-br ${quiz.color} p-5 shadow-md snap-start`}
            >
              {/* Emoji decoration */}
              <span className="absolute right-4 top-4 text-4xl opacity-80 select-none">
                {quiz.emoji}
              </span>

              <p className="text-base font-bold text-white">{quiz.title}</p>
              <p className="mt-0.5 text-xs text-white/80">
                {quiz.questions} questions
              </p>

              {/* Progress */}
              <div className="mt-4 h-1.5 w-full rounded-full bg-white/30 overflow-hidden">
                <div
                  className="h-1.5 rounded-full bg-white transition-all duration-700"
                  style={{ width: `${quiz.progress}%` }}
                />
              </div>

              {/* CTA */}
              <button className="mt-4 flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-smooth px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                <Play className="h-3.5 w-3.5 fill-white" />
                Let&apos;s go!
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── My Friends ── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">My Friends</h2>
          <Link
            href="#"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
          >
            See All
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {friends.map((friend) => (
            <button
              key={friend.id}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div
                className={`h-14 w-14 rounded-full bg-gradient-to-br ${friend.color} flex items-center justify-center text-white text-lg font-bold shadow-md ring-2 ring-background group-hover:ring-primary/40 transition-smooth`}
              >
                {friend.initials}
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {friend.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-foreground">Category</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-smooth ${
                i === 0
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "border border-border/60 text-foreground hover:border-primary/60 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Latest Quizzes ── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Latest Quiz</h2>
          <Link
            href="/dashboard/quizzes"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
          >
            See All
          </Link>
        </div>

        <div className="space-y-3">
          {latestQuizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-smooth group"
            >
              {/* Icon */}
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${quiz.color} text-2xl shadow-sm`}
              >
                {quiz.emoji}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                  {quiz.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground truncate">
                  {quiz.description}
                </p>
                <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {quiz.tag}
                </span>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-smooth" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
