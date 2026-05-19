import { Breadcrumbs } from "@/components/breadcrumbs";
import { WalkthroughCard } from "@/components/walkthrough-card";
import { PaginationControls } from "@/components/pagination-controls";
import { getWalkthroughs } from "@/lib/api";

export const dynamic = "force-dynamic";

interface WalkthroughsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function WalkthroughsPage({
  searchParams,
}: WalkthroughsPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const walkthroughs = await getWalkthroughs({ page });

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10">
      <Breadcrumbs segments={[{ label: "Walkthroughs" }]} />

      <div className="mt-6 mb-8">
        <h1 className="font-heading text-[32px] font-bold leading-[1.3] tracking-tight" style={{ letterSpacing: '-0.01em' }}>Walkthroughs</h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          Step-by-step guides to help you accomplish tasks
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {walkthroughs.data.map((walkthrough) => (
          <WalkthroughCard key={walkthrough.id} walkthrough={walkthrough} />
        ))}
      </div>

      <div className="mt-8">
        <PaginationControls meta={walkthroughs.meta} basePath="/walkthroughs" />
      </div>
    </div>
  );
}
