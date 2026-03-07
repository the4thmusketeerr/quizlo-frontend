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
  icons,
  type LucideIcon,
} from "lucide-react";
import { getCategoryData, type Category as CategoryType } from "@/lib/quiz";

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

// ── Trending quiz data ────────────────────────────────────────────────────────

const trendingQuizzes: TrendingQuiz[] = [
  {
    id: "1",
    title: "Space Frontiers",
    categories: ["Science"],
    difficulty: "Medium",
    plays: "1.2k",
    xp: 50,
    icon: <Globe2 className="h-6 w-6 text-white" />,
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  {
    id: "2",
    title: "Modern Web Stack",
    categories: ["Tech"],
    difficulty: "Hard",
    plays: "850",
    xp: 80,
    icon: <Code2 className="h-6 w-6 text-white" />,
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    id: "3",
    title: "Ancient Civilizations",
    categories: ["History"],
    difficulty: "Easy",
    plays: "3.4k",
    xp: 30,
    icon: <Landmark className="h-6 w-6 text-white" />,
    iconBg: "bg-gradient-to-br from-orange-400 to-red-500",
  },
  {
    id: "4",
    title: "Human Anatomy",
    categories: ["Science"],
    difficulty: "Hard",
    plays: "620",
    xp: 90,
    icon: <Brain className="h-6 w-6 text-white" />,
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
  },
  {
    id: "5",
    title: "Olympic Records",
    categories: ["Sports"],
    difficulty: "Medium",
    plays: "1.5k",
    xp: 45,
    icon: <Dumbbell className="h-6 w-6 text-white" />,
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
  {
    id: "6",
    title: "Renaissance Masters",
    categories: ["Art", "History"],
    difficulty: "Medium",
    plays: "970",
    xp: 55,
    icon: <Palette className="h-6 w-6 text-white" />,
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
  },
];

// ── Recommended quiz data ─────────────────────────────────────────────────────

const recommendedQuizzes: RecommendedQuiz[] = [
  {
    id: "r1",
    title: "Master of Psychology",
    description:
      "Test your knowledge of the human mind, behavior, and social interactions.",
    badge: "Most Popular",
    badgeBg: "bg-white/20 text-white",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    icon: <Brain className="h-10 w-10 text-white/30" />,
    avatars: ["🧑‍🔬", "👩‍⚕️", "🧠"],
  },
  {
    id: "r2",
    title: "Art History 101",
    description:
      "From Renaissance to Modernism, how well do you know the masters?",
    badge: "New Content",
    badgeBg: "bg-white/20 text-white",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    icon: <Palette className="h-10 w-10 text-white/30" />,
    avatars: ["🎨", "🖌️"],
  },
  {
    id: "r3",
    title: "Quantum Physics",
    description:
      "Dive into the bizarre world of quantum mechanics and wave-particle duality.",
    badge: "Trending",
    badgeBg: "bg-white/20 text-white",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    icon: <Atom className="h-10 w-10 text-white/30" />,
    avatars: ["⚛️", "🔬", "🧪"],
  },
  {
    id: "r4",
    title: "Full-Stack Dev",
    description:
      "React, Node, databases & deployment — prove your full-stack skills.",
    badge: "Advanced",
    badgeBg: "bg-white/20 text-white",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    icon: <Code2 className="h-10 w-10 text-white/30" />,
    avatars: ["💻", "🚀"],
  },
];

// ── Difficulty badge color map ────────────────────────────────────────────────

const difficultyColors: Record<Difficulty, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const categoryColors: Record<string, string> = {
  Science:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  Tech: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Sports:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  History:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  Art: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ExploreQuizzesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [fetchedCategories, setFetchedCategories] = useState<CategoryType[]>(
    [],
  );
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        setCategoryError(null);
        const data = await getCategoryData();
        setFetchedCategories(data);
      } catch (err) {
        setCategoryError(
          err instanceof Error ? err.message : "Failed to load categories.",
        );
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const filteredTrending =
    activeCategory === "All"
      ? trendingQuizzes
      : trendingQuizzes.filter((q) => q.categories.includes(activeCategory));

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
        <h2 className="mb-4 text-xl font-bold text-foreground tracking-tight">
          Categories
        </h2>

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
                      ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-md shadow-primary/25"
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

      {/* ── Trending Now ── */}
      <section className="mb-10 animate-slide-up">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Trending Now
          </h2>
          <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            View all
          </button>
        </div>

        <div className="space-y-3">
          {filteredTrending.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No quizzes found in this category yet.
              </p>
            </div>
          )}

          {filteredTrending.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-border/40 bg-card p-4 shadow-sm hover:shadow-md hover:border-border/70 transition-all duration-200"
            >
              {/* Icon */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${quiz.iconBg} shadow-sm`}
              >
                {quiz.icon}
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                {/* Tags row */}
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                  {quiz.categories.map((cat) => (
                    <span
                      key={cat}
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        categoryColors[cat] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </span>
                  ))}
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${difficultyColors[quiz.difficulty]}`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                {/* Title */}
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {quiz.title}
                </p>

                {/* Meta */}
                <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {quiz.plays} plays
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-amber-500" /> +{quiz.xp} XP
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/50 bg-muted/40 group-hover:bg-primary group-hover:border-primary transition-all duration-200">
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recommended for You ── */}
      <section className="animate-slide-up animation-delay-200">
        <h2 className="mb-4 text-xl font-bold text-foreground tracking-tight">
          Recommended for You
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {recommendedQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${quiz.gradient} p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Decorative icon in background */}
              <div className="absolute right-4 top-4 opacity-30">
                {quiz.icon}
              </div>

              {/* Badge */}
              <span
                className={`inline-block rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${quiz.badgeBg} backdrop-blur-sm mb-6`}
              >
                {quiz.badge}
              </span>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-white mb-1.5">
                {quiz.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4 line-clamp-2">
                {quiz.description}
              </p>

              {/* Footer: avatars + Play Now */}
              <div className="flex items-center justify-between">
                {/* Emoji avatars */}
                <div className="flex -space-x-1.5">
                  {quiz.avatars.map((emoji, i) => (
                    <span
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-sm ring-2 ring-white/10"
                    >
                      {emoji}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/quiz/${quiz.id}`}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-800 shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-200"
                >
                  Play Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
