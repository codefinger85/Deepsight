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
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  getTotalEarnings,
  getOverallWinRate,
  getTotalSessions,
  getTotalTrades,
  getTotalWinningTrades,
  getTotalLosingTrades,
  getSessionsAbove60Percent,
  getSessionsBelow60Percent,
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
}

export function SectionCards({ initialData }: SectionCardsProps) {
  const [dateRange, setDateRange] = React.useState("all")
  const [data, setData] = React.useState(initialData)

  React.useEffect(() => {
    const fetchData = async () => {
      const range = dateRange === "all" ? undefined : dateRange
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
        getTotalEarnings(range),
        getOverallWinRate(range),
        getTotalSessions(range),
        getTotalTrades(range),
        getTotalWinningTrades(range),
        getTotalLosingTrades(range),
        getSessionsAbove60Percent(range),
        getSessionsBelow60Percent(range),
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
  }, [dateRange])
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h2 className="text-lg font-semibold">Dashboard Metrics</h2>
        <ToggleGroup
          type="single"
          value={dateRange}
          onValueChange={setDateRange}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="7d" className="text-xs px-2">7d</ToggleGroupItem>
          <ToggleGroupItem value="30d" className="text-xs px-2">30d</ToggleGroupItem>
          <ToggleGroupItem value="90d" className="text-xs px-2">90d</ToggleGroupItem>
          <ToggleGroupItem value="all" className="text-xs px-2">All</ToggleGroupItem>
        </ToggleGroup>
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
  )
}
