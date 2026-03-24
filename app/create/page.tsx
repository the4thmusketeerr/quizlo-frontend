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
import { useRouter } from "next/navigation";
import { createQuiz, getCategoryData, Category } from "@/lib/quiz";
import { uploadToImageKit } from "@/lib/media";
import { goeyToast } from "goey-toast";
import { useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export type QuestionType =
  | "mcq"
  | "true-false"
  | "multiple-select"
  | "short-answer"
  | "long-answer"
  | "fill-in-the-blank"
  | "matching"
  | "sequencing"
  | "numeric";

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  matchText?: string;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  media?: File | null;
  mediaUrl?: string;
  options: AnswerOption[];
  correctAnswerText?: string;
  correctAnswerNumeric?: number | "";
}

type CreationMode = "manual" | "ai";

// ── Helpers ──────────────────────────────────────────────────────────────────

// Static difficulties remain as they are likely fixed
const difficulties = ["Easy", "Medium", "Hard"] as const;
type Difficulty = (typeof difficulties)[number];

const manualQuestionTypes = [
  { value: "mcq", label: "Multiple Choice" },
  { value: "true-false", label: "True / False" },
  { value: "multiple-select", label: "Multiple Select" },
  { value: "short-answer", label: "Short Answer" },
  { value: "long-answer", label: "Long Answer" },
  { value: "fill-in-the-blank", label: "Fill in the Blank" },
  { value: "matching", label: "Matching" },
  { value: "sequencing", label: "Order / Sequencing" },
  { value: "numeric", label: "Numeric Answer" },
] as const;

const aiQuestionTypes = [
  { value: "mcq", label: "Multiple Choice", icon: "🔘" },
  { value: "true-false", label: "True / False", icon: "✅" },
  { value: "mixed", label: "Mixed", icon: "🎲" },
];

function createEmptyQuestion(index: number): Question {
  return {
    id: `q-${Date.now()}-${index}`,
    type: "mcq",
    text: "",
    media: null,
    mediaUrl: "",
    options: [
      { id: `o-${Date.now()}-1`, text: "", isCorrect: false },
      { id: `o-${Date.now()}-2`, text: "", isCorrect: false },
      { id: `o-${Date.now()}-3`, text: "", isCorrect: false },
      { id: `o-${Date.now()}-4`, text: "", isCorrect: false },
    ],
    correctAnswerText: "",
    correctAnswerNumeric: "",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CreateQuizPage() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  // ── Creation mode ──
  const [mode, setMode] = useState<CreationMode>("manual");

  // ── Shared form state ──
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [isPrivate, setIsPrivate] = useState(false);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(10);

  // ── Fetch dynamic categories ──
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoryData();
        setCategories(data);
        if (data.length > 0) {
          setCategory(data[0].id); // Set default to first category ID
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        goeyToast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

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
    [],
  );
  const [aiPreviewOpen, setAiPreviewOpen] = useState<Record<string, boolean>>(
    {},
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
          !aiFiles.some(
            (existing) => existing.name === f.name && existing.size === f.size,
          ),
      );
      setAiFiles((prev) => [...prev, ...newFiles].slice(0, MAX_FILES));
    },
    [aiFiles],
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
    setQuestions((prev) => {
      const q = prev[qIndex];
      if (q.mediaUrl) URL.revokeObjectURL(q.mediaUrl);
      return prev.filter((_, i) => i !== qIndex);
    });
  };

  const updateQuestionText = (qIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, text } : q)),
    );
  };

  const updateQuestionType = (qIndex: number, type: QuestionType) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = [...q.options];
        if (type === "true-false") {
          return {
            ...q,
            type,
            options: [
              { id: `o-${Date.now()}-1`, text: "True", isCorrect: true },
              { id: `o-${Date.now()}-2`, text: "False", isCorrect: false },
            ],
          };
        } else if (type === "matching") {
          return {
            ...q,
            type,
            options: [
              {
                id: `o-${Date.now()}-1`,
                text: "",
                matchText: "",
                isCorrect: true,
              },
              {
                id: `o-${Date.now()}-2`,
                text: "",
                matchText: "",
                isCorrect: true,
              },
            ],
          };
        } else if (
          type === "mcq" ||
          type === "multiple-select" ||
          type === "sequencing"
        ) {
          if (newOptions.length < 2) {
            newOptions.push(
              { id: `o-${Date.now()}-1`, text: "", isCorrect: false },
              { id: `o-${Date.now()}-2`, text: "", isCorrect: false },
            );
          }
          return { ...q, type, options: newOptions };
        }
        return { ...q, type, options: newOptions };
      }),
    );
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) =>
                j === oIndex ? { ...o, text } : o,
              ),
            }
          : q,
      ),
    );
  };

  const updateOptionMatchText = (
    qIndex: number,
    oIndex: number,
    matchText: string,
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) =>
                j === oIndex ? { ...o, matchText } : o,
              ),
            }
          : q,
      ),
    );
  };

  const addOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: [
                ...q.options,
                {
                  id: `o-${Date.now()}-${q.options.length}`,
                  text: "",
                  isCorrect: false,
                  matchText: "",
                },
              ],
            }
          : q,
      ),
    );
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.filter((_, j) => j !== oIndex),
            }
          : q,
      ),
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
          : q,
      ),
    );
  };

  const toggleCorrectOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) => ({
                ...o,
                isCorrect: j === oIndex ? !o.isCorrect : o.isCorrect,
              })),
            }
          : q,
      ),
    );
  };

  const updateCorrectAnswerText = (qIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, correctAnswerText: text } : q,
      ),
    );
  };

  const updateCorrectAnswerNumeric = (qIndex: number, val: string) => {
    const numeric = val === "" ? "" : Number(val);
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              correctAnswerNumeric: isNaN(numeric as number) ? "" : numeric,
            }
          : q,
      ),
    );
  };

  const handleMediaUpload = (
    qIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const mediaUrl = URL.createObjectURL(file);
      setQuestions((prev) =>
        prev.map((q, i) => {
          if (i === qIndex) {
            if (q.mediaUrl) URL.revokeObjectURL(q.mediaUrl);
            return { ...q, media: file, mediaUrl };
          }
          return q;
        }),
      );
    }
  };

  const removeMedia = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i === qIndex) {
          if (q.mediaUrl) URL.revokeObjectURL(q.mediaUrl);
          return { ...q, media: null, mediaUrl: "" };
        }
        return q;
      }),
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
        type: "mcq",
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
      }),
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

  // ── Publish handler ──
  const handlePublish = async (isDraftStatus = false) => {
    if (!title) {
      goeyToast.error("Please enter a title for the quiz.");
      return;
    }
    if (!description) {
      goeyToast.error("Please enter a description for the quiz.");
      return;
    }
    if (!category) {
      goeyToast.error("Please select a category for the quiz.");
      return;
    }
    if (!difficulty) {
      goeyToast.error("Please select a difficulty for the quiz.");
      return;
    }
    if ((hours * 3600 + minutes * 60) <= 0) {
      goeyToast.error("Please enter a time allocated for the quiz.");
      return;
    }
    if (!questions.length) {
      goeyToast.error("Please add at least one question to the quiz.");
      return;
    }
    setIsPublishing(true);
    try {
      const qs = mode === "manual" ? questions : aiGeneratedQuestions;
      const formattedQuestions = await Promise.all(qs.map(async (q) => {
        let mappedType = "Mcq";
        switch (q.type) {
          case "mcq": mappedType = "Mcq"; break;
          case "true-false": mappedType = "TrueFalse"; break;
          case "multiple-select": mappedType = "MultipleSelect"; break;
          case "short-answer": mappedType = "ShortAnswer"; break;
          case "long-answer": mappedType = "LongAnswer"; break;
          case "fill-in-the-blank": mappedType = "FillInTheBlank"; break;
          case "matching": mappedType = "Matching"; break;
          case "sequencing": mappedType = "Sequencing"; break;
          case "numeric": mappedType = "Numeric"; break;
        }

        let mediaUrls: string[] = [];
        if (q.media) {
          try {
            const url = await uploadToImageKit(q.media);
            if (url) {
              mediaUrls.push(url);
            }
          } catch (error: any) {
            console.error("Failed to upload media for question:", q.text, error);
            throw new Error(`Failed to upload media for question "${q.text}": ${error.message || "Unknown error"}`);
          }
        }

        // Base shape shared by all question types
        const base = {
          text: q.text,
          type: mappedType,
          explanation: "",
          media: mediaUrls,
        };

        // ── Types that use a free-text correct answer ──────────────────────
        if (
          q.type === "short-answer" ||
          q.type === "long-answer" ||
          q.type === "fill-in-the-blank"
        ) {
          return {
            ...base,
            correctAnswerText: q.correctAnswerText ?? "",
            options: [],
          };
        }

        // ── Numeric answer ─────────────────────────────────────────────────
        if (q.type === "numeric") {
          return {
            ...base,
            correctAnswerNumeric:
              q.correctAnswerNumeric !== "" ? Number(q.correctAnswerNumeric) : null,
            options: [],
          };
        }

        // ── Matching pairs ─────────────────────────────────────────────────
        // Each option carries a `text` (left) and `matchText` (right); all are
        // correct by definition — the player must match them properly.
        if (q.type === "matching") {
          return {
            ...base,
            options: q.options.map((o) => ({
              text: o.text,
              matchText: o.matchText ?? "",
              isCorrect: true,
            })),
          };
        }

        // ── Sequencing ─────────────────────────────────────────────────────
        // Options represent items in the correct order; send them as-is with
        // their position implied by array index. isCorrect is not meaningful here.
        if (q.type === "sequencing") {
          return {
            ...base,
            options: q.options.map((o, idx) => ({
              text: o.text,
              order: idx,
              isCorrect: true,
            })),
          };
        }

        // ── MCQ / True-False / Multiple-Select ─────────────────────────────
        return {
          ...base,
          options: q.options.map((o) => ({
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        };
      }));

      const payload = {
        title,
        description,
        categoryId: category, // Using category name directly for now, backend or future logic can map to actual ID
        difficulty,
        timeAllocated: hours * 3600 + minutes * 60,
        isPrivate,
        isDraft: isDraftStatus,
        creationMode: mode === "manual" ? "Manual" : "Ai",
        questions: formattedQuestions
      };

      console.log("Quiz details sent to backend:", payload);

      await createQuiz(payload);
      
      goeyToast.success(isDraftStatus ? "Draft saved successfully!" : "Quiz published successfully!");
      router.push("/explore");
    } catch (error: any) {
      console.log("Error publishing quiz:", error);
      goeyToast.error(error.message || "Failed to publish quiz");
    } finally {
      setIsPublishing(false);
    }
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
                mode === "ai" ? "left-[calc(50%+3px)]" : "left-1.5"
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
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white">
              <Info className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">Basic Info</h2>
          </div>

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
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white">
              <Settings className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">Settings</h2>
          </div>

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
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Time Allocated
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="HH"
                  value={hours || ""}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="rounded-xl border-border/60 bg-muted/40 placeholder:text-muted-foreground/60 focus-visible:ring-purple-500/40"
                />
                <span className="mt-1 block text-[10px] font-medium uppercase text-muted-foreground ml-1">
                  Hours
                </span>
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="MM"
                  value={minutes || ""}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="rounded-xl border-border/60 bg-muted/40 placeholder:text-muted-foreground/60 focus-visible:ring-purple-500/40"
                />
                <span className="mt-1 block text-[10px] font-medium uppercase text-muted-foreground ml-1">
                  Minutes
                </span>
              </div>
            </div>
          </div>

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
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all z-10"
                        title="Remove question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                    {/* Question text */}
                    <div className="mb-4">
                      <Input
                        placeholder="Type your question here…"
                        value={question.text}
                        onChange={(e) =>
                          updateQuestionText(qIndex, e.target.value)
                        }
                        className="mb-3 border-0 bg-transparent px-0 text-base font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Select
                          value={question.type}
                          onValueChange={(val: QuestionType) =>
                            updateQuestionType(qIndex, val)
                          }
                        >
                          <SelectTrigger className="w-full sm:w-[200px] rounded-xl border-border/60 bg-muted/40 focus:ring-purple-500/40 text-sm">
                            <SelectValue placeholder="Question Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {manualQuestionTypes.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Media Upload */}
                        {!question.mediaUrl && (
                          <label className="cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-purple-600 transition-colors bg-muted/30 px-3 py-2 rounded-xl border border-border/50 w-full sm:w-auto">
                            <Upload className="w-3.5 h-3.5" />
                            Add Media
                            <input
                              type="file"
                              accept="image/*,video/*,audio/*"
                              className="hidden"
                              onChange={(e: any) =>
                                handleMediaUpload(qIndex, e)
                              }
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Media Preview */}
                    {question.mediaUrl && (
                      <div className="mb-4 relative inline-flex border border-border/50 rounded-xl overflow-hidden bg-muted/30">
                        {question.media?.type.startsWith("video/") ? (
                          <video
                            src={question.mediaUrl}
                            controls
                            className="max-h-48 max-w-full"
                          />
                        ) : question.media?.type.startsWith("audio/") ? (
                          <audio
                            src={question.mediaUrl}
                            controls
                            className="m-2"
                          />
                        ) : (
                          <img
                            src={question.mediaUrl}
                            alt="Question Media"
                            className="max-h-48 max-w-full object-contain"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(qIndex)}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors shadow-md backdrop-blur-md"
                          title="Remove media"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Answer options */}
                    <div className="mt-4">
                      {/* MCQ Option */}
                      {question.type === "mcq" && (
                        <div className="grid grid-cols-2 gap-3">
                          {question.options.map((option, oIndex) => {
                            const isCorrect = option.isCorrect;
                            return (
                              <div key={option.id} className="relative group">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCorrectOption(qIndex, oIndex)
                                  }
                                  className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ${
                                    isCorrect
                                      ? "border-teal-400 bg-teal-50/60 dark:border-teal-500 dark:bg-teal-950/30"
                                      : "border-border/50 bg-muted/30 hover:border-purple-300 dark:hover:border-purple-600"
                                  }`}
                                >
                                  <input
                                    type="text"
                                    placeholder={`Option ${oIndex + 1}`}
                                    value={option.text}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                      updateOptionText(
                                        qIndex,
                                        oIndex,
                                        e.target.value,
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
                                {question.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeOption(qIndex, oIndex)}
                                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => addOption(qIndex)}
                            className="col-span-2 text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 py-2 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-colors"
                          >
                            + Add Option
                          </button>
                        </div>
                      )}

                      {/* True-False */}
                      {question.type === "true-false" && (
                        <div className="grid grid-cols-2 gap-3">
                          {question.options.map((option, oIndex) => {
                            const isCorrect = option.isCorrect;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setCorrectOption(qIndex, oIndex)}
                                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ${
                                  isCorrect
                                    ? "border-teal-400 bg-teal-50/60 dark:border-teal-500 dark:bg-teal-950/30"
                                    : "border-border/50 bg-muted/30 hover:border-purple-300 dark:hover:border-purple-600"
                                }`}
                              >
                                <span className="flex-1 text-sm font-semibold">
                                  {option.text}
                                </span>
                                <div
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                                    isCorrect
                                      ? "bg-teal-500 text-white"
                                      : "border-2 border-border/60 hover:border-purple-400"
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
                      )}

                      {/* Multiple Select */}
                      {question.type === "multiple-select" && (
                        <div className="grid grid-cols-2 gap-3">
                          {question.options.map((option, oIndex) => {
                            const isCorrect = option.isCorrect;
                            return (
                              <div key={option.id} className="relative group">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleCorrectOption(qIndex, oIndex)
                                  }
                                  className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ${
                                    isCorrect
                                      ? "border-teal-400 bg-teal-50/60 dark:border-teal-500 dark:bg-teal-950/30"
                                      : "border-border/50 bg-muted/30 hover:border-purple-300 dark:hover:border-purple-600"
                                  }`}
                                >
                                  <input
                                    type="text"
                                    placeholder={`Option ${oIndex + 1}`}
                                    value={option.text}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                      updateOptionText(
                                        qIndex,
                                        oIndex,
                                        e.target.value,
                                      )
                                    }
                                    className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                                  />
                                  <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all ${
                                      isCorrect
                                        ? "bg-teal-500 flex items-center justify-center"
                                        : "border-2 border-border/60 group-hover:border-purple-400"
                                    }`}
                                  >
                                    {isCorrect && (
                                      <CheckCircle2 className="h-4 w-4 text-white" />
                                    )}
                                  </div>
                                </button>
                                {question.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeOption(qIndex, oIndex)}
                                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => addOption(qIndex)}
                            className="col-span-2 text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 py-2 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-colors"
                          >
                            + Add Option
                          </button>
                        </div>
                      )}

                      {/* Short Answer / Fill in the blank / Long Answer */}
                      {(question.type === "short-answer" ||
                        question.type === "fill-in-the-blank" ||
                        question.type === "long-answer") && (
                        <div className="flex flex-col gap-2 bg-muted/20 p-4 rounded-xl border border-border/50">
                          <label className="text-sm font-semibold text-foreground">
                            Correct Answer / Rubric (Optional)
                          </label>
                          <p className="text-xs text-muted-foreground mb-2">
                            Provide the exact text or keywords students need to
                            match.
                          </p>
                          {question.type === "long-answer" ? (
                            <Textarea
                              value={question.correctAnswerText || ""}
                              onChange={(e) =>
                                updateCorrectAnswerText(qIndex, e.target.value)
                              }
                              placeholder="Example full answer or key points..."
                              className="rounded-xl border-border/60 bg-background resize-y"
                            />
                          ) : (
                            <Input
                              value={question.correctAnswerText || ""}
                              onChange={(e) =>
                                updateCorrectAnswerText(qIndex, e.target.value)
                              }
                              placeholder={
                                question.type === "fill-in-the-blank"
                                  ? "Exact single word or phrase..."
                                  : "Exact correct answer text..."
                              }
                              className="rounded-xl border-border/60 bg-background"
                            />
                          )}
                        </div>
                      )}

                      {/* Numeric */}
                      {question.type === "numeric" && (
                        <div className="flex flex-col gap-2 bg-muted/20 p-4 rounded-xl border border-border/50">
                          <label className="text-sm font-semibold text-foreground">
                            Correct Numeric Answer
                          </label>
                          <Input
                            type="number"
                            value={question.correctAnswerNumeric ?? ""}
                            onChange={(e) =>
                              updateCorrectAnswerNumeric(qIndex, e.target.value)
                            }
                            placeholder="e.g. 42"
                            className="rounded-xl border-border/60 bg-background text-lg"
                          />
                        </div>
                      )}

                      {/* Matching */}
                      {question.type === "matching" && (
                        <div className="flex flex-col gap-3">
                          {question.options.map((option, oIndex) => (
                            <div
                              key={option.id}
                              className="flex gap-2 items-center bg-muted/20 p-2 rounded-xl border border-border/50"
                            >
                              <Input
                                value={option.text}
                                onChange={(e) =>
                                  updateOptionText(
                                    qIndex,
                                    oIndex,
                                    e.target.value,
                                  )
                                }
                                placeholder={`Term ${oIndex + 1}`}
                                className="flex-1 bg-background"
                              />
                              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                              <Input
                                value={option.matchText || ""}
                                onChange={(e) =>
                                  updateOptionMatchText(
                                    qIndex,
                                    oIndex,
                                    e.target.value,
                                  )
                                }
                                placeholder={`Match for Term ${oIndex + 1}`}
                                className="flex-1 bg-background"
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="text-muted-foreground hover:text-destructive px-2 transition-colors disabled:opacity-50"
                                disabled={question.options.length <= 2}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addOption(qIndex)}
                            className="text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 py-2 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-colors"
                          >
                            + Add Match Pair
                          </button>
                        </div>
                      )}

                      {/* Sequencing */}
                      {question.type === "sequencing" && (
                        <div className="flex flex-col gap-3">
                          <p className="text-xs text-muted-foreground mb-1">
                            Add items in the correct order top to bottom
                          </p>
                          {question.options.map((option, oIndex) => (
                            <div
                              key={option.id}
                              className="flex gap-3 items-center bg-muted/20 p-2 rounded-xl border border-border/50"
                            >
                              <span className="flex h-6 w-6 items-center justify-center shrink-0 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                                {oIndex + 1}
                              </span>
                              <Input
                                value={option.text}
                                onChange={(e) =>
                                  updateOptionText(
                                    qIndex,
                                    oIndex,
                                    e.target.value,
                                  )
                                }
                                placeholder={`Step ${oIndex + 1}`}
                                className="flex-1 bg-background"
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="text-muted-foreground hover:text-destructive px-2 transition-colors disabled:opacity-50"
                                disabled={question.options.length <= 2}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addOption(qIndex)}
                            className="text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 py-2 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-colors"
                          >
                            + Add Sequence Item
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

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

            <div className="flex flex-col items-center gap-3 animate-scale-in animation-delay-300">
              <button
                type="button"
                onClick={() => handlePublish(false)}
                disabled={isPublishing}
                className="w-full max-w-sm rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isPublishing ? "Publishing..." : "Publish Quiz"}
              </button>

              <button
                type="button"
                onClick={() => handlePublish(true)}
                disabled={isPublishing}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-70"
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
            <section className="mb-6 rounded-2xl border border-border/50 bg-card p-5 shadow-sm animate-slide-up animation-delay-200 relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 blur-2xl" />

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
                  The more detail you provide, the better the questions. Leave
                  empty to use the selected category.
                </p>
              </div>

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

              <div className="mb-5 relative">
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Question Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {aiQuestionTypes.map((qt) => (
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
                  <span>You can paste study notes or article text here</span>
                </div>
              </div>

              <div className="mt-5 relative">
                <label className="mb-1.5 block text-sm font-semibold text-foreground">
                  Upload Source Material{" "}
                  <span className="font-normal text-muted-foreground/70">
                    (optional)
                  </span>
                </label>

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
                      PDF, TXT, DOC, DOCX, PPT, PPTX, PNG, JPG • Max {MAX_FILES}{" "}
                      files
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

            <div className="mb-8 flex justify-center animate-scale-in animation-delay-300">
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiIsGenerating}
                className="group relative flex w-full max-w-sm items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              >
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

                <div className="mt-6 flex flex-col items-center gap-3 animate-scale-in">
                  <button
                    type="button"
                    onClick={() => handlePublish(false)}
                    disabled={isPublishing}
                    className="w-full max-w-sm rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isPublishing ? "Publishing..." : "Publish Quiz"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePublish(true)}
                    disabled={isPublishing}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-70"
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
