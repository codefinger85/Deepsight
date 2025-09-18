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

  // Initial data fetch
  React.useEffect(() => {
    const fetchInitialData = async () => {
      const [chartDataResult, lossReasonsData, confirmationAnalysisData, tradesAnalysisData, dayAnalysisData] = await Promise.all([
        getChartData(),
        getLossReasonsWithConfirmations(),
        getConfirmationAnalysisWithCounts(),
        getTradesAnalysis(),
        getDayAnalysis(),
      ])

      setChartData(chartDataResult)
      setTableData({
        lossReasonsData,
        confirmationAnalysisData,
        tradesAnalysisData,
        dayAnalysisData,
      })
    }

    fetchInitialData()
  }, [])

  // Update chart and table data when global date filter changes
  React.useEffect(() => {
    const fetchFilteredData = async () => {
      if (globalDateFilter === "all") return // SectionCards will handle "all" case

      const filter = globalDateFilter === "all" ? undefined : globalDateFilter
      const [chartDataResult, lossReasonsData, confirmationAnalysisData, tradesAnalysisData, dayAnalysisData] = await Promise.all([
        getChartData(), // Chart data doesn't support filtering yet, so keep as is
        getLossReasonsWithConfirmations(filter),
        getConfirmationAnalysisWithCounts(filter),
        getTradesAnalysis(filter),
        getDayAnalysis(filter),
      ])

      setTableData({
        lossReasonsData,
        confirmationAnalysisData,
        tradesAnalysisData,
        dayAnalysisData,
      })
    }

    fetchFilteredData()
  }, [globalDateFilter])

  const handleDateFilterChange = (filter: DateFilter) => {
    setGlobalDateFilter(filter)
  }

  const initialSectionData = {
    totalEarnings: 0,
    overallWinRate: 0,
    totalSessions: 0,
    totalTrades: 0,
    totalWinningTrades: 0,
    totalLosingTrades: 0,
    sessionsAbove60: 0,
    sessionsBelow60: 0,
  }

  return (
    <div className="flex flex-1 flex-col min-h-screen max-w-[1600px] mx-auto">
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards 
              initialData={initialSectionData}
              onDateFilterChange={handleDateFilterChange}
            />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive chartData={chartData} dateFilter={globalDateFilter} />
            </div>
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