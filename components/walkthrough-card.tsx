import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Walkthrough } from "@/lib/types";

interface WalkthroughCardProps {
  walkthrough: Walkthrough;
}

export function WalkthroughCard({ walkthrough }: WalkthroughCardProps) {
  return (
    <Card className="border border-border bg-card transition-shadow hover:shadow-[0_4px_12px_rgba(0,29,75,0.05)]">
      <CardHeader>
        <CardTitle>
          <Link
            href={`/walkthroughs/${walkthrough.slug}`}
            className="hover:underline"
          >
            {walkthrough.title}
          </Link>
        </CardTitle>
        <CardDescription>
          {walkthrough.steps?.length ?? 0} step
          {(walkthrough.steps?.length ?? 0) !== 1 ? "s" : ""} ·{" "}
          <time dateTime={walkthrough.published_at}>
            {new Date(walkthrough.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </CardDescription>
      </CardHeader>
      {walkthrough.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {walkthrough.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
