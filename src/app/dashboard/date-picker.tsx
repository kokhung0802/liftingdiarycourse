"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selectedDate: string;
}

export function DatePicker({ selectedDate }: DatePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const date = parse(selectedDate, "yyyy-MM-dd", new Date());

  function handleDateSelect(newDate: Date | undefined) {
    if (!newDate) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("date", format(newDate, "yyyy-MM-dd"));
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal sm:w-[280px]"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(date, "do MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
