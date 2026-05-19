"use client";

import { Button } from "@/components/ui/button";
import type { WalkthroughStepChoice } from "@/lib/types";

interface ChoiceButtonsProps {
  choices: WalkthroughStepChoice[];
  onChoiceSelect: (choice: WalkthroughStepChoice) => void;
}

export function ChoiceButtons({ choices, onChoiceSelect }: ChoiceButtonsProps) {
  return (
    <div className="flex flex-col gap-3 mt-6">
      {choices.map((choice) => (
        <Button
          key={choice.id}
          variant="outline"
          size="lg"
          className="w-full justify-start text-left h-auto py-3 px-4"
          onClick={() => onChoiceSelect(choice)}
        >
          {choice.label}
        </Button>
      ))}
    </div>
  );
}
