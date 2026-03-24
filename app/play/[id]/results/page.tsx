"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Trophy, 
  Target, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle,
  RotateCcw,
  Search,
  Share2,
  Home,
  Star,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useQuizStore } from "@/store/useQuizStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import StarRatings from "react-star-ratings";
import { rateQuiz } from "@/lib/quiz";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getLevelLabel } from "@/lib/user";

// ── Confetti canvas component ──────────────────────────────────────────────
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: {
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; angle: number; spin: number;
    }[] = [];

    const colors = ["#9333ea", "#a855f7", "#fcd34d", "#f97316", "#ec4899", "#22d3ee", "#4ade80"];
    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.vy += 0.05; // gravity

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    };

    draw();

    // Stop after 3 seconds
    const stop = setTimeout(() => cancelAnimationFrame(animId), 3000);
    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(stop);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden
    />
  );
}

// ── Animated XP counter ────────────────────────────────────────────────────
function XpCounter({ target }: { target: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplayed(Math.round(eased * target));
      if (elapsed < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return <span>+{displayed}</span>;
}

// ── Tier colour map ─────────────────────────────────────────────────────────
const TIER_COLORS: Record<string, string> = {
  Beginner: "#9ca3af",
  Bronze:   "#b45309",
  Silver:   "#6b7280",
  Gold:     "#d97706",
  Platinum: "#0891b2",
  Diamond:  "#7c3aed",
};

// ── Main page ──────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { 
    quizTitle, 
    quizResults, 
    questions, 
    questionResults,
    clearSession 
  } = useQuizStore();

  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isRating, setIsRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Redirect if no results
  useEffect(() => {
    if (!quizResults) {
      router.replace(`/explore/quiz/${id}`);
    }
  }, [quizResults, id, router]);

  // Trigger confetti on level-up
  useEffect(() => {
    if (quizResults?.levelUp) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3200);
      return () => clearTimeout(t);
    }
  }, [quizResults?.levelUp]);

  if (!quizResults) return null;

  const { score, questionsAnsweredCorrectly, totalQuestions, xpEarned, levelUp, newLevel } = quizResults;
  const levelLabel = getLevelLabel(newLevel);

  const handlePlayAgain = () => {
    clearSession();
    router.push(`/explore/quiz/${id}`);
  };

  const handleSubmitRating = async () => {
    if (rating < 1 || rating > 5) {
      toast({
        title: "Please select a rating",
        description: "Your rating must be between 1 and 5 stars.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRating(true);
      await rateQuiz({ quizId: id, rating, comment });
      setHasRated(true);
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
    } catch (err) {
      toast({
        title: "Failed to submit rating",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] pb-32">
      {/* Confetti overlay */}
      {showConfetti && <ConfettiCanvas />}

      {/* ── Top Header ── */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-gray-500"
          onClick={() => router.push("/explore")}
        >
          <Home className="h-5 w-5" />
        </Button>
        <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-none font-bold">
          Quiz Completed
        </Badge>
        <Button variant="ghost" size="icon" className="rounded-full text-gray-500">
          <Share2 className="h-5 w-5" />
        </Button>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-4 flex flex-col items-center">
        {/* ── Celebration Section ── */}
        <div className="text-center mb-10 animate-in fade-in zoom-in duration-700">
          <div className="relative inline-block">
            <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-200">
              <Trophy className="h-16 w-16 text-white" />
            </div>
            <Star className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 fill-yellow-400 animate-bounce delay-100" />
            <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-pink-400 animate-pulse" />
          </div>
          <h1 className="mt-8 text-3xl font-black text-gray-900 leading-tight">
            {score >= 80 ? "Awesome Job!" : score >= 50 ? "Good Effort!" : "Keep Practicing!"}
          </h1>
          <p className="mt-2 text-gray-500 font-medium">
            You&apos;ve successfully completed <span className="text-purple-600 font-bold">{quizTitle}</span>
          </p>
        </div>

        {/* ── Primary Score — Fraction ── */}
        <div className="w-full bg-white rounded-[2.5rem] p-8 border border-purple-50 shadow-sm mb-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-2">Your Score</p>
          {/* Large fraction */}
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-black text-gray-900 tabular-nums">{questionsAnsweredCorrectly}</span>
            <span className="text-3xl font-black text-muted-foreground">/</span>
            <span className="text-4xl font-black text-muted-foreground">{totalQuestions}</span>
          </div>
          {/* Percentage below */}
          <div className="mt-3 px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 font-black text-lg">
            {score}%
          </div>
          {/* Mini progress bar */}
          <div className="w-full mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 ease-out"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="w-full grid grid-cols-2 gap-3 mb-8">
          {/* XP Earned */}
          <div className="bg-white rounded-[2.5rem] p-6 border border-purple-50 shadow-sm flex flex-col items-center justify-center transition-all hover:scale-[1.03] hover:shadow-md">
            <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 mb-2">
              <Zap className="h-5 w-5 fill-yellow-100" />
            </div>
            <span className="text-xl font-black text-gray-900">
              <XpCounter target={xpEarned} />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground">XP Earned</span>
          </div>

          {/* Level */}
          <div className="bg-white rounded-[2.5rem] p-6 border border-purple-50 shadow-sm flex flex-col items-center justify-center transition-all hover:scale-[1.03] hover:shadow-md">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-black text-gray-900">Lvl {newLevel}</span>
            <span className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground">{levelLabel}</span>
          </div>
        </div>

        {/* ── Level Up Card ── */}
        {levelUp ? (
          <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2rem] p-6 mb-8 flex items-center justify-between text-white shadow-lg shadow-purple-200 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <Zap className="h-8 w-8 text-yellow-300 fill-yellow-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Level Up! 🎉</h3>
                <p className="text-sm font-medium text-white/80">
                  You are now <strong>Level {newLevel}</strong> — {levelLabel}
                </p>
              </div>
            </div>
            <div className="px-5 py-2 rounded-full bg-white text-purple-600 font-bold text-sm whitespace-nowrap">
              NEW RANK
            </div>
          </div>
        ) : (
          <div className="w-full bg-gray-50 rounded-[2rem] p-4 mb-8 flex items-center gap-4 border border-gray-100 animate-in fade-in duration-500">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-sm font-bold text-gray-700">
              You are <span className="text-indigo-600">Level {newLevel}</span> — <span className="text-gray-500">{levelLabel}</span>
            </p>
          </div>
        )}

        {/* ── Answer Review Header ── */}
        <div className="w-full flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-bold text-gray-900">Answer Review</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-purple-600 font-bold hover:bg-purple-50 rounded-full h-8"
            onClick={() => setShowReview(!showReview)}
          >
            {showReview ? (
              <>Hide Review <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Show Review <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </div>

        {/* ── Review List ── */}
        {showReview && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {questions.map((question, idx) => {
              const result = questionResults[question.id];
              const isCorrect = result?.isCorrect;
              
              return (
                <div key={question.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn(
                          "uppercase text-[10px] font-bold px-2 py-0.5",
                          isCorrect ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"
                        )}>
                          Question {idx + 1}
                        </Badge>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{question.type}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 leading-tight">
                        {question.text}
                      </h4>
                    </div>
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                      isCorrect ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <div className={cn(
                      "p-4 rounded-2xl border flex flex-col gap-3",
                      isCorrect ? "bg-green-50/50 border-green-100" : "bg-red-50/50 border-red-100"
                    )}>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Answer</span>
                        <div className={cn(
                          "text-sm font-bold",
                          isCorrect ? "text-green-700" : "text-red-700"
                        )}>
                          {(() => {
                            const ans = result?.answer;
                            if (!ans) return "N/A";
                            
                            if (question.type === "Mcq" || question.type === "TrueFalse") {
                              return question.answerOptions.find(o => o.id === ans)?.text || ans;
                            }
                            if (question.type === "MultipleSelect" || question.type === "OrderSequencing") {
                              const ids = Array.isArray(ans) ? ans : [];
                              return ids.map(id => question.answerOptions.find(o => o.id === id)?.text || id).join(", ");
                            }
                            if (question.type === "Matching") {
                              return Object.entries(ans as Record<string, string>)
                                .map(([leftId, rightText]) => {
                                  const leftText = question.answerOptions.find(o => o.id === leftId)?.text || leftId;
                                  return `${leftText} → ${rightText}`;
                                }).join(" | ");
                            }
                            return String(ans);
                          })()}
                        </div>
                      </div>

                      {!isCorrect && result?.correctData && (
                        <div className="pt-3 border-t border-red-100/50 flex flex-col gap-1">
                          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Correct Answer</span>
                          <div className="text-sm font-bold text-green-700">
                            {(() => {
                              const data = result.correctData;
                              if (!data) return "N/A";
                              
                              if (question.type === "Mcq" || question.type === "TrueFalse") {
                                // Support both new (direct ID) and old (object with correctOptionId) formats
                                const id = (typeof data === 'object' && data.correctOptionId) ? data.correctOptionId : data;
                                return question.answerOptions.find(o => o.id === id)?.text || id || "N/A";
                              }
                              if (question.type === "MultipleSelect") {
                                // Support both new (direct IDs) and old (object with correctOptionIds) formats
                                const ids = (typeof data === 'object' && data.correctOptionIds) ? data.correctOptionIds : (Array.isArray(data) ? data : []);
                                return ids.map((id: string) => question.answerOptions.find(o => o.id === id)?.text || id).join(", ");
                              }
                              if (question.type === "OrderSequencing") {
                                // Support both new (direct IDs) and old (object with correctOrder) formats
                                const ids = (typeof data === 'object' && data.correctOrder) ? data.correctOrder : (Array.isArray(data) ? data : []);
                                return ids.map((id: string) => question.answerOptions.find(o => o.id === id)?.text || id).join(" → ");
                              }
                              if (["ShortAnswer", "FillInTheBlank", "Numeric", "LongAnswer"].includes(question.type)) {
                                // Support both new (direct text) and old (object with correctText) formats
                                const text = (typeof data === 'object' && data.correctText) ? data.correctText : data;
                                return text || "N/A";
                              }
                              if (question.type === "Matching") {
                                // Support both new (direct pairs) and old (object with correctPairs) formats
                                const pairs = (typeof data === 'object' && data.correctPairs) ? data.correctPairs : data;
                                if (!pairs) return "N/A";
                                return Object.entries(pairs as Record<string, string>)
                                  .map(([leftId, rightText]) => {
                                    const leftText = question.answerOptions.find(o => o.id === leftId)?.text || leftId;
                                    return `${leftText} → ${rightText}`;
                                  }).join(" | ");
                              }
                              return "N/A";
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explanation */}
                  {(question as any).explanation && (
                    <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Explanation</p>
                      <p className="text-sm text-gray-600 font-medium">
                        {(question as any).explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Quiz Rating Section ── */}
        {!hasRated && (
          <div className="w-full mt-10 bg-white rounded-[2.5rem] p-8 border border-purple-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-xl font-black text-gray-900 mb-2 text-center">Rate this Quiz</h3>
            <p className="text-gray-500 text-sm font-medium text-center mb-6">How was your experience with this challenge?</p>
            
            <div className="flex flex-col items-center gap-6">
              <StarRatings
                rating={rating}
                starRatedColor="#9D4EDD"
                starHoverColor="#7B2CBF"
                changeRating={(newRating: number) => setRating(newRating)}
                numberOfStars={5}
                name='rating'
                starDimension="36px"
                starSpacing="6px"
              />

              <div className="w-full">
                <Textarea
                  placeholder="Leave a comment about the quiz (optional)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="rounded-2xl border-gray-100 bg-gray-50 p-4 min-h-[100px] focus:ring-purple-500"
                />
              </div>

              <Button
                onClick={handleSubmitRating}
                disabled={isRating || rating === 0}
                className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-lg shadow-purple-100"
              >
                {isRating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Submit Rating"
                )}
              </Button>
            </div>
          </div>
        )}

        {hasRated && (
          <div className="w-full mt-10 bg-green-50 rounded-[2.5rem] p-8 border border-green-100 text-center animate-in zoom-in duration-500">
            <div className="h-12 w-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-green-900">Thank you for your feedback!</h3>
            <p className="text-green-700 text-sm font-medium">Your rating helps us improve our quizzes.</p>
          </div>
        )}
      </main>

      {/* ── Sticky Actions ── */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t p-6 flex items-center justify-center z-50">
        <div className="max-w-2xl w-full flex gap-4">
          <Button 
            variant="secondary" 
            className="flex-1 h-14 rounded-2xl bg-[#F4F7FF] text-[#4A5568] font-bold text-sm border-none transition-all hover:bg-blue-50"
            onClick={() => router.push("/explore")}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Try Others
          </Button>
          <Button 
            className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-95"
            onClick={handlePlayAgain}
          >
            Play Again
          </Button>
        </div>
      </footer>
    </div>
  );
}
