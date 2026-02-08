import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkoutsByDate(userId: string, date: string) {
  const workoutsData = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.date, date)));

  const workoutsWithExercises = await Promise.all(
    workoutsData.map(async (workout) => {
      const workoutExercisesData = await db
        .select({
          id: workoutExercises.id,
          order: workoutExercises.order,
          notes: workoutExercises.notes,
          exercise: {
            id: exercises.id,
            name: exercises.name,
          },
        })
        .from(workoutExercises)
        .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
        .where(eq(workoutExercises.workoutId, workout.id))
        .orderBy(workoutExercises.order);

      const exercisesWithSets = await Promise.all(
        workoutExercisesData.map(async (we) => {
          const setsData = await db
            .select({
              id: sets.id,
              setNumber: sets.setNumber,
              weight: sets.weight,
              reps: sets.reps,
              completed: sets.completed,
            })
            .from(sets)
            .where(eq(sets.workoutExerciseId, we.id))
            .orderBy(sets.setNumber);

          return {
            ...we,
            sets: setsData,
          };
        })
      );

      return {
        ...workout,
        exercises: exercisesWithSets,
      };
    })
  );

  return workoutsWithExercises;
}
