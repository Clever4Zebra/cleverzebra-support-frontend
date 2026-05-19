import { SearchableArticleList } from "@/components/searchable-article-list";
import { getArticles } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles = await getArticles({ page: 1 });

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-16">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="font-heading text-5xl font-bold tracking-tight leading-[1.2] sm:text-[48px]" style={{ letterSpacing: '-0.02em' }}>
          Knowledgebase
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Articles, guides, and step-by-step walkthroughs to help you get
          started.
        </p>
        <SearchableArticleList initialArticles={articles.data} />
      </section>
    </div>
  );
}
