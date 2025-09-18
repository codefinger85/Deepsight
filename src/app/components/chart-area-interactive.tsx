"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartData } from "@/lib/database"

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

export function ChartAreaInteractive({ chartData }: ChartAreaInteractiveProps) {
  // Scale trades count for better visibility in performance chart
  const maxTrades = Math.max(...chartData.map(item => item.tradesCount))
  const scaledData = chartData.map(item => ({
    ...item,
    scaledTradesCount: maxTrades > 0 ? (item.tradesCount / maxTrades) * 35 : 0
  }))

  return (
    <Card className="@container/card">
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle>Trading Performance</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Daily win rate and trade volume over time
              </span>
              <span className="@[540px]/card:hidden">
                Win rate & volume
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
            <AreaChart data={scaledData}>
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
                      <div className="rounded-lg border bg-background p-3 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {new Date(label).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {data.winRate}%
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Total Trades:</span>
                            <span className="text-sm font-medium">{data.wins + data.losses}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Wins:</span>
                            <span className="text-sm font-medium">{data.wins}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Losses:</span>
                            <span className="text-sm font-medium">{data.losses}</span>
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
}
