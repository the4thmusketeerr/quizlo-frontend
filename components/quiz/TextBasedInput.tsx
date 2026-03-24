import { useState } from "react";
import { cn } from "@/lib/utils";
import { SanitizedQuestion } from "@/lib/quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TextBasedInputProps {
  question: SanitizedQuestion;
  value: string;
  onSelect: (text: string) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctAnswer?: string;
  disabled: boolean;
}

export function TextBasedInput({
  question,
  value,
  onSelect,
  isAnswered,
  isCorrect,
  correctAnswer,
  disabled,
}: TextBasedInputProps) {
  const [tempValue, setTempValue] = useState(value);

  const handleSubmit = () => {
    if (!tempValue.trim()) return;
    onSelect(tempValue);
  };

  const isNumeric = question.type === "Numeric";
  const isLong = question.type === "LongAnswer";

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        {isLong ? (
          <Textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            disabled={disabled || isAnswered}
            placeholder="Type your response here..."
            className={cn(
              "min-h-[150px] rounded-[1.5rem] border-2 p-6 text-lg transition-all focus-visible:ring-purple-500",
              isAnswered 
                ? isCorrect 
                  ? "border-green-500 bg-green-50" 
                  : "border-red-500 bg-red-50"
                : "border-gray-100 bg-white focus:border-purple-500"
            )}
          />
        ) : (
          <Input
            type={isNumeric ? "number" : "text"}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={disabled || isAnswered}
            placeholder={isNumeric ? "Enter number..." : "Type your answer..."}
            className={cn(
              "h-16 rounded-[1.5rem] border-2 px-6 text-xl font-medium transition-all focus-visible:ring-purple-500",
              isAnswered 
                ? isCorrect 
                  ? "border-green-500 bg-green-50" 
                  : "border-red-500 bg-red-50"
                : "border-gray-100 bg-white focus:border-purple-500"
            )}
          />
        )}
      </div>

      {!isAnswered && (
        <Button
          onClick={handleSubmit}
          disabled={!tempValue.trim() || disabled}
          className="h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg"
        >
          Submit Answer
        </Button>
      )}

      {isAnswered && !isCorrect && correctAnswer && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
          <p className="text-sm font-bold text-green-800">Correct Answer:</p>
          <p className="text-lg font-medium text-green-700 mt-1">{correctAnswer}</p>
        </div>
      )}
    </div>
  );
}
