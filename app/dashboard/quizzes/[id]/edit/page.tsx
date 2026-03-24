"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Plus,
  CheckCircle2,
  Upload,
  X,
  ArrowRight,
  Info,
  Settings,
  Loader2,
  Save,
  Eye,
  EyeOff,
  GripVertical,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getQuizWithQuestions, updateQuiz, getCategoryData, Category } from "@/lib/quiz";
import { uploadToImageKit } from "@/lib/media";
import { goeyToast } from "goey-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

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
  id: string;         // real DB id or temp local id
  _isNew?: boolean;   // if true this question was added client-side and doesn't exist in DB
  type: QuestionType;
  text: string;
  media?: File | null;
  mediaUrl?: string;  // preview URL (could be remote or blob)
  options: AnswerOption[];
  correctAnswerText?: string;
  correctAnswerNumeric?: number | "";
}

type Difficulty = "Easy" | "Medium" | "Hard";
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

const QUESTION_TYPES = [
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

// Backend type -> local QuestionType conversion
function backendTypeToLocal(t: string): QuestionType {
  const map: Record<string, QuestionType> = {
    Mcq: "mcq",
    TrueFalse: "true-false",
    MultipleSelect: "multiple-select",
    ShortAnswer: "short-answer",
    LongAnswer: "long-answer",
    FillInTheBlank: "fill-in-the-blank",
    Matching: "matching",
    Sequencing: "sequencing",
    OrderSequencing: "sequencing",
    Numeric: "numeric",
  };
  return map[t] ?? "mcq";
}

// Local QuestionType -> backend type
function localTypeToBackend(t: QuestionType): string {
  const map: Record<QuestionType, string> = {
    mcq: "Mcq",
    "true-false": "TrueFalse",
    "multiple-select": "MultipleSelect",
    "short-answer": "ShortAnswer",
    "long-answer": "LongAnswer",
    "fill-in-the-blank": "FillInTheBlank",
    matching: "Matching",
    sequencing: "Sequencing",
    numeric: "Numeric",
  };
  return map[t];
}

function createNewQuestion(): Question {
  return {
    id: `new-${Date.now()}-${Math.random()}`,
    _isNew: true,
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

export default function EditQuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // ── Loading states
  const [pageLoading, setPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  // ── Read-only metadata (cannot be edited)
  const [readonlyMeta, setReadonlyMeta] = useState<Record<string, any>>({});

  // ── Editable quiz details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10);

  // ── Categories (editable)
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");

  // ── Questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);

  // ── Load quiz data + categories on mount
  useEffect(() => {
    async function loadAll() {
      try {
        const [quiz, cats] = await Promise.all([
          getQuizWithQuestions(id),
          getCategoryData(),
        ]);

        setCategories(cats);

        // Store true read-only fields for display only
        setReadonlyMeta({
          id: quiz.id,
          plays: quiz.plays,
          rating: quiz.rating,
          createdAt: quiz.createdAt,
          creatorId: quiz.creatorId,
          creationMode: quiz.creationMode,
          updatedAt: quiz.updatedAt,
        });

        // Editable fields
        setTitle(quiz.title ?? "");
        setDescription(quiz.description ?? "");
        setDifficulty((quiz.difficulty as Difficulty) ?? "Easy");
        setIsPrivate(quiz.isPrivate ?? false);
        setIsDraft(quiz.isDraft ?? false);
        setCategoryId(quiz.categoryId ?? "");

        const totalSeconds = quiz.timeAllocated ?? 0;
        setHours(Math.floor(totalSeconds / 3600));
        setMinutes(Math.floor((totalSeconds % 3600) / 60));

        // Map questions from DB format to local format
        const mappedQuestions: Question[] = (quiz.questions ?? []).map((q: any) => {
          const localType = backendTypeToLocal(q.type);
          const options: AnswerOption[] = (q.answerOptions ?? []).map((o: any) => ({
            id: o.id,
            text: o.text ?? "",
            isCorrect: o.isCorrect ?? false,
            matchText: o.matchingText ?? o.matchText ?? "",
          }));

          return {
            id: q.id,
            _isNew: false,
            type: localType,
            text: q.text ?? "",
            media: null,
            mediaUrl: q.media?.[0] ?? "",
            options,
            correctAnswerText: q.correctAnswerText ?? options.find((o) => o.isCorrect)?.text ?? "",
            correctAnswerNumeric: q.correctAnswerNumeric ?? "",
          };
        });

        setQuestions(mappedQuestions.length > 0 ? mappedQuestions : [createNewQuestion()]);
      } catch (err) {
        setPageError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setPageLoading(false);
      }
    }
    loadAll();
  }, [id]);

  // ── Question helpers ──────────────────────────────────────────────────────

  const addQuestion = () => setQuestions((prev) => [...prev, createNewQuestion()]);

  const removeQuestion = (qIdx: number) => {
    const q = questions[qIdx];
    if (!q._isNew) {
      setDeletedQuestionIds((prev) => [...prev, q.id]);
    }
    setQuestions((prev) => {
      const next = prev.filter((_, i) => i !== qIdx);
      return next.length > 0 ? next : [createNewQuestion()];
    });
  };

  const updateQuestionText = (qIdx: number, text: string) =>
    setQuestions((prev) => prev.map((q, i) => (i === qIdx ? { ...q, text } : q)));

  const updateQuestionType = (qIdx: number, type: QuestionType) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        if (type === "true-false") {
          return {
            ...q,
            type,
            options: [
              { id: `o-${Date.now()}-t`, text: "True", isCorrect: true },
              { id: `o-${Date.now()}-f`, text: "False", isCorrect: false },
            ],
          };
        }
        if (type === "matching") {
          return {
            ...q,
            type,
            options: [
              { id: `o-${Date.now()}-1`, text: "", isCorrect: true, matchText: "" },
              { id: `o-${Date.now()}-2`, text: "", isCorrect: true, matchText: "" },
            ],
          };
        }
        // For types without options, keep options but reset
        return { ...q, type };
      })
    );
  };

  const updateOptionText = (qIdx: number, oIdx: number, text: string) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, j) => (j === oIdx ? { ...o, text } : o)) }
          : q
      )
    );

  const updateOptionMatchText = (qIdx: number, oIdx: number, matchText: string) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, j) => (j === oIdx ? { ...o, matchText } : o)) }
          : q
      )
    );

  const setCorrectOption = (qIdx: number, oIdx: number) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, j) => ({ ...o, isCorrect: j === oIdx })) }
          : q
      )
    );

  const toggleCorrectOption = (qIdx: number, oIdx: number) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, j) => (j === oIdx ? { ...o, isCorrect: !o.isCorrect } : o)) }
          : q
      )
    );

  const addOption = (qIdx: number) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: [
                ...q.options,
                { id: `o-${Date.now()}-${q.options.length}`, text: "", isCorrect: false, matchText: "" },
              ],
            }
          : q
      )
    );

  const removeOption = (qIdx: number, oIdx: number) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.filter((_, j) => j !== oIdx) } : q
      )
    );

  const updateCorrectAnswerText = (qIdx: number, text: string) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, correctAnswerText: text } : q))
    );

  const updateCorrectAnswerNumeric = (qIdx: number, val: string) => {
    const num = val === "" ? "" : Number(val);
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, correctAnswerNumeric: isNaN(num as number) ? "" : num } : q))
    );
  };

  const handleMediaUpload = (qIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        if (q.mediaUrl?.startsWith("blob:")) URL.revokeObjectURL(q.mediaUrl);
        return { ...q, media: file, mediaUrl: objectUrl };
      })
    );
  };

  const removeMedia = (qIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        if (q.mediaUrl?.startsWith("blob:")) URL.revokeObjectURL(q.mediaUrl);
        return { ...q, media: null, mediaUrl: "" };
      })
    );
  };

  // ── Save handler ──────────────────────────────────────────────────────────

  const handleSave = async (asDraft?: boolean) => {
    if (!title.trim()) {
      goeyToast.error("Please enter a quiz title.");
      return;
    }
    if (!description.trim()) {
      goeyToast.error("Please enter a description.");
      return;
    }

    setIsSaving(true);
    try {
      const formattedQuestions = await Promise.all(
        questions.map(async (q) => {
          // Upload new media if File object present
          let mediaUrls: string[] = [];
          if (q.media) {
            try {
              const url = await uploadToImageKit(q.media);
              if (url) mediaUrls.push(url);
            } catch (err: any) {
              throw new Error(`Media upload failed for "${q.text}": ${err.message}`);
            }
          } else if (q.mediaUrl && !q.mediaUrl.startsWith("blob:")) {
            mediaUrls = [q.mediaUrl];
          }

          const base = {
            type: localTypeToBackend(q.type),
            text: q.text,
            media: mediaUrls,
            explanation: "",
            options: q.options.map((o) => ({
              text: o.text,
              isCorrect: o.isCorrect,
              ...(o.matchText !== undefined ? { matchText: o.matchText } : {}),
            })),
          };

          // For existing questions include their id so backend can update
          if (!q._isNew) {
            return { ...base, id: q.id };
          }
          return base;
        })
      );

      const payload: Record<string, any> = {
        title,
        description,
        categoryId,
        difficulty,
        timeAllocated: hours * 3600 + minutes * 60,
        isPrivate,
        isDraft: asDraft ?? isDraft,
        questions: formattedQuestions,
        deletedQuestionIds,
      };

      console.log("edit quiz payload:",payload);

      await updateQuiz(id, payload);
      goeyToast.success(asDraft ? "Draft saved!" : "Quiz updated successfully!");
      router.push("/dashboard/quizzes");
    } catch (err: any) {
      console.log("error saving quiz:",err.message);
      goeyToast.error("Failed to save quiz");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading quiz…</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8fafc]">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-xl font-semibold text-slate-700">{pageError}</p>
        <Button onClick={() => router.back()} className="rounded-full bg-purple-600 text-white">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-8 pb-24">
        {/* ── Back link ── */}
        <Link
          href="/dashboard/quizzes"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Quizzes
        </Link>

        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Edit Quiz</h1>
          <p className="mt-1 text-sm font-medium text-purple-500">
            Update your quiz details and questions.
          </p>
        </div>

        {/* ── Read-only metadata banner ── */}
        {/* <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Read-only fields</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-amber-700/80">
                <span><strong>Mode:</strong> {readonlyMeta.creationMode}</span>
                <span><strong>Plays:</strong> {readonlyMeta.plays}</span>
                <span><strong>Rating:</strong> {readonlyMeta.rating ?? "—"}</span>
                <span><strong>Created:</strong> {readonlyMeta.createdAt ? new Date(readonlyMeta.createdAt).toLocaleDateString() : "—"}</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* ══════════════════════════════════════════════════════════════════
            BASIC INFO
           ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-6 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white">
              <Info className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">Basic Info</h2>
          </div>

          <div className="mb-4">
            <label htmlFor="edit-title" className="mb-1.5 block text-sm font-semibold text-foreground">
              Quiz Title
            </label>
            <Input
              id="edit-title"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-border/60 bg-muted/40 placeholder:text-muted-foreground/60 focus-visible:ring-purple-500/40"
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="mb-1.5 block text-sm font-semibold text-foreground">
              Description
            </label>
            <Textarea
              id="edit-description"
              placeholder="What is this quiz about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-y rounded-xl border-border/60 bg-muted/40 placeholder:text-muted-foreground/60 focus-visible:ring-purple-500/40"
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SETTINGS
           ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-6 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white">
              <Settings className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">Settings</h2>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Category</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
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

          {/* Difficulty */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-foreground">Difficulty</label>
            <div className="flex gap-2">
              {difficulties.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-all duration-200 ${
                    difficulty === d
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
                      : "border border-border/60 text-foreground hover:border-purple-400/60 hover:text-purple-600"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time Allocated */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-semibold text-foreground">Time Allocated</label>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  id="edit-hours"
                  type="number"
                  min="0"
                  placeholder="HH"
                  value={hours || ""}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="rounded-xl border-border/60 bg-muted/40 placeholder:text-muted-foreground/60 focus-visible:ring-purple-500/40"
                />
                <span className="ml-1 mt-1 block text-[10px] font-medium uppercase text-muted-foreground">Hours</span>
              </div>
              <div className="flex-1">
                <Input
                  id="edit-minutes"
                  type="number"
                  min="0"
                  max="59"
                  placeholder="MM"
                  value={minutes || ""}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="rounded-xl border-border/60 bg-muted/40 placeholder:text-muted-foreground/60 focus-visible:ring-purple-500/40"
                />
                <span className="ml-1 mt-1 block text-[10px] font-medium uppercase text-muted-foreground">Minutes</span>
              </div>
            </div>
          </div>

          {/* Private toggle */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-muted/40 p-4">
            <div>
              <p className="text-sm font-bold text-foreground">Private Quiz</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Only people with the link can play</p>
            </div>
            <Switch
              id="edit-private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          {/* Draft toggle */}
          <div className="flex items-center justify-between rounded-xl bg-muted/40 p-4">
            <div>
              <p className="text-sm font-bold text-foreground">Draft</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Save as draft — won't appear publicly</p>
            </div>
            <Switch
              id="edit-draft"
              checked={isDraft}
              onCheckedChange={setIsDraft}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            QUESTIONS
           ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">Questions</h2>
              <p className="mt-0.5 text-sm font-medium text-purple-500">
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {questions.map((question, qIdx) => (
              <QuestionCard
                key={question.id}
                question={question}
                qIdx={qIdx}
                total={questions.length}
                onRemove={() => removeQuestion(qIdx)}
                onUpdateText={(t) => updateQuestionText(qIdx, t)}
                onUpdateType={(t) => updateQuestionType(qIdx, t)}
                onUpdateOptionText={(oIdx, t) => updateOptionText(qIdx, oIdx, t)}
                onUpdateMatchText={(oIdx, t) => updateOptionMatchText(qIdx, oIdx, t)}
                onSetCorrect={(oIdx) => setCorrectOption(qIdx, oIdx)}
                onToggleCorrect={(oIdx) => toggleCorrectOption(qIdx, oIdx)}
                onAddOption={() => addOption(qIdx)}
                onRemoveOption={(oIdx) => removeOption(qIdx, oIdx)}
                onUpdateCorrectText={(t) => updateCorrectAnswerText(qIdx, t)}
                onUpdateCorrectNumeric={(v) => updateCorrectAnswerNumeric(qIdx, v)}
                onMediaUpload={(e) => handleMediaUpload(qIdx, e)}
                onRemoveMedia={() => removeMedia(qIdx)}
              />
            ))}
          </div>

          {/* Add question button */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={addQuestion}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg shadow-purple-500/25 hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-200"
              title="Add question"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SAVE ACTIONS
           ══════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="w-full max-w-sm rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-70"
          >
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
}

// ── QuestionCard sub-component ─────────────────────────────────────────────

interface QuestionCardProps {
  question: Question;
  qIdx: number;
  total: number;
  onRemove: () => void;
  onUpdateText: (t: string) => void;
  onUpdateType: (t: QuestionType) => void;
  onUpdateOptionText: (oIdx: number, t: string) => void;
  onUpdateMatchText: (oIdx: number, t: string) => void;
  onSetCorrect: (oIdx: number) => void;
  onToggleCorrect: (oIdx: number) => void;
  onAddOption: () => void;
  onRemoveOption: (oIdx: number) => void;
  onUpdateCorrectText: (t: string) => void;
  onUpdateCorrectNumeric: (v: string) => void;
  onMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveMedia: () => void;
}

function QuestionCard({
  question,
  qIdx,
  total,
  onRemove,
  onUpdateText,
  onUpdateType,
  onUpdateOptionText,
  onUpdateMatchText,
  onSetCorrect,
  onToggleCorrect,
  onAddOption,
  onRemoveOption,
  onUpdateCorrectText,
  onUpdateCorrectNumeric,
  onMediaUpload,
  onRemoveMedia,
}: QuestionCardProps) {
  return (
    <div className="relative rounded-2xl border-2 border-dashed border-border/70 p-5 transition-all duration-200 hover:border-purple-300">
      {/* Question number badge + new indicator */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-[11px] font-black text-purple-700">
            {qIdx + 1}
          </span>
          {question._isNew && (
            <Badge className="rounded-full bg-emerald-100 px-2 py-0 text-[10px] font-bold text-emerald-700">
              New
            </Badge>
          )}
        </div>
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full p-1.5 text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive transition-all"
            title="Remove question"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Question text input */}
      <div className="mb-4">
        <Input
          placeholder="Type your question here…"
          value={question.text}
          onChange={(e) => onUpdateText(e.target.value)}
          className="mb-3 border-0 bg-transparent px-0 text-base font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Type selector + media upload */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={question.type}
            onValueChange={(val) => onUpdateType(val as QuestionType)}
          >
            <SelectTrigger className="w-full rounded-xl border-border/60 bg-muted/40 text-sm sm:w-[200px]">
              <SelectValue placeholder="Question Type" />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!question.mediaUrl && (
            <label className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-purple-600 sm:w-auto">
              <Upload className="h-3.5 w-3.5" />
              Add Media
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                className="hidden"
                onChange={onMediaUpload}
              />
            </label>
          )}
        </div>
      </div>

      {/* Media preview */}
      {question.mediaUrl && (
        <div className="relative mb-4 inline-flex overflow-hidden rounded-xl border border-border/50 bg-muted/30">
          {question.media?.type?.startsWith("video/") || question.mediaUrl?.match(/\.(mp4|webm|ogg)$/i) ? (
            <video src={question.mediaUrl} controls className="max-h-48 max-w-full" />
          ) : question.media?.type?.startsWith("audio/") || question.mediaUrl?.match(/\.(mp3|wav|ogg)$/i) ? (
            <audio src={question.mediaUrl} controls className="m-2" />
          ) : (
            <img src={question.mediaUrl} alt="Question media" className="max-h-48 max-w-full object-contain" />
          )}
          <button
            type="button"
            onClick={onRemoveMedia}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-black/70"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Answer options by type ── */}
      <div className="mt-4">
        {/* MCQ */}
        {question.type === "mcq" && (
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, oIdx) => (
              <div key={opt.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSetCorrect(oIdx)}
                  className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ${
                    opt.isCorrect
                      ? "border-teal-400 bg-teal-50/60"
                      : "border-border/50 bg-muted/30 hover:border-purple-300"
                  }`}
                >
                  <input
                    type="text"
                    placeholder={`Option ${oIdx + 1}`}
                    value={opt.text}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onUpdateOptionText(oIdx, e.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${opt.isCorrect ? "bg-teal-500 text-white" : "border-2 border-border/60 group-hover:border-purple-400"}`}>
                    {opt.isCorrect && <CheckCircle2 className="h-5 w-5 fill-teal-500 text-white" />}
                  </div>
                </button>
                {question.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => onRemoveOption(oIdx)}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={onAddOption}
              className="col-span-2 rounded-xl border-2 border-dashed border-purple-500/30 py-2 text-sm font-semibold text-purple-600 transition-colors hover:border-purple-500/60"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* True / False */}
        {question.type === "true-false" && (
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, oIdx) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSetCorrect(oIdx)}
                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ${
                  opt.isCorrect
                    ? "border-teal-400 bg-teal-50/60"
                    : "border-border/50 bg-muted/30 hover:border-purple-300"
                }`}
              >
                <span className="flex-1 text-sm font-semibold">{opt.text}</span>
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${opt.isCorrect ? "bg-teal-500" : "border-2 border-border/60"}`}>
                  {opt.isCorrect && <CheckCircle2 className="h-5 w-5 fill-teal-500 text-white" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Multiple Select */}
        {question.type === "multiple-select" && (
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, oIdx) => (
              <div key={opt.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onToggleCorrect(oIdx)}
                  className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ${
                    opt.isCorrect
                      ? "border-teal-400 bg-teal-50/60"
                      : "border-border/50 bg-muted/30 hover:border-purple-300"
                  }`}
                >
                  <input
                    type="text"
                    placeholder={`Option ${oIdx + 1}`}
                    value={opt.text}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onUpdateOptionText(oIdx, e.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all ${opt.isCorrect ? "bg-teal-500" : "border-2 border-border/60 group-hover:border-purple-400"}`}>
                    {opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </div>
                </button>
                {question.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => onRemoveOption(oIdx)}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={onAddOption}
              className="col-span-2 rounded-xl border-2 border-dashed border-purple-500/30 py-2 text-sm font-semibold text-purple-600 transition-colors hover:border-purple-500/60"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* Short Answer / Long Answer / Fill in the Blank */}
        {(question.type === "short-answer" ||
          question.type === "fill-in-the-blank" ||
          question.type === "long-answer") && (
          <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-4">
            <label className="text-sm font-semibold text-foreground">
              Correct Answer / Rubric{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <p className="text-xs text-muted-foreground">Provide the exact text or keywords.</p>
            {question.type === "long-answer" ? (
              <Textarea
                value={question.correctAnswerText ?? ""}
                onChange={(e) => onUpdateCorrectText(e.target.value)}
                placeholder="Example full answer or key points..."
                className="resize-y rounded-xl border-border/60 bg-background"
              />
            ) : (
              <Input
                value={question.correctAnswerText ?? ""}
                onChange={(e) => onUpdateCorrectText(e.target.value)}
                placeholder={question.type === "fill-in-the-blank" ? "Exact word or phrase..." : "Correct answer..."}
                className="rounded-xl border-border/60 bg-background"
              />
            )}
          </div>
        )}

        {/* Numeric */}
        {question.type === "numeric" && (
          <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-4">
            <label className="text-sm font-semibold text-foreground">Correct Numeric Answer</label>
            <Input
              type="number"
              value={question.correctAnswerNumeric ?? ""}
              onChange={(e) => onUpdateCorrectNumeric(e.target.value)}
              placeholder="e.g. 42"
              className="rounded-xl border-border/60 bg-background text-lg"
            />
          </div>
        )}

        {/* Matching */}
        {question.type === "matching" && (
          <div className="flex flex-col gap-3">
            {question.options.map((opt, oIdx) => (
              <div key={opt.id} className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/20 p-2">
                <Input
                  value={opt.text}
                  onChange={(e) => onUpdateOptionText(oIdx, e.target.value)}
                  placeholder={`Term ${oIdx + 1}`}
                  className="flex-1 bg-background"
                />
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  value={opt.matchText ?? ""}
                  onChange={(e) => onUpdateMatchText(oIdx, e.target.value)}
                  placeholder={`Match ${oIdx + 1}`}
                  className="flex-1 bg-background"
                />
                <button
                  type="button"
                  onClick={() => onRemoveOption(oIdx)}
                  disabled={question.options.length <= 2}
                  className="px-2 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={onAddOption}
              className="rounded-xl border-2 border-dashed border-purple-500/30 py-2 text-sm font-semibold text-purple-600 transition-colors hover:border-purple-500/60"
            >
              + Add Match Pair
            </button>
          </div>
        )}

        {/* Sequencing */}
        {question.type === "sequencing" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">Items should be listed in the correct order (top → bottom).</p>
            {question.options.map((opt, oIdx) => (
              <div key={opt.id} className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  {oIdx + 1}
                </span>
                <Input
                  value={opt.text}
                  onChange={(e) => onUpdateOptionText(oIdx, e.target.value)}
                  placeholder={`Step ${oIdx + 1}`}
                  className="flex-1 bg-background"
                />
                <button
                  type="button"
                  onClick={() => onRemoveOption(oIdx)}
                  disabled={question.options.length <= 2}
                  className="px-2 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={onAddOption}
              className="rounded-xl border-2 border-dashed border-purple-500/30 py-2 text-sm font-semibold text-purple-600 transition-colors hover:border-purple-500/60"
            >
              + Add Sequence Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
