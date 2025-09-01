import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  totalEarnings: number;
  overallWinRate: number;
  totalSessions: number;
  totalTrades: number;
  totalWinningTrades: number;
  totalLosingTrades: number;
  sessionsAbove60: number;
  sessionsBelow60: number;
}

export function SectionCards({ 
  totalEarnings = 0, 
  overallWinRate = 0, 
  totalSessions = 0, 
  totalTrades = 0,
  totalWinningTrades = 0,
  totalLosingTrades = 0,
  sessionsAbove60 = 0,
  sessionsBelow60 = 0
}: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Earnings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${(totalEarnings || 0).toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
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
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {(overallWinRate || 0)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
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
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {(totalSessions || 0).toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sessions with more than 60% winrate: {sessionsAbove60.toLocaleString()}
          </div>
          <div className="text-muted-foreground">Sessions with less than 60% winrate: {sessionsBelow60.toLocaleString()}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Trades</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {(totalTrades || 0).toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total winning trades: {totalWinningTrades.toLocaleString()}
          </div>
          <div className="text-muted-foreground">Total losing trades: {totalLosingTrades.toLocaleString()}</div>
        </CardFooter>
      </Card>
    </div>
  )
}
