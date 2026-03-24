import * as fs from 'fs';

let content = fs.readFileSync('c:/Users/anork/Desktop/Quizlo-Frontend/app/create/page.tsx', 'utf8');

// Replacement 1
content = content.replace(
/\/\/ -- Types --[\\s\\S]*?function createEmptyQuestion[\\s\\S]*?return \\{[\\s\\S]*?\\}\\;\\n\\}/,
\// -- Types --------------------------------------------------------------------

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

// -- Helpers ------------------------------------------------------------------

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

const questionTypes = [
  { value: "mcq", label: "Multiple Choice", icon: "??" },
  { value: "true-false", label: "True / False", icon: "?" },
  { value: "mixed", label: "Mixed", icon: "??" },
];

function createEmptyQuestion(index: number): Question {
  return {
    id: \\\q-\\\-\\\\\\,
    type: "mcq",
    text: "",
    media: null,
    mediaUrl: "",
    options: [
      { id: \\\o-\\\-1\\\, text: "", isCorrect: false },
      { id: \\\o-\\\-2\\\, text: "", isCorrect: false },
      { id: \\\o-\\\-3\\\, text: "", isCorrect: false },
      { id: \\\o-\\\-4\\\, text: "", isCorrect: false },
    ],
    correctAnswerText: "",
    correctAnswerNumeric: "",
  };
}\
);

const helperOldRegex = /  \/\/ -- Question helpers \\(manual\\) --[\\s\\S]*?const setCorrectOption = [\\s\\S]*?  \};/
const helperNew = \  // -- Question helpers (manual) --
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
      prev.map((q, i) => (i === qIndex ? { ...q, text } : q))
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
              { id: \\\o-\\\-1\\\, text: "True", isCorrect: true },
              { id: \\\o-\\\-2\\\, text: "False", isCorrect: false },
            ],
          };
        } else if (type === "matching") {
          return {
            ...q,
            type,
            options: [
              { id: \\\o-\\\-1\\\, text: "", matchText: "", isCorrect: true },
              { id: \\\o-\\\-2\\\, text: "", matchText: "", isCorrect: true },
            ],
          };
        } else if (
          type === "mcq" ||
          type === "multiple-select" ||
          type === "sequencing"
        ) {
          if (newOptions.length < 2) {
             newOptions.push(
               { id: \\\o-\\\-1\\\, text: "", isCorrect: false },
               { id: \\\o-\\\-2\\\, text: "", isCorrect: false },
             );
          }
          return { ...q, type, options: newOptions };
        }
        return { ...q, type };
      })
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

  const updateOptionMatchText = (qIndex: number, oIndex: number, matchText: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((o, j) =>
                j === oIndex ? { ...o, matchText } : o
              ),
            }
          : q
      )
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
                { id: \\\o-\\\-\\\\\\, text: "", isCorrect: false, matchText: "" },
              ],
            }
          : q
      )
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
          : q
      )
    );
  };

  const updateCorrectAnswerText = (qIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, correctAnswerText: text } : q))
    );
  };

  const updateCorrectAnswerNumeric = (qIndex: number, val: string) => {
    const numeric = val === "" ? "" : Number(val);
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, correctAnswerNumeric: isNaN(numeric as number) ? "" : numeric } : q))
    );
  };

  const handleMediaUpload = (qIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
        })
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
       })
    );
  };\;

content = content.replace(helperOldRegex, helperNew);

const renderOldRegex = /                    \\{\\/\\* Question text \\*\\/\\}(?:.|\\n|\\r)*?(?=                  <\\/div>\\r?\\n                \\}\\)\\)\\r?\\n              <\\/div>\\r?\\n\\r?\\n              \\{\\/\\* Add Question button \\*\\/\\})/
const renderNew = \                    {/* Question text */}
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
                        <Select value={question.type} onValueChange={(val: QuestionType) => updateQuestionType(qIndex, val)}>
                          <SelectTrigger className="w-full sm:w-[200px] rounded-xl border-border/60 bg-muted/40 focus:ring-purple-500/40 text-sm">
                            <SelectValue placeholder="Question Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {manualQuestionTypes.map((t) => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Media Upload */}
                        {!question.mediaUrl && (
                          <label className="cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-purple-600 transition-colors bg-muted/30 px-3 py-2 rounded-xl border border-border/50 w-full sm:w-auto">
                            <Upload className="w-3.5 h-3.5" />
                            Add Media
                            <input type="file" accept="image/*,video/*,audio/*" className="hidden" onChange={(e: any) => handleMediaUpload(qIndex, e)} />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Media Preview */}
                    {question.mediaUrl && (
                      <div className="mb-4 relative inline-block border border-border/50 rounded-xl overflow-hidden bg-muted/30">
                        {question.media?.type.startsWith("video/") ? (
                          <video src={question.mediaUrl} controls className="max-h-48 max-w-full" />
                        ) : question.media?.type.startsWith("audio/") ? (
                          <audio src={question.mediaUrl} controls className="m-2" />
                        ) : (
                          <img src={question.mediaUrl} alt="Question Media" className="max-h-48 max-w-full object-contain" />
                        )}
                        <button type="button" onClick={() => removeMedia(qIndex)} className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors" title="Remove media">
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
                                  onClick={() => setCorrectOption(qIndex, oIndex)}
                                  className={\lex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 \\}
                                >
                                  <input
                                    type="text"
                                    placeholder={\Option \\}
                                    value={option.text}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                                    className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                                  />
                                  <div
                                    className={\lex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all \\}
                                  >
                                    {isCorrect && <CheckCircle2 className="h-5 w-5 fill-teal-500 text-white" />}
                                  </div>
                                </button>
                                {question.options.length > 2 && (
                                  <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                          <button type="button" onClick={() => addOption(qIndex)} className="col-span-2 text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 py-2 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-colors">
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
                                className={\lex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 \\}
                              >
                                <span className="flex-1 text-sm font-semibold">{option.text}</span>
                                <div className={\lex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all \\}>
                                  {isCorrect && <CheckCircle2 className="h-5 w-5 fill-teal-500 text-white" />}
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
                                  onClick={() => toggleCorrectOption(qIndex, oIndex)}
                                  className={\lex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 \\}
                                >
                                  <input
                                    type="text"
                                    placeholder={\Option \\}
                                    value={option.text}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                                    className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                                  />
                                  <div
                                    className={\lex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all \\}
                                  >
                                    {isCorrect && <CheckCircle2 className="h-4 w-4 text-white" />}
                                  </div>
                                </button>
                                {question.options.length > 2 && (
                                  <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                          <button type="button" onClick={() => addOption(qIndex)} className="col-span-2 text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 py-2 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-colors">
                            + Add Option
                          </button>
                        </div>
                      )}

                      {/* Short Answer / Fill in the blank / Long Answer */}
                      {(question.type === "short-answer" || question.type === "fill-in-the-blank" || question.type === "long-answer") && (
                        <div className="flex flex-col gap-2 bg-muted/20 p-4 rounded-xl border border-border/50">
                          <label className="text-sm font-semibold text-foreground">Correct Answer / Rubric (Optional)</label>
                          <p className="text-xs text-muted-foreground mb-2">Provide the exact text or keywords students need to match.</p>
                          {question.type === "long-answer" ? (
                            <Textarea
                              value={question.correctAnswerText || ""}
                              onChange={(e) => updateCorrectAnswerText(qIndex, e.target.value)}
                              placeholder="Example full answer or key points..."
                              className="rounded-xl border-border/60 bg-background resize-y"
                            />
                          ) : (
                            <Input
                              value={question.correctAnswerText || ""}
                              onChange={(e) => updateCorrectAnswerText(qIndex, e.target.value)}
                              placeholder={question.type === "fill-in-the-blank" ? "Exact single word or phrase..." : "Exact correct answer text..."}
                              className="rounded-xl border-border/60 bg-background"
                            />
                          )}
                        </div>
                      )}

                      {/* Numeric */}
                      {question.type === "numeric" && (
                        <div className="flex flex-col gap-2 bg-muted/20 p-4 rounded-xl border border-border/50">
                          <label className="text-sm font-semibold text-foreground">Correct Numeric Answer</label>
                          <Input
                            type="number"
                            value={question.correctAnswerNumeric ?? ""}
                            onChange={(e) => updateCorrectAnswerNumeric(qIndex, e.target.value)}
                            placeholder="e.g. 42"
                            className="rounded-xl border-border/60 bg-background text-lg"
                          />
                        </div>
                      )}

                      {/* Matching */}
                      {question.type === "matching" && (
                        <div className="flex flex-col gap-3">
                          {question.options.map((option, oIndex) => (
                            <div key={option.id} className="flex gap-2 items-center bg-muted/20 p-2 rounded-xl border border-border/50">
                              <Input 
                                value={option.text} 
                                onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)} 
                                placeholder={\Term \\} 
                                className="flex-1 bg-background" 
                              />
                              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                              <Input 
                                value={option.matchText || ""} 
                                onChange={(e) => updateOptionMatchText(qIndex, oIndex, e.target.value)} 
                                placeholder={\Match for Term \\} 
                                className="flex-1 bg-background" 
                              />
                              <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-muted-foreground hover:text-destructive p-2 transition-colors" disabled={question.options.length <= 2}>
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addOption(qIndex)} className="text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 py-2 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-colors">
                            + Add Match Pair
                          </button>
                        </div>
                      )}

                      {/* Sequencing */}
                      {question.type === "sequencing" && (
                        <div className="flex flex-col gap-3">
                          <p className="text-xs text-muted-foreground mb-1">Add items in the correct order top to bottom</p>
                          {question.options.map((option, oIndex) => (
                            <div key={option.id} className="flex gap-3 items-center bg-muted/20 p-2 rounded-xl border border-border/50">
                              <span className="flex h-6 w-6 items-center justify-center shrink-0 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                                {oIndex + 1}
                              </span>
                              <Input 
                                value={option.text} 
                                onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)} 
                                placeholder={\Step \\} 
                                className="flex-1 bg-background" 
                              />
                              <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-muted-foreground hover:text-destructive p-2 transition-colors" disabled={question.options.length <= 2}>
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addOption(qIndex)} className="text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 py-2 border-2 border-dashed border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-colors">
                            + Add Sequence Item
                          </button>
                        </div>
                      )};

content = content.replace(renderOldRegex, renderNew);

fs.writeFileSync('c:/Users/anork/Desktop/Quizlo-Frontend/app/create/page.tsx', content);
console.log('Done!');
