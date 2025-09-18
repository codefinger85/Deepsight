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
  onDateFilterChange: (filter: DateFilter) => void;
}

export function SectionCards({ initialData, onDateFilterChange }: SectionCardsProps) {
  const [dateFilter, setDateFilter] = React.useState<DateFilter>("all")
  const [customRange, setCustomRange] = React.useState<DateRange>({ start: null, end: null })
  const [data, setData] = React.useState(initialData)

  React.useEffect(() => {
    const fetchData = async () => {
      const filter = dateFilter === "all" ? undefined : dateFilter
      const [
        totalEarnings,
        overallWinRate,
        totalSessions,
        totalTrades,
        totalWinningTrades,
        totalLosingTrades,
        sessionsAbove60,
        sessionsBelow60,
      ] = await Promise.all([
        getTotalEarnings(filter),
        getOverallWinRate(filter),
        getTotalSessions(filter),
        getTotalTrades(filter),
        getTotalWinningTrades(filter),
        getTotalLosingTrades(filter),
        getSessionsAbove60Percent(filter),
        getSessionsBelow60Percent(filter),
      ])

      setData({
        totalEarnings,
        overallWinRate,
        totalSessions,
        totalTrades,
        totalWinningTrades,
        totalLosingTrades,
        sessionsAbove60,
        sessionsBelow60,
      })
    }

    fetchData()
    // Notify parent of date filter change
    onDateFilterChange(dateFilter)
  }, [dateFilter, onDateFilterChange])

  const handleTabChange = (value: string) => {
    setDateFilter(value)
    setCustomRange({ start: null, end: null }) // Reset custom range when switching to presets
  }

  const handleCustomRangeChange = (range: DateRange) => {
    setCustomRange(range)
    if (range.start && range.end) {
      setDateFilter(range)
    }
  }

  const handleCustomReset = () => {
    setCustomRange({ start: null, end: null })
    setDateFilter("all")
  }

  const isCustomMode = typeof dateFilter === 'object' && dateFilter !== null
  const currentTab = isCustomMode ? "all" : (typeof dateFilter === 'string' ? dateFilter : "all")
  
  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="space-y-4">
        <div className="flex justify-end px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Selected date range display */}
            {customRange.start && customRange.end && (
              <div className="text-sm font-medium text-slate-700">
                {format(customRange.start, "MMM d")} - {format(customRange.end, "MMM d, yyyy")}
              </div>
            )}
            <div className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex bg-white border inline-flex h-9 items-center justify-center rounded-lg p-1 text-muted-foreground">
              <TabsList className="bg-transparent border-0 pr-3">
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="14d">14d</TabsTrigger>
                <TabsTrigger value="21d">21d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="90d">90d</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
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
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Earnings</CardDescription>
            <div className="flex items-end justify-start gap-3">
              <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
                ${(data.totalEarnings || 0).toFixed(2)}
              </CardTitle>
              <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-semibold text-slate-600">
                +12.5%
              </Badge>
            </div>
          </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Data is coming stay tuned.
          </div>
          <div className="text-muted-foreground">
            Data is coming stay tuned.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Overall Win Rate</CardDescription>
          <div className="flex items-end justify-start gap-3">
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {(data.overallWinRate || 0)}%
            </CardTitle>
            <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-semibold text-slate-600">
              -20%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Data is coming stay tuned.
          </div>
          <div className="text-muted-foreground">
            Data is coming stay tuned.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Sessions</CardDescription>
          <div className="flex items-end justify-start gap-3">
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {(data.totalSessions || 0).toLocaleString()}
            </CardTitle>
            <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-semibold text-slate-600">
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sessions with more than 60% winrate: {data.sessionsAbove60.toLocaleString()}
          </div>
          <div className="text-muted-foreground">Sessions with less than 60% winrate: {data.sessionsBelow60.toLocaleString()}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Trades</CardDescription>
          <div className="flex items-end justify-start gap-3">
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {(data.totalTrades || 0).toLocaleString()}
            </CardTitle>
            <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-semibold text-slate-600">
              +4.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total winning trades: {data.totalWinningTrades.toLocaleString()}
          </div>
          <div className="text-muted-foreground">Total losing trades: {data.totalLosingTrades.toLocaleString()}</div>
        </CardFooter>
      </Card>
      </div>
    </div>
    </Tabs>
  )
}
