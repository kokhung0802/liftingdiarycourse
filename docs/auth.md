# Authentication Coding Standards

## Auth Provider

**This application uses [Clerk](https://clerk.com/) for all authentication. Use `@clerk/nextjs` exclusively.**

- **DO NOT** use any other auth library (e.g., NextAuth, Auth.js, Lucia)
- **DO NOT** implement custom authentication logic
- **ALWAYS** use Clerk's built-in components and helpers

## Setup

### ClerkProvider

The `<ClerkProvider>` wrapper is configured in the root layout (`src/app/layout.tsx`). All pages are wrapped by this provider. Do not add additional providers or remove it.

### Middleware

Clerk middleware is configured in `src/proxy.ts` using `clerkMiddleware()`. This runs on all routes (excluding static files and Next.js internals).

## Getting the Authenticated User

### Server Components

Use `auth()` from `@clerk/nextjs/server` to get the current user's ID in Server Components.

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Use userId for data fetching
}
```

### Key Rules

- **ALWAYS** destructure `userId` from the `auth()` return value
- **ALWAYS** check for `!userId` and redirect unauthenticated users
- **ALWAYS** pass `userId` to data helper functions (see `/docs/data-fetching.md`)
- **DO NOT** use `auth()` in Client Components — it is a server-only function

## Clerk UI Components

Use Clerk's pre-built components for all auth UI. Import them from `@clerk/nextjs`.

| Component | Purpose |
|-----------|---------|
| `<SignInButton>` | Renders a sign-in trigger |
| `<SignUpButton>` | Renders a sign-up trigger |
| `<SignedIn>` | Renders children only when the user is signed in |
| `<SignedOut>` | Renders children only when the user is signed out |
| `<UserButton>` | Renders the user avatar with account management dropdown |

### Usage

```typescript
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

// Show sign-in/sign-up for unauthenticated users
<SignedOut>
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</SignedOut>

// Show user button for authenticated users
<SignedIn>
  <UserButton />
</SignedIn>
```

- **ALWAYS** use `mode="modal"` for sign-in and sign-up buttons to keep users on the current page
- **DO NOT** build custom sign-in or sign-up forms

## Protecting Pages

Every page that requires authentication **MUST** check for `userId` and redirect if not present.

```typescript
const { userId } = await auth();

if (!userId) {
  redirect("/");
}
```

- **DO NOT** rely solely on middleware for page protection — always check `userId` in the Server Component
- Redirect unauthenticated users to `/` (the home page)

## Summary

| Rule | Requirement |
|------|-------------|
| Auth provider | Clerk (`@clerk/nextjs`) ONLY |
| Get user ID (server) | `auth()` from `@clerk/nextjs/server` |
| Auth UI | Clerk built-in components ONLY |
| Sign-in/sign-up mode | `mode="modal"` |
| Page protection | Check `userId` + redirect in every protected Server Component |
| Unauthenticated redirect | `/` |
