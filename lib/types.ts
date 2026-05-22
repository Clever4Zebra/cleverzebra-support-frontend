export interface HATEOASLink {
  href: string;
  name?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_email_protected: boolean;
  created_at: string;
  updated_at: string;
  _links: {
    self: HATEOASLink;
    articles: HATEOASLink;
    parent?: HATEOASLink;
    children?: HATEOASLink[];
  };
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  _links: {
    self: HATEOASLink;
    articles: HATEOASLink;
  };
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  published_at: string;
  is_email_protected: boolean;
  created_at: string;
  updated_at: string;
  category: Category | null;
  tags: Tag[];
  _links: {
    self: HATEOASLink;
    category?: HATEOASLink;
  };
}

export interface WalkthroughStepChoice {
  id: number;
  label: string;
  next_step_id: number | null;
  position: number;
}

export interface WalkthroughStep {
  id: number;
  position: number;
  title: string;
  body: string;
  image_url: string | null;
  choices?: WalkthroughStepChoice[];
  created_at: string;
  updated_at: string;
  _links: {
    self: HATEOASLink;
    walkthrough: HATEOASLink;
    prev?: HATEOASLink;
    next?: HATEOASLink;
  };
}

export interface Walkthrough {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  type: 'linear' | 'decision_tree';
  published_at: string;
  created_at: string;
  updated_at: string;
  steps?: WalkthroughStep[];
  _links: {
    self: HATEOASLink;
    steps: HATEOASLink;
  };
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginationLinks {
  first: HATEOASLink;
  last: HATEOASLink;
  prev: HATEOASLink | null;
  next: HATEOASLink | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  _links: PaginationLinks;
  meta: PaginationMeta;
}
