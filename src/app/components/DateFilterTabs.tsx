import * as React from "react"
import {
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker"
import { format } from "date-fns"
import { CustomBadge } from "./CustomBadge"

interface DateFilterTabsProps {
  currentTab: string
  customRange: DateRange
  onTabChange: (value: string) => void
  onCustomRangeChange: (range: DateRange) => void
  onCustomReset: () => void
}

export function DateFilterTabs({ 
  currentTab, 
  customRange, 
  onTabChange, 
  onCustomRangeChange, 
  onCustomReset 
}: DateFilterTabsProps) {
  return (
    <div className="flex justify-end px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Selected date range display */}
        {customRange.start && customRange.end && (
          <CustomBadge 
            text={`${format(customRange.start, "MMM d")} - ${format(customRange.end, "MMM d, yyyy")}`}
            className="ml-0" 
          />
        )}
        <div className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex bg-bg-primary border-border-primary border inline-flex h-9 items-center justify-center rounded-lg p-1 text-text-tertiary">
          <TabsList className="bg-transparent border-0 pr-3">
            <TabsTrigger value="7d" className="font-normal text-text-tertiary hover:text-text-secondary data-[state=active]:font-normal data-[state=active]:text-text-secondary">7d</TabsTrigger>
            <TabsTrigger value="14d" className="font-normal text-text-tertiary hover:text-text-secondary data-[state=active]:font-normal data-[state=active]:text-text-secondary">14d</TabsTrigger>
            <TabsTrigger value="21d" className="font-normal text-text-tertiary hover:text-text-secondary data-[state=active]:font-normal data-[state=active]:text-text-secondary">21d</TabsTrigger>
            <TabsTrigger value="30d" className="font-normal text-text-tertiary hover:text-text-secondary data-[state=active]:font-normal data-[state=active]:text-text-secondary">30d</TabsTrigger>
            <TabsTrigger value="90d" className="font-normal text-text-tertiary hover:text-text-secondary data-[state=active]:font-normal data-[state=active]:text-text-secondary">90d</TabsTrigger>
            <TabsTrigger value="all" className="font-normal text-text-tertiary hover:text-text-secondary data-[state=active]:font-normal data-[state=active]:text-text-secondary">All</TabsTrigger>
          </TabsList>
          <DateRangePicker
            selectedRange={customRange}
            onRangeChange={onCustomRangeChange}
            onReset={onCustomReset}
            isActive={!!(customRange.start && customRange.end)}
          />
        </div>
      </div>
    </div>
  )
}