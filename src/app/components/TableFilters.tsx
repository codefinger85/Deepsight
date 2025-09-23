import * as React from "react"
import { PlusCircle, Target, Tag, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
              <span>Add Filter</span>
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
  )
}