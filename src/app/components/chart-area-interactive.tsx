"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartData } from "@/lib/database"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartTab, setChartTab] = React.useState("performance")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date() // Use current date as reference
    let daysToSubtract = 90
    if (timeRange === "7d") {
      daysToSubtract = 7
    } else if (timeRange === "14d") {
      daysToSubtract = 14
    } else if (timeRange === "21d") {
      daysToSubtract = 21
    } else if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "90d") {
      daysToSubtract = 90
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  // Scale trades count for better visibility in performance chart
  const maxTrades = Math.max(...filteredData.map(item => item.tradesCount))
  const scaledData = filteredData.map(item => ({
    ...item,
    scaledTradesCount: maxTrades > 0 ? (item.tradesCount / maxTrades) * 35 : 0
  }))

  return (
    <Tabs value={chartTab} onValueChange={setChartTab} className="@container/card">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <CardTitle>Trading Performance</CardTitle>
              <CardDescription>
                <span className="hidden @[540px]/card:block">
                  {chartTab === "performance" ? "Daily win rate and trade volume over time" : "Daily win and loss patterns over time"}
                </span>
                <span className="@[540px]/card:hidden">
                  {chartTab === "performance" ? "Win rate & volume" : "Win/Loss patterns"}
                </span>
              </CardDescription>
            </div>
            <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex bg-white border">
              <TabsTrigger value="performance">Winrate</TabsTrigger>
              <TabsTrigger value="counts">Counts</TabsTrigger>
            </TabsList>
          </div>
        <CardAction>
          <div className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex bg-white border inline-flex items-center justify-center rounded-md p-1 text-muted-foreground">
            <button 
              onClick={() => setTimeRange("7d")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${timeRange === "7d" ? "bg-background text-foreground shadow" : ""}`}
            >
              7d
            </button>
            <button 
              onClick={() => setTimeRange("14d")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${timeRange === "14d" ? "bg-background text-foreground shadow" : ""}`}
            >
              14d
            </button>
            <button 
              onClick={() => setTimeRange("21d")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${timeRange === "21d" ? "bg-background text-foreground shadow" : ""}`}
            >
              21d
            </button>
            <button 
              onClick={() => setTimeRange("30d")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${timeRange === "30d" ? "bg-background text-foreground shadow" : ""}`}
            >
              30d
            </button>
            <button 
              onClick={() => setTimeRange("90d")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${timeRange === "90d" ? "bg-background text-foreground shadow" : ""}`}
            >
              90d
            </button>
          </div>
        </CardAction>
      </CardHeader>
      
      <TabsContent value="performance">
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
      </TabsContent>

      <TabsContent value="counts">
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillWins" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-wins)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-wins)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillLosses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-losses)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-losses)"
                  stopOpacity={0.1}
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
              domain={['dataMin', 'dataMax']}
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
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--color-wins)'}} />
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">Wins:</span>
                            <span className="text-sm font-medium">{data.wins}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--color-losses)'}} />
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">Losses:</span>
                            <span className="text-sm font-medium">{data.losses}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null;
              }}
            />
            <Area
              dataKey="losses"
              type="natural"
              fill="url(#fillLosses)"
              stroke="var(--color-losses)"
              stackId="a"
            />
            <Area
              dataKey="wins"
              type="natural"
              fill="url(#fillWins)"
              stroke="var(--color-wins)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        </CardContent>
      </TabsContent>
      </Card>
    </Tabs>
  )
}
