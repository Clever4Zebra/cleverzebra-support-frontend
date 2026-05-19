import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="border border-border bg-card transition-shadow hover:shadow-[0_4px_12px_rgba(0,29,75,0.05)]">
      <CardHeader>
        <CardTitle>
          <Link
            href={`/categories/${category.slug}`}
            className="hover:underline"
          >
            {category.name}
          </Link>
        </CardTitle>
        {category.description && (
          <CardDescription className="line-clamp-2">
            {category.description}
          </CardDescription>
        )}
        {category._links.children && category._links.children.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 text-xs text-muted-foreground">
            {category._links.children.map((child) => (
              <span
                key={child.href}
                className="rounded bg-muted px-1.5 py-0.5"
              >
                {child.name}
              </span>
            ))}
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
