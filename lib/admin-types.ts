export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor";
  created_at: string;
  updated_at: string;
}

export interface AdminArticle {
  id: number;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  category_id: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: { id: number; name: string; slug: string } | null;
  tags?: { id: number; name: string; slug: string }[];
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  parent?: { id: number; name: string } | null;
  articles_count?: number;
  children_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AdminTag {
  id: number;
  name: string;
  slug: string;
  articles_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AdminWalkthrough {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  type: "linear" | "decision_tree";
  published_at: string | null;
  steps_count?: number;
  steps?: AdminWalkthroughStep[];
  created_at: string;
  updated_at: string;
}

export interface AdminWalkthroughStep {
  id: number;
  walkthrough_id: number;
  position: number;
  title: string;
  body: string | null;
  image_url: string | null;
  choices?: AdminStepChoice[];
  created_at: string;
  updated_at: string;
}

export interface AdminStepChoice {
  id: number;
  walkthrough_step_id: number;
  label: string;
  next_step_id: number | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface AdminSupportRequest {
  id: number;
  walkthrough_id: number | null;
  walkthrough_step_id: number | null;
  path_taken: string[] | null;
  description: string;
  screenshots: string[] | null;
  contact_email: string;
  walkthrough?: { id: number; title: string } | null;
  walkthrough_step?: { id: number; title: string } | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  articles_count: number;
  categories_count: number;
  walkthroughs_count: number;
  support_requests_count: number;
  users_count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
