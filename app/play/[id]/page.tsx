"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { useQuizStore } from "@/store/useQuizStore";
import { submitAnswer, completeQuiz } from "@/lib/quiz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MCQTrueFalse } from "@/components/quiz/MCQTrueFalse";
import { MultipleSelect } from "@/components/quiz/MultipleSelect";
import { TextBasedInput } from "@/components/quiz/TextBasedInput";
import { OrderSequencing } from "@/components/quiz/OrderSequencing";
import { Matching } from "@/components/quiz/Matching";
import { useWebHaptics } from "web-haptics/react";

export default function GameplayPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { 
    quizTitle, 
    questions, 
    timeAllocated, 
    attemptId,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    setResults,
    setQuestionResult,
    clearSession 
  } = useQuizStore();

  const [timeLeft, setTimeLeft] = useState(timeAllocated);
  const [answer, setAnswer] = useState<any>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [correctData, setCorrectData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Redirect if no quiz data
  useEffect(() => {
    if (!questions || questions.length === 0) {
      router.replace(`/explore/quiz/${id}`);
    }
  }, [questions, id, router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isGrading && !isAnswered) {
        handleCompleteQuiz();
      }
      return;
    }
    
    if (isGrading) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGrading]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions?.length > 0 
    ? ((currentQuestionIndex + 1) / questions.length) * 100 
    : 0;

  const handleAnswerSubmit = async (submittedAnswer: any) => {
    if (isAnswered || isSubmitting || !attemptId) return;
    
    setAnswer(submittedAnswer);
    
    try {
      setIsSubmitting(true);
      const timeSpent = Math.ceil((Date.now() - questionStartTime) / 1000);
      
      const payload: any = {
        questionId: currentQuestion.id,
        timeSpent,
        type: currentQuestion.type,
      };

      console.log("Payload for question", currentQuestion.id, "is", payload);

      // Format payload based on type
      if (currentQuestion.type === "Mcq" || currentQuestion.type === "TrueFalse") {
        payload.selectedOptionId = submittedAnswer;
      } else if (currentQuestion.type === "MultipleSelect" || currentQuestion.type === "OrderSequencing") {
        payload.selectedOptionIds = submittedAnswer;
      } else if (["ShortAnswer", "FillInTheBlank", "Numeric", "LongAnswer"].includes(currentQuestion.type)) {
        payload.textResponse = submittedAnswer;
      } else if (currentQuestion.type === "Matching") {
        payload.responseJson = submittedAnswer;
      }
      
      const response = await submitAnswer(attemptId, payload);
      console.log("Response for question", currentQuestion.id, "is", response);
      
      setPointsEarned(response.pointsEarned);
      setCorrectData(response.correctData);
      setIsCorrect(response.isCorrect);
      
      setQuestionResult(currentQuestion.id, {
        answer: submittedAnswer,
        isCorrect: response.isCorrect,
        correctData: response.correctData,
        pointsEarned: response.pointsEarned,
      });
      
      setIsAnswered(true);
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Failed to submit answer.",
        variant: "destructive",
      });
      setAnswer(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteQuiz = async () => {
    if (!attemptId || isGrading) return;
    
    try {
      setIsGrading(true);
      const results = await completeQuiz(attemptId);
      
      // Store correct answers for review
      if (results.correctAnswers) {
        results.correctAnswers.forEach((ca: any) => {
          // If we already have a result, merge the correctData
          // We use the questionResults state directly from the store's current state if possible,
          // but we can just use setQuestionResult which handles the logic.
          // Note: we don't have the user's answer/isCorrect here but we might have it in the store already.
          // However, we can just rely on the results.correctAnswers in the Results page too.
          // The user said "store it", so we should ensure it's in the store.
          
          // Actually, setResults(results) already stores it in the quizResults field.
          // Let's just ensure we map it to questionResults if the results page expects it there.
          const existingResult = (useQuizStore.getState() as any).questionResults[ca.questionId];
          setQuestionResult(ca.questionId, {
            answer: existingResult?.answer || null,
            isCorrect: existingResult?.isCorrect || false,
            pointsEarned: existingResult?.pointsEarned || 0,
            correctData: ca.correctData, // This is the new field we want to include
          });
        });
      }

      setResults(results);
      router.push(`/play/${id}/results`);
    } catch (err) {
      toast({
        title: "Grading failed",
        description: err instanceof Error ? err.message : "Failed to complete quiz.",
        variant: "destructive",
      });
      setIsGrading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setPointsEarned(0);
      setCorrectData(null);
      setQuestionStartTime(Date.now());
    } else {
      handleCompleteQuiz();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins > 0) {
      return `${mins}m ${secs}s left`;
    }
    return `${secs}s left`;
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-[#FDFCFE] flex flex-col">
      {/* ── Header ── */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white">
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-sm font-bold text-gray-900">{quizTitle}</h1>
            <p className="text-[10px] uppercase font-bold tracking-wider text-purple-600">
              Question {currentQuestionIndex + 1} / {questions.length}
            </p>
          </div>
        </div>
        
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300",
          timeLeft <= 10 
            ? "bg-red-50 text-red-600 animate-pulse" 
            : "bg-purple-50 text-purple-600"
        )}>
          <Clock className="h-4 w-4" />
          <span className="text-sm font-bold">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* ── Progress Bar ── */}
      <Progress value={progress} className="h-1.5 rounded-none" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        {/* ── Question Card ── */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-purple-50 overflow-hidden">
          {currentQuestion.media && Array.isArray(currentQuestion.media) && currentQuestion.media.length > 0 && (
            <div className="h-48 w-full overflow-hidden">
              <img 
                src={typeof currentQuestion.media[0] === 'string' ? currentQuestion.media[0] : (currentQuestion.media[0] as any).url} 
                alt="Question visual" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
              {currentQuestion.text}
            </h2>
          </div>
        </div>

        {/* ── Dynamic Question Input ── */}
        <div className="w-full">
          {currentQuestion.type === "Mcq" || currentQuestion.type === "TrueFalse" ? (
            <MCQTrueFalse
              question={currentQuestion}
              selectedOptionId={answer}
              onSelect={handleAnswerSubmit}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              correctOptionId={correctData?.correctOptionId}
              disabled={isSubmitting}
            />
          ) : currentQuestion.type === "MultipleSelect" ? (
            <MultipleSelect
              question={currentQuestion}
              selectedOptionIds={answer || []}
              onSelect={handleAnswerSubmit}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              correctOptionIds={correctData?.correctOptionIds}
              disabled={isSubmitting}
            />
          ) : ["ShortAnswer", "FillInTheBlank", "Numeric", "LongAnswer"].includes(currentQuestion.type) ? (
            <TextBasedInput
              question={currentQuestion}
              value={answer || ""}
              onSelect={handleAnswerSubmit}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              correctAnswer={correctData?.correctText}
              disabled={isSubmitting}
            />
          ) : currentQuestion.type === "OrderSequencing" ? (
            <OrderSequencing
              question={currentQuestion}
              selectedOptionIds={answer || []}
              onSelect={handleAnswerSubmit}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              correctOrder={correctData?.correctOrder}
              disabled={isSubmitting}
            />
          ) : currentQuestion.type === "Matching" ? (
            <Matching
              question={currentQuestion}
              responseJson={answer || {}}
              onSelect={handleAnswerSubmit}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              correctData={correctData?.correctPairs}
              disabled={isSubmitting}
            />
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">This question type ({currentQuestion.type}) is not yet supported.</p>
            </div>
          )}
        </div>

        {/* ── Feedback Message (Visible after answer) ── */}
        {isAnswered && (
          <div className={cn(
            "rounded-[2rem] p-5 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300",
            isCorrect ? "bg-green-100/50" : "bg-red-100/50"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
              isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
            )}>
              {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            </div>
            <div>
              <p className={cn(
                "font-bold text-sm",
                isCorrect ? "text-green-700" : "text-red-700"
              )}>
                {isCorrect ? `Correct! +${pointsEarned} XP` : "Incorrect. See the correct answer above."}
              </p>
              <p className={cn(
                "text-xs font-medium mt-1 opacity-80",
                isCorrect ? "text-green-600" : "text-red-600"
              )}>
                {isCorrect 
                  ? "Great job! Keep it up." 
                  : "Don't worry, knowledge is power!"}
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto p-6 flex justify-center">
        {isAnswered && (
          <Button 
            size="lg"
            onClick={handleNextQuestion}
            className="h-14 w-full max-w-md rounded-2xl bg-gradient-to-r from-[#9D4EDD] to-[#7B2CBF] text-white font-bold text-lg shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-95 group animate-in fade-in slide-in-from-bottom-2"
          >
            Next Question
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
        {!isAnswered && isSubmitting && (
          <div className="h-14 flex items-center justify-center text-purple-600 font-bold">
            Verifying Answer...
          </div>
        )}
      </footer>

      {/* ── Grading Overlay ── */}
      {isGrading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
            <Loader2 className="absolute inset-0 m-auto h-10 w-10 text-purple-600 animate-pulse" />
          </div>
          <h2 className="mt-8 text-2xl font-bold text-gray-900">Grading your quiz...</h2>
          <p className="mt-2 text-gray-500 font-medium">Calculating your final score and XP</p>
        </div>
      )}
    </div>
  );
}
