import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NewWorkoutForm } from "./new-workout-form";

interface NewWorkoutPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function NewWorkoutPage({
  searchParams,
}: NewWorkoutPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const params = await searchParams;
  const defaultDate = params.date || format(new Date(), "yyyy-MM-dd");

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Create Workout</h1>
      <NewWorkoutForm defaultDate={defaultDate} />
    </div>
  );
}
