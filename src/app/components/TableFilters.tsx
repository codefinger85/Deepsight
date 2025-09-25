import * as React from "react"
import { Settings2, Target, Tag, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipPortal,
} from "@/components/ui/tooltip"
import Filters, { Filter, FilterType, FilterOption } from "@/components/ui/filters"

interface TableFiltersProps {
  activeTab: string
  filters: Filter[]
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
  confirmationTypeOptions: FilterOption[]
}

export function TableFilters({ activeTab, filters, setFilters, confirmationTypeOptions }: TableFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Active Filters Display - Only show for Confirmations tab */}
      {activeTab === "confirmations" && filters.length > 0 && (
        <div className="flex items-center gap-2">
          <Filters filters={filters} setFilters={setFilters} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters([])}
            className="text-text-secondary hover:text-text-primary p-2 h-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </Button>
        </div>
      )}
      {/* Add Filter button - Only show for Confirmations tab */}
      {activeTab === "confirmations" && (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="p-1.5 h-fit">
                  <Settings2 className="h-4 w-4" strokeWidth="1.5" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent side="top">
                Add filters
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-56 p-2 text-text-secondary">
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
              <Tag className="size-4 mr-2" strokeWidth="1.5" />
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
              <Target className="size-4 mr-2" strokeWidth="1.5" />
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
              <BarChart3 className="size-4 mr-2" strokeWidth="1.5" />
              Trade count
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}