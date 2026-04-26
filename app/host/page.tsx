"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
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
  Loader2,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { getAllQuizzes, Quiz } from "@/lib/quiz";
import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function HostGamePage() {
  const { profile, categories, setCategories } = useAppStore();
  const currentUserId = profile?.id;

  const [roomCode] = useState(generateRoomCode);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionOption>(10);
  const [selectedTimer, setSelectedTimer] = useState<TimerOption>(20);
  const [maxPlayers, setMaxPlayers] = useState(25);
  const [isPublicRoom, setIsPublicRoom] = useState(true);
  const [playerCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);

  // Pagination — separate page per section
  const PAGE_SIZE = 10;
  const [modalPage, setModalPage] = useState(1);
  const [modalSearch, setModalSearch] = useState("");
  const [modalCreator, setModalCreator] = useState<"all" | "mine" | "others">("all");
  const [modalDifficulty, setModalDifficulty] = useState("All");
  const [modalCategory, setModalCategory] = useState("All");
  const [modalCreationMode, setModalCreationMode] = useState("All");
  const [modalSort, setModalSort] = useState<"newest" | "oldest" | "popular" | "unpopular">("newest");

  // Derived filter/sort/pagination for modal — always computed so Dialog content stays in sync
  const { filteredQuizzes, pagedQuizzes, totalPages } = useMemo(() => {
    let filtered = quizzes.filter(q => {
      if (modalSearch && !q.title.toLowerCase().includes(modalSearch.toLowerCase())) return false;
      if (modalCreator === "mine" && q.creatorId !== currentUserId) return false;
      if (modalCreator === "others" && q.creatorId === currentUserId) return false;
      if (modalDifficulty !== "All" && q.difficulty !== modalDifficulty) return false;
      if (modalCategory !== "All" && (q.category?.name || "Uncategorized") !== modalCategory) return false;
      if (modalCreationMode !== "All" && q.creationMode !== modalCreationMode) return false;
      return true;
    });

    filtered = [...filtered].sort((a, b) => {
      if (modalSort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (modalSort === "popular") return b.plays - a.plays;
      if (modalSort === "unpopular") return a.plays - b.plays;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((modalPage - 1) * PAGE_SIZE, modalPage * PAGE_SIZE);

    return { filteredQuizzes: filtered, pagedQuizzes: paged, totalPages: total };
  }, [quizzes, modalSearch, modalCreator, modalDifficulty, modalSort, modalPage, currentUserId, PAGE_SIZE]);

  useEffect(() => {
    async function loadData() {
      setIsLoadingQuizzes(true);
      try {
        // Load Quizzes
        let data: any = await getAllQuizzes();
        if (data && data.success && Array.isArray(data.data)) {
          data = data.data;
        } else if (!Array.isArray(data)) {
          data = [];
        }
        setQuizzes(data as Quiz[]);
        if ((data as Quiz[]).length > 0) {
          setSelectedQuiz((data as Quiz[])[0]);
        }

        // Load Categories if not already in store
        if (categories.length === 0) {
          const { getCategoryData } = await import("@/lib/quiz");
          const catData = await getCategoryData();
          setCategories(catData);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setIsLoadingQuizzes(false);
      }
    }
    loadData();
  }, []);

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
            <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
              {/* Cover strip — quiz image or gradient fallback */}
              {selectedQuiz?.coverPicture ? (
                <div
                  className="h-32 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedQuiz.coverPicture})` }}
                />
              ) : (
                <div className="h-32 w-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 dark:from-purple-700 dark:via-violet-700 dark:to-indigo-700" />
              )}

              {/* Content area */}
              <div className="p-5">
                {selectedQuiz ? (
                  <>
                    {/* Badges row */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                        {selectedQuiz.category?.name || "Uncategorized"}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${difficultyColors[selectedQuiz.difficulty] || "bg-amber-100 text-amber-700"}`}>
                        {selectedQuiz.difficulty || "Medium"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                        {selectedQuiz._count?.questions || 0} Questions
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-foreground leading-tight line-clamp-1">
                      {selectedQuiz.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-snug line-clamp-2">
                      {selectedQuiz.description || "No description provided."}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <p className="text-sm text-muted-foreground">No quiz selected yet.</p>
                    <button
                      type="button"
                      onClick={() => setIsQuizModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 px-5 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                    >
                      Choose Quiz
                    </button>
                  </div>
                )}

                {/* Footer row — only shown when a quiz is selected */}
                {selectedQuiz && (
                  <div className="mt-4 flex items-center justify-between">
                    {/* Creator chip */}
                    {selectedQuiz.creator && (
                      <div className="flex items-center gap-2">
                        {selectedQuiz.creator.profilePicture ? (
                          <img
                            src={selectedQuiz.creator.profilePicture}
                            alt={selectedQuiz.creator.username}
                            className="h-6 w-6 rounded-full object-cover ring-1 ring-border"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-[10px] font-bold text-purple-700 dark:text-purple-300">
                            {selectedQuiz.creator.username?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground font-medium">
                          {selectedQuiz.creator.username}
                        </span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="ml-auto flex items-center gap-2">
                      {/* Edit — swap quiz */}
                      <button
                        type="button"
                        onClick={() => setIsQuizModalOpen(true)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
                        title="Change quiz"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete — clear selection */}
                      <button
                        type="button"
                        onClick={() => setSelectedQuiz(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        title="Remove quiz"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
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
              {/* <div className="mb-7">
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
              </div> */}

              {/* ── Timer per Question ── */}
              {/* <div className="mb-7">
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
              </div> */}

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

                {/* <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    Public Room
                  </span>
                  <Switch
                    checked={isPublicRoom}
                    onCheckedChange={setIsPublicRoom}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div> */}
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

      {/* ── Quiz Selection Modal ── */}
      <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
        <DialogContent className="w-[92vw] sm:w-full max-w-2xl max-h-[85vh] p-0 rounded-3xl border border-border/50 overflow-hidden flex flex-col gap-0">

          {/* Header */}
          <DialogHeader className="border-b border-border/50 px-6 py-5 bg-card shrink-0 space-y-1">
            <DialogTitle className="text-xl font-bold text-foreground">
              Select a Quiz
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {filteredQuizzes.length} of {quizzes.length} quizzes
            </DialogDescription>
          </DialogHeader>

          {/* Filter bar */}
          <div className="shrink-0 border-b border-border/50 bg-card/60 px-6 py-4 flex flex-col gap-3">
            {/* Search - Top Row */}
            <Input
              type="text"
              placeholder="Search quizzes..."
              value={modalSearch}
              onChange={e => { setModalSearch(e.target.value); setModalPage(1); }}
              className="w-full h-10 text-sm"
            />

            {/* Selects Row - Bottom Row (Forced on one line) */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide p-2 pb-2">
              {/* Creator filter */}
              <Select
                value={modalCreator}
                onValueChange={v => { setModalCreator(v as any); setModalPage(1); }}
              >
                <SelectTrigger className="h-8 w-fit gap-1.5 px-3 text-xs font-semibold shrink-0 rounded-lg border-border bg-card">
                  <SelectValue placeholder="Creator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quizzes</SelectItem>
                  <SelectItem value="mine">My Quizzes</SelectItem>
                  <SelectItem value="others">Community</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select
                value={modalCategory}
                onValueChange={v => { setModalCategory(v); setModalPage(1); }}
              >
                <SelectTrigger className="h-8 w-fit gap-1.5 px-3 text-xs font-semibold shrink-0 rounded-lg border-border bg-card">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Difficulty */}
              <Select
                value={modalDifficulty}
                onValueChange={v => { setModalDifficulty(v); setModalPage(1); }}
              >
                <SelectTrigger className="h-8 w-fit gap-1.5 px-3 text-xs font-semibold shrink-0 rounded-lg border-border bg-card">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent className="min-w-[160px]">
                  <SelectItem value="All">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              {/* Creation Mode */}
              <Select
                value={modalCreationMode}
                onValueChange={v => { setModalCreationMode(v); setModalPage(1); }}
              >
                <SelectTrigger className="h-8 w-fit gap-1.5 px-3 text-xs font-semibold shrink-0 rounded-lg border-border bg-card">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Modes</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={modalSort}
                onValueChange={v => { setModalSort(v as any); setModalPage(1); }}
              >
                <SelectTrigger className="h-8 w-fit gap-1.5 px-3 text-xs font-semibold shrink-0 rounded-lg border-border bg-card">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest to Oldest</SelectItem>
                  <SelectItem value="oldest">Oldest to Newest</SelectItem>
                  <SelectItem value="popular">Popularity(Most to Least)</SelectItem>
                  <SelectItem value="unpopular">Popularity(Least to Most)</SelectItem>
                </SelectContent>
              </Select>

            </div>

            {/* Clear filters Row — Centered below Selects */}
            {(modalSearch || modalCreator !== "all" || modalDifficulty !== "All" || modalCategory !== "All" || modalCreationMode !== "All" || modalSort !== "newest") && (
              <div className="flex justify-center -mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setModalSearch("");
                    setModalCreator("all");
                    setModalDifficulty("All");
                    setModalCategory("All");
                    setModalCreationMode("All");
                    setModalSort("newest");
                    setModalPage(1);
                  }}
                  className="h-8 px-4 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoadingQuizzes ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-purple-600" />
                <p>Loading quizzes...</p>
              </div>
            ) : pagedQuizzes.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="font-medium">No quizzes match your filters.</p>
                <p className="text-xs mt-1">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pagedQuizzes.map(quiz => (
                  <div
                    key={quiz.id}
                    onClick={() => { setSelectedQuiz(quiz); setIsQuizModalOpen(false); }}
                    className={`cursor-pointer rounded-2xl border-2 p-3 transition-all duration-200 flex items-center gap-4 ${
                      selectedQuiz?.id === quiz.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10 shadow-md"
                        : "border-border/50 bg-card hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm"
                    }`}
                  >
                    {/* Left: Cover Picture */}
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/40">
                      <img 
                        src={quiz.coverPicture || "https://placehold.net/600x600.png"} 
                        alt={quiz.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground line-clamp-1 text-sm">{quiz.title}</h4>
                      <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                        {quiz.description || "No description"}
                      </p>
                      
                      <div className="mt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-purple-600 dark:text-purple-400 truncate mr-2">
                          {quiz.category?.name || "Uncategorized"}
                        </span>
                        <div className="flex gap-1.5 shrink-0">
                          <span className={`${difficultyColors[quiz.difficulty] || "text-amber-600 dark:text-amber-400"} px-1.5 py-0.5 rounded-md`}>
                            {quiz.difficulty || "Medium"}
                          </span>
                          <span className="text-black dark:text-white dark:bg-white/10 px-1.5 py-0.5 rounded-md">
                            {quiz._count?.questions || 0} Qs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paginator */}
          {totalPages > 1 && (
            <div className="shrink-0 border-t border-border/50 px-6 py-4 flex items-center justify-center gap-3 bg-card/60">
              <button
                onClick={() => setModalPage(p => Math.max(1, p - 1))}
                disabled={modalPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted/50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                {modalPage} / {totalPages}
              </span>
              <button
                onClick={() => setModalPage(p => Math.min(totalPages, p + 1))}
                disabled={modalPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted/50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
}
