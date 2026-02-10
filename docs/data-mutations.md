# Data Mutations Coding Standards

## Critical Rules

### Server Actions Only

**ALL data mutations MUST be done via Server Actions.**

- **DO NOT** mutate data in Client Components directly
- **DO NOT** mutate data via Route Handlers (API routes)
- **ONLY** mutate data through Server Actions

### Colocated `actions.ts` Files

**ALL Server Actions MUST live in a colocated `actions.ts` file next to the `page.tsx` that uses them.**

```
src/app/
  dashboard/
    page.tsx
    actions.ts      # Server actions for the dashboard page
  workouts/
    create/
      page.tsx
      actions.ts    # Server actions for the create workout page
```

- **DO NOT** define Server Actions inline within components
- **DO NOT** create a shared/global actions file
- Every `actions.ts` file **MUST** start with the `"use server"` directive at the top of the file

```typescript
"use server";

// All exported functions in this file are Server Actions
```

### Data Helper Functions in `/data` Directory

**ALL database calls inside Server Actions MUST go through helper functions in the `src/data/` directory.**

- **DO NOT** write database queries directly in Server Actions
- **DO NOT** import `db` directly in `actions.ts` files
- **ALWAYS** create or use existing helper functions in `/data`

```typescript
// src/data/workouts.ts

import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// CORRECT - Data helper wrapping a Drizzle query
export async function createWorkout(userId: string, data: { name: string; date: string }) {
  return db.insert(workouts).values({
    userId,
    name: data.name,
    date: data.date,
  }).returning();
}

export async function deleteWorkout(workoutId: number, userId: string) {
  return db
    .delete(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)
      )
    );
}
```

### Drizzle ORM Only

**ALL database mutations MUST use Drizzle ORM.**

- **DO NOT** use raw SQL for inserts, updates, or deletes
- **ALWAYS** use Drizzle's `insert()`, `update()`, and `delete()` methods

## Server Action Parameters

### Typed Parameters (No FormData)

**ALL Server Action parameters MUST be explicitly typed. DO NOT use `FormData` as a parameter type.**

```typescript
// CORRECT - Explicitly typed parameters
export async function createWorkout(name: string, date: string) { ... }

// CORRECT - Object parameter with explicit type
export async function createWorkout(data: { name: string; date: string }) { ... }

// WRONG - FormData parameter
export async function createWorkout(formData: FormData) { ... }
```

### Zod Validation (Required)

**ALL Server Actions MUST validate their arguments using [Zod](https://zod.dev/).**

- **DO NOT** trust incoming data without validation
- **ALWAYS** define a Zod schema for each Server Action's parameters
- **ALWAYS** parse the arguments at the top of the Server Action before any other logic

#### Defining Schemas

Define Zod schemas in the same `actions.ts` file, above the Server Action that uses them.

```typescript
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function createWorkoutAction(data: { name: string; date: string }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const validated = createWorkoutSchema.parse(data);

  await createWorkout(userId, validated);
}
```

#### Validation Rules

- Call `.parse()` to validate — this throws a `ZodError` on invalid input
- Validate **before** authenticating or doing any other work only when it makes sense; otherwise validate immediately after auth
- Keep schemas colocated with their Server Action in the same `actions.ts` file
- **DO NOT** export Zod schemas — they are internal to the actions file

## Full Pattern

Below is the complete pattern showing how a Server Action, data helper, and page fit together.

### 1. Data Helper (`src/data/workouts.ts`)

```typescript
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(userId: string, data: { name: string; date: string }) {
  return db.insert(workouts).values({
    userId,
    name: data.name,
    date: data.date,
  }).returning();
}
```

### 2. Server Action (`src/app/workouts/create/actions.ts`)

```typescript
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function createWorkoutAction(data: { name: string; date: string }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const validated = createWorkoutSchema.parse(data);

  await createWorkout(userId, validated);

  revalidatePath("/dashboard");
}
```

### 3. Page / Component Usage

```typescript
import { createWorkoutAction } from "./actions";

// Call the server action from a Client Component or form
await createWorkoutAction({ name: "Push Day", date: "2025-09-01" });
```

## User Data Isolation (CRITICAL)

The same rules from `/docs/data-fetching.md` apply to mutations:

- **ALWAYS** scope mutations to the authenticated user's `userId`
- Data helpers **MUST** accept `userId` and filter by it
- **NEVER** allow a user to mutate another user's data

## Summary

| Rule | Requirement |
|------|-------------|
| Mutation method | Server Actions ONLY |
| Action file location | Colocated `actions.ts` next to `page.tsx` |
| File directive | `"use server"` at top of every `actions.ts` |
| Database calls | Via `/data` helper functions ONLY |
| ORM | Drizzle ORM ONLY (no raw SQL) |
| Parameter types | Explicit types ONLY (no `FormData`) |
| Validation | Zod `.parse()` on ALL arguments |
| User data access | Own data ONLY (always filter by `userId`) |
