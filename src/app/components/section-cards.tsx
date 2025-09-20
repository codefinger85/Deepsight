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
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
        <Card className="@container/card border-border-primary">
          <CardHeader>
            <CardDescription>Total Earnings</CardDescription>
            <div className="flex items-end justify-start gap-3">
              <CardTitle className="text-xl font-medium tabular-nums @[250px]/card:text-2xl text-text-primary">
                $ {(initialData.totalEarnings || 0).toFixed(2)}
              </CardTitle>
              {/* <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-medium text-text-secondary">
                +12.5%
              </Badge> */}
            </div>
          </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-regular text-text-primary">
            Data is coming stay tuned.
          </div>
          <div className="text-text-secondary">
            Data is coming stay tuned.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Overall Win Rate</CardDescription>
          <div className="flex items-end justify-start gap-3">
            <CardTitle className="text-xl font-medium tabular-nums @[250px]/card:text-2xl text-text-primary">
              {(initialData.overallWinRate || 0)}%
            </CardTitle>
            {/* <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-medium text-text-secondary">
              -20%
            </Badge> */}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-regular text-text-primary">
            Data is coming stay tuned.
          </div>
          <div className="text-text-secondary">
            Data is coming stay tuned.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Sessions</CardDescription>
          <div className="flex items-end justify-start gap-3">
            <CardTitle className="text-xl font-medium tabular-nums @[250px]/card:text-2xl text-text-primary">
              {(initialData.totalSessions || 0).toLocaleString()}
            </CardTitle>
            {/* <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-medium text-text-secondary">
              +12.5%
            </Badge> */}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-regular text-text-primary">
            Sessions over 60% winrate: {initialData.sessionsAbove60.toLocaleString()}
          </div>
          <div className="text-text-secondary">Sessions below 60% winrate: {initialData.sessionsBelow60.toLocaleString()}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Trades</CardDescription>
          <div className="flex items-end justify-start gap-3">
            <CardTitle className="text-xl font-medium tabular-nums @[250px]/card:text-2xl text-text-primary">
              {(initialData.totalTrades || 0).toLocaleString()}
            </CardTitle>
            {/* <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-medium text-text-secondary">
              +4.5%
            </Badge> */}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-regular text-text-primary">
            Total winning trades: {initialData.totalWinningTrades.toLocaleString()}
          </div>
          <div className="text-text-secondary">Total losing trades: {initialData.totalLosingTrades.toLocaleString()}</div>
        </CardFooter>
      </Card>
      
      {/* Test MetricCard component */}
      <MetricCard 
        title="Test Card"
        value="$ 1,234.56"
        footerPrimary="This is a test of the MetricCard component"
        footerSecondary="It should look identical to the other cards"
      />
      
      </div>
    </div>
    </Tabs>
  )
}
