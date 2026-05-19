"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SearchableArticleListProps {
  initialArticles: Article[];
}

export function SearchableArticleList({ initialArticles }: SearchableArticleListProps) {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setArticles(initialArticles);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ search: query.trim() });
        const res = await fetch(`${BASE_URL}/api/articles?${params}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const json = await res.json();
          setArticles(json.data);
        }
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, initialArticles]);

  return (
    <div>
      <div className="mx-auto mt-8 w-full max-w-[600px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="h-14 w-full rounded-lg border border-border bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-muted-foreground">Searching...</p>
        ) : articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No articles found.
          </p>
        )}
      </div>
    </div>
  );
}
