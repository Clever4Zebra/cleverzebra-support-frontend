import type {
  Article,
  Category,
  Tag,
  Walkthrough,
  WalkthroughStep,
  PaginatedResponse,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(path: string, options?: { email?: string }): Promise<T> {
  const url = `${BASE_URL}/api${path}`;
  const headers: Record<string, string> = {};
  if (options?.email) {
    headers["X-User-Email"] = options.email;
  }

  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers,
  });

  if (!res.ok) {
    const error = new Error(`API error: ${res.status} ${res.statusText} for ${path}`);
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
}

// Categories
export async function getCategories(): Promise<{ data: Category[] }> {
  return fetchAPI("/categories");
}

export async function getCategory(slug: string, email?: string): Promise<{ data: Category }> {
  return fetchAPI(`/categories/${encodeURIComponent(slug)}`, { email });
}

// Tags
export async function getTags(): Promise<{ data: Tag[] }> {
  return fetchAPI("/tags");
}

export async function getTag(slug: string): Promise<{ data: Tag }> {
  return fetchAPI(`/tags/${encodeURIComponent(slug)}`);
}

// Articles
export async function getArticles(params?: {
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<PaginatedResponse<Article>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.category) searchParams.set("category", params.category);
  if (params?.tag) searchParams.set("tag", params.tag);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return fetchAPI(`/articles${query ? `?${query}` : ""}`);
}

export async function getArticle(slug: string, email?: string): Promise<{ data: Article }> {
  return fetchAPI(`/articles/${encodeURIComponent(slug)}`, { email });
}

// Walkthroughs
export async function getWalkthroughs(params?: {
  page?: number;
}): Promise<PaginatedResponse<Walkthrough>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());

  const query = searchParams.toString();
  return fetchAPI(`/walkthroughs${query ? `?${query}` : ""}`);
}

export async function getWalkthrough(
  slug: string
): Promise<{ data: Walkthrough }> {
  return fetchAPI(`/walkthroughs/${encodeURIComponent(slug)}`);
}

// Walkthrough Steps
export async function getWalkthroughSteps(
  walkthroughSlug: string
): Promise<{ data: WalkthroughStep[] }> {
  return fetchAPI(
    `/walkthroughs/${encodeURIComponent(walkthroughSlug)}/steps`
  );
}

export async function getWalkthroughStep(
  walkthroughSlug: string,
  position: number
): Promise<{ data: WalkthroughStep }> {
  return fetchAPI(
    `/walkthroughs/${encodeURIComponent(walkthroughSlug)}/steps/${position}`
  );
}

// Support Requests
export async function submitSupportRequest(
  formData: FormData
): Promise<{ message: string; data: { id: number } }> {
  const url = `${BASE_URL}/api/support-requests`;
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
