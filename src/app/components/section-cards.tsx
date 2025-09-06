import { Badge } from "@/components/ui/badge"
import {
  Card,
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
          <div className="flex items-end justify-start gap-3">
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
              ${(totalEarnings || 0).toFixed(2)}
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
              {(overallWinRate || 0)}%
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
              {(totalSessions || 0).toLocaleString()}
            </CardTitle>
            <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-semibold text-slate-600">
              +12.5%
            </Badge>
          </div>
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
          <div className="flex items-end justify-start gap-3">
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
              {(totalTrades || 0).toLocaleString()}
            </CardTitle>
            <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-semibold text-slate-600">
              +4.5%
            </Badge>
          </div>
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
