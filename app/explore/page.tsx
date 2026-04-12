"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Eye,
  Zap,
  Brain,
  Code2,
  Dumbbell,
  Landmark,
  Palette,
  Atom,
  Globe2,
  Sparkles,
  ArrowLeft,
  Clock,
  HelpCircle,
  User,
  icons,
  type LucideIcon,
} from "lucide-react";
import {
  getCategoryData,
  getAllQuizzes,
  type Category as CategoryType,
  type Quiz,
} from "@/lib/quiz";
import { useAppStore } from "@/store/useAppStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// ── Dynamic Icon Component ────────────────────────────────────────────────────

/**
 * Converts a kebab-case icon name (e.g. "flask-conical")
 * to PascalCase (e.g. "FlaskConical") to match lucide-react's icon keys.
 */
function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const pascalName = toPascalCase(name);
  const IconComponent = icons[pascalName as keyof typeof icons] as
    | LucideIcon
    | undefined;
  if (!IconComponent) {
    // Fallback to Sparkles if icon name doesn't match
    return <Sparkles className={className} />;
  }
  return <IconComponent className={className} />;
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Difficulty = "Easy" | "Medium" | "Hard";

interface TrendingQuiz {
  id: string;
  title: string;
  categories: string[];
  difficulty: Difficulty;
  plays: string;
  xp: number;
  icon: React.ReactNode;
  iconBg: string;
}

interface RecommendedQuiz {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeBg: string;
  gradient: string;
  icon: React.ReactNode;
  avatars: string[];
}



// ── Difficulty badge color map ────────────────────────────────────────────────

const difficultyColors: Record<Difficulty, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ExploreQuizzesPage() {
  const { 
    categories: fetchedCategories, 
    setCategories: setStoreCategories, 
    quizzes, 
    setQuizzes: setStoreQuizzes 
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loadingCategories, setLoadingCategories] = useState(fetchedCategories.length === 0);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [loadingQuizzes, setLoadingQuizzes] = useState(quizzes.length === 0);
  const [quizzesError, setQuizzesError] = useState<string | null>(null);

  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [creationModeFilter, setCreationModeFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Newest");

  // ── Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 8 : 12);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, difficultyFilter, creationModeFilter, sortBy]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        if (fetchedCategories.length === 0) setLoadingCategories(true);
        setCategoryError(null);
        const data = await getCategoryData();
        setStoreCategories(data);
      } catch (err) {
        setCategoryError(
          err instanceof Error ? err.message : "Failed to load categories.",
        );
      } finally {
        setLoadingCategories(false);
      }

      try {
        if (quizzes.length === 0) setLoadingQuizzes(true);
        setQuizzesError(null);
        let qData: any = await getAllQuizzes();

        if (qData && qData.success && Array.isArray(qData.data)) {
          qData = qData.data;
        } else if (Array.isArray(qData)) {
          // qData is already an array
        } else {
          qData = [];
        }
        setStoreQuizzes(qData as Quiz[]);
      } catch (err) {
        setQuizzesError(
          err instanceof Error ? err.message : "Failed to load quizzes.",
        );
      } finally {
        setLoadingQuizzes(false);
      }
    }
    fetchAllData();
  }, []);

  let filteredQuizzes = quizzes.filter((q) => {
    if (activeCategory !== "All") {
      const categoryName =
        fetchedCategories.find((c) => c.id === q.categoryId)?.name || "Unknown";
      if (categoryName !== activeCategory) return false;
    }
    if (difficultyFilter !== "All" && q.difficulty !== difficultyFilter) {
      return false;
    }
    if (creationModeFilter !== "All" && q.creationMode !== creationModeFilter) {
      return false;
    }
    return true;
  });

  filteredQuizzes.sort((a, b) => {
    if (sortBy === "Oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "PopularityDesc") {
      return b.plays - a.plays;
    }
    if (sortBy === "PopularityAsc") {
      return a.plays - b.plays;
    }
    // Default to Newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="animate-fade-in min-h-[80vh]">
      {/* ── Breadcrumb / Back ── */}
      <Link
        href="/home"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Explore Quizzes
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground font-medium">
          Discover trending topics and challenge yourself.
        </p>
      </div>

      {/* ── Categories ── */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Categories
          </h2>

          {(difficultyFilter !== "All" ||
            creationModeFilter !== "All" ||
            sortBy !== "Newest" ||
            activeCategory !== "All") && (
            <button
              onClick={() => {
                setDifficultyFilter("All");
                setCreationModeFilter("All");
                setSortBy("Newest");
                setActiveCategory("All");
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors shrink-0"
            >
              Clear Filters
            </button>
          )}
        </div>
        

        {loadingCategories && (
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-40 shrink-0 rounded-2xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        )}

        {categoryError && (
          <div className="rounded-2xl border border-dashed border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-6 text-center">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {categoryError}
            </p>
          </div>
        )}

        {!loadingCategories && !categoryError && (
          <div
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {fetchedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`
                  group flex items-center gap-2 shrink-0 rounded-3xl border px-4 py-1 
                  transition-all duration-200 select-none
                  ${
                    activeCategory === cat.name
                      ? "bg-purple-400 to-secondary text-white border-transparent shadow-md shadow-primary/25"
                      : "bg-card border-border/40 hover:border-border/70 hover:shadow-md text-foreground"
                  }
                `}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200  border-none`}
                >
                  <DynamicIcon
                    name={cat.icon}
                    className={`h-4.5 w-4.5 transition-colors duration-200  border-none  ${
                      activeCategory === cat.name
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── All Quizzes ── */}
      <section className="mb-10 animate-slide-up">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            All Quizzes
          </h2>

          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 py-2 scrollbar-hide -mx-1 px-1  sm:mx-0 sm:px-0">
            {/* Filtering */}
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-fit h-8 sm:h-9 gap-1 sm:gap-2 px-2 sm:px-3 rounded-lg border-border bg-card text-[12px] sm:text-sm font-medium shrink-0">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="min-w-[100px] sm:min-w-[160px]">
                <SelectItem value="All">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={creationModeFilter}
              onValueChange={setCreationModeFilter}
            >
              <SelectTrigger className="w-fit h-8 sm:h-9 gap-1 sm:gap-2 px-2 sm:px-3 rounded-lg border-border bg-card text-[12px] sm:text-sm font-medium shrink-0">
                <SelectValue placeholder="Creation Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Modes</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-border shrink-0 hidden sm:block"></div>

            {/* Sorting & Clear */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="text-[12px] sm:text-sm font-medium text-muted-foreground whitespace-nowrap hidden xs:inline">
                Sort by:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-fit h-8 sm:h-9 gap-1 sm:gap-2 px-2 sm:px-3 rounded-lg border-border bg-card text-[12px] sm:text-sm font-medium shrink-0">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Newest">Newest to Oldest</SelectItem>
                  <SelectItem value="Oldest">Oldest to Newest</SelectItem>
                  <SelectItem value="PopularityDesc">
                    Popularity (Most to Least)
                  </SelectItem>
                  <SelectItem value="PopularityAsc">
                    Popularity (Least to Most)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loadingQuizzes && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 w-full rounded-2xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        )}

        {quizzesError && (
          <div className="rounded-2xl border border-dashed border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-6 text-center">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {quizzesError}
            </p>
          </div>
        )}

        {!loadingQuizzes && !quizzesError && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredQuizzes.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No quizzes found yet.
                </p>
              </div>
            )}

            {paginatedQuizzes.map((quiz) => {
              const categoryInfo = fetchedCategories.find(
                (c) => c.id === quiz.categoryId,
              );
              const categoryName =
                quiz.category?.name || categoryInfo?.name || "Unknown";
              const categoryIcon = categoryInfo?.icon || "sparkles";

              const iconColors = [
                "bg-gradient-to-br from-violet-500 to-purple-600",
                "bg-gradient-to-br from-blue-500 to-cyan-500",
                "bg-gradient-to-br from-orange-400 to-red-500",
                "bg-gradient-to-br from-pink-500 to-rose-500",
                "bg-gradient-to-br from-green-500 to-emerald-500",
                "bg-gradient-to-br from-amber-400 to-orange-500",
              ];
              const hash = (quiz.id || "")
                .split("")
                .reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const iconBg = iconColors[hash % iconColors.length];

              // Format timeAllocated (seconds) to "Xm Ys" mapping
              const minutes = Math.floor(quiz.timeAllocated / 60);
              const seconds = quiz.timeAllocated % 60;
              const formattedTime =
                minutes > 0
                  ? `${minutes}m ${seconds > 0 ? `${seconds}s` : ""}`.trim()
                  : `${seconds}s`;

              return (
                <Link
                  key={quiz.id}
                  href={`/explore/quiz/${quiz.id}`}
                  className="group flex flex-col h-full rounded-2xl border border-border/40 bg-card p-3 shadow-sm hover:shadow-md hover:border-border/70 transition-all duration-200"
                >
                  {/* Cover Picture or Gradient Fallback */}
                  <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl sm:h-32 md:h-40 lg:h-48">
                    {quiz.coverPicture ? (
                      <img
                        src={quiz.coverPicture}
                        alt={quiz.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <img
                        src="https://placehold.net/600x600.png"
                        alt={quiz.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col h-full px-1">
                    {/* Tags row */}
                    <div className="mb-1 flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-hide whitespace-nowrap -mx-0.5 px-0.5">
                      <span className="inline-block rounded-md px-1.5 py-0.5 sm:px-2  text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider bg-purple-400 text-white">
                        {quiz.category?.name || "Unknown"}
                      </span>
                      <span
                        className={`inline-block rounded-md px-1.5 py-0.5 sm:px-2 text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider ${difficultyColors[quiz.difficulty as Difficulty] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {quiz.difficulty}
                      </span>
                      {quiz.isPrivate && (
                        <span className="inline-block rounded-md px-1.5 py-0.5 sm:px-2 text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-800">
                          Private
                        </span>
                      )}
                      {quiz.isDraft && (
                        <span className="inline-block rounded-md px-1.5 py-0.5 sm:px-2 text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider bg-orange-200 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400">
                          Draft
                        </span>
                      )}
                      <span className="inline-block rounded-md px-1.5 py-0.5 sm:px-2 text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                        Mode: {quiz.creationMode}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {quiz.title}
                    </p>

                    {/* Description */}
                    {quiz.description && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {quiz.description}
                      </p>
                    )}

                    {/* Meta Pinned to Bottom */}
                    <div className="mt-auto pt-3 sm:pt-4 border-t border-border/40">
                      <div className="flex items-center gap-x-2.5 sm:gap-x-3 text-[10px] sm:text-xs text-muted-foreground overflow-x-auto scrollbar-hide whitespace-nowrap -mx-0.5 px-0.5">
                        <span className="flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" />{" "}
                          {quiz._count?.questions ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formattedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {quiz.plays}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />{" "}
                          {quiz.creator?.username ?? "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Pagination Controls ── */}
        {!loadingQuizzes && !quizzesError && totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-accent disabled:opacity-40 disabled:hover:bg-card"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  // Show current page, first, last, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                          currentPage === pageNumber
                            ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                            : "bg-card border border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="flex h-9 w-9 items-center justify-center text-muted-foreground"
                      >
                        •
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-accent disabled:opacity-40 disabled:hover:bg-card"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {/* <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p> */}
          </div>
        )}
      </section>

      {/* ── Trending ── */}
    </div>
  );
}
