import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Check } from "lucide-react";
import { SanitizedQuestion } from "@/lib/quiz";
import { Button } from "@/components/ui/button";

interface MultipleSelectProps {
  question: SanitizedQuestion;
  selectedOptionIds: string[];
  onSelect: (optionIds: string[]) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctOptionIds?: string[];
  disabled: boolean;
}

export function MultipleSelect({
  question,
  selectedOptionIds,
  onSelect,
  isAnswered,
  isCorrect,
  correctOptionIds = [],
  disabled,
}: MultipleSelectProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedOptionIds);

  const toggleOption = (optionId: string) => {
    if (disabled || isAnswered) return;
    const next = tempSelected.includes(optionId)
      ? tempSelected.filter((id) => id !== optionId)
      : [...tempSelected, optionId];
    setTempSelected(next);
  };

  const handleSubmit = () => {
    onSelect(tempSelected);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4">
        {question.answerOptions.map((option, index) => {
          const isSelected = isAnswered 
            ? selectedOptionIds.includes(option.id)
            : tempSelected.includes(option.id);
          
          const isCorrectOption = correctOptionIds.includes(option.id);
          const isItemCorrect = isCorrect || isCorrectOption;

          return (
            <button
              key={option.id}
              disabled={disabled || isAnswered}
              onClick={() => toggleOption(option.id)}
              className={cn(
                "group relative flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all duration-200 text-left",
                isSelected
                  ? isAnswered
                    ? isItemCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-purple-500 bg-purple-50/30"
                  : "border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/30",
                isAnswered && isCorrectOption && !isSelected && "border-green-200 bg-green-50/50 dashed"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                  isSelected
                    ? (isAnswered
                        ? isItemCorrect
                          ? "bg-green-500 border-green-500"
                          : "bg-red-500 border-red-500"
                        : "bg-purple-500 border-purple-500")
                    : "border-gray-300 bg-white group-hover:border-purple-400"
                )}
              >
                {isSelected && <Check className="h-4 w-4 text-white" />}
              </div>
              <span
                className={cn(
                  "font-semibold text-gray-700",
                  isSelected && "text-gray-900"
                )}
              >
                {option.text}
              </span>

              {isAnswered && (isSelected || isCorrectOption) && (
                <div className="ml-auto">
                  {isItemCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : isSelected && !isItemCorrect ? (
                    <XCircle className="h-6 w-6 text-red-500" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!isAnswered && (
        <Button
          onClick={handleSubmit}
          disabled={tempSelected.length === 0 || disabled}
          className="h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          Confirm Selection ({tempSelected.length})
        </Button>
      )}
    </div>
  );
}
