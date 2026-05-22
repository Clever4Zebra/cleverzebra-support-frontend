import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProtectedArticleView } from "@/components/protected-article-view";
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

      <ProtectedArticleView article={article} slug={slug} />
    </div>
  );
}
