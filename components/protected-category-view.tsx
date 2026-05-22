"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/article-card";
import { EmptyState } from "@/components/empty-state";
import { EmailGate } from "@/components/email-gate";
import type { Category, Article } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ProtectedCategoryViewProps {
  category: Category;
  articles: Article[];
  slug: string;
}

export function ProtectedCategoryView({
  category,
  articles,
  slug,
}: ProtectedCategoryViewProps) {
  const [loadedArticles, setLoadedArticles] = useState<Article[]>(articles);

  const handleEmailSubmit = useCallback(
    async (email: string): Promise<boolean> => {
      const res = await fetch(
        `${BASE_URL}/api/categories/${encodeURIComponent(slug)}`,
        { headers: { "X-User-Email": email } }
      );
      if (res.ok) {
        // Also reload articles for this category
        const articlesRes = await fetch(
          `${BASE_URL}/api/articles?category=${encodeURIComponent(slug)}`,
          { headers: { "X-User-Email": email } }
        );
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          setLoadedArticles(articlesData.data);
        }
        return true;
      }
      return false;
    },
    [slug]
  );

  return (
    <EmailGate isProtected={category.is_email_protected} onEmailSubmit={handleEmailSubmit}>
      <div className="mt-6 mb-8">
        <h1
          className="font-heading text-[32px] font-bold leading-[1.3] tracking-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        )}
      </div>

      {/* Child categories */}
      {category._links.children && category._links.children.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Subcategories</h2>
          <div className="flex flex-wrap gap-2">
            {category._links.children.map((child) => (
              <Link
                key={child.href}
                href={`/categories/${child.name?.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Badge variant="secondary" className="cursor-pointer">
                  {child.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Articles in this category */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Articles</h2>
        {loadedArticles.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="There are no published articles in this category."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loadedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </EmailGate>
  );
}
