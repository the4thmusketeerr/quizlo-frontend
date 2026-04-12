"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Rocket, 
  HelpCircle, 
  Clock, 
  Trophy, 
  PlayCircle, 
  CheckCircle2, 
  Plus, 
  Play,
  ChevronLeft,
  Star
} from "lucide-react";
import { getQuizById, startQuiz, type Quiz } from "@/lib/quiz";
import { useQuizStore } from "@/store/useQuizStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function QuizOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setSession = useQuizStore((state) => state.setSession);

  useEffect(() => {
    async function fetchQuiz() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getQuizById(id);
        setQuiz(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [id]);

  const handleStartQuiz = async () => {
    try {
      setStarting(true);
      const session = await startQuiz(id);
      setSession(session);
      router.push(`/play/${id}`);
    } catch (err) {
      toast({
        title: "Error starting quiz",
        description: err instanceof Error ? err.message : "Failed to start quiz session.",
        variant: "destructive",
      });
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 px-4">
        <p className="text-destructive font-medium">{error || "Quiz not found"}</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  // Calculate duration in minutes
  const minutes = Math.floor(quiz.timeAllocated / 60);
  
  // Generic learning points since they aren't in the data
  const learningPoints = [
    `Master ${quiz.category?.name || "the topic"} fundamentals`,
    `Challenge yourself with ${quiz.difficulty.toLowerCase()} level questions`,
    `Improve your speed and accuracy in ${quiz.title}`
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* ── Navigation Header ── */}
      {/* <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b bg-background/80 px-4 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-primary transition-colors hover:bg-secondary/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Quiz Overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-primary transition-colors hover:bg-secondary/20">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-primary transition-colors hover:bg-secondary/20">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </header> */}

      <main className="mx-auto max-w-2xl px-4 pt-24">
        {/* ── Header Card ── */}
        <div className="relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-xl min-h-[220px] flex flex-col justify-end">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={quiz.coverPicture || "https://placehold.net/600x600.png"}
              alt={quiz.title}
              className="h-full w-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#7B2CBF] via-[#9D4EDD]/70 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/20 text-[10px] font-bold uppercase tracking-wider text-white border-none px-3 py-1 backdrop-blur-md">
                {quiz.category?.name || "General"}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-[10px] font-bold uppercase tracking-wider text-white border-none px-3 py-1 backdrop-blur-md">
                {quiz.difficulty}
              </Badge>
            </div>
            <h2 className="text-3xl font-extrabold leading-tight">
              {quiz.title}
            </h2>
            <p className="text-sm font-medium text-white/90 line-clamp-2">
              {quiz.description}
            </p>
          </div>
          
          {/* Rocket Icon Container */}
          <div className="absolute top-4 right-4 h-24 w-24 opacity-20 transform rotate-12 z-10">
            <Rocket className="h-full w-full" />
          </div>
        </div>

        {/* ── Stats Section ── */}
        <div className="mt-8 grid grid-cols-4 gap-2 px-1">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/50 py-5 transition-transform hover:scale-105">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600">
              <HelpCircle className="h-5 w-5" />
            </div>
            <span className="text-sm font-black text-foreground">{quiz._count?.questions || 0}</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Questions</span>
          </div>
          
          <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/50 py-5 transition-transform hover:scale-105">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-sm font-black text-foreground">{minutes} min</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Duration</span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/50 py-5 transition-transform hover:scale-105">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600">
              <Star className="h-5 w-5" />
            </div>
            <span className="text-sm font-black text-foreground">{quiz.rating}/5</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Rating</span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/50 py-5 transition-transform hover:scale-105">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600">
              <PlayCircle className="h-5 w-5" />
            </div>
            <span className="text-sm font-black text-foreground">
              {quiz.plays >= 1000 ? `${(quiz.plays / 1000).toFixed(1)}K` : quiz.plays}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Plays</span>
          </div>
        </div>

        {/* ── What You'll Learn ── */}
        {/* <section className="mt-10">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-600 text-white">
              <Trophy className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-lg font-bold tracking-tight">What You'll Learn</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {learningPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-4 rounded-[2rem] bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm shadow-purple-600/20">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </div>
                <p className="text-sm font-semibold text-foreground/80">{point}</p>
              </div>
            ))}
          </div>
        </section> */}

        
      </main>

      {/* ── Bottom Actions ── */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 p-6 backdrop-blur-sm sm:px-10">
        <div className="mx-auto flex max-w-2xl gap-4">
          <Button 
            variant="secondary" 
            className="h-14 flex-1 rounded-2xl bg-[#F4F7FF] text-[#4A5568] font-bold text-base hover:bg-muted/80 border-none transition-all"
            onClick={() => router.back()}
          >
            Exit
          </Button>
          <Button 
            className="h-14 flex-[2] rounded-2xl bg-gradient-to-r from-[#9D4EDD] to-[#7B2CBF] text-white font-bold text-lg shadow-lg shadow-purple-600/30 transition-transform active:scale-95 group"
            onClick={handleStartQuiz}
            disabled={starting}
          >
            {starting ? "Starting..." : "Start Quiz"}
            {!starting && <Play className="ml-2 h-5 w-5 fill-current group-hover:translate-x-1 transition-transform" />}
          </Button>
        </div>
      </div>
    </div>
  );
}