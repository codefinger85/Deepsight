"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartData, type DateFilter } from "@/lib/database"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

interface ChartAreaInteractiveProps {
  chartData: ChartData[];
  dateFilter?: DateFilter;
}

export const description = "Trading performance over time"

const chartConfig = {
  wins: {
    label: "Wins",
    color: "var(--primary)",
  },
  losses: {
    label: "Losses", 
    color: "var(--primary)",
  },
} satisfies ChartConfig

export const ChartAreaInteractive = React.memo(function ChartAreaInteractive({ chartData, dateFilter = "90d" }: ChartAreaInteractiveProps) {
  // Filter data based on dateFilter prop (restored from commit 143d8c2)
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    
    // Handle custom date range objects
    if (typeof dateFilter === 'object' && dateFilter !== null && dateFilter.start && dateFilter.end) {
      return date >= dateFilter.start && date <= dateFilter.end
    }
    
    // Handle preset string filters (original logic from commit)
    if (typeof dateFilter === 'string' && dateFilter !== 'all' && dateFilter !== 'custom') {
      const referenceDate = new Date() // Use current date as reference
      let daysToSubtract = 90
      if (dateFilter === "7d") {
        daysToSubtract = 7
      } else if (dateFilter === "14d") {
        daysToSubtract = 14
      } else if (dateFilter === "21d") {
        daysToSubtract = 21
      } else if (dateFilter === "30d") {
        daysToSubtract = 30
      } else if (dateFilter === "90d") {
        daysToSubtract = 90
      }
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate
    }
    
    // Show all data for "all" or undefined
    return true
  })

  // Scale trades count for better visibility in performance chart
  const maxTrades = Math.max(...filteredData.map(item => item.tradesCount))
  const scaledData = filteredData.map(item => ({
    ...item,
    scaledTradesCount: maxTrades > 0 ? (item.tradesCount / maxTrades) * 35 : 0
  }))

  return (
    <Card className="@container/card">
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle className="font-medium">Trading Performance</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Daily winrate and trades volume over time
              </span>
              <span className="@[540px]/card:hidden">
                Winrate & volume
              </span>
            </CardDescription>
          </div>
      </CardHeader>
      
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={{
              winRate: {
                label: "Win Rate %",
                color: "var(--primary)",
              },
              tradesCount: {
                label: "Total Trades",
                color: "var(--primary)",
              },
            }}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart 
              data={scaledData}
            >
              <defs>
                <linearGradient id="fillWinRate" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-winRate)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-winRate)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillTrades" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-tradesCount)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-tradesCount)"
                    stopOpacity={0.15}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                domain={[0, 115]}
                hide={true}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={10}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background shadow-sm w-[160px]">
                        <div className="flex justify-between items-center mb-1 border-b px-3 py-2 bg-bg-secondary rounded-tr-lg rounded-tl-lg">
                          <span className="text-sm font-medium text-text-secondary">
                            {new Date(label).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {data.winRate}%
                          </span>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-text-secondary">Total Trades:</span>
                            <span className="text-sm font-normal text-text-secondary">{data.wins + data.losses}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="text-sm text-text-secondary">Losses:</span>
                            <span className="text-sm font-normal text-text-secondary">{data.losses}</span>
                          </div>
                          <div className="flex flex-row items-center justify-between border-t pt-2 mt-2">
                            <span className="text-sm text-text-secondary">Wins:</span>
                            <span className="text-sm font-medium text-text-secondary">{data.wins}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null;
                }}
              />
              <Area
                dataKey="scaledTradesCount"
                type="natural"
                fill="url(#fillTrades)"
                stroke="var(--color-tradesCount)"
                stackId="background"
              />
              <Area
                dataKey="winRate"
                type="natural"
                fill="url(#fillWinRate)"
                stroke="var(--color-winRate)"
                stackId="main"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
    </Card>
  )
})
