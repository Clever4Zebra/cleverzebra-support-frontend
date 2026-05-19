import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TagBadge } from "@/components/tag-badge";
import { Separator } from "@/components/ui/separator";
import { getArticle } from "@/lib/api";

export const dynamic = "force-dynamic";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;

  let article;
  try {
    const response = await getArticle(slug);
    article = response.data;
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[800px] px-6 py-10">
      <Breadcrumbs
        segments={[
          { label: "Articles", href: "/articles" },
          { label: article.title },
        ]}
      />

      <article className="mt-8">
        <header className="mb-8">
          <h1 className="font-heading text-[32px] font-bold leading-[1.3] sm:text-4xl" style={{ letterSpacing: '-0.01em' }}>
            {article.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {article.category && (
              <>
                <Link
                  href={`/categories/${article.category.slug}`}
                  className="text-primary hover:underline"
                >
                  {article.category.name}
                </Link>
                <span>·</span>
              </>
            )}
            <time dateTime={article.published_at}>
              {new Date(article.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          {article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </header>

        <Separator className="mb-8" />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.body}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
