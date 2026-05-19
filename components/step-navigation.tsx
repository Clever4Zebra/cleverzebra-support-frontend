import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  walkthroughSlug: string;
  currentPosition: number;
  totalSteps: number;
}

export function StepNavigation({
  walkthroughSlug,
  currentPosition,
  totalSteps,
}: StepNavigationProps) {
  const hasPrev = currentPosition > 1;
  const hasNext = currentPosition < totalSteps;

  return (
    <div className="flex items-center justify-between">
      {hasPrev ? (
        <Button variant="outline" asChild>
          <Link
            href={`/walkthroughs/${walkthroughSlug}?step=${currentPosition - 1}`}
          >
            ← Previous Step
          </Link>
        </Button>
      ) : (
        <div />
      )}

      <span className="text-sm text-muted-foreground">
        Step {currentPosition} of {totalSteps}
      </span>

      {hasNext ? (
        <Button variant="outline" asChild>
          <Link
            href={`/walkthroughs/${walkthroughSlug}?step=${currentPosition + 1}`}
          >
            Next Step →
          </Link>
        </Button>
      ) : (
        <div />
      )}
    </div>
  );
}
