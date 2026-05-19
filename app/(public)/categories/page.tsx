import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryCard } from "@/components/category-card";
import { getCategories } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <Breadcrumbs segments={[{ label: "Categories" }]} />

      <div className="mt-6 mb-8">
        <h1 className="font-heading text-[32px] font-bold leading-[1.3] tracking-tight" style={{ letterSpacing: '-0.01em' }}>Categories</h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          Browse articles by category
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.data.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
