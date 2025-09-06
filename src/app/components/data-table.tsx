"use client"

import * as React from "react"

// Fixed width styles
const tableStyles = `
  .fixed-width-table {
    table-layout: fixed !important;
    width: 100% !important;
  }
  
  .fixed-width-table thead tr th:first-child,
  .fixed-width-table tbody tr td:first-child {
    width: 192px !important;
    max-width: 192px !important;
    min-width: 192px !important;
    box-sizing: border-box !important;
  }
  
  .fixed-width-table thead tr th:not(:first-child),
  .fixed-width-table tbody tr td:not(:first-child) {
    width: 60px !important;
    max-width: 60px !important;
    min-width: 60px !important;
    box-sizing: border-box !important;
  }

  /* Grid containers with clean borders */
  .trade-grid-container,
  .loss-grid-container,
  .confirmation-grid-container,
  .day-grid-container {
    border: 1px solid hsl(var(--border));
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .trade-grid-header {
    display: grid;
    grid-template-columns: 1fr repeat(4, minmax(80px, 120px));
    border-bottom: 1px solid hsl(var(--border));
  }
  
  .trade-grid-content {
    display: grid;
    grid-template-columns: 1fr repeat(4, minmax(80px, 120px));
  }
  
  .loss-grid-header {
    display: grid;
    grid-template-columns: 1fr repeat(9, minmax(80px, 120px));
    border-bottom: 1px solid hsl(var(--border));
  }
  
  .loss-grid-content {
    display: grid;
    grid-template-columns: 1fr repeat(9, minmax(80px, 120px));
  }
  
  .confirmation-grid-header {
    display: grid;
    grid-template-columns: 1fr repeat(11, minmax(80px, 120px));
    border-bottom: 1px solid hsl(var(--border));
  }
  
  .confirmation-grid-content {
    display: grid;
    grid-template-columns: 1fr repeat(11, minmax(80px, 120px));
  }
  
  .day-grid-header {
    display: grid;
    grid-template-columns: 1fr repeat(4, minmax(80px, 120px));
    border-bottom: 1px solid hsl(var(--border));
  }
  
  .day-grid-content {
    display: grid;
    grid-template-columns: 1fr repeat(4, minmax(80px, 120px));
  }
  
  /* Header cells - only add right borders between cells */
  .grid-header {
    background-color: rgb(248 250 252);
    height: 50px;
    padding: 0.5rem;
    font-weight: 600;
    text-align: center;
    font-size: 0.75rem;
    color: rgb(51 65 85);
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid hsl(var(--border));
  }
  
  .grid-header:first-child {
    text-align: left;
    justify-content: flex-start;
    padding-left: 16px;
  }
  
  .grid-header:last-child {
    border-right: none;
  }
  
  /* Data cells - only add borders between cells and rows */
  .grid-cell-name {
    padding: 0.5rem 0.5rem 0.5rem 16px;
    text-align: left;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 500;
    min-height: 60px;
    border-right: 1px solid hsl(var(--border));
    border-bottom: 1px solid hsl(var(--border));
  }
  
  .grid-cell-data {
    padding: 0.5rem;
    text-align: center;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60px;
    border-right: 1px solid hsl(var(--border));
    border-bottom: 1px solid hsl(var(--border));
  }
  
  /* Remove right border from last column */
  .trade-grid-header .grid-header:nth-child(5),
  .trade-grid-content .grid-cell-name:nth-child(5n),
  .trade-grid-content .grid-cell-data:nth-child(5n) {
    border-right: none;
  }
  
  .loss-grid-header .grid-header:nth-child(10),
  .loss-grid-content .grid-cell-name:nth-child(10n),
  .loss-grid-content .grid-cell-data:nth-child(10n) {
    border-right: none;
  }
  
  .confirmation-grid-header .grid-header:nth-child(12),
  .confirmation-grid-content .grid-cell-name:nth-child(12n),
  .confirmation-grid-content .grid-cell-data:nth-child(12n) {
    border-right: none;
  }
  
  .day-grid-header .grid-header:nth-child(5),
  .day-grid-content .grid-cell-name:nth-child(5n),
  .day-grid-content .grid-cell-data:nth-child(5n) {
    border-right: none;
  }
  
  /* Remove bottom border from last row - dynamically calculated */
  .trade-grid-content .grid-cell-name:nth-last-child(-n+5),
  .trade-grid-content .grid-cell-data:nth-last-child(-n+5) {
    border-bottom: none;
  }
  
  .loss-grid-content .grid-cell-name:nth-last-child(-n+10),
  .loss-grid-content .grid-cell-data:nth-last-child(-n+10) {
    border-bottom: none;
  }
  
  .confirmation-grid-content .grid-cell-name:nth-last-child(-n+12),
  .confirmation-grid-content .grid-cell-data:nth-last-child(-n+12) {
    border-bottom: none;
  }
  
  .day-grid-content .grid-cell-name:nth-last-child(-n+5),
  .day-grid-content .grid-cell-data:nth-last-child(-n+5) {
    border-bottom: none;
  }
  
  .grid-row:hover .grid-cell-name,
  .grid-row:hover .grid-cell-data {
    background-color: hsl(var(--muted) / 0.5);
  }
  
  [hidden] {
    display: none !important;
  }
`
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import { PlusCircle, Target, Tag, BarChart3, Activity, SignalHigh } from "lucide-react"

// Types for range analysis
type RangeKey = 'conf1' | 'conf2' | 'conf3' | 'conf4' | 'conf5' | 'conf6' | 'conf7';

// Utility functions for range calculations
const parseRangeData = (rangeValue: string): { wins: number; losses: number; total: number } => {
  try {
    const [winsStr, lossesStr] = rangeValue.split('|');
    const wins = parseInt(winsStr) || 0;
    const losses = parseInt(lossesStr) || 0;
    return { wins, losses, total: wins + losses };
  } catch {
    return { wins: 0, losses: 0, total: 0 };
  }
};

const calculateRangeWinPercentage = (wins: number, losses: number): number => {
  const total = wins + losses;
  return total === 0 ? 0 : Math.round((wins / total) * 100);
};

// Generic range cell renderer that works with both confirmation and trades analysis
const createRangeCell = <T extends Record<RangeKey, string>>(rangeKey: RangeKey) => {
  const RangeCell = ({ row }: { row: Row<T> }) => {
    const rangeValue = row.original[rangeKey];
    const { wins, losses, total } = parseRangeData(rangeValue);
    const percentage = calculateRangeWinPercentage(wins, losses);

    return (
      <div className="text-center text-sm w-20">
        <div>
          {percentage}%
        </div>
        {total > 0 && (
          <div className="text-muted-foreground text-[10px] mt-0.5 border-t pt-0.5 font-semibold">
            {wins}W | {losses}L
          </div>
        )}
      </div>
    );
  };
  return RangeCell;
};


import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"
import { LossReasonAnalysis, WinningConfirmationAnalysis, ConfirmationAnalysis, TradesAnalysis } from "@/lib/database"
import Filters, { Filter, FilterType, filterViewToFilterOptions, FilterOption, PerformanceTier, VolumeTier, WinPercentageRange, TotalCountRange } from "@/components/ui/filters"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

const lossReasonColumns: ColumnDef<z.infer<typeof lossReasonSchema>>[] = [
  {
    accessorKey: "lossReason",
    header: ({ column }) => (
      <div>Loss Reason</div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.lossReason}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "totalCount",
    header: () => <div className="text-center">Total</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        {row.original.totalCount}
      </div>
    ),
  },
  {
    accessorKey: "lossPercentage",
    header: () => <div className="text-center">Lossrate</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        {row.original.lossPercentage}%
      </div>
    ),
  },
  {
    accessorKey: "conf1",
    header: () => <div className="text-center">1 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf1}
      </div>
    ),
  },
  {
    accessorKey: "conf2",
    header: () => <div className="text-center">2 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf2}
      </div>
    ),
  },
  {
    accessorKey: "conf3",
    header: () => <div className="text-center">3 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf3}
      </div>
    ),
  },
  {
    accessorKey: "conf4",
    header: () => <div className="text-center">4 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf4}
      </div>
    ),
  },
  {
    accessorKey: "conf5",
    header: () => <div className="text-center">5 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf5}
      </div>
    ),
  },
  {
    accessorKey: "conf6",
    header: () => <div className="text-center">6 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf6}
      </div>
    ),
  },
  {
    accessorKey: "conf7",
    header: () => <div className="text-center">7 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf7}
      </div>
    ),
  },
]

const winningConfirmationColumns: ColumnDef<z.infer<typeof winningConfirmationSchema>>[] = [
  {
    accessorKey: "confirmation",
    header: "Winning Confirmation",
    cell: ({ row }) => (
      <div className="font-medium max-w-48">
        {row.original.confirmation}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "totalCount",
    header: () => <div className="text-center">Total</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        {row.original.totalCount}
      </div>
    ),
  },
  {
    accessorKey: "conf1",
    header: () => <div className="text-center">1 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf1}
      </div>
    ),
  },
  {
    accessorKey: "conf2",
    header: () => <div className="text-center">2 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf2}
      </div>
    ),
  },
  {
    accessorKey: "conf3",
    header: () => <div className="text-center">3 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf3}
      </div>
    ),
  },
  {
    accessorKey: "conf4",
    header: () => <div className="text-center">4 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf4}
      </div>
    ),
  },
  {
    accessorKey: "conf5",
    header: () => <div className="text-center">5 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf5}
      </div>
    ),
  },
  {
    accessorKey: "conf6",
    header: () => <div className="text-center">6 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf6}
      </div>
    ),
  },
  {
    accessorKey: "conf7",
    header: () => <div className="text-center">7 Conf</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.conf7}
      </div>
    ),
  },
]

const confirmationAnalysisColumns: ColumnDef<z.infer<typeof confirmationAnalysisSchema>>[] = [
  {
    accessorKey: "confirmation",
    header: ({ column }) => (
      <div className="w-48">Confirmation</div>
    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-48 w-48">
        {row.original.confirmation}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "totalCount",
    header: () => <div className="text-center w-20">Total</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium w-20">
        {row.original.totalCount}
      </div>
    ),
  },
  {
    accessorKey: "winCount",
    header: () => <div className="text-center w-20">Wins</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium w-20">
        {row.original.winCount}
      </div>
    ),
  },
  {
    accessorKey: "lossCount",
    header: () => <div className="text-center w-20">Losses</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium w-20">
        {row.original.lossCount}
      </div>
    ),
  },
  {
    accessorKey: "winPercentage",
    header: () => <div className="text-center w-20">Winrate</div>,
    cell: ({ row }) => {
      const percentage = row.original.winPercentage;
      return (
        <div className="text-center font-semibold w-20">
          {percentage}%
        </div>
      );
    },
  },
  {
    accessorKey: "conf1",
    header: () => <div className="text-center w-20">1 Conf</div>,
    cell: createRangeCell('conf1'),
  },
  {
    accessorKey: "conf2",
    header: () => <div className="text-center w-20">2 Conf</div>,
    cell: createRangeCell('conf2'),
  },
  {
    accessorKey: "conf3",
    header: () => <div className="text-center w-20">3 Conf</div>,
    cell: createRangeCell('conf3'),
  },
  {
    accessorKey: "conf4",
    header: () => <div className="text-center w-20">4 Conf</div>,
    cell: createRangeCell('conf4'),
  },
  {
    accessorKey: "conf5",
    header: () => <div className="text-center w-20">5 Conf</div>,
    cell: createRangeCell('conf5'),
  },
  {
    accessorKey: "conf6",
    header: () => <div className="text-center w-20">6 Conf</div>,
    cell: createRangeCell('conf6'),
  },
  {
    accessorKey: "conf7",
    header: () => <div className="text-center w-20">7 Conf</div>,
    cell: createRangeCell('conf7'),
  },
]

const tradesAnalysisColumns: ColumnDef<z.infer<typeof tradesAnalysisSchema>>[] = [
  {
    accessorKey: "confirmation",
    header: ({ column }) => (
      <div className="w-48">Trades Analysis</div>
    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-48 w-48">
        {row.original.confirmation}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "totalCount",
    header: () => <div className="text-center w-20">Total</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium w-20">
        {row.original.totalCount}
      </div>
    ),
  },
  {
    accessorKey: "winCount",
    header: () => <div className="text-center w-20">Wins</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium w-20">
        {row.original.winCount}
      </div>
    ),
  },
  {
    accessorKey: "lossCount",
    header: () => <div className="text-center w-20">Losses</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium w-20">
        {row.original.lossCount}
      </div>
    ),
  },
  {
    accessorKey: "winPercentage",
    header: () => <div className="text-center w-20">Winrate</div>,
    cell: ({ row }) => {
      const percentage = row.original.winPercentage;
      return (
        <div className="text-center font-semibold w-20">
          {percentage}%
        </div>
      );
    },
  },
  {
    accessorKey: "conf1",
    header: () => <div className="text-center w-20">1 Conf</div>,
    cell: createRangeCell('conf1'),
  },
  {
    accessorKey: "conf2",
    header: () => <div className="text-center w-20">2 Conf</div>,
    cell: createRangeCell('conf2'),
  },
  {
    accessorKey: "conf3",
    header: () => <div className="text-center w-20">3 Conf</div>,
    cell: createRangeCell('conf3'),
  },
  {
    accessorKey: "conf4",
    header: () => <div className="text-center w-20">4 Conf</div>,
    cell: createRangeCell('conf4'),
  },
  {
    accessorKey: "conf5",
    header: () => <div className="text-center w-20">5 Conf</div>,
    cell: createRangeCell('conf5'),
  },
  {
    accessorKey: "conf6",
    header: () => <div className="text-center w-20">6 Conf</div>,
    cell: createRangeCell('conf6'),
  },
  {
    accessorKey: "conf7",
    header: () => <div className="text-center w-20">7 Conf</div>,
    cell: createRangeCell('conf7'),
  },
]

const dayAnalysisColumns: ColumnDef<z.infer<typeof dayAnalysisSchema>>[] = [
  {
    accessorKey: "dayOfWeek",
    header: ({ column }) => (
      <div className="w-48">Day of Week</div>
    ),
    cell: ({ row }) => (
      <div className="font-medium w-48">
        {row.original.dayOfWeek}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "totalTrades",
    header: () => <div className="text-center w-20">Total Trades</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold w-20">
        {row.original.totalTrades}
      </div>
    ),
  },
  {
    accessorKey: "winCount",
    header: () => <div className="text-center w-20">Wins</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium w-20">
        {row.original.winCount}
      </div>
    ),
  },
  {
    accessorKey: "lossCount",
    header: () => <div className="text-center w-20">Losses</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium w-20">
        {row.original.lossCount}
      </div>
    ),
  },
  {
    accessorKey: "winPercentage",
    header: () => <div className="text-center w-20">Winrate</div>,
    cell: ({ row }) => {
      const percentage = row.original.winPercentage;
      return (
        <div className="text-center font-semibold w-20">
          {percentage}%
        </div>
      );
    },
  },
]

export function DataTable({
  lossReasonsData,
  confirmationAnalysisData,
  tradesAnalysisData,
  dayAnalysisData,
}: {
  lossReasonsData: z.infer<typeof lossReasonSchema>[]
  confirmationAnalysisData: z.infer<typeof confirmationAnalysisSchema>[]
  tradesAnalysisData: z.infer<typeof tradesAnalysisSchema>[]
  dayAnalysisData: z.infer<typeof dayAnalysisSchema>[]
}) {
  const [activeTab, setActiveTab] = React.useState("trades")
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filters, setFilters] = React.useState<Filter[]>([])

  // Generate confirmation type options from actual data
  const confirmationTypeOptions: FilterOption[] = React.useMemo(() => {
    const uniqueConfirmations = Array.from(new Set(confirmationAnalysisData.map(item => item.confirmation)))
    return uniqueConfirmations.map(confirmation => ({
      name: confirmation,
      icon: <IconTrendingUp className="size-3.5 text-muted-foreground" />
    }))
  }, [confirmationAnalysisData])

  // Update the filter options for confirmation types
  React.useEffect(() => {
    filterViewToFilterOptions[FilterType.CONFIRMATION_TYPE] = confirmationTypeOptions
  }, [confirmationTypeOptions])

  // Filter confirmation analysis data based on active filters
  const filteredConfirmationData = React.useMemo(() => {
    if (activeTab !== "confirmations" || filters.length === 0) return confirmationAnalysisData
    
    return confirmationAnalysisData.filter(item => {
      return filters.every(filter => {
        // Skip filters with no values (they shouldn't filter anything)
        if (!filter.value || filter.value.length === 0) return true
        
        switch (filter.type) {
          case FilterType.CONFIRMATION_TYPE:
            return filter.value.includes(item.confirmation)
          case FilterType.WIN_PERCENTAGE:
            return filter.value.some(range => {
              switch (range) {
                case WinPercentageRange.EXCELLENT:
                  return item.winPercentage >= 90
                case WinPercentageRange.VERY_HIGH:
                  return item.winPercentage >= 80 && item.winPercentage < 90
                case WinPercentageRange.HIGH:
                  return item.winPercentage >= 70 && item.winPercentage < 80
                case WinPercentageRange.GOOD:
                  return item.winPercentage >= 60 && item.winPercentage < 70
                case WinPercentageRange.AVERAGE:
                  return item.winPercentage >= 50 && item.winPercentage < 60
                case WinPercentageRange.POOR:
                  return item.winPercentage >= 40 && item.winPercentage < 50
                case WinPercentageRange.VERY_POOR:
                  return item.winPercentage < 40
                default:
                  return false
              }
            })
          case FilterType.TOTAL_COUNT:
            return filter.value.some(range => {
              switch (range) {
                case TotalCountRange.VERY_HIGH:
                  return item.totalCount >= 100
                case TotalCountRange.HIGH:
                  return item.totalCount >= 50 && item.totalCount < 100
                case TotalCountRange.MEDIUM:
                  return item.totalCount >= 20 && item.totalCount < 50
                case TotalCountRange.LOW:
                  return item.totalCount >= 10 && item.totalCount < 20
                case TotalCountRange.VERY_LOW:
                  return item.totalCount < 10
                default:
                  return false
              }
            })
          case FilterType.PERFORMANCE_TIER:
            return filter.value.some(tier => {
              switch (tier) {
                case PerformanceTier.HIGH:
                  return item.winPercentage >= 70
                case PerformanceTier.MEDIUM:
                  return item.winPercentage >= 50 && item.winPercentage < 70
                case PerformanceTier.LOW:
                  return item.winPercentage < 50
                default:
                  return false
              }
            })
          case FilterType.VOLUME_TIER:
            return filter.value.some(tier => {
              switch (tier) {
                case VolumeTier.HIGH:
                  return item.totalCount >= 50
                case VolumeTier.MEDIUM:
                  return item.totalCount >= 20 && item.totalCount < 50
                case VolumeTier.LOW:
                  return item.totalCount < 20
                default:
                  return false
              }
            })
          default:
            return true
        }
      })
    })
  }, [confirmationAnalysisData, filters, activeTab])

  // Determine which data and columns to use based on active tab
  const currentData = activeTab === "loss-reasons" 
    ? lossReasonsData 
    : activeTab === "confirmations" 
    ? filteredConfirmationData
    : activeTab === "trades"
    ? tradesAnalysisData
    : activeTab === "days"
    ? dayAnalysisData
    : []
  
  const currentColumns = activeTab === "loss-reasons" 
    ? lossReasonColumns 
    : activeTab === "confirmations"
    ? confirmationAnalysisColumns
    : activeTab === "trades"
    ? tradesAnalysisColumns
    : activeTab === "days"
    ? dayAnalysisColumns
    : []

  const table = useReactTable({
    data: currentData,
    columns: currentColumns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row, index) => index.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })


  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tableStyles }} />
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
            size="sm"
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
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex bg-white">
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="confirmations">Confirmations</TabsTrigger>
          <TabsTrigger value="loss-reasons">Loss reasons</TabsTrigger>
          <TabsTrigger value="days">Days</TabsTrigger>
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
                className="text-muted-foreground hover:text-foreground"
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
                  Win Percentage
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
                  Total Count
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const newFilter: Filter = {
                      id: Math.random().toString(36).substr(2, 9),
                      type: FilterType.PERFORMANCE_TIER,
                      operator: "is" as any,
                      value: [],
                    }
                    setFilters(prev => [...prev, newFilter])
                  }}
                >
                  <Activity className="size-4 mr-2" />
                  Performance Tier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const newFilter: Filter = {
                      id: Math.random().toString(36).substr(2, 9),
                      type: FilterType.VOLUME_TIER,
                      operator: "is" as any,
                      value: [],
                    }
                    setFilters(prev => [...prev, newFilter])
                  }}
                >
                  <SignalHigh className="size-4 mr-2" />
                  Volume Tier
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>


      <TabsContent
        value="loss-reasons"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="loss-grid-container">
          {/* Fixed Header */}
          <div className="loss-grid-header">
            <div className="grid-header">Loss Reason</div>
            <div className="grid-header">Total</div>
            <div className="grid-header">Lossrate</div>
            <div className="grid-header">1 Conf</div>
            <div className="grid-header">2 Conf</div>
            <div className="grid-header">3 Conf</div>
            <div className="grid-header">4 Conf</div>
            <div className="grid-header">5 Conf</div>
            <div className="grid-header">6 Conf</div>
            <div className="grid-header">7 Conf</div>
          </div>
          
          {/* Scrollable Content */}
          <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
            <div className="loss-grid-content">
              {lossReasonsData.length > 0 ? (
                lossReasonsData.map((row, index) => (
                  <React.Fragment key={index}>
                    <div className="grid-cell-name">{row.lossReason}</div>
                    <div className="grid-cell-data font-semibold">{row.totalCount}</div>
                    <div className="grid-cell-data font-semibold">{row.lossPercentage}%</div>
                    <div className="grid-cell-data">{row.conf1}</div>
                    <div className="grid-cell-data">{row.conf2}</div>
                    <div className="grid-cell-data">{row.conf3}</div>
                    <div className="grid-cell-data">{row.conf4}</div>
                    <div className="grid-cell-data">{row.conf5}</div>
                    <div className="grid-cell-data">{row.conf6}</div>
                    <div className="grid-cell-data">{row.conf7}</div>
                  </React.Fragment>
                ))
              ) : (
                <div className="grid-cell-name" style={{gridColumn: '1 / -1'}}>No loss reason data available.</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing {lossReasonsData.length} loss reasons (CSS Grid)
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="confirmations"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="confirmation-grid-container">
          {/* Fixed Header */}
          <div className="confirmation-grid-header">
            <div className="grid-header">Confirmation</div>
            <div className="grid-header">Total</div>
            <div className="grid-header">Wins</div>
            <div className="grid-header">Losses</div>
            <div className="grid-header">Winrate</div>
            <div className="grid-header">1 Conf</div>
            <div className="grid-header">2 Conf</div>
            <div className="grid-header">3 Conf</div>
            <div className="grid-header">4 Conf</div>
            <div className="grid-header">5 Conf</div>
            <div className="grid-header">6 Conf</div>
            <div className="grid-header">7 Conf</div>
          </div>
          
          {/* Scrollable Content */}
          <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
            <div className="confirmation-grid-content">
              {filteredConfirmationData.length > 0 ? (
                filteredConfirmationData.map((row, index) => (
                  <React.Fragment key={index}>
                    <div className="grid-cell-name">{row.confirmation}</div>
                    <div className="grid-cell-data font-semibold">{row.totalCount}</div>
                    <div className="grid-cell-data font-medium">{row.winCount}</div>
                    <div className="grid-cell-data font-medium">{row.lossCount}</div>
                    <div className="grid-cell-data font-semibold">
                      {row.winPercentage}%
                    </div>
                    <div className="grid-cell-data">
                      <div className="text-center text-sm">
                        {(() => {
                          const { wins, losses, total } = parseRangeData(row.conf1);
                          const percentage = calculateRangeWinPercentage(wins, losses);
                          return (
                            <div>
                              <div>
                                {percentage}%
                              </div>
                              {total > 0 && (
                                <div className="text-muted-foreground text-[10px] mt-0.5 border-t pt-0.5 font-semibold">
                                  {wins}W | {losses}L
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="grid-cell-data">
                      <div className="text-center text-sm">
                        {(() => {
                          const { wins, losses, total } = parseRangeData(row.conf2);
                          const percentage = calculateRangeWinPercentage(wins, losses);
                          return (
                            <div>
                              <div>
                                {percentage}%
                              </div>
                              {total > 0 && (
                                <div className="text-muted-foreground text-[10px] mt-0.5 border-t pt-0.5 font-semibold">
                                  {wins}W | {losses}L
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="grid-cell-data">
                      <div className="text-center text-sm">
                        {(() => {
                          const { wins, losses, total } = parseRangeData(row.conf3);
                          const percentage = calculateRangeWinPercentage(wins, losses);
                          return (
                            <div>
                              <div>
                                {percentage}%
                              </div>
                              {total > 0 && (
                                <div className="text-muted-foreground text-[10px] mt-0.5 border-t pt-0.5 font-semibold">
                                  {wins}W | {losses}L
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="grid-cell-data">
                      <div className="text-center text-sm">
                        {(() => {
                          const { wins, losses, total } = parseRangeData(row.conf4);
                          const percentage = calculateRangeWinPercentage(wins, losses);
                          return (
                            <div>
                              <div>
                                {percentage}%
                              </div>
                              {total > 0 && (
                                <div className="text-muted-foreground text-[10px] mt-0.5 border-t pt-0.5 font-semibold">
                                  {wins}W | {losses}L
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="grid-cell-data">
                      <div className="text-center text-sm">
                        {(() => {
                          const { wins, losses, total } = parseRangeData(row.conf5);
                          const percentage = calculateRangeWinPercentage(wins, losses);
                          return (
                            <div>
                              <div>
                                {percentage}%
                              </div>
                              {total > 0 && (
                                <div className="text-muted-foreground text-[10px] mt-0.5 border-t pt-0.5 font-semibold">
                                  {wins}W | {losses}L
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="grid-cell-data">
                      <div className="text-center text-sm">
                        {(() => {
                          const { wins, losses, total } = parseRangeData(row.conf6);
                          const percentage = calculateRangeWinPercentage(wins, losses);
                          return (
                            <div>
                              <div>
                                {percentage}%
                              </div>
                              {total > 0 && (
                                <div className="text-muted-foreground text-[10px] mt-0.5 border-t pt-0.5 font-semibold">
                                  {wins}W | {losses}L
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="grid-cell-data">
                      <div className="text-center text-sm">
                        {(() => {
                          const { wins, losses, total } = parseRangeData(row.conf7);
                          const percentage = calculateRangeWinPercentage(wins, losses);
                          return (
                            <div>
                              <div>
                                {percentage}%
                              </div>
                              {total > 0 && (
                                <div className="text-muted-foreground text-[10px] mt-0.5 border-t pt-0.5 font-semibold">
                                  {wins}W | {losses}L
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <div className="grid-cell-name" style={{gridColumn: '1 / -1'}}>No confirmation analysis data available.</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing {filteredConfirmationData.length} confirmations (CSS Grid)
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="trades"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="trade-grid-container">
          {/* Fixed Header */}
          <div className="trade-grid-header">
            <div className="grid-header">Analysis</div>
            <div className="grid-header">Total</div>
            <div className="grid-header">Wins</div>
            <div className="grid-header">Losses</div>
            <div className="grid-header">Winrate</div>
          </div>
          
          {/* Scrollable Content */}
          <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
            <div className="trade-grid-content">
              {tradesAnalysisData.length > 0 ? (
                (() => {
                  const allTradesRow = tradesAnalysisData[0];
                  const totalAllTrades = allTradesRow.totalCount;
                  
                  // Create rows for All Trades + each confirmation level
                  const rows = [
                    {
                      name: "All Trades",
                      total: allTradesRow.totalCount,
                      percentage: 100,
                      wins: allTradesRow.winCount,
                      losses: allTradesRow.lossCount,
                      winRate: allTradesRow.winPercentage
                    }
                  ];
                  
                  // Add confirmation level rows
                  for (let i = 1; i <= 7; i++) {
                    const confKey = `conf${i}` as keyof typeof allTradesRow;
                    const confData = parseRangeData(String(allTradesRow[confKey]));
                    const percentage = totalAllTrades > 0 ? Math.round((confData.total / totalAllTrades) * 100) : 0;
                    
                    rows.push({
                      name: `${i} Confirmation${i > 1 ? 's' : ''}`,
                      total: confData.total,
                      percentage,
                      wins: confData.wins,
                      losses: confData.losses,
                      winRate: calculateRangeWinPercentage(confData.wins, confData.losses)
                    });
                  }
                  
                  return rows.map((row, index) => (
                    <React.Fragment key={index}>
                      <div className="grid-cell-name">{row.name}</div>
                      <div className="grid-cell-data">
                        <div className="text-sm">
                          <div className="font-semibold">{row.total}</div>
                          <div className="text-muted-foreground text-[12px] mt-0.5">
                            ({row.percentage}%)
                          </div>
                        </div>
                      </div>
                      <div className="grid-cell-data font-medium">{row.wins}</div>
                      <div className="grid-cell-data font-medium">{row.losses}</div>
                      <div className="grid-cell-data font-semibold">
                        {row.winRate}%
                      </div>
                    </React.Fragment>
                  ));
                })()
              ) : (
                <div className="grid-cell-name" style={{gridColumn: '1 / -1'}}>No trades data available.</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing trades analysis (CSS Grid)
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="days"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="day-grid-container">
          {/* Fixed Header */}
          <div className="day-grid-header">
            <div className="grid-header">Day of Week</div>
            <div className="grid-header">Total Trades</div>
            <div className="grid-header">Wins</div>
            <div className="grid-header">Losses</div>
            <div className="grid-header">Winrate</div>
          </div>
          
          {/* Scrollable Content */}
          <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
            <div className="day-grid-content">
              {dayAnalysisData.length > 0 ? (
                dayAnalysisData.map((row, index) => (
                  <React.Fragment key={index}>
                    <div className="grid-cell-name">{row.dayOfWeek}</div>
                    <div className="grid-cell-data font-semibold">{row.totalTrades}</div>
                    <div className="grid-cell-data font-medium">{row.winCount}</div>
                    <div className="grid-cell-data font-medium">{row.lossCount}</div>
                    <div className="grid-cell-data font-semibold">
                      {row.winPercentage}%
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <div className="grid-cell-name" style={{gridColumn: '1 / -1'}}>No days data available.</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing {dayAnalysisData.length} days (CSS Grid)
          </div>
        </div>
      </TabsContent>
    </Tabs>
    </>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Table of Contents">
                      Table of Contents
                    </SelectItem>
                    <SelectItem value="Executive Summary">
                      Executive Summary
                    </SelectItem>
                    <SelectItem value="Technical Approach">
                      Technical Approach
                    </SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Capabilities">Capabilities</SelectItem>
                    <SelectItem value="Focus Documents">
                      Focus Documents
                    </SelectItem>
                    <SelectItem value="Narrative">Narrative</SelectItem>
                    <SelectItem value="Cover Page">Cover Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                  <SelectItem value="Jamik Tashpulatov">
                    Jamik Tashpulatov
                  </SelectItem>
                  <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
