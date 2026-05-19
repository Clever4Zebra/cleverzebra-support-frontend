import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/lib/types";

interface TagBadgeProps {
  tag: Tag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link href={`/articles?tag=${tag.slug}`}>
      <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
        {tag.name}
      </Badge>
    </Link>
  );
}
