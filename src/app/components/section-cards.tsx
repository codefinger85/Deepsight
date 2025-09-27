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
    totalDraws: number;
    sessionsAbove60: number;
    sessionsBelow60: number;
    bestSessionEarnings: number;
    worstSessionEarnings: number;
    averageSessionEarnings: number;
    bestSessionWinRate: number;
    worstSessionWinRate: number;
    profitableSessions: number;
    lossSessions: number;
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
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <MetricCard 
          title="Total Earnings"
          value={`$ ${(initialData.totalEarnings || 0).toFixed(2)}`}
          footerPrimary={`Best session: $${(initialData.bestSessionEarnings || 0).toFixed(2)}`}
          footerSecondary={`Average per session: $${(initialData.averageSessionEarnings || 0).toFixed(2)}`}
        />
        <MetricCard 
          title="Overall Win Rate"
          value={`${(initialData.overallWinRate || 0)}%`}
          footerPrimary={`Best session: ${(initialData.bestSessionWinRate || 0)}%`}
          footerSecondary={`Worst session: ${(initialData.worstSessionWinRate || 0)}%`}
        />
        <MetricCard 
          title="Total Sessions"
          value={(initialData.totalSessions || 0).toLocaleString()}
          footerPrimary={`Sessions 50% winrate and above: ${(initialData.profitableSessions || 0).toLocaleString()}`}
          footerSecondary={`Sessions below 50% winrate: ${(initialData.lossSessions || 0).toLocaleString()}`}
        />
        <MetricCard 
          title="Total Trades"
          value={(initialData.totalTrades || 0).toLocaleString()}
          footerPrimary={`Total wins: ${initialData.totalWinningTrades.toLocaleString()}`}
          footerSecondary={`Losses: ${initialData.totalLosingTrades.toLocaleString()}\u00A0 | \u00A0Draws: ${(initialData.totalDraws || 0).toLocaleString()}`}
        />
      </div>
    </div>
    </Tabs>
  )
}
