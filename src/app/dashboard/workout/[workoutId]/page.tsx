import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({
  params,
}: EditWorkoutPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { workoutId } = await params;
  const workoutIdNum = Number(workoutId);

  if (isNaN(workoutIdNum)) {
    notFound();
  }

  const workout = await getWorkoutById(workoutIdNum, userId);

  if (!workout) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Workout</h1>
      <EditWorkoutForm workout={workout} />
    </div>
  );
}
