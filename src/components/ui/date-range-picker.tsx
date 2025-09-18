"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

interface DateRange {
  start: Date | null
  end: Date | null
}

interface DateRangePickerProps {
  selectedRange: DateRange
  onRangeChange: (range: DateRange) => void
  onReset: () => void
}

export function DateRangePicker({ selectedRange, onRangeChange, onReset }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-3 pr-2">
      <div className="h-6 w-px bg-slate-200 mr-1"></div>
      
      <button
        onClick={onReset}
        className="toolbar-action-reset w-3.5 h-3.5 text-slate-400 hover:text-slate-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      </button>
      
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors duration-200 ease-in-out">
            <CalendarIcon className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0"
          align="end"
          side="bottom"
          sideOffset={5}
          alignOffset={-10}
          collisionPadding={10}
          avoidCollisions={true}
        >
          <Calendar
            mode="range"
            selected={{
              from: selectedRange.start || undefined,
              to: selectedRange.end || undefined,
            }}
            onSelect={(range) => {
              onRangeChange({
                start: range?.from || null,
                end: range?.to || null,
              });
              if (range?.to) {
                const popoverTrigger = document.querySelector('[data-state="open"]');
                if (popoverTrigger) {
                  (popoverTrigger as HTMLElement).click();
                }
              }
            }}
            numberOfMonths={2}
            className="rounded-lg border border-gray-200"
            weekStartsOn={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export type { DateRange }