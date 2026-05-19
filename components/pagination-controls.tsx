import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationMeta } from "@/lib/types";

interface PaginationControlsProps {
  meta: PaginationMeta;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function PaginationControls({
  meta,
  basePath,
  searchParams = {},
}: PaginationControlsProps) {
  if (meta.last_page <= 1) return null;

  function buildHref(page: number): string {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${basePath}?${params.toString()}`;
  }

  const pages: number[] = [];
  for (let i = 1; i <= meta.last_page; i++) {
    if (
      i === 1 ||
      i === meta.last_page ||
      (i >= meta.current_page - 1 && i <= meta.current_page + 1)
    ) {
      pages.push(i);
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        {meta.current_page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={buildHref(meta.current_page - 1)} />
          </PaginationItem>
        )}

        {pages.map((page, idx) => {
          const prevPage = pages[idx - 1];
          const showEllipsis = prevPage !== undefined && page - prevPage > 1;
          return (
            <span key={page} className="contents">
              {showEllipsis && (
                <PaginationItem>
                  <span className="px-2 text-muted-foreground">…</span>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={buildHref(page)}
                  isActive={page === meta.current_page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </span>
          );
        })}

        {meta.current_page < meta.last_page && (
          <PaginationItem>
            <PaginationNext href={buildHref(meta.current_page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
