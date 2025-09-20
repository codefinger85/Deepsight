"use client"

import * as React from "react"
import "./table-styles.css"

// Import extracted components
import { parseRangeData, calculateRangeWinPercentage } from "./RangeCell"
import { IconTrendingUp } from "@tabler/icons-react"
import { ConfirmationGrid } from "./ConfirmationGrid"
import { LossAnalysisGrid } from "./LossAnalysisGrid"
import { TradesGrid } from "./TradesGrid"
import { DayAnalysisGrid } from "./DayAnalysisGrid"
import { PlusCircle, Target, Tag, BarChart3 } from "lucide-react"



import { z } from "zod"
import Filters, { Filter, FilterType, filterViewToFilterOptions, FilterOption, WinPercentageRange, TotalCountRange } from "@/components/ui/filters"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
      <div className="flex items-center justify-between px-4 lg:px-6 mb-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="trades">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trades">Trades</SelectItem>
            <SelectItem value="confirmations">Confirmations</SelectItem>
            <SelectItem value="loss-reasons">Loss reasons</SelectItem>
            <SelectItem value="days">Days</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between w-full">
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex bg-white border border-border-primary">
            <TabsTrigger value="trades" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">Trades</TabsTrigger>
            <TabsTrigger value="confirmations" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">Confirmations</TabsTrigger>
            <TabsTrigger value="loss-reasons" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">Loss reasons</TabsTrigger>
            <TabsTrigger value="days" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">Days</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {/* Active Filters Display - Only show for Confirmations tab */}
            {activeTab === "confirmations" && filters.length > 0 && (
              <div className="flex items-center gap-2">
                <Filters filters={filters} setFilters={setFilters} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters([])}
                  className="text-text-secondary hover:text-text-primary"
                >
                  Clear All
                </Button>
              </div>
            )}
            {/* Add Filter button - Only show for Confirmations tab */}
            {activeTab === "confirmations" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <PlusCircle className="size-4" />
                    <span className="hidden lg:inline">Add Filter</span>
                    <span className="lg:hidden">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem
                    onClick={() => {
                      const newFilter: Filter = {
                        id: Math.random().toString(36).substr(2, 9),
                        type: FilterType.CONFIRMATION_TYPE,
                        operator: "include" as any,
                        value: [],
                      }
                      setFilters(prev => [...prev, newFilter])
                    }}
                  >
                    <Tag className="size-4 mr-2" />
                    Confirmation Type
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const newFilter: Filter = {
                        id: Math.random().toString(36).substr(2, 9),
                        type: FilterType.WIN_PERCENTAGE,
                        operator: "is" as any,
                        value: [],
                      }
                      setFilters(prev => [...prev, newFilter])
                    }}
                  >
                    <Target className="size-4 mr-2" />
                    Winrate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const newFilter: Filter = {
                        id: Math.random().toString(36).substr(2, 9),
                        type: FilterType.TOTAL_COUNT,
                        operator: "is" as any,
                        value: [],
                      }
                      setFilters(prev => [...prev, newFilter])
                    }}
                  >
                    <BarChart3 className="size-4 mr-2" />
                    Trade count
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>


      <TabsContent
        value="loss-reasons"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <LossAnalysisGrid data={data.lossReasonsData} />
        <div className="flex items-center justify-between px-2 ml-2 border border-border-primary w-fit rounded-md py-1 bg-bg-secondary">
          <div className="text-text-secondary text-xs font-regular hidden flex-1 text-sm lg:flex">
            Showing {data.lossReasonsData.length} loss reasons
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="confirmations"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <ConfirmationGrid data={filteredConfirmationData} />
        <div className="flex items-center justify-between px-2 ml-2 border border-border-primary w-fit rounded-md py-1 bg-bg-secondary">
          <div className="text-text-secondary text-xs font-regular hidden flex-1 text-sm lg:flex">
            Showing {filteredConfirmationData.length} confirmations
          </div>
        </div>
      </TabsContent>
      
      
      <TabsContent
        value="trades"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <TradesGrid data={data.tradesAnalysisData} />
        <div className="flex items-center justify-between px-2 ml-2 border border-border-primary w-fit rounded-md py-1 bg-bg-secondary">
          <div className="text-text-secondary text-xs font-regular hidden flex-1 text-sm lg:flex">
            Showing trades analysis
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="days"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
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
       <div className="flex items-center justify-between px-2 ml-2 border border-border-primary w-fit rounded-md py-1 bg-bg-secondary">
          <div className="text-text-secondary text-xs font-regular hidden flex-1 text-sm lg:flex">
            Showing {data.dayAnalysisData.length} days
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

