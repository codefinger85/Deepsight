// Sidebar components kept for future use but not currently imported
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/app/components/app-sidebar"
"use client"

import * as React from "react"
import { ChartAreaInteractive } from "@/app/components/chart-area-interactive"
import { DataTable } from "@/app/components/data-table"
import { SectionCards } from "@/app/components/section-cards"
import { SiteHeader } from "@/app/components/site-header"
import { 
  getLossReasonsWithConfirmations,
  getConfirmationAnalysisWithCounts,
  getTradesAnalysis,
  getDayAnalysis,
  getChartData,
  getTotalEarnings,
  getAllTradeStats,
  getTotalSessions,
  getSessionsAbove60Percent,
  getSessionsBelow60Percent,
  getSessionStats,
  type DateFilter,
  type ChartData
} from "@/lib/database"


function PageContent() {
  const [globalDateFilter, setGlobalDateFilter] = React.useState<DateFilter>("all")
  const [chartData, setChartData] = React.useState<ChartData[]>([])
  const [tableData, setTableData] = React.useState({
    lossReasonsData: [],
    confirmationAnalysisData: [],
    tradesAnalysisData: [],
    dayAnalysisData: [],
  })
  const [sectionData, setSectionData] = React.useState({
    totalEarnings: 0,
    overallWinRate: 0,
    totalSessions: 0,
    totalTrades: 0,
    totalWinningTrades: 0,
    totalLosingTrades: 0,
    totalDraws: 0,
    sessionsAbove60: 0,
    sessionsBelow60: 0,
    // New session stats
    bestSessionEarnings: 0,
    worstSessionEarnings: 0,
    averageSessionEarnings: 0,
    bestSessionWinRate: 0,
    worstSessionWinRate: 0,
    profitableSessions: 0,
    lossSessions: 0,
  })

  const fetchFilteredData = React.useCallback(async () => {
    const filter = globalDateFilter === "all" ? undefined : globalDateFilter
    const [
      chartDataResult, 
      lossReasonsData, 
      confirmationAnalysisData, 
      tradesAnalysisData, 
      dayAnalysisData,
      totalEarnings,
      tradeStats,
      totalSessions,
      sessionsAbove60,
      sessionsBelow60,
      sessionStats,
    ] = await Promise.all([
      getChartData(), // Chart data doesn't support filtering yet, so keep as is
      getLossReasonsWithConfirmations(filter),
      getConfirmationAnalysisWithCounts(filter),
      getTradesAnalysis(filter),
      getDayAnalysis(filter),
      getTotalEarnings(filter),
      getAllTradeStats(filter),
      getTotalSessions(filter),
      getSessionsAbove60Percent(filter),
      getSessionsBelow60Percent(filter),
      getSessionStats(filter),
    ])

    setChartData(chartDataResult)
    setTableData({
      lossReasonsData,
      confirmationAnalysisData,
      tradesAnalysisData,
      dayAnalysisData,
    })
    setSectionData({
      totalEarnings,
      overallWinRate: tradeStats.overallWinRate,
      totalSessions,
      totalTrades: tradeStats.totalTrades,
      totalWinningTrades: tradeStats.totalWins,
      totalLosingTrades: tradeStats.totalLosses,
      totalDraws: tradeStats.totalDraws,
      sessionsAbove60,
      sessionsBelow60,
      ...sessionStats,
    })
  }, [globalDateFilter])

  // Update chart and table data when global date filter changes
  React.useEffect(() => {
    fetchFilteredData()
  }, [fetchFilteredData])

  const handleDateFilterChange = React.useCallback((filter: DateFilter) => {
    setGlobalDateFilter(filter)
  }, [])


  return (
    <div className="flex flex-1 flex-col min-h-screen max-w-[1600px] mx-auto">
      <SiteHeader onRefreshData={fetchFilteredData} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <SectionCards 
              initialData={sectionData}
              currentFilter={globalDateFilter}
              onDateFilterChange={handleDateFilterChange}
            />
            <ChartAreaInteractive chartData={chartData} dateFilter={globalDateFilter} />
            <DataTable 
              initialData={tableData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return <PageContent />
}