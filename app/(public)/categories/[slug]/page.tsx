import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProtectedCategoryView } from "@/components/protected-category-view";
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

      <ProtectedCategoryView
        category={category}
        articles={articles.data}
        slug={slug}
      />
    </div>
  );
}
