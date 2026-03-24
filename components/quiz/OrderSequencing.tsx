import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, CheckCircle2, XCircle } from "lucide-react";
import { SanitizedQuestion } from "@/lib/quiz";
import { Button } from "@/components/ui/button";

interface SortableItemProps {
  id: string;
  text: string;
  index: number;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctOrder?: string[];
  disabled: boolean;
}

function SortableItem({ id, text, index, isAnswered, isCorrect, correctOrder, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled: disabled || isAnswered });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const isCorrectPos = correctOrder ? correctOrder[index] === id : null;
  const isCorrectItem = isCorrect || isCorrectPos;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-4 p-5 rounded-2xl border-2 bg-white transition-all",
        isDragging ? "shadow-lg border-purple-300 scale-[1.02]" : "border-gray-100",
        isAnswered && (isCorrectItem ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50")
      )}
    >
      {!isAnswered && (
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
        {index + 1}
      </div>
      <span className="font-semibold text-gray-700 flex-1">{text}</span>
      
      {isAnswered && (
        <div className="ml-auto">
          {isCorrectItem ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
      )}
    </div>
  );
}

interface OrderSequencingProps {
  question: SanitizedQuestion;
  selectedOptionIds: string[];
  onSelect: (optionIds: string[]) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctOrder?: string[];
  disabled: boolean;
}

export function OrderSequencing({
  question,
  selectedOptionIds,
  onSelect,
  isAnswered,
  isCorrect,
  correctOrder,
  disabled,
}: OrderSequencingProps) {
  const [items, setItems] = useState(() => {
    // If not answered, use the provided order (usually shuffled by backend)
    return question.answerOptions.map(o => o.id);
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = () => {
    onSelect(items);
  };

  const displayItems = isAnswered ? selectedOptionIds : items;

  return (
    <div className="flex flex-col gap-6">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={displayItems}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {displayItems.map((id, index) => {
              const option = question.answerOptions.find(o => o.id === id);
              if (!option) return null;
              return (
                <SortableItem 
                  key={id} 
                  id={id} 
                  text={option.text} 
                  index={index}
                  isAnswered={isAnswered}
                  isCorrect={isCorrect}
                  correctOrder={correctOrder}
                  disabled={disabled}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {!isAnswered && (
        <Button
          onClick={handleSubmit}
          disabled={disabled}
          className="h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          Submit Order
        </Button>
      )}

      {isAnswered && !isCorrect && correctOrder && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
          <p className="text-sm font-bold text-green-800 mb-2">Correct Order:</p>
          <div className="flex flex-wrap gap-2">
            {correctOrder.map((id, idx) => {
              const option = question.answerOptions.find(o => o.id === id);
              return (
                <div key={id} className="px-3 py-1 bg-white border border-green-200 rounded-full text-sm font-medium text-green-700">
                  {idx + 1}. {option?.text}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
