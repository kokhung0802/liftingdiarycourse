import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "./date-picker";
import { getWorkoutsByDate } from "@/data/workouts";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const params = await searchParams;
  const selectedDate = params.date || format(new Date(), "yyyy-MM-dd");

  const workouts = await getWorkoutsByDate(userId, selectedDate);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Workout Log</h1>

      <div className="mb-8">
        <DatePicker selectedDate={selectedDate} />
      </div>

      <div className="space-y-4">
        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-center">
                No workouts logged for this date.
              </p>
              <Button className="mt-4">Log a Workout</Button>
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) =>
            workout.exercises.map((exercise) => (
              <Card key={exercise.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {exercise.exercise.name}
                  </CardTitle>
                  <CardDescription>
                    {exercise.sets.length} sets logged
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exercise.sets.map((set) => (
                      <div
                        key={set.id}
                        className="bg-muted flex items-center justify-between rounded-md px-3 py-2 text-sm"
                      >
                        <span className="text-muted-foreground font-medium">
                          Set {set.setNumber}
                        </span>
                        <span>
                          {set.weight} lbs x {set.reps} reps
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )
        )}
      </div>

      <div className="mt-8">
        <Button className="w-full">
          <Dumbbell className="mr-2 h-4 w-4" />
          Add Exercise
        </Button>
      </div>
    </div>
  );
}
