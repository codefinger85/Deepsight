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
} from "@/components/ui/tabs"
import { type DateRange } from "@/components/ui/date-range-picker"
import {
  type DateFilter,
} from "@/lib/database"
import { MetricCard } from "./MetricCard"
import { DateFilterTabs } from "./DateFilterTabs"

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
  const currentTab = isCustomMode ? "" : (typeof currentFilter === 'string' ? currentFilter : "all")
  
  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="space-y-4">
        <DateFilterTabs 
          currentTab={currentTab}
          customRange={customRange}
          onTabChange={handleTabChange}
          onCustomRangeChange={handleCustomRangeChange}
          onCustomReset={handleCustomReset}
        />
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
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
