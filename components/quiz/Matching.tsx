import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SanitizedQuestion } from "@/lib/quiz";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface MatchingProps {
  question: SanitizedQuestion;
  responseJson: Record<string, string>;
  onSelect: (response: Record<string, string>) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctData?: Record<string, string>;
  disabled: boolean;
}

export function Matching({
  question,
  responseJson,
  onSelect,
  isAnswered,
  isCorrect,
  correctData,
  disabled,
}: MatchingProps) {
  const [selections, setSelections] = useState<Record<string, string>>(responseJson);
  const [activeLeft, setActiveLeft] = useState<string | null>(null);

  const leftOptions = question.answerOptions;
  // Shuffled right options (matchingText)
  const [rightOptions, setRightOptions] = useState<string[]>([]);

  useEffect(() => {
    const rights = question.answerOptions.map(o => o.matchingText || "").filter(Boolean);
    // Shuffle them once on load if not answered
    if (!isAnswered && rights.length > 0) {
      setRightOptions([...rights].sort(() => Math.random() - 0.5));
    } else if (isAnswered) {
      setRightOptions(question.answerOptions.map(o => o.matchingText || ""));
    }
  }, [question, isAnswered]);

  const handleMatch = (rightText: string) => {
    if (!activeLeft || isAnswered) return;
    
    setSelections(prev => {
      const next = { ...prev };
      // Remove this right text from any other left if exists (one-to-one)
      Object.keys(next).forEach(key => {
        if (next[key] === rightText) delete next[key];
      });
      next[activeLeft] = rightText;
      return next;
    });
    setActiveLeft(null);
  };

  const handleSubmit = () => {
    onSelect(selections);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Items</p>
          {leftOptions.map((option) => {
            const isSelected = !!selections[option.id];
            const isActive = activeLeft === option.id;
            const isCorrectMatch = isAnswered && (isCorrect || (correctData && correctData[option.id] === selections[option.id]));

            return (
              <button
                key={option.id}
                disabled={disabled || isAnswered}
                onClick={() => setActiveLeft(option.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all",
                  isActive ? "border-purple-500 bg-purple-50" : "border-gray-100 bg-white",
                  isAnswered 
                    ? isCorrectMatch ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                    : isSelected ? "border-purple-200" : ""
                )}
              >
                <span className="font-semibold text-gray-700">{option.text}</span>
                {selections[option.id] && !isAnswered && (
                  <div className="mt-2 text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full inline-block">
                    Matched
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Matches</p>
          {rightOptions.map((text, idx) => {
            const isMatchedAcross = Object.values(selections).includes(text);
            const matchingLeftId = Object.keys(selections).find(k => selections[k] === text);
            
            return (
              <button
                key={idx}
                disabled={disabled || isAnswered || !activeLeft}
                onClick={() => handleMatch(text)}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all",
                  isMatchedAcross && !isAnswered ? "border-purple-200 bg-purple-50/50 opacity-60" : "border-gray-100 bg-white",
                  isAnswered && "opacity-100 border-gray-100",
                  !isAnswered && activeLeft && !isMatchedAcross ? "hover:border-purple-300 hover:bg-purple-50/30" : ""
                )}
              >
                <span className="font-semibold text-gray-700">{text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!isAnswered && (
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(selections).length < leftOptions.length || disabled}
          className="h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          Submit Matching
        </Button>
      )}

      {isAnswered && !isCorrect && correctData && (
        <div className="p-6 rounded-[2rem] bg-green-50 border border-green-200">
          <p className="text-sm font-bold text-green-800 mb-4">Correct Pairs:</p>
          <div className="grid grid-cols-1 gap-2">
            {leftOptions.map(option => (
              <div key={option.id} className="flex items-center gap-3 text-sm font-medium text-green-700">
                <span className="bg-white px-3 py-1 rounded-lg border border-green-100">{option.text}</span>
                <ArrowRight className="h-4 w-4 opacity-50" />
                <span className="bg-green-100 px-3 py-1 rounded-lg">{correctData[option.id]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
