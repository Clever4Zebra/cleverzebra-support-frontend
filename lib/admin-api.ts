import type {
  AdminArticle,
  AdminCategory,
  AdminSupportRequest,
  AdminTag,
  AdminUser,
  AdminWalkthrough,
  AdminWalkthroughStep,
  AdminStepChoice,
  DashboardStats,
  Organization,
  OrganizationMember,
  PaginatedResponse,
} from "./admin-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const xsrfToken = getCookie("XSRF-TOKEN");

  const res = await fetch(`${BASE_URL}/api/admin${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(xsrfToken && { "X-XSRF-TOKEN": xsrfToken }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthenticated");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

async function superAdminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const xsrfToken = getCookie("XSRF-TOKEN");

  const res = await fetch(`${BASE_URL}/api/super-admin${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(xsrfToken && { "X-XSRF-TOKEN": xsrfToken }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthenticated");
  }

  if (res.status === 403) {
    throw new Error("Super Admin access required");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

// Auth
export async function getCsrfCookie(): Promise<void> {
  await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

export async function login(
  email: string,
  password: string
): Promise<{ user: AdminUser }> {
  await getCsrfCookie();
  return adminFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  await adminFetch("/logout", { method: "POST" });
}

export async function getUser(): Promise<{ user: AdminUser }> {
  return adminFetch("/user");
}

// Dashboard
export async function getStats(): Promise<DashboardStats> {
  return adminFetch("/stats");
}

// Articles
export async function getArticles(
  params?: Record<string, string>
): Promise<PaginatedResponse<AdminArticle>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return adminFetch(`/articles${query}`);
}

export async function getArticle(id: number): Promise<{ data: AdminArticle }> {
  return adminFetch(`/articles/${id}`);
}

export async function createArticle(
  data: Partial<AdminArticle> & { tag_ids?: number[] }
): Promise<{ data: AdminArticle }> {
  return adminFetch("/articles", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateArticle(
  id: number,
  data: Partial<AdminArticle> & { tag_ids?: number[] }
): Promise<{ data: AdminArticle }> {
  return adminFetch(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteArticle(id: number): Promise<void> {
  await adminFetch(`/articles/${id}`, { method: "DELETE" });
}

// Categories
export async function getCategories(
  params?: Record<string, string>
): Promise<{ data: AdminCategory[] }> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return adminFetch(`/categories${query}`);
}

export async function getCategory(
  id: number
): Promise<{ data: AdminCategory }> {
  return adminFetch(`/categories/${id}`);
}

export async function createCategory(
  data: Partial<AdminCategory>
): Promise<{ data: AdminCategory }> {
  return adminFetch("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: number,
  data: Partial<AdminCategory>
): Promise<{ data: AdminCategory }> {
  return adminFetch(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  await adminFetch(`/categories/${id}`, { method: "DELETE" });
}

// Tags
export async function getTags(
  params?: Record<string, string>
): Promise<{ data: AdminTag[] }> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return adminFetch(`/tags${query}`);
}

export async function createTag(
  data: Partial<AdminTag>
): Promise<{ data: AdminTag }> {
  return adminFetch("/tags", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTag(
  id: number,
  data: Partial<AdminTag>
): Promise<{ data: AdminTag }> {
  return adminFetch(`/tags/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTag(id: number): Promise<void> {
  await adminFetch(`/tags/${id}`, { method: "DELETE" });
}

// Walkthroughs
export async function getWalkthroughs(
  params?: Record<string, string>
): Promise<PaginatedResponse<AdminWalkthrough>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return adminFetch(`/walkthroughs${query}`);
}

export async function getWalkthrough(
  id: number
): Promise<{ data: AdminWalkthrough }> {
  return adminFetch(`/walkthroughs/${id}`);
}

export async function createWalkthrough(
  data: Partial<AdminWalkthrough>
): Promise<{ data: AdminWalkthrough }> {
  return adminFetch("/walkthroughs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateWalkthrough(
  id: number,
  data: Partial<AdminWalkthrough>
): Promise<{ data: AdminWalkthrough }> {
  return adminFetch(`/walkthroughs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteWalkthrough(id: number): Promise<void> {
  await adminFetch(`/walkthroughs/${id}`, { method: "DELETE" });
}

// Walkthrough Steps
export async function getSteps(
  walkthroughId: number
): Promise<{ data: AdminWalkthroughStep[] }> {
  return adminFetch(`/walkthroughs/${walkthroughId}/steps`);
}

export async function createStep(
  walkthroughId: number,
  data: Partial<AdminWalkthroughStep>
): Promise<{ data: AdminWalkthroughStep }> {
  return adminFetch(`/walkthroughs/${walkthroughId}/steps`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStep(
  walkthroughId: number,
  stepId: number,
  data: Partial<AdminWalkthroughStep>
): Promise<{ data: AdminWalkthroughStep }> {
  return adminFetch(`/walkthroughs/${walkthroughId}/steps/${stepId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStep(
  walkthroughId: number,
  stepId: number
): Promise<void> {
  await adminFetch(`/walkthroughs/${walkthroughId}/steps/${stepId}`, {
    method: "DELETE",
  });
}

export async function reorderSteps(
  walkthroughId: number,
  steps: { id: number; position: number }[]
): Promise<void> {
  await adminFetch(`/walkthroughs/${walkthroughId}/steps/reorder`, {
    method: "POST",
    body: JSON.stringify({ steps }),
  });
}

// Step Choices
export async function createChoice(
  stepId: number,
  data: Partial<AdminStepChoice>
): Promise<{ data: AdminStepChoice }> {
  return adminFetch(`/steps/${stepId}/choices`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateChoice(
  stepId: number,
  choiceId: number,
  data: Partial<AdminStepChoice>
): Promise<{ data: AdminStepChoice }> {
  return adminFetch(`/steps/${stepId}/choices/${choiceId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteChoice(
  stepId: number,
  choiceId: number
): Promise<void> {
  await adminFetch(`/steps/${stepId}/choices/${choiceId}`, {
    method: "DELETE",
  });
}

// Support Requests
export async function getSupportRequests(
  params?: Record<string, string>
): Promise<PaginatedResponse<AdminSupportRequest>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return adminFetch(`/support-requests${query}`);
}

export async function getSupportRequest(
  id: number
): Promise<{ data: AdminSupportRequest }> {
  return adminFetch(`/support-requests/${id}`);
}

export async function deleteSupportRequest(id: number): Promise<void> {
  await adminFetch(`/support-requests/${id}`, { method: "DELETE" });
}

// Users
export async function getUsers(): Promise<{ data: AdminUser[] }> {
  return adminFetch("/users");
}

export async function createUser(
  data: Partial<AdminUser> & { password: string }
): Promise<{ data: AdminUser }> {
  return adminFetch("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(
  id: number,
  data: Partial<AdminUser> & { password?: string }
): Promise<{ data: AdminUser }> {
  return adminFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number): Promise<void> {
  await adminFetch(`/users/${id}`, { method: "DELETE" });
}

// ============ Super Admin: Organizations ============

export async function getOrganizations(
  params?: Record<string, string>
): Promise<PaginatedResponse<Organization>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return superAdminFetch(`/organizations${query}`);
}

export async function getOrganization(
  id: number
): Promise<{ data: Organization }> {
  return superAdminFetch(`/organizations/${id}`);
}

export async function createOrganization(
  data: Partial<Organization>
): Promise<{ data: Organization }> {
  return superAdminFetch("/organizations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOrganization(
  id: number,
  data: Partial<Organization>
): Promise<{ data: Organization }> {
  return superAdminFetch(`/organizations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteOrganization(id: number): Promise<void> {
  await superAdminFetch(`/organizations/${id}`, { method: "DELETE" });
}

// Organization Members
export async function getOrganizationMembers(
  organizationId: number
): Promise<{ data: OrganizationMember[] }> {
  return superAdminFetch(`/organizations/${organizationId}/members`);
}

export async function addOrganizationMember(
  organizationId: number,
  data: { user_id: number; role: string }
): Promise<{ message: string }> {
  return superAdminFetch(`/organizations/${organizationId}/members`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOrganizationMember(
  organizationId: number,
  userId: number,
  data: { role: string }
): Promise<{ message: string }> {
  return superAdminFetch(`/organizations/${organizationId}/members/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function removeOrganizationMember(
  organizationId: number,
  userId: number
): Promise<void> {
  await superAdminFetch(`/organizations/${organizationId}/members/${userId}`, {
    method: "DELETE",
  });
}
