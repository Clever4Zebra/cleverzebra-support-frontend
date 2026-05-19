"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChoiceButtons } from "@/components/choice-buttons";
import { SupportRequestForm } from "@/components/support-request-form";
import type { Walkthrough, WalkthroughStep, WalkthroughStepChoice } from "@/lib/types";

interface DecisionTreeViewProps {
  walkthrough: Walkthrough;
}

export function DecisionTreeView({ walkthrough }: DecisionTreeViewProps) {
  const steps = walkthrough.steps ?? [];
  const startStep = steps.find((s) => s.position === 1);

  const [currentStepId, setCurrentStepId] = useState<number>(
    startStep?.id ?? steps[0]?.id
  );
  const [path, setPath] = useState<number[]>([]);

  const activeStep = steps.find((s) => s.id === currentStepId);

  if (!activeStep) return null;

  const choices = activeStep.choices ?? [];
  const isLeafStep = choices.length === 0;

  function handleChoiceSelect(choice: WalkthroughStepChoice) {
    if (choice.next_step_id) {
      setPath((prev) => [...prev, currentStepId]);
      setCurrentStepId(choice.next_step_id);
    }
  }

  function handleBack() {
    if (path.length > 0) {
      const previousStepId = path[path.length - 1];
      setPath((prev) => prev.slice(0, -1));
      setCurrentStepId(previousStepId);
    }
  }

  function handleRestart() {
    setPath([]);
    setCurrentStepId(startStep?.id ?? steps[0]?.id);
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{activeStep.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {activeStep.image_url && (
            <div className="mb-6 overflow-hidden rounded-lg border border-border">
              <img
                src={activeStep.image_url}
                alt={activeStep.title}
                className="w-full object-cover"
              />
            </div>
          )}
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {activeStep.body.split("\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {!isLeafStep && (
            <ChoiceButtons
              choices={choices}
              onChoiceSelect={handleChoiceSelect}
            />
          )}

          {isLeafStep && (
            <SupportRequestForm
              walkthroughId={walkthrough.id}
              walkthroughStepId={activeStep.id}
              pathTaken={[...path, currentStepId]}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        {path.length > 0 ? (
          <Button variant="outline" onClick={handleBack}>
            ← Back
          </Button>
        ) : (
          <div />
        )}

        {path.length > 0 && (
          <Button variant="ghost" onClick={handleRestart}>
            Start over
          </Button>
        )}
      </div>
    </div>
  );
}
