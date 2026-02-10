# Routing Coding Standards

## Route Structure

**ALL application routes MUST live under `/dashboard`.**

- The `/dashboard` route is the main entry point for authenticated users
- All sub-pages (e.g., workouts, exercises, settings) are nested under `/dashboard`
- The only route outside `/dashboard` is `/` (the public home/landing page)

```
src/app/
  page.tsx                          # / (public landing page)
  dashboard/
    page.tsx                        # /dashboard (main dashboard)
    workout/
      new/
        page.tsx                    # /dashboard/workout/new
      [workoutId]/
        page.tsx                    # /dashboard/workout/:workoutId
```

- **DO NOT** create routes outside of `/dashboard` (except the root `/` page)
- **DO NOT** create top-level routes like `/workouts`, `/settings`, etc.
- **ALWAYS** nest new pages under `src/app/dashboard/`

## Route Protection

### Middleware (Primary Protection)

**The `/dashboard` route and ALL sub-routes MUST be protected via Next.js middleware using Clerk.**

The middleware is configured in `src/proxy.ts` and uses `clerkMiddleware()` from `@clerk/nextjs/server`. Route protection MUST be enforced at the middleware level to block unauthenticated access before the page even loads.

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

- **DO NOT** rely solely on in-component auth checks for route protection
- **ALWAYS** ensure the middleware protects `/dashboard(.*)` to cover all sub-routes

### Server Component Auth Check (Secondary Protection)

In addition to middleware, every protected page's Server Component **MUST** also check for `userId` and redirect unauthenticated users. This is a defense-in-depth measure.

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Page content...
}
```

See `/docs/auth.md` for full authentication patterns.

## Linking and Navigation

### Internal Links

**ALWAYS** use Next.js `<Link>` for internal navigation.

```typescript
import Link from "next/link";

<Link href="/dashboard/workout/new">New Workout</Link>
```

- **DO NOT** use `<a>` tags for internal navigation
- **DO NOT** hardcode links — always use the `/dashboard` prefix

### Programmatic Navigation

Use `redirect()` from `next/navigation` in Server Components and Server Actions.

```typescript
import { redirect } from "next/navigation";

// After a mutation, redirect to the dashboard
redirect("/dashboard");
```

## Summary

| Rule | Requirement |
|------|-------------|
| Route location | All pages under `/dashboard` (except root `/`) |
| Primary protection | Next.js middleware via Clerk `auth.protect()` |
| Secondary protection | `userId` check in every protected Server Component |
| Middleware file | `src/proxy.ts` |
| Internal navigation | Next.js `<Link>` component ONLY |
| Programmatic navigation | `redirect()` from `next/navigation` |
