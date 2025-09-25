"use client"

import * as React from "react"
import "./table-styles.css"

// Import extracted components
import { IconTrendingUp } from "@tabler/icons-react"
import { ConfirmationGrid } from "./ConfirmationGrid"
import { LossAnalysisGrid } from "./LossAnalysisGrid"
import { TradesGrid } from "./TradesGrid"
import { DayAnalysisGrid } from "./DayAnalysisGrid"
import { TableTabsNavigation } from "./TableTabsNavigation"
import { TableFilters } from "./TableFilters"
import { CustomBadge } from "./CustomBadge"
import { IconWithPopover } from "@/components/ui/icon-with-popover"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Info } from "lucide-react"



import { z } from "zod"
import { Filter, FilterType, filterViewToFilterOptions, FilterOption, WinPercentageRange, TotalCountRange } from "@/components/ui/filters"

import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"

export const lossReasonSchema = z.object({
  lossReason: z.string(),
  totalCount: z.number(),
  lossPercentage: z.number(),
  conf1: z.number(),
  conf2: z.number(),
  conf3: z.number(),
  conf4: z.number(),
  conf5: z.number(),
  conf6: z.number(),
  conf7: z.number(),
  conf8: z.number(),
})

export const winningConfirmationSchema = z.object({
  confirmation: z.string(),
  totalCount: z.number(),
  conf1: z.number(),
  conf2: z.number(),
  conf3: z.number(),
  conf4: z.number(),
  conf5: z.number(),
  conf6: z.number(),
  conf7: z.number(),
})

export const confirmationAnalysisSchema = z.object({
  confirmation: z.string(),
  totalCount: z.number(),
  winCount: z.number(),
  lossCount: z.number(),
  winPercentage: z.number(),
  conf1: z.string(),
  conf2: z.string(),
  conf3: z.string(),
  conf4: z.string(),
  conf5: z.string(),
  conf6: z.string(),
  conf7: z.string(),
})

export const tradesAnalysisSchema = z.object({
  confirmation: z.string(),
  totalCount: z.number(),
  winCount: z.number(),
  lossCount: z.number(),
  winPercentage: z.number(),
  conf1: z.string(),
  conf2: z.string(),
  conf3: z.string(),
  conf4: z.string(),
  conf5: z.string(),
  conf6: z.string(),
  conf7: z.string(),
})

export const dayAnalysisSchema = z.object({
  dayOfWeek: z.string(),
  totalTrades: z.number(),
  winCount: z.number(),
  lossCount: z.number(),
  winPercentage: z.number(),
})



export function DataTable({
  initialData,
}: {
  initialData: {
    lossReasonsData: z.infer<typeof lossReasonSchema>[]
    confirmationAnalysisData: z.infer<typeof confirmationAnalysisSchema>[]
    tradesAnalysisData: z.infer<typeof tradesAnalysisSchema>[]
    dayAnalysisData: z.infer<typeof dayAnalysisSchema>[]
  }
}) {
  const [activeTab, setActiveTab] = React.useState("trades")
  const [data, setData] = React.useState(initialData)

  // Update data when initialData changes (from global date filter)
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])
  const [filters, setFilters] = React.useState<Filter[]>([])

  // Generate confirmation type options from actual data
  const confirmationTypeOptions: FilterOption[] = React.useMemo(() => {
    const uniqueConfirmations = Array.from(new Set(data.confirmationAnalysisData.map(item => item.confirmation)))
    return uniqueConfirmations.map(confirmation => ({
      name: confirmation,
      icon: <IconTrendingUp className="size-3.5 text-text-secondary" />
    }))
  }, [data.confirmationAnalysisData])

  // Update the filter options for confirmation types
  React.useEffect(() => {
    filterViewToFilterOptions[FilterType.CONFIRMATION_TYPE] = confirmationTypeOptions
  }, [confirmationTypeOptions])

  // Filter confirmation analysis data based on active filters
  const filteredConfirmationData = React.useMemo(() => {
    if (activeTab !== "confirmations" || filters.length === 0) return data.confirmationAnalysisData
    
    return data.confirmationAnalysisData.filter(item => {
      return filters.every(filter => {
        // Skip filters with no values (they shouldn't filter anything)
        if (!filter.value || filter.value.length === 0) return true
        
        switch (filter.type) {
          case FilterType.CONFIRMATION_TYPE:
            return filter.value.includes(item.confirmation)
          case FilterType.WIN_PERCENTAGE:
            return filter.value.some(range => {
              switch (range) {
                case WinPercentageRange.NINETY_PLUS:
                  return item.winPercentage >= 90
                case WinPercentageRange.EIGHTY_PLUS:
                  return item.winPercentage >= 80
                case WinPercentageRange.SEVENTY_PLUS:
                  return item.winPercentage >= 70
                case WinPercentageRange.SIXTY_PLUS:
                  return item.winPercentage >= 60
                case WinPercentageRange.FIFTY_PLUS:
                  return item.winPercentage >= 50
                case WinPercentageRange.FORTY_PLUS:
                  return item.winPercentage >= 40
                case WinPercentageRange.THIRTY_PLUS:
                  return item.winPercentage >= 30
                default:
                  return false
              }
            })
          case FilterType.TOTAL_COUNT:
            return filter.value.some(range => {
              switch (range) {
                case TotalCountRange.HUNDRED_PLUS:
                  return item.totalCount >= 100
                case TotalCountRange.FIFTY_PLUS:
                  return item.totalCount >= 50
                case TotalCountRange.TWENTY_PLUS:
                  return item.totalCount >= 20
                case TotalCountRange.TEN_PLUS:
                  return item.totalCount >= 10
                case TotalCountRange.FIVE_PLUS:
                  return item.totalCount >= 5
                default:
                  return false
              }
            })
          default:
            return true
        }
      })
    })
  }, [data.confirmationAnalysisData, filters, activeTab])



  return (
    <Tabs
        defaultValue="trades"
        onValueChange={setActiveTab}
        className="w-full flex-col justify-start gap-6"
      >
      <TooltipProvider>
        <div className="flex items-center justify-between px-4 mb-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <TableTabsNavigation />
              <IconWithPopover 
                icon={Info} 
                side="bottom" 
                align="start"
                sideOffset={8}
                alignOffset={-4}
              >
                <p className="mb-2">Winrate is calculated excluding draws using the formula:</p>
                <div className="font-mono font-semibold text-[12px] tracking-tight border px-2 py-0.5 rounded-sm my-3 bg-bg-secondary w-fit">wins ÷ (wins + losses)</div>
                <p>Draws are calculated using:</p> 
                <div className="font-mono font-semibold text-[12px] tracking-tight border px-2 py-0.5 rounded-sm my-3 bg-bg-secondary w-fit">Total trades - wins - losses</div>
                <p className="mb-2">This leaves any leftover trades to be counted as draws.</p>
                <p>Draws are treated as neutrals, and are thus not shown in some tables.</p>

              </IconWithPopover>
            </div>
            <TableFilters 
              activeTab={activeTab}
              filters={filters}
              setFilters={setFilters}
              confirmationTypeOptions={confirmationTypeOptions}
            />
          </div>
        </div>
      </TooltipProvider>


      <TabsContent
        value="loss-reasons"
        className="relative flex flex-col gap-4 overflow-auto px-4"
      >
        <LossAnalysisGrid data={data.lossReasonsData} />
        <CustomBadge text={`Showing ${data.lossReasonsData.length} loss reasons`} />
      </TabsContent>

      <TabsContent
        value="confirmations"
        className="relative flex flex-col gap-4 overflow-auto px-4"
      >
        <ConfirmationGrid data={filteredConfirmationData} />
        <CustomBadge text={`Showing ${filteredConfirmationData.length} confirmations`} />
      </TabsContent>
      
      
      <TabsContent
        value="trades"
        className="relative flex flex-col gap-4 overflow-auto px-4"
      >
        <TradesGrid data={data.tradesAnalysisData} />
        <CustomBadge text="Showing trades analysis" />
      </TabsContent>

      <TabsContent
        value="days"
        className="relative flex flex-col gap-4 overflow-auto px-4"
      >
        {(() => {
          // Transform day analysis data to match DayAnalysisGrid component structure
          const processedDayData = data.dayAnalysisData.map(row => ({
            day: row.dayOfWeek,
            totalCount: row.totalTrades,
            winCount: row.winCount,
            lossCount: row.lossCount,
            winPercentage: row.winPercentage
          }));
          
          return <DayAnalysisGrid data={processedDayData} />;
        })()}
       <CustomBadge text={`Showing ${data.dayAnalysisData.length} days`} />
      </TabsContent>
    </Tabs>
  )
}

