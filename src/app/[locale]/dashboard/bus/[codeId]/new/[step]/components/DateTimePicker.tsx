"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "next-intl";

interface DateTimePickerProps {
  label: string;
  date: Date | undefined;
  time: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  required?: boolean;
  minDate?: Date;
}

export function DateTimePicker({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
  required = false,
  minDate,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("EventCreation.basicInfo");

  const formatDate = (date: Date | undefined) => {
    if (!date) return t("selectDate");
    return date.toLocaleDateString();
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor={`${label.toLowerCase()}-date-picker`} className="px-1">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={`${label.toLowerCase()}-date-picker`}
              className="w-40 justify-between font-normal"
            >
              {formatDate(date)}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                onDateChange(selectedDate);
                setOpen(false);
              }}
              disabled={(date) => (minDate ? date < minDate : false)}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor={`${label.toLowerCase()}-time-picker`} className="px-1">
          {t("time")}
        </Label>
        <Input
          type="time"
          id={`${label.toLowerCase()}-time-picker`}
          step="1"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          required={required}
        />
      </div>
    </div>
  );
}
