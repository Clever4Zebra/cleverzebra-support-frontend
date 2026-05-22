"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TagBadge } from "@/components/tag-badge";
import { Separator } from "@/components/ui/separator";
import { EmailGate } from "@/components/email-gate";
import type { Article } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ProtectedArticleViewProps {
  article: Article;
  slug: string;
}

export function ProtectedArticleView({ article, slug }: ProtectedArticleViewProps) {
  const [loadedArticle, setLoadedArticle] = useState<Article>(article);
  const needsGate = article.is_email_protected && !article.body;

  const handleEmailSubmit = useCallback(
    async (email: string): Promise<boolean> => {
      const res = await fetch(`${BASE_URL}/api/articles/${encodeURIComponent(slug)}`, {
        headers: { "X-User-Email": email },
      });
      if (res.ok) {
        const data = await res.json();
        setLoadedArticle(data.data);
        return true;
      }
      return false;
    },
    [slug]
  );

  return (
    <EmailGate isProtected={needsGate} onEmailSubmit={handleEmailSubmit}>
      <article className="mt-8">
        <header className="mb-8">
          <h1
            className="font-heading text-[32px] font-bold leading-[1.3] sm:text-4xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            {loadedArticle.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {loadedArticle.category && (
              <>
                <Link
                  href={`/categories/${loadedArticle.category.slug}`}
                  className="text-primary hover:underline"
                >
                  {loadedArticle.category.name}
                </Link>
                <span>·</span>
              </>
            )}
            <time dateTime={loadedArticle.published_at}>
              {new Date(loadedArticle.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          {loadedArticle.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {loadedArticle.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </header>

        <Separator className="mb-8" />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {loadedArticle.body}
          </ReactMarkdown>
        </div>
      </article>
    </EmailGate>
  );
}
