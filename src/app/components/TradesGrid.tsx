import * as React from "react"
import { TradesAnalysis } from "@/lib/database"
import { parseRangeData, calculateRangeWinPercentage } from "./RangeCell"
import "./table-styles.css"

interface TradesGridProps {
  data: TradesAnalysis[]
  className?: string
}

export function TradesGrid({ data, className = "" }: TradesGridProps) {
  return (
    <div className={`trade-grid-container ${className}`}>
      {/* Fixed Header */}
      <div className="trade-grid-header">
        <div className="grid-header">Analysis</div>
        <div className="grid-header">Total</div>
        <div className="grid-header">Wins</div>
        <div className="grid-header">Losses</div>
        <div className="grid-header">Winrate</div>
      </div>
      
      {/* Scrollable Content */}
      <div className="max-h-[425px] overflow-y-auto scrollbar-hide">
        <div className="trade-grid-content">
          {data.length > 0 ? (() => {
            const allTradesRow = data[0];
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
                    <div className="text-text-secondary text-[12px] mt-0.5">
                      ({row.percentage}%)
                    </div>
                  </div>
                </div>
                <div className="grid-cell-data font-regular">{row.wins}</div>
                <div className="grid-cell-data font-regular">{row.losses}</div>
                <div className="grid-cell-data font-semibold">
                  {row.winRate}%
                </div>
              </React.Fragment>
            ));
          })() : (
            <div className="grid-cell-name" style={{gridColumn: '1 / -1'}}>No trades data available.</div>
          )}
        </div>
      </div>
    </div>
  )
}