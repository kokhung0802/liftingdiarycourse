# Data Fetching

## Critical Rules

### Server Components Only

**ALL data fetching in this application MUST be done via Server Components.**

- **DO NOT** fetch data in Client Components
- **DO NOT** fetch data via Route Handlers (API routes)
- **ONLY** fetch data in Server Components

This is non-negotiable. Server Components provide better security, performance, and simplify the data flow.

### Database Access via /data Directory

All database queries **MUST** be done through helper functions located in the `/data` directory.

```
src/
  data/
    users.ts      # User-related queries
    workouts.ts   # Workout-related queries
    exercises.ts  # Exercise-related queries
    ...
```

**DO NOT** write database queries directly in components or anywhere else. Always create or use existing helper functions in `/data`.

### Drizzle ORM Only

**ALL database queries MUST use Drizzle ORM.**

- **DO NOT** use raw SQL queries
- **DO NOT** use `sql` template literals for full queries
- **ALWAYS** use Drizzle's query builder

```typescript
// CORRECT - Using Drizzle ORM
const workouts = await db
  .select()
  .from(workoutsTable)
  .where(eq(workoutsTable.userId, userId));

// WRONG - Raw SQL
const workouts = await db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`);
```

## User Data Isolation (CRITICAL)

**A logged-in user can ONLY access their own data. They MUST NOT be able to access any other user's data.**

This is a critical security requirement. Every data helper function MUST:

1. Accept the authenticated user's ID as a parameter
2. Filter ALL queries by the user's ID
3. Never expose data from other users

### Implementation Pattern

```typescript
// src/data/workouts.ts

import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// CORRECT - Always filter by userId
export async function getWorkouts(userId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

// CORRECT - Filter by both workout ID AND user ID
export async function getWorkoutById(workoutId: string, userId: string) {
  return db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId)
      )
    );
}

// WRONG - No user filtering, exposes all users' data
export async function getAllWorkouts() {
  return db.select().from(workouts);
}

// WRONG - Only filtering by workout ID allows users to access others' data
export async function getWorkoutById(workoutId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.id, workoutId));
}
```

### Usage in Server Components

```typescript
// src/app/workouts/page.tsx

import { getWorkouts } from "@/data/workouts";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WorkoutsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // CORRECT - Pass the authenticated user's ID
  const workouts = await getWorkouts(session.user.id);

  return (
    <div>
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
```

## Summary

| Rule | Requirement |
|------|-------------|
| Data fetching location | Server Components ONLY |
| Database queries | `/data` directory helper functions ONLY |
| ORM | Drizzle ORM ONLY (no raw SQL) |
| User data access | Own data ONLY (always filter by userId) |
