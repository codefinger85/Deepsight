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

  .trade-grid {
    display: grid;
    grid-template-columns: 1fr repeat(4, minmax(80px, 120px));
    border: 1px solid hsl(var(--border));
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .grid-header {
    background-color: hsl(var(--muted));
    border-bottom: 1px solid hsl(var(--border));
    border-right: 1px solid hsl(var(--border));
    padding: 0.5rem;
    font-medium: 500;
    text-align: center;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }
  
  .grid-header:first-child {
    text-align: left;
  }
  
  .grid-header:last-child {
    border-right: none;
  }
  
  .grid-cell-name {
    border-bottom: 1px solid hsl(var(--border));
    border-right: 1px solid hsl(var(--border));
    padding: 0.5rem;
    text-align: left;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 500;
  }
  
  .grid-cell-data {
    border-bottom: 1px solid hsl(var(--border));
    border-right: 1px solid hsl(var(--border));
    padding: 0.5rem;
    text-align: center;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .grid-cell-name:last-child,
  .grid-cell-data:last-child {
    border-right: none;
  }
  
  .grid-row:hover .grid-cell-name,
  .grid-row:hover .grid-cell-data {
    background-color: hsl(var(--muted) / 0.5);
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
type RangeKey = 'conf1' | 'conf2' | 'conf3' | 'conf4' | 'conf5' | 'conf6';

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
          <span className="text-green-600">{wins}</span>
          <span className="text-gray-400">|</span>
          <span className="text-red-600">{losses}</span>
        </div>
        {total > 0 && (
          <div className="text-muted-foreground text-[12px] mt-0.5">
            ({percentage}%)
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
  conf1: z.number(),
  conf2: z.number(),
  conf3: z.number(),
  conf4: z.number(),
  conf5: z.number(),
  conf6: z.number(),
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
      <div className="text-center font-medium">
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
      <div className="text-center font-medium">
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
      <div className="text-center text-green-600 font-medium w-20">
        {row.original.winCount}
      </div>
    ),
  },
  {
    accessorKey: "lossCount",
    header: () => <div className="text-center w-20">Losses</div>,
    cell: ({ row }) => (
      <div className="text-center text-red-600 font-medium w-20">
        {row.original.lossCount}
      </div>
    ),
  },
  {
    accessorKey: "winPercentage",
    header: () => <div className="text-center w-20">Win %</div>,
    cell: ({ row }) => {
      const percentage = row.original.winPercentage;
      return (
        <div className={`text-center font-medium w-20 ${percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
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
      <div className="text-center text-green-600 font-medium w-20">
        {row.original.winCount}
      </div>
    ),
  },
  {
    accessorKey: "lossCount",
    header: () => <div className="text-center w-20">Losses</div>,
    cell: ({ row }) => (
      <div className="text-center text-red-600 font-medium w-20">
        {row.original.lossCount}
      </div>
    ),
  },
  {
    accessorKey: "winPercentage",
    header: () => <div className="text-center w-20">Win %</div>,
    cell: ({ row }) => {
      const percentage = row.original.winPercentage;
      return (
        <div className={`text-center font-medium w-20 ${percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
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
      <div className="text-center font-medium w-20">
        {row.original.totalTrades}
      </div>
    ),
  },
  {
    accessorKey: "winCount",
    header: () => <div className="text-center w-20">Wins</div>,
    cell: ({ row }) => (
      <div className="text-center text-green-600 font-medium w-20">
        {row.original.winCount}
      </div>
    ),
  },
  {
    accessorKey: "lossCount",
    header: () => <div className="text-center w-20">Losses</div>,
    cell: ({ row }) => (
      <div className="text-center text-red-600 font-medium w-20">
        {row.original.lossCount}
      </div>
    ),
  },
  {
    accessorKey: "winPercentage",
    header: () => <div className="text-center w-20">Win %</div>,
    cell: ({ row }) => {
      const percentage = row.original.winPercentage;
      return (
        <div className={`text-center font-medium w-20 ${percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
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
  const [activeTab, setActiveTab] = React.useState("outline")
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
    if (activeTab === "outline" || filters.length === 0) return confirmationAnalysisData
    
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
  const currentData = activeTab === "outline" 
    ? lossReasonsData 
    : activeTab === "past-performance" 
    ? filteredConfirmationData
    : activeTab === "trades"
    ? tradesAnalysisData
    : activeTab === "trades2"
    ? tradesAnalysisData
    : activeTab === "days"
    ? dayAnalysisData
    : []
  
  const currentColumns = activeTab === "outline" 
    ? lossReasonColumns 
    : activeTab === "past-performance"
    ? confirmationAnalysisColumns
    : activeTab === "trades"
    ? tradesAnalysisColumns
    : activeTab === "trades2"
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
        defaultValue="outline"
        onValueChange={setActiveTab}
        className="w-full flex-col justify-start gap-6"
      >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Loss reasons</SelectItem>
            <SelectItem value="past-performance">Confirmations</SelectItem>
            <SelectItem value="trades">Trades</SelectItem>
            <SelectItem value="trades2">Trades 2</SelectItem>
            <SelectItem value="days">Days</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Loss reasons</TabsTrigger>
          <TabsTrigger value="past-performance">Confirmations</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="trades2">Trades 2</TabsTrigger>
          <TabsTrigger value="days">Days</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {/* Add Filter button - Only show for Confirmations tab */}
          {activeTab === "past-performance" && (
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters Display - Only show for Confirmations tab */}
      {activeTab === "past-performance" && filters.length > 0 && (
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-2 flex-1">
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
            <div className="text-sm text-muted-foreground">
              {filters.length} filter{filters.length !== 1 ? 's' : ''} active
            </div>
          </div>
        </div>
      )}

      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table className="fixed-width-table">
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={currentColumns.length}
                    className="h-24 text-center"
                  >
                    {activeTab === "outline" ? "No loss reason data available." : activeTab === "past-performance" ? "No confirmation analysis data available." : "No data available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing {table.getFilteredRowModel().rows.length} {activeTab === "outline" ? "loss reasons" : activeTab === "past-performance" ? "confirmations" : "trades"}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table className="fixed-width-table">
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={currentColumns.length}
                    className="h-24 text-center"
                  >
                    No confirmation analysis data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing {table.getFilteredRowModel().rows.length} confirmations
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page-2" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page-2">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="trades"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table className="fixed-width-table">
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={currentColumns.length}
                    className="h-24 text-center"
                  >
                    No trades data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing trades analysis
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="trades2"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="trade-grid">
          {/* Grid Headers */}
          <div className="grid-header">Analysis</div>
          <div className="grid-header">Total</div>
          <div className="grid-header">Wins</div>
          <div className="grid-header">Losses</div>
          <div className="grid-header">Win %</div>
          
          {/* Grid Data */}
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
              for (let i = 1; i <= 6; i++) {
                const confKey = `conf${i}` as keyof typeof allTradesRow;
                const confData = parseRangeData(allTradesRow[confKey]);
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
                      <div>{row.total}</div>
                      <div className="text-muted-foreground text-[12px] mt-0.5">
                        ({row.percentage}%)
                      </div>
                    </div>
                  </div>
                  <div className="grid-cell-data text-green-600 font-medium">{row.wins}</div>
                  <div className="grid-cell-data text-red-600 font-medium">{row.losses}</div>
                  <div className={`grid-cell-data font-medium ${row.winRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.winRate}%
                  </div>
                </React.Fragment>
              ));
            })()
          ) : (
            <div className="grid-cell-name" style={{gridColumn: '1 / -1'}}>No trades data available.</div>
          )}
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
        <div className="overflow-hidden rounded-lg border">
          <Table className="fixed-width-table">
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={currentColumns.length}
                    className="h-24 text-center"
                  >
                    No days data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing day-by-day analysis
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
