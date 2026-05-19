# Frontend Agent Instructions

## Project Context

This is a **Next.js 16** frontend (App Router) consuming a Laravel REST API. It uses React Server Components, shadcn/ui, and Tailwind CSS 4.

## Tech Stack

- Next.js 16 with App Router and Turbopack
- React 19 (Server Components by default)
- TypeScript 5 (strict mode)
- Tailwind CSS 4 (CSS-first config, oklch colors)
- shadcn/ui (Radix primitives, installed via CLI)
- pnpm package manager

## Coding Conventions

### File naming
- **Pages**: `app/<route>/page.tsx` (kebab-case route segments)
- **Components**: `components/<name>.tsx` (kebab-case filenames)
- **UI primitives**: `components/ui/<name>.tsx` (shadcn-managed, do not edit manually)
- **Utilities**: `lib/<name>.ts`

### Component patterns
- All page components are **async Server Components** — use `async function` and `await` for data fetching
- Export `dynamic = "force-dynamic"` on every page that fetches from the API
- Use `{ params, searchParams }` props (both are `Promise<>` in Next.js 16 — must `await` them)
- Use `notFound()` from `next/navigation` for 404 handling in try/catch
- Reusable components receive typed props interfaces (no `any`)

### Styling
- Use Tailwind utility classes directly — no CSS modules or styled-components
- Use `cn()` from `@/lib/utils` for conditional class merging
- Follow mobile-first responsive design (`sm:`, `lg:` breakpoints)
- Use shadcn/ui color tokens: `text-muted-foreground`, `bg-card`, `border`, etc.

### API integration
- All API calls go through `lib/api.ts` — never call `fetch()` directly in components
- API functions return typed responses matching `lib/types.ts`
- Use `encodeURIComponent()` for dynamic URL segments
- Backend URL: `http://localhost:8000` (configurable via `NEXT_PUBLIC_API_URL`)

### Imports
- Use `@/` path alias (maps to project root)
- Group imports: React/Next → shadcn/ui → custom components → lib → types

## Do NOT

- Do not edit files in `components/ui/` manually — use `pnpm dlx shadcn@latest add <component>`
- Do not use `"use client"` unless the component needs browser APIs, event handlers, or hooks
- Do not use `getServerSideProps` or `getStaticProps` — these are Pages Router patterns
- Do not install additional UI libraries — use shadcn/ui components
- Do not hardcode the backend URL — use the API client functions

## Adding New Features

1. Define types in `lib/types.ts`
2. Add API function in `lib/api.ts`
3. Create reusable components in `components/`
4. Create page in `app/<route>/page.tsx` with `dynamic = "force-dynamic"`
5. Add navigation link in `components/header.tsx` if it's a top-level section

## Build & Verify

```bash
pnpm build    # Must pass with no TypeScript errors
pnpm lint     # Must pass ESLint
pnpm dev      # Dev server at localhost:3000
```
