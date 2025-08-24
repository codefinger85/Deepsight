"use client"

import * as React from "react"
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
import { LossReasonAnalysis, WinningConfirmationAnalysis, ConfirmationAnalysis } from "@/lib/database"

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

const lossReasonColumns: ColumnDef<z.infer<typeof lossReasonSchema>>[] = [
  {
    accessorKey: "lossReason",
    header: "Loss Reason",
    cell: ({ row }) => (
      <div className="font-medium max-w-48">
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
    header: "Confirmation",
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
    accessorKey: "winCount",
    header: () => <div className="text-center">Wins</div>,
    cell: ({ row }) => (
      <div className="text-center text-green-600 font-medium">
        {row.original.winCount}
      </div>
    ),
  },
  {
    accessorKey: "lossCount",
    header: () => <div className="text-center">Losses</div>,
    cell: ({ row }) => (
      <div className="text-center text-red-600 font-medium">
        {row.original.lossCount}
      </div>
    ),
  },
  {
    accessorKey: "winPercentage",
    header: () => <div className="text-center">Win %</div>,
    cell: ({ row }) => {
      const percentage = row.original.winPercentage;
      return (
        <div className={`text-center font-medium ${percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
          {percentage}%
        </div>
      );
    },
  },
  {
    accessorKey: "conf1",
    header: () => <div className="text-center">1 Conf</div>,
    cell: ({ row }) => {
      const [wins, losses] = row.original.conf1.split('|');
      return (
        <div className="text-center text-sm">
          <span className="text-green-600">{wins}</span>
          <span className="text-gray-400">|</span>
          <span className="text-red-600">{losses}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "conf2",
    header: () => <div className="text-center">2 Conf</div>,
    cell: ({ row }) => {
      const [wins, losses] = row.original.conf2.split('|');
      return (
        <div className="text-center text-sm">
          <span className="text-green-600">{wins}</span>
          <span className="text-gray-400">|</span>
          <span className="text-red-600">{losses}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "conf3",
    header: () => <div className="text-center">3 Conf</div>,
    cell: ({ row }) => {
      const [wins, losses] = row.original.conf3.split('|');
      return (
        <div className="text-center text-sm">
          <span className="text-green-600">{wins}</span>
          <span className="text-gray-400">|</span>
          <span className="text-red-600">{losses}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "conf4",
    header: () => <div className="text-center">4 Conf</div>,
    cell: ({ row }) => {
      const [wins, losses] = row.original.conf4.split('|');
      return (
        <div className="text-center text-sm">
          <span className="text-green-600">{wins}</span>
          <span className="text-gray-400">|</span>
          <span className="text-red-600">{losses}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "conf5",
    header: () => <div className="text-center">5 Conf</div>,
    cell: ({ row }) => {
      const [wins, losses] = row.original.conf5.split('|');
      return (
        <div className="text-center text-sm">
          <span className="text-green-600">{wins}</span>
          <span className="text-gray-400">|</span>
          <span className="text-red-600">{losses}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "conf6",
    header: () => <div className="text-center">6 Conf</div>,
    cell: ({ row }) => {
      const [wins, losses] = row.original.conf6.split('|');
      return (
        <div className="text-center text-sm">
          <span className="text-green-600">{wins}</span>
          <span className="text-gray-400">|</span>
          <span className="text-red-600">{losses}</span>
        </div>
      );
    },
  },
]

export function DataTable({
  lossReasonsData,
  confirmationAnalysisData,
}: {
  lossReasonsData: z.infer<typeof lossReasonSchema>[]
  confirmationAnalysisData: z.infer<typeof confirmationAnalysisSchema>[]
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

  // Determine which data and columns to use based on active tab
  const currentData = activeTab === "outline" ? lossReasonsData : confirmationAnalysisData
  const currentColumns = activeTab === "outline" ? lossReasonColumns : confirmationAnalysisColumns

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
            <SelectItem value="outline">Most Common Loss Reasons</SelectItem>
            <SelectItem value="past-performance">Confirmation Analysis</SelectItem>
            <SelectItem value="key-personnel">Key Personnel</SelectItem>
            <SelectItem value="focus-documents">Focus Documents</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Most Common Loss Reasons</TabsTrigger>
          <TabsTrigger value="past-performance">
            Confirmation Analysis
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
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
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
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
                    {activeTab === "outline" ? "No loss reason data available." : "No confirmation analysis data available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing {table.getFilteredRowModel().rows.length} {activeTab === "outline" ? "loss reasons" : "confirmations"}
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
          <Table>
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
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
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
