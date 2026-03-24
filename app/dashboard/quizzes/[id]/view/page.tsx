"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Eye,
  EyeOff,
  Clock,
  HelpCircle,
  Play,
  Star,
  Lock,
  Globe,
  FileEdit,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Calendar,
  Hash,
  Zap,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getQuizWithQuestions } from "@/lib/quiz";
import { formatDistanceToNow } from "date-fns";

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
  if (m > 0) return `${m}m ${s > 0 ? `${s}s` : ""}`.trim();
  return `${s}s`;
}

function backendTypeToLabel(t: string): string {
  const map: Record<string, string> = {
    Mcq: "Multiple Choice",
    TrueFalse: "True / False",
    MultipleSelect: "Multiple Select",
    ShortAnswer: "Short Answer",
    LongAnswer: "Long Answer",
    FillInTheBlank: "Fill in the Blank",
    Matching: "Matching",
    Sequencing: "Order / Sequencing",
    OrderSequencing: "Order / Sequencing",
    Numeric: "Numeric Answer",
  };
  return map[t] ?? t;
}

const difficultyConfig: Record<string, { label: string; className: string }> = {
  Easy: { label: "Easy", className: "bg-emerald-100 text-emerald-700" },
  Medium: { label: "Medium", className: "bg-amber-100 text-amber-700" },
  Hard: { label: "Hard", className: "bg-red-100 text-red-700" },
};

const typeConfig: Record<string, string> = {
  Mcq: "bg-blue-50 text-blue-700 border-blue-200",
  TrueFalse: "bg-teal-50 text-teal-700 border-teal-200",
  MultipleSelect: "bg-violet-50 text-violet-700 border-violet-200",
  ShortAnswer: "bg-orange-50 text-orange-700 border-orange-200",
  LongAnswer: "bg-pink-50 text-pink-700 border-pink-200",
  FillInTheBlank: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Matching: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Sequencing: "bg-purple-50 text-purple-700 border-purple-200",
  OrderSequencing: "bg-purple-50 text-purple-700 border-purple-200",
  Numeric: "bg-slate-50 text-slate-700 border-slate-200",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ViewQuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const q = await getQuizWithQuestions(id);
        setQuiz(q);
        // Expand first question by default
        if (q.questions?.length > 0) {
          setExpandedQuestions({ [q.questions[0].id]: true });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const toggleQuestion = (qId: string) =>
    setExpandedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));

  // ── States ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading quiz…</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8fafc]">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-xl font-semibold text-slate-700">{error ?? "Quiz not found"}</p>
        <Button onClick={() => router.back()} className="rounded-full bg-purple-600 text-white">
          Go Back
        </Button>
      </div>
    );
  }

  const difficulty = difficultyConfig[quiz.difficulty] ?? { label: quiz.difficulty, className: "bg-slate-100 text-slate-600" };
  const questions: any[] = quiz.questions ?? [];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Sticky top bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>

          {/* <div className="flex items-center gap-2">
            <span className="hidden text-xs font-bold uppercase tracking-wider text-slate-400 sm:block">
              View Only
            </span>
            <Button
              asChild
              className="h-9 rounded-full bg-purple-600 px-4 text-sm font-bold text-white shadow-sm shadow-purple-200 hover:bg-purple-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Link href={`/dashboard/quizzes/${id}/edit`}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit Quiz
              </Link>
            </Button>
          </div> */}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 space-y-6 pb-16">
        {/* ── Hero / Overview Card ─────────────────────────────────────── */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#9333ea] via-[#a855f7] to-violet-500 p-7 text-white shadow-2xl shadow-purple-200/60 relative">
          {/* decorative circles */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-purple-400/20 blur-2xl" />

          {/* Status badges */}
          <div className="relative flex flex-wrap items-center gap-2 mb-4">
            <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${difficulty.className}`}>
              {difficulty.label}
            </span>
            {quiz.isDraft ? (
              <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700">
                <FileEdit className="h-3 w-3" /> Draft
              </span>
            ) : (
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90">
                Published
              </span>
            )}
            {quiz.isPrivate ? (
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
                <Lock className="h-3 w-3" /> Private
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
                <Globe className="h-3 w-3" /> Public
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="relative text-2xl font-black leading-tight sm:text-3xl">{quiz.title}</h1>

          {/* Description */}
          <p className="relative mt-2 text-sm leading-relaxed text-white/75 max-w-xl">
            {quiz.description || "No description provided."}
          </p>

          {/* Meta row */}
          <div className="relative mt-6 flex flex-wrap gap-4 text-sm font-semibold text-white/80">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-white/60" />
              {questions.length} Questions
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-white/60" />
              {formatTime(quiz.timeAllocated)}
            </span>
            <span className="flex items-center gap-1.5">
              <Play className="h-4 w-4 text-white/60" />
              {quiz.plays?.toLocaleString() ?? 0} Plays
            </span>
            {quiz.rating != null && quiz.rating > 0 && (
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                {quiz.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* ── Info Cards Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Rating",
              value: quiz.rating,
            },
            {
              label: "Category",
              value: quiz.category?.name ?? "—",
            },
            {
              label: "Mode",
              value: quiz.creationMode,
            },
            {
              label: "Created",
              value: quiz.createdAt
                ? formatDistanceToNow(new Date(quiz.createdAt)) + " ago"
                : "—",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1.5 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </div>
              <p className="text-sm font-black text-slate-800 truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* ── Questions ────────────────────────────────────────────────── */}
        <div>
          <h2 className="mb-4 px-1 text-xl font-black text-slate-800">
            Questions{" "}
            <span className="text-base font-bold text-slate-400">({questions.length})</span>
          </h2>

          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-slate-400">
              <HelpCircle className="mb-3 h-10 w-10 opacity-20" />
              <p className="font-semibold">No questions yet</p>
              <Button asChild variant="link" className="mt-2 text-purple-600 font-semibold">
                <Link href={`/dashboard/quizzes/${id}/edit`}>Add questions</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q: any, idx: number) => {
                const isExpanded = !!expandedQuestions[q.id];
                const typeLabel = backendTypeToLabel(q.type);
                const typeClass = typeConfig[q.type] ?? "bg-slate-50 text-slate-600 border-slate-200";
                const options: any[] = q.answerOptions ?? [];

                return (
                  <div
                    key={q.id}
                    className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Question header row — clickable to expand */}
                    <button
                      type="button"
                      onClick={() => toggleQuestion(q.id)}
                      className="flex w-full items-start justify-between gap-3 p-5 text-left"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Number badge */}
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[11px] font-black text-purple-700">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 leading-snug">
                            {q.text || <span className="italic text-slate-400">No question text</span>}
                          </p>
                          <span className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${typeClass}`}>
                            {typeLabel}
                          </span>
                        </div>
                      </div>
                      {/* Chevron */}
                      <span className={`mt-0.5 shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">
                        {/* Media */}
                        {q.media?.[0] && (
                          <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                            <img src={q.media[0]} alt="Question media" className="max-h-48 w-full object-contain" />
                          </div>
                        )}

                        {/* Answer options */}
                        {(q.type === "Mcq" || q.type === "MultipleSelect" || q.type === "TrueFalse") && options.length > 0 && (
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {options.map((opt: any) => (
                              <div
                                key={opt.id}
                                className={`flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-sm ${
                                  opt.isCorrect
                                    ? "border-teal-300 bg-teal-50/70 text-teal-800"
                                    : "border-slate-100 bg-slate-50 text-slate-600"
                                }`}
                              >
                                {opt.isCorrect && (
                                  <CheckCircle2 className="h-4 w-4 shrink-0 fill-teal-500 text-white" />
                                )}
                                {!opt.isCorrect && (
                                  <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" />
                                )}
                                <span className="font-medium">{opt.text || <span className="italic opacity-40">Empty option</span>}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Sequencing */}
                        {(q.type === "Sequencing" || q.type === "OrderSequencing") && options.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {options.map((opt: any, oIdx: number) => (
                              <div key={opt.id} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-black text-purple-700">
                                  {oIdx + 1}
                                </span>
                                <span className="text-sm font-medium text-slate-700">{opt.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Matching */}
                        {q.type === "Matching" && options.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {options.map((opt: any) => (
                              <div key={opt.id} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                                <span className="flex-1 text-sm font-medium text-slate-700">{opt.text}</span>
                                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                                <span className="flex-1 text-sm font-medium text-teal-700">{opt.matchingText ?? opt.matchText}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Short / Long / Fill / Numeric — show correct answer if available */}
                        {(q.type === "ShortAnswer" || q.type === "LongAnswer" || q.type === "FillInTheBlank" || q.type === "Numeric") && (
                          <div className="rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-teal-600">
                              Correct Answer
                            </p>
                            <p className="text-sm font-semibold text-teal-800">
                              {options.find((o: any) => o.isCorrect)?.text ||
                                q.correctAnswerText ||
                                q.correctAnswerNumeric?.toString() ||
                                <span className="italic opacity-50">Not specified</span>}
                            </p>
                          </div>
                        )}

                        {/* Explanation if present */}
                        {q.explanation && (
                          <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-500">
                              Explanation
                            </p>
                            <p className="text-sm text-blue-800">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────── */}
        <div className="flex justify-center pt-4">
          <Button
            asChild
            className="h-12 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 px-8 text-base font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            <Link href={`/dashboard/quizzes/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit This Quiz
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
