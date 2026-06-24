/**
 * Module-level store for the current organization slug.
 * This allows the admin API fetch helper to include the X-Organization header
 * without needing access to React context.
 */

let currentOrganizationSlug: string | null = null;

export function setOrganizationSlug(slug: string | null) {
  currentOrganizationSlug = slug;
}

export function getOrganizationSlug(): string | null {
  return currentOrganizationSlug;
}

