"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required").max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  notes: z.string().max(1000).optional(),
});

export async function updateWorkoutAction(
  workoutId: number,
  data: {
    name: string;
    date: string;
    notes?: string;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const validated = updateWorkoutSchema.parse(data);

  await updateWorkout(workoutId, userId, validated);

  revalidatePath("/dashboard");
  redirect(`/dashboard?date=${validated.date}`);
}
