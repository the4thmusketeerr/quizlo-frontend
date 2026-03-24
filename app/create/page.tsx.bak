"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Plus,
  Settings,
  Info,
  Trash2,
  CheckCircle2,
  Sparkles,
  PenLine,
  Wand2,
  BookOpen,
  Loader2,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
}

type CreationMode = "manual" | "ai";

// ── Helpers ──────────────────────────────────────────────────────────────────

const difficulties = ["Easy", "Medium", "Hard"] as const;
type Difficulty = (typeof difficulties)[number];

const categories = [
  "General Knowledge",
  "Science",
  "Mathematics",
  "History",
  "Geography",
  "Music",
  "Sports",
  "Technology",
  "Literature",
  "Art",
];

const questionTypes = [
  { value: "mcq", label: "Multiple Choice", icon: "🔘" },
  { value: "true-false", label: "True / False", icon: "✅" },
  { value: "mixed", label: "Mixed", icon: "🎲" },
];

function createEmptyQuestion(index: number): Question {
  return {
    id: `q-${Date.now()}-${index}`,
    text: "",
    options: [
      { id: `o-${Date.now()}-1`, text: "", isCorrect: false },
      { id: `o-${Date.now()}-2`, text: "", isCorrect: false },
      { id: `o-${Date.now()}-3`, text: "", isCorrect: false },
      { id: `o-${Date.now()}-4`, text: "", isCorrect: false },
    ],
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CreateQuizPage() {
  // ── Creation mode ──
  const [mode, setMode] = useState<CreationMode>("manual");

  // ── Shared form state ──
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General Knowledge");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [isPrivate, setIsPrivate] = useState(false);

  // ── Manual-mode state ──
  const [questions, setQuestions] = useState<Question[]>([
    createEmptyQuestion(0),
  ]);

  // ── AI-mode state ──
  const [aiTopic, setAiTopic] = useState("");
  const [aiNumQuestions, setAiNumQuestions] = useState(10);
  const [aiQuestionType, setAiQuestionType] = useState("mcq");
  const [aiAdditionalContext, setAiAdditionalContext] = useState("");
  const [aiIsGenerating, setAiIsGenerating] = useState(false);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<Question[]>(
    []
  );
  const [aiPreviewOpen, setAiPreviewOpen] = useState<Record<string, boolean>>(
    {}
  );
  const [aiFiles, setAiFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File upload helpers ──
  const MAX_FILES = 5;
  const ACCEPTED_TYPES = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/png",
    "image/jpeg",
  ];
  const ACCEPTED_EXTENSIONS = ".pdf,.txt,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg";

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const newFiles = Array.from(incoming).filter(
        (f) =>
          ACCEPTED_TYPES.includes(f.type) &&
          !aiFiles.some((existing) => existing.name === f.name && existing.size === f.size)
      );
      setAiFiles((prev) => [...prev, ...newFiles].slice(0, MAX_FILES));
    },
    [aiFiles]
  );

  const removeFile = (index: number) => {
    setAiFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ── Question helpers (manual) ──
  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion(prev.length)]);
  };

  const removeQuestion = (qIndex: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== qIndex));
  };

  const updateQuestionText = (qIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, text } : q))
    );
  };

  const updateOptionText = (
    qIndex: number,
    oIndex: number,
    text: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) =>
                j === oIndex ? { ...o, text } : o
              ),
            }
          : q
      )
    );
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) => ({
                ...o,
                isCorrect: j === oIndex,
              })),
            }
          : q
      )
    );
  };

  // ── AI generation handler (stub – wire to your API) ──
  const handleAiGenerate = async () => {
    setAiIsGenerating(true);
    setAiGeneratedQuestions([]);

    // TODO: Replace with an actual API call
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Simulated generated questions for demo
    const simulated: Question[] = Array.from(
      { length: aiNumQuestions },
      (_, i) => ({
        id: `ai-q-${Date.now()}-${i}`,
        text: `Sample AI question ${i + 1} about "${aiTopic || category}"`,
        options: [
          {
            id: `ai-o-${Date.now()}-${i}-1`,
            text: "Option A",
            isCorrect: true,
          },
          {
            id: `ai-o-${Date.now()}-${i}-2`,
            text: "Option B",
            isCorrect: false,
          },
          {
            id: `ai-o-${Date.now()}-${i}-3`,
            text: "Option C",
            isCorrect: false,
          },
          {
            id: `ai-o-${Date.now()}-${i}-4`,
            text: "Option D",
            isCorrect: false,
          },
        ],
      })
    );

    setAiGeneratedQuestions(simulated);
    setAiIsGenerating(false);
  };

  const togglePreview = (id: string) => {
    setAiPreviewOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeAiQuestion = (qIndex: number) => {
    setAiGeneratedQuestions((prev) => prev.filter((_, i) => i !== qIndex));
  };

  // ── Render ──
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-8 pb-16">
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
            Create a Quiz
          </h1>
          <p className="mt-1 text-sm font-medium text-purple-500 dark:text-purple-400">
            Let&apos;s build something fun!
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            MODE SELECTOR – PILL TOGGLE
           ══════════════════════════════════════════════════════════════════ */}
        <div className="mb-8 animate-slide-up">
          <div className="relative flex w-full rounded-2xl border border-border/50 bg-card p-1.5 shadow-sm">
            {/* Sliding background indicator */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg shadow-purple-500/25 transition-all duration-300 ease-out ${
                mode === "ai"
                  ? "left-[calc(50%+3px)]"
                  : "left-1.5"
              }`}
            />

            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors duration-300 ${
                mode === "manual"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PenLine className="h-4 w-4" />
              Manual
            </button>

            <button
              type="button"
              onClick={() => setMode("ai")}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors duration-300 ${
                mode === "ai"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              AI Generate
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            BASIC INFO CARD (shared)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-6 rounded-2xl border border-border/50 bg-card p-5 shadow-sm animate-slide-up">
          {/* Section title */}
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white">
              <Info className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">Basic Info</h2>
          </div>

          {/* Quiz Title */}
          <div className="mb-4">
            <label
              htmlFor="quiz-title"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              Quiz Title
            </label>
            <Input
              id="quiz-title"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-border/60 bg-muted/40 placeholder:text-muted-foreground/60 focus-visible:ring-purple-500/40"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="quiz-description"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              Description
            </label>
            <Textarea
              id="quiz-description"
              placeholder="What is this quiz about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-xl border-border/60 bg-muted/40 placeholder:text-muted-foreground/60 focus-visible:ring-purple-500/40 resize-y"
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SETTINGS CARD (shared)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-6 rounded-2xl border border-border/50 bg-card p-5 shadow-sm animate-slide-up animation-delay-100">
          {/* Section title */}
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white">
              <Settings className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">Settings</h2>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-xl border-border/60 bg-muted/40 focus:ring-purple-500/40">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Difficulty
            </label>
            <div className="flex gap-2">
              {difficulties.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-all duration-200 ${
                    difficulty === d
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
                      : "border border-border/60 text-foreground hover:border-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Private Quiz */}
          <div className="flex items-center justify-between rounded-xl bg-muted/40 p-4">
            <div>
              <p className="text-sm font-bold text-foreground">Private Quiz</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Only people with the link can play
              </p>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            MANUAL MODE — QUESTIONS
           ══════════════════════════════════════════════════════════════════ */}
        {mode === "manual" && (
          <>
            <section className="mb-8 animate-slide-up animation-delay-200">
              <div className="mb-4">
                <h2 className="text-xl font-extrabold text-foreground">
                  Questions
                </h2>
                <p className="mt-0.5 text-sm font-medium text-purple-500 dark:text-purple-400">
                  Question {questions.length} of {questions.length}
                </p>
              </div>

              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div
                    key={question.id}
                    className="relative rounded-2xl border-2 border-dashed border-border/70 p-5 transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700"
                  >
                    {/* Remove question button */}
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                        title="Remove question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                    {/* Question text */}
                    <Input
                      placeholder="Type your question here…"
                      value={question.text}
                      onChange={(e) =>
                        updateQuestionText(qIndex, e.target.value)
                      }
                      className="mb-4 border-0 bg-transparent px-0 text-base font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />

                    {/* Answer options — 2×2 grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {question.options.map((option, oIndex) => {
                        const isCorrect = option.isCorrect;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setCorrectOption(qIndex, oIndex)}
                            className={`group flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ${
                              isCorrect
                                ? "border-teal-400 bg-teal-50/60 dark:border-teal-500 dark:bg-teal-950/30"
                                : "border-border/50 bg-muted/30 hover:border-purple-300 dark:hover:border-purple-600"
                            }`}
                          >
                            <input
                              type="text"
                              placeholder={
                                isCorrect
                                  ? "Correct Answer example"
                                  : `Answer Option ${oIndex + 1}`
                              }
                              value={option.text}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                updateOptionText(
                                  qIndex,
                                  oIndex,
                                  e.target.value
                                )
                              }
                              className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                            />
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                                isCorrect
                                  ? "bg-teal-500 text-white"
                                  : "border-2 border-border/60 group-hover:border-purple-400"
                              }`}
                            >
                              {isCorrect && (
                                <CheckCircle2 className="h-5 w-5 fill-teal-500 text-white" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Question button */}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg shadow-purple-500/25 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-200"
                  title="Add question"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </section>

            {/* ── Manual Actions ── */}
            <div className="flex flex-col items-center gap-3 animate-scale-in animation-delay-300">
              <button
                type="button"
                className="w-full max-w-sm rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-300"
              >
                Publish Quiz
              </button>

              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Save as Draft
              </button>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            AI MODE — GENERATION FORM
           ══════════════════════════════════════════════════════════════════ */}
        {mode === "ai" && (
          <>
            {/* ── AI Configuration Card ── */}
            <section className="mb-6 rounded-2xl border border-border/50 bg-card p-5 shadow-sm animate-slide-up animation-delay-200 relative overflow-hidden">
              {/* Subtle gradient background accent */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 blur-2xl" />

              {/* Section title */}
              <div className="mb-5 flex items-center gap-2 relative">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-purple-500/20">
                  <Wand2 className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-foreground">
                  AI Configuration
                </h2>
                <span className="ml-auto rounded-full bg-gradient-to-r from-violet-500/15 to-purple-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Powered by AI
                </span>
              </div>

              {/* Prompt */}
              <div className="mb-5 relative">
                <label
                  htmlFor="ai-topic"
                  className="mb-1.5 block text-sm font-semibold text-foreground"
                >
                  Write a Prompt
                </label>
                <Textarea
                  id="ai-topic"
                  placeholder="Describe what your quiz should be about… e.g. 'Create a quiz on photosynthesis covering light reactions and the Calvin cycle' or 'Test knowledge of JavaScript closures and scope'"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  rows={3}
                  className="rounded-xl border-border/60 bg-muted/40 placeholder:text-muted-foreground/50 focus-visible:ring-purple-500/40 resize-y"
                />
                <p className="mt-1 text-xs text-muted-foreground/70">
                  The more detail you provide, the better the questions.
                  Leave empty to use the selected category.
                </p>
              </div>

              {/* Number of questions */}
              <div className="mb-5 relative">
                <label className="mb-1.5 block text-sm font-semibold text-foreground">
                  Number of Questions
                </label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[aiNumQuestions]}
                    onValueChange={([val]) => setAiNumQuestions(val)}
                    min={3}
                    max={30}
                    step={1}
                    className="flex-1 [&_[role=slider]]:border-purple-500 [&_[role=slider]]:bg-white dark:[&_[role=slider]]:bg-card [&_[data-orientation=horizontal]>[data-orientation=horizontal]]:bg-purple-500"
                  />
                  <span className="inline-flex h-10 w-14 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-sm font-bold text-foreground tabular-nums">
                    {aiNumQuestions}
                  </span>
                </div>
              </div>

              {/* Question Type */}
              <div className="mb-5 relative">
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Question Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {questionTypes.map((qt) => (
                    <button
                      key={qt.value}
                      type="button"
                      onClick={() => setAiQuestionType(qt.value)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                        aiQuestionType === qt.value
                          ? "border-purple-500 bg-purple-50/60 text-purple-700 shadow-md shadow-purple-500/10 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-400"
                          : "border-border/50 text-muted-foreground hover:border-purple-300 hover:text-foreground dark:hover:border-purple-600"
                      }`}
                    >
                      <span className="text-lg">{qt.icon}</span>
                      <span className="text-xs">{qt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Context */}
              <div className="relative">
                <label
                  htmlFor="ai-context"
                  className="mb-1.5 block text-sm font-semibold text-foreground"
                >
                  Additional Context{" "}
                  <span className="font-normal text-muted-foreground/70">
                    (optional)
                  </span>
                </label>
                <Textarea
                  id="ai-context"
                  placeholder="Paste notes, textbook content, or give extra instructions to guide the AI…"
                  value={aiAdditionalContext}
                  onChange={(e) => setAiAdditionalContext(e.target.value)}
                  rows={3}
                  className="rounded-xl border-border/60 bg-muted/40 placeholder:text-muted-foreground/50 focus-visible:ring-purple-500/40 resize-y"
                />
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground/60">
                  <FileText className="h-3 w-3" />
                  <span>
                    You can paste study notes or article text here
                  </span>
                </div>
              </div>

              {/* ── File Upload ── */}
              <div className="mt-5 relative">
                <label className="mb-1.5 block text-sm font-semibold text-foreground">
                  Upload Source Material{" "}
                  <span className="font-normal text-muted-foreground/70">
                    (optional)
                  </span>
                </label>

                {/* Drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${
                    isDragging
                      ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20"
                      : "border-border/60 bg-muted/20 hover:border-purple-400/60 hover:bg-muted/40"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                      isDragging
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                        : "bg-muted/60 text-muted-foreground/60 group-hover:bg-purple-100/60 group-hover:text-purple-500 dark:group-hover:bg-purple-900/30 dark:group-hover:text-purple-400"
                    }`}
                  >
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {isDragging ? (
                        <span className="text-purple-600 dark:text-purple-400">
                          Drop files here
                        </span>
                      ) : (
                        <>
                          <span className="text-purple-600 dark:text-purple-400">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground/60">
                      PDF, TXT, DOC, DOCX, PPT, PPTX, PNG, JPG • Max {MAX_FILES} files
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_EXTENSIONS}
                    onChange={(e) => {
                      if (e.target.files) addFiles(e.target.files);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </div>

                {/* Uploaded file list */}
                {aiFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {aiFiles.map((file, idx) => (
                      <div
                        key={`${file.name}-${file.size}`}
                        className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 animate-slide-up"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100/60 dark:bg-purple-900/30">
                          <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground/60">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive transition-all"
                          title="Remove file"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* ── Generate Button ── */}
            <div className="mb-8 flex justify-center animate-scale-in animation-delay-300">
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiIsGenerating}
                className="group relative flex w-full max-w-sm items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out" />

                {aiIsGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Quiz…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>

            {/* ── Generated Questions Preview ── */}
            {aiGeneratedQuestions.length > 0 && (
              <section className="mb-8 animate-slide-up">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-foreground">
                      Generated Questions
                    </h2>
                    <p className="mt-0.5 text-sm font-medium text-purple-500 dark:text-purple-400">
                      {aiGeneratedQuestions.length} questions ready •{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAiGeneratedQuestions([]);
                        }}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Regenerate
                      </button>
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {aiGeneratedQuestions.map((question, qIndex) => (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-200 hover:border-purple-300/50 dark:hover:border-purple-700/50"
                    >
                      {/* Question header — always visible */}
                      <div className="flex items-center gap-3 p-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-xs font-bold text-purple-600 dark:text-purple-400">
                          {qIndex + 1}
                        </span>
                        <p className="flex-1 text-sm font-medium text-foreground line-clamp-1">
                          {question.text}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => removeAiQuestion(qIndex)}
                            className="rounded-full p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                            title="Remove question"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => togglePreview(question.id)}
                            className="rounded-full p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/60 transition-all"
                            title="Preview answers"
                          >
                            {aiPreviewOpen[question.id] ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable answer preview */}
                      {aiPreviewOpen[question.id] && (
                        <div className="border-t border-border/40 bg-muted/20 p-4">
                          <div className="grid grid-cols-2 gap-2">
                            {question.options.map((option, oIndex) => (
                              <div
                                key={option.id}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                                  option.isCorrect
                                    ? "bg-teal-50/80 text-teal-700 border border-teal-200/60 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-800/40"
                                    : "bg-muted/40 text-muted-foreground border border-border/40"
                                }`}
                              >
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border border-current/30">
                                  {String.fromCharCode(65 + oIndex)}
                                </span>
                                {option.text}
                                {option.isCorrect && (
                                  <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0 text-teal-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* ── AI Actions ── */}
                <div className="mt-6 flex flex-col items-center gap-3 animate-scale-in">
                  <button
                    type="button"
                    className="w-full max-w-sm rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Publish Quiz
                  </button>

                  <button
                    type="button"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Save as Draft
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* ── Footer ── */}
        <footer className="mt-16 text-center">
          <p className="text-xs text-muted-foreground/60">
            © 2024 Quizlo. Made for learners.
          </p>
        </footer>
      </div>
    </div>
  );
}
