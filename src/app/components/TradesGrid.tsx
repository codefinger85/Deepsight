import * as React from "react"
import { TradesAnalysis } from "@/lib/database"
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
        <div className="grid-header">Trades</div>
        <div className="grid-header">Total</div>
        <div className="grid-header">Wins</div>
        <div className="grid-header">Losses</div>
        <div className="grid-header">Winrate</div>
      </div>
      
      {/* Scrollable Content */}
      <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
        <div className="trade-grid-content">
          {data.length > 0 ? (
            data.map((row, index) => (
              <React.Fragment key={index}>
                <div className="grid-cell-name">{row.tradeName}</div>
                <div className="grid-cell-data font-semibold">{row.totalCount}</div>
                <div className="grid-cell-data font-regular">{row.winCount}</div>
                <div className="grid-cell-data font-regular">{row.lossCount}</div>
                <div className="grid-cell-data font-semibold">
                  {row.winPercentage}%
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="grid-cell-data col-span-5 text-center text-text-secondary py-8">
              No trades data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}