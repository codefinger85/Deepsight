// Sidebar components kept for future use but not currently imported
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/app/components/app-sidebar"
import { ChartAreaInteractive } from "@/app/components/chart-area-interactive"
import { DataTable } from "@/app/components/data-table"
import { SectionCards } from "@/app/components/section-cards"
import { SiteHeader } from "@/app/components/site-header"
import { 
  getTotalEarnings, 
  getOverallWinRate, 
  getTotalSessions, 
  getTotalTrades,
  getTotalWinningTrades,
  getTotalLosingTrades,
  getSessionsAbove60Percent,
  getSessionsBelow60Percent,
  getLossReasonsWithConfirmations,
  getConfirmationAnalysisWithCounts,
  getTradesAnalysis,
  getDayAnalysis,
  getChartData
} from "@/lib/database"


export default async function Page() {
  // Fetch trading data from Supabase
  const [totalEarnings, overallWinRate, totalSessions, totalTrades, totalWinningTrades, totalLosingTrades, sessionsAbove60, sessionsBelow60, lossReasonsData, confirmationAnalysisData, tradesAnalysisData, dayAnalysisData, chartData] = await Promise.all([
    getTotalEarnings(),
    getOverallWinRate(),
    getTotalSessions(),
    getTotalTrades(),
    getTotalWinningTrades(),
    getTotalLosingTrades(),
    getSessionsAbove60Percent(),
    getSessionsBelow60Percent(),
    getLossReasonsWithConfirmations(),
    getConfirmationAnalysisWithCounts(),
    getTradesAnalysis(),
    getDayAnalysis(),
    getChartData(),
  ]);

  return (
    <div className="flex flex-1 flex-col min-h-screen max-w-[1600px] mx-auto">
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards 
              initialData={{
                totalEarnings,
                overallWinRate,
                totalSessions,
                totalTrades,
                totalWinningTrades,
                totalLosingTrades,
                sessionsAbove60,
                sessionsBelow60,
              }}
            />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive chartData={chartData} />
            </div>
            <DataTable 
              lossReasonsData={lossReasonsData}
              confirmationAnalysisData={confirmationAnalysisData}
              tradesAnalysisData={tradesAnalysisData}
              dayAnalysisData={dayAnalysisData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}