"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock workout data for UI demonstration
const mockWorkouts = [
  {
    id: "1",
    name: "Bench Press",
    sets: [
      { weight: 135, reps: 10 },
      { weight: 155, reps: 8 },
      { weight: 175, reps: 6 },
    ],
  },
  {
    id: "2",
    name: "Squat",
    sets: [
      { weight: 185, reps: 8 },
      { weight: 205, reps: 6 },
      { weight: 225, reps: 4 },
    ],
  },
  {
    id: "3",
    name: "Deadlift",
    sets: [
      { weight: 225, reps: 5 },
      { weight: 275, reps: 3 },
      { weight: 315, reps: 1 },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Workout Log</h1>

      <div className="mb-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal sm:w-[280px]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "do MMM yyyy") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        {mockWorkouts.length === 0 ? (
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
          mockWorkouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{workout.name}</CardTitle>
                <CardDescription>
                  {workout.sets.length} sets logged
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {workout.sets.map((set, index) => (
                    <div
                      key={index}
                      className="bg-muted flex items-center justify-between rounded-md px-3 py-2 text-sm"
                    >
                      <span className="text-muted-foreground font-medium">
                        Set {index + 1}
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
