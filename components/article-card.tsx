import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TagBadge } from "@/components/tag-badge";
import type { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="border border-border bg-card transition-shadow hover:shadow-[0_4px_12px_rgba(0,29,75,0.05)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link
            href={`/articles/${article.slug}`}
            className="hover:underline"
          >
            {article.title}
          </Link>
          {article.is_email_protected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-muted-foreground"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
        </CardTitle>
        <CardDescription>
          {article.category && (
            <Link
              href={`/categories/${article.category.slug}`}
              className="text-primary hover:underline"
            >
              {article.category.name}
            </Link>
          )}
          {article.category && " · "}
          <time dateTime={article.published_at}>
            {new Date(article.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </CardDescription>
      </CardHeader>
      {(article.excerpt || article.tags.length > 0) && (
        <CardContent>
          {article.excerpt && (
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
              {article.excerpt}
            </p>
          )}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
