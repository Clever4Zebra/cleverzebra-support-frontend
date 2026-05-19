import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StepNavigation } from "@/components/step-navigation";
import { DecisionTreeView } from "@/components/decision-tree-view";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { getWalkthrough } from "@/lib/api";
import type { WalkthroughStep } from "@/lib/types";

export const dynamic = "force-dynamic";

interface WalkthroughDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ step?: string }>;
}

export default async function WalkthroughDetailPage({
  params,
  searchParams,
}: WalkthroughDetailPageProps) {
  const { slug } = await params;
  const { step: stepParam } = await searchParams;

  let walkthrough;
  try {
    const response = await getWalkthrough(slug);
    walkthrough = response.data;
  } catch {
    notFound();
  }

  const steps = walkthrough.steps ?? [];
  const isDecisionTree = walkthrough.type === "decision_tree";

  return (
    <div className="mx-auto max-w-[800px] px-6 py-10">
      <Breadcrumbs
        segments={[
          { label: "Walkthroughs", href: "/walkthroughs" },
          { label: walkthrough.title },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1 className="font-heading text-[32px] font-bold leading-[1.3]" style={{ letterSpacing: '-0.01em' }}>
          {walkthrough.title}
        </h1>
        {walkthrough.description && (
          <p className="mt-2 text-muted-foreground">
            {walkthrough.description}
          </p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {steps.length} step
          {steps.length !== 1 ? "s" : ""} ·{" "}
          <time dateTime={walkthrough.published_at}>
            Published{" "}
            {new Date(walkthrough.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>
      </div>

      {isDecisionTree ? (
        <DecisionTreeView walkthrough={walkthrough} />
      ) : (
        <LinearWalkthroughView
          slug={slug}
          steps={steps}
          stepParam={stepParam}
        />
      )}
    </div>
  );
}

function LinearWalkthroughView({
  slug,
  steps,
  stepParam,
}: {
  slug: string;
  steps: WalkthroughStep[];
  stepParam?: string;
}) {
  const currentStep = stepParam ? parseInt(stepParam) : 1;
  const activeStep = steps.find((s) => s.position === currentStep);

  if (!activeStep && steps.length > 0) {
    notFound();
  }

  return (
    <>
      {/* Step overview tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {steps.map((step) => (
          <a
            key={step.id}
            href={`/walkthroughs/${slug}?step=${step.position}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              step.position === currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {step.position}. {step.title}
          </a>
        ))}
      </div>

      <Separator className="mb-6" />

      {/* Active step content */}
      {activeStep && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Step {activeStep.position}: {activeStep.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeStep.image_url && (
              <div className="mb-6 overflow-hidden rounded-lg border border-border">
                <img
                  src={activeStep.image_url}
                  alt={`Step ${activeStep.position}: ${activeStep.title}`}
                  className="w-full object-cover"
                />
              </div>
            )}
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              {activeStep.body.split("\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step navigation */}
      <div className="mt-6">
        <StepNavigation
          walkthroughSlug={slug}
          currentPosition={currentStep}
          totalSteps={steps.length}
        />
      </div>
    </>
  );
}
