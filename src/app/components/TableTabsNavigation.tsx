import * as React from "react"
import {
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function TableTabsNavigation() {
  return (
    <TabsList className="bg-white border border-border-primary">
      <TabsTrigger value="trades" className="font-normal text-text-tertiary hover:text-text-secondary data-[state=active]:font-normal data-[state=active]:text-text-secondary">Trades</TabsTrigger>
      <TabsTrigger value="confirmations" className="font-normal text-text-tertiary hover:text-text-secondary data-[state=active]:font-normal data-[state=active]:text-text-secondary">Confirmations</TabsTrigger>
      <TabsTrigger value="loss-reasons" className="font-normal text-text-tertiary hover:text-text-secondary data-[state=active]:font-normal data-[state=active]:text-text-secondary">Loss reasons</TabsTrigger>
      <TabsTrigger value="days" className="font-normal text-text-tertiary hover:text-text-secondary data-[state=active]:font-normal data-[state=active]:text-text-secondary">Days</TabsTrigger>
    </TabsList>
  )
}