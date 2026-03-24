"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuizCard } from "@/components/dashboard/quiz-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getUserQuizzes, Quiz } from "@/lib/user";
import { deleteQuiz } from "@/lib/quiz";
import {
  ArrowLeft,
  Search,
  Bell,
  HelpCircle,
  Upload,
  LayoutGrid,
  List,
  BookOpen,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { goeyToast } from "goey-toast";

// ── Types ──────────────────────────────────────────────────────────────────────
type Filter = "All" | "Published" | "Drafts";
type ViewMode = "grid" | "list";

// ── Page ───────────────────────────────────────────────────────────────────────
export default function MyQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<Filter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Delete dialog
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await getUserQuizzes();
        if (response.success && response.data) {
          setQuizzes(response.data);
        } else {
          setError(response.message || "Failed to load quizzes");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  // Derived data
  const uniqueCategories = useMemo(
    () => Array.from(new Set(quizzes.map((q) => q.category.name))),
    [quizzes]
  );

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        !searchQuery ||
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || quiz.category.name === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === "All" ||
        quiz.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && !quiz.isDraft) ||
        (statusFilter === "Drafts" && quiz.isDraft);
      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [quizzes, searchQuery, categoryFilter, difficultyFilter, statusFilter]);

  // ── Delete handlers ──────────────────────────────────────────────────────
  const handleDeleteRequest = useCallback((quiz: Quiz) => {
    setQuizToDelete(quiz);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return;
    setIsDeleting(true);
    try {
      await deleteQuiz(quizToDelete.id);
      // Optimistically remove from list
      setQuizzes((prev) => prev.filter((q) => q.id !== quizToDelete.id));
      goeyToast.success(`"${quizToDelete.title}" deleted successfully.`);
    } catch (err: any) {
      goeyToast.error(err.message || "Failed to delete quiz.");
    } finally {
      setIsDeleting(false);
      setQuizToDelete(null);
    }
  };

  // ── Early returns ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8fafc]">
        <p className="text-xl font-semibold text-red-500">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="rounded-full bg-purple-600 px-8 font-bold text-white hover:bg-purple-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#f8fafc]">
        {/* ── Top Navbar ───────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
            {/* Left: back + title + search */}
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => router.back()}
                className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-slate-500 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <h1 className="text-xl font-black text-slate-800 shrink-0">My Quizzes</h1>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="quiz-search-input"
                  placeholder="Search your quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-60 rounded-full border-slate-200 bg-slate-50 pl-9 text-sm placeholder:text-slate-400 focus-visible:ring-purple-500 lg:w-72"
                />
              </div>
            </div>

            {/* Right: actions */}
            {/* <div className="flex shrink-0 items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Help">
                <HelpCircle className="h-5 w-5" />
              </button>
              <Button variant="ghost" className="hidden h-9 rounded-full px-4 text-sm font-bold text-slate-600 hover:bg-slate-100 sm:flex">
                <Upload className="mr-1.5 h-4 w-4" />
                Import
              </Button>
              <Button
                asChild
                className="h-9 rounded-full bg-purple-600 px-4 text-sm font-bold text-white shadow-sm shadow-purple-200 hover:bg-purple-700 transition-all hover:scale-[1.03] active:scale-95"
              >
                <Link href="/create">Create Quiz</Link>
              </Button>
            </div> */}
          </div>

          {/* Mobile search */}
          <div className="mx-auto block px-4 pb-3 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search your quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-full border-slate-200 bg-slate-50 pl-9 text-sm placeholder:text-slate-400 focus-visible:ring-purple-500"
              />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          {/* ── Filter Bar ─────────────────────────────────────────────── */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter" className="h-8 w-auto min-w-[120px] rounded-full border-slate-200 bg-white text-xs font-semibold text-slate-600 shadow-sm focus:ring-purple-500">
                  <SelectValue placeholder="Category: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Category: All</SelectItem>
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Difficulty */}
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger id="difficulty-filter" className="h-8 w-auto min-w-[120px] rounded-full border-slate-200 bg-white text-xs font-semibold text-slate-600 shadow-sm focus:ring-purple-500">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Difficulty: All</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Tabs */}
              <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
                {(["All", "Published", "Drafts"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    id={`filter-${f.toLowerCase()}`}
                    onClick={() => setStatusFilter(f)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                      statusFilter === f ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
                <button
                  id="view-grid"
                  onClick={() => setViewMode("grid")}
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${viewMode === "grid" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  id="view-list"
                  onClick={() => setViewMode("list")}
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${viewMode === "list" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  aria-label="List view"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Quiz Grid / List ──────────────────────────────────────── */}
          {filteredQuizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <BookOpen size={52} className="mb-4 opacity-20" />
              <p className="text-lg font-bold">
                {quizzes.length === 0 ? "You haven't created any quizzes yet" : "No quizzes match your filters"}
              </p>
              {quizzes.length === 0 && (
                <Button asChild className="mt-4 rounded-full bg-purple-600 px-6 text-sm font-bold text-white hover:bg-purple-700">
                  <Link href="/create">Create your first quiz</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-3"}>
              {filteredQuizzes.map((quiz) => (
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
                  createdAt={formatDistanceToNow(new Date(quiz.createdAt)) + " ago"}
                  viewMode={viewMode}
                  onDelete={() => handleDeleteRequest(quiz)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Delete Confirmation Dialog ──────────────────────────────── */}
      <AlertDialog open={!!quizToDelete} onOpenChange={(open) => { if (!open && !isDeleting) setQuizToDelete(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-slate-800">
              Delete Quiz?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">"{quizToDelete?.title}"</span>?
              This action <span className="font-bold text-red-500">cannot be undone</span> and will
              permanently remove the quiz and all its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-full border-slate-200 font-bold"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="rounded-full bg-red-500 font-bold text-white hover:bg-red-600 disabled:opacity-70"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting…
                </span>
              ) : (
                "Yes, Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
