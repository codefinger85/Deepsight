"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker"
import { format } from "date-fns"
import {
  getTotalEarnings,
  getOverallWinRate,
  getTotalSessions,
  getTotalTrades,
  getTotalWinningTrades,
  getTotalLosingTrades,
  getSessionsAbove60Percent,
  getSessionsBelow60Percent,
  type DateFilter,
} from "@/lib/database"
import { MetricCard } from "./MetricCard"

interface SectionCardsProps {
  initialData: {
    totalEarnings: number;
    overallWinRate: number;
    totalSessions: number;
    totalTrades: number;
    totalWinningTrades: number;
    totalLosingTrades: number;
    sessionsAbove60: number;
    sessionsBelow60: number;
  };
  currentFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
}

export function SectionCards({ initialData, currentFilter, onDateFilterChange }: SectionCardsProps) {
  const [customRange, setCustomRange] = React.useState<DateRange>({ start: null, end: null })

  const handleTabChange = (value: string) => {
    onDateFilterChange(value)
    setCustomRange({ start: null, end: null }) // Reset custom range when switching to presets
  }

  const handleCustomRangeChange = (range: DateRange) => {
    setCustomRange(range)
    if (range.start && range.end) {
      onDateFilterChange(range)
    }
  }

  const handleCustomReset = () => {
    setCustomRange({ start: null, end: null })
    onDateFilterChange("all")
  }

  const isCustomMode = typeof currentFilter === 'object' && currentFilter !== null
  const currentTab = isCustomMode ? "all" : (typeof currentFilter === 'string' ? currentFilter : "all")
  
  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="space-y-4">
        <div className="flex justify-end px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Selected date range display */}
            {customRange.start && customRange.end && (
              <div className="text-xs font-regualr text-text-secondary border border-border-primary w-fit rounded-md py-1 px-2 bg-bg-secondary">
                {format(customRange.start, "MMM d")} - {format(customRange.end, "MMM d, yyyy")}
              </div>
            )}
            <div className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex bg-bg-primary border-border-primary border inline-flex h-9 items-center justify-center rounded-lg p-1 text-text-tertiary">
              <TabsList className="bg-transparent border-0 pr-3">
                <TabsTrigger value="7d" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">7d</TabsTrigger>
                <TabsTrigger value="14d" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">14d</TabsTrigger>
                <TabsTrigger value="21d" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">21d</TabsTrigger>
                <TabsTrigger value="30d" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">30d</TabsTrigger>
                <TabsTrigger value="90d" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">90d</TabsTrigger>
                <TabsTrigger value="all" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">All</TabsTrigger>
              </TabsList>
              <DateRangePicker
                selectedRange={customRange}
                onRangeChange={handleCustomRangeChange}
                onReset={handleCustomReset}
              />
            </div>
          </div>
        </div>
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <MetricCard 
          title="Total Earnings"
          value={`$ ${(initialData.totalEarnings || 0).toFixed(2)}`}
          footerPrimary="Data is coming stay tuned."
          footerSecondary="Data is coming stay tuned."
        />
        <MetricCard 
          title="Overall Win Rate"
          value={`${(initialData.overallWinRate || 0)}%`}
          footerPrimary="Data is coming stay tuned."
          footerSecondary="Data is coming stay tuned."
        />
        <MetricCard 
          title="Total Sessions"
          value={(initialData.totalSessions || 0).toLocaleString()}
          footerPrimary={`Sessions over 60% winrate: ${initialData.sessionsAbove60.toLocaleString()}`}
          footerSecondary={`Sessions below 60% winrate: ${initialData.sessionsBelow60.toLocaleString()}`}
        />
        <MetricCard 
          title="Total Trades"
          value={(initialData.totalTrades || 0).toLocaleString()}
          footerPrimary={`Total winning trades: ${initialData.totalWinningTrades.toLocaleString()}`}
          footerSecondary={`Total losing trades: ${initialData.totalLosingTrades.toLocaleString()}`}
        />
      </div>
    </div>
    </Tabs>
  )
}
