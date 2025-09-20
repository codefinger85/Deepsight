import * as React from "react"
import { PlusCircle } from "lucide-react"
import {
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Filters, { Filter, FilterType, filterViewToFilterOptions, FilterOption } from "@/components/ui/filters"

interface TableTabsProps {
  activeTab: string
  filters: Filter[]
  onFiltersChange: (filters: Filter[]) => void
  onFilterAdd: (filterType: FilterType, option: FilterOption) => void
}

export function TableTabs({ 
  activeTab, 
  filters, 
  onFiltersChange, 
  onFilterAdd 
}: TableTabsProps) {
  const clearAllFilters = () => {
    onFiltersChange([])
  }

  return (
    <div className="flex items-center justify-between w-full">
      <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex bg-white border border-border-primary">
        <TabsTrigger value="trades" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">
          Trades
        </TabsTrigger>
        <TabsTrigger value="confirmations" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">
          Confirmations
        </TabsTrigger>
        <TabsTrigger value="loss-reasons" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">
          Loss reasons
        </TabsTrigger>
        <TabsTrigger value="days" className="font-normal data-[state=active]:font-medium text-text-secondary data-[state=active]:text-text-secondary">
          Days
        </TabsTrigger>
      </TabsList>
      
      <div className="flex items-center gap-2">
        {/* Active Filters Display - Only show for Confirmations tab */}
        {activeTab === "confirmations" && filters.length > 0 && (
          <div className="flex items-center gap-2">
            <Filters filters={filters} setFilters={onFiltersChange} />
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
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
                Add filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {Object.entries(filterViewToFilterOptions).map(([filterType, options]) => (
                <div key={filterType}>
                  <div className="px-2 py-1.5 text-sm font-medium text-text-primary">
                    {filterType.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  {options.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onFilterAdd(filterType as FilterType, option)}
                      className="cursor-pointer text-text-secondary hover:text-text-primary"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}