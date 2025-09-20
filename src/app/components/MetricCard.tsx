import * as React from "react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | number
  footerPrimary?: string
  footerSecondary?: string
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  footerPrimary, 
  footerSecondary, 
  className 
}: MetricCardProps) {
  return (
    <Card className={`@container/card border-border-primary ${className || ''}`}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <div className="flex items-end justify-start gap-3">
          <CardTitle className="text-xl font-medium tabular-nums @[250px]/card:text-2xl text-text-primary">
            {value}
          </CardTitle>
          {/* Badge placeholder - commented out for now */}
          {/* <Badge variant="outline" className="mb-1 px-1.5 py-0.5 font-medium text-text-secondary">
            +12.5%
          </Badge> */}
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-regular text-text-primary">
          {footerPrimary || "Data is coming stay tuned."}
        </div>
        <div className="text-text-secondary">
          {footerSecondary || "Data is coming stay tuned."}
        </div>
      </CardFooter>
    </Card>
  )
}