"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required").max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  notes: z.string().max(1000).optional(),
});

export async function createWorkoutAction(data: {
  name: string;
  date: string;
  notes?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const validated = createWorkoutSchema.parse(data);

  await createWorkout(userId, validated);

  revalidatePath("/dashboard");
  redirect(`/dashboard?date=${validated.date}`);
}
