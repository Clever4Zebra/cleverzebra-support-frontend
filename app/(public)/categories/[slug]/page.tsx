import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleCard } from "@/components/article-card";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { getCategory, getArticles } from "@/lib/api";

export const dynamic = "force-dynamic";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug } = await params;

  let category;
  try {
    const response = await getCategory(slug);
    category = response.data;
  } catch {
    notFound();
  }

  const articles = await getArticles({ category: slug });

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <Breadcrumbs
        segments={[
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1 className="font-heading text-[32px] font-bold leading-[1.3] tracking-tight" style={{ letterSpacing: '-0.01em' }}>{category.name}</h1>
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
              <Link key={child.href} href={`/categories/${child.name?.toLowerCase().replace(/\s+/g, "-")}`}>
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
        {articles.data.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="There are no published articles in this category."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.data.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
