import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleCard } from "@/components/article-card";
import { PaginationControls } from "@/components/pagination-controls";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { getArticles, getCategories, getTags } from "@/lib/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ArticlesPageProps {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const category = params.category;
  const tag = params.tag;

  const [articles, categories, tags] = await Promise.all([
    getArticles({ page, category, tag }),
    getCategories(),
    getTags(),
  ]);

  const activeFilters: Record<string, string> = {};
  if (category) activeFilters.category = category;
  if (tag) activeFilters.tag = tag;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <Breadcrumbs segments={[{ label: "Articles" }]} />

      <div className="mt-6 mb-8">
        <h1 className="font-heading text-[32px] font-bold leading-[1.3] tracking-tight" style={{ letterSpacing: '-0.01em' }}>Articles</h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          Browse all published articles
          {category && ` in "${category}"`}
          {tag && ` tagged "${tag}"`}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Categories:</span>
          <Link href="/articles">
            <Badge variant={!category ? "default" : "secondary"}>All</Badge>
          </Link>
          {categories.data.map((cat) => (
            <Link key={cat.id} href={`/articles?category=${cat.slug}`}>
              <Badge
                variant={category === cat.slug ? "default" : "secondary"}
                className="cursor-pointer"
              >
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Tags:</span>
          {tags.data.map((t) => (
            <Link key={t.id} href={`/articles?tag=${t.slug}`}>
              <Badge
                variant={tag === t.slug ? "default" : "outline"}
                className="cursor-pointer"
              >
                {t.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Article List */}
      {articles.data.length === 0 ? (
        <EmptyState
          title="No articles found"
          description="Try changing your filters or check back later."
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.data.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-8">
            <PaginationControls
              meta={articles.meta}
              basePath="/articles"
              searchParams={activeFilters}
            />
          </div>
        </>
      )}
    </div>
  );
}
