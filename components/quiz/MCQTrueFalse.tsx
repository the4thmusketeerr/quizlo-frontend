import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import { SanitizedQuestion } from "@/lib/quiz";

interface MCQTrueFalseProps {
  question: SanitizedQuestion;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctOptionId?: string | null;
  disabled: boolean;
}

export function MCQTrueFalse({
  question,
  selectedOptionId,
  onSelect,
  isAnswered,
  isCorrect,
  correctOptionId,
  disabled,
}: MCQTrueFalseProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {question.answerOptions.map((option, index) => {
        const label = String.fromCharCode(65 + index);
        const isSelected = selectedOptionId === option.id;
        const isCorrectOption = correctOptionId === option.id;

        return (
          <button
            key={option.id}
            disabled={disabled}
            onClick={() => onSelect(option.id)}
            className={cn(
              "group relative flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all duration-200 text-left",
              isSelected
                ? isAnswered
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : "border-purple-500 bg-purple-50/30"
                : "border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/30",
              isAnswered && isCorrectOption && "border-green-500 bg-green-50"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                isSelected
                  ? (isAnswered
                      ? isCorrect
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-purple-500") + " text-white"
                  : "bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600",
                isAnswered && isCorrectOption && "bg-green-500 text-white"
              )}
            >
              {label}
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
                {isCorrectOption || (isSelected && isCorrect) ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500 fill-white" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 fill-white" />
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
