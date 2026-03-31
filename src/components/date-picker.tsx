"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

export function DatePicker({ value, onChange, label, placeholder = "Pick a date" }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(value ? new Date(value) : undefined);
  }, [value]);

  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground ml-1">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal h-12 data-[empty=true]:text-muted-foreground"
            data-empty={!date}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              onChange(selectedDate ? selectedDate.toISOString().split('T')[0] : '');
              setOpen(false);
            }} 
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
