import * as React from "react"
import "./table-styles.css"

// Define day analysis data type
interface DayAnalysisData {
  day: string
  totalCount: number
  winCount: number
  lossCount: number
  winPercentage: number
}

interface DayAnalysisGridProps {
  data: DayAnalysisData[]
  className?: string
}

export function DayAnalysisGrid({ data, className = "" }: DayAnalysisGridProps) {
  return (
    <div className={`day-grid-container ${className}`}>
      {/* Fixed Header */}
      <div className="day-grid-header">
        <div className="grid-header">Day</div>
        <div className="grid-header">Total</div>
        <div className="grid-header">Wins</div>
        <div className="grid-header">Losses</div>
        <div className="grid-header">Winrate</div>
      </div>
      
      {/* Scrollable Content */}
      <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
        <div className="day-grid-content">
          {data.length > 0 ? (
            data.map((row, index) => (
              <React.Fragment key={index}>
                <div className="grid-cell-name">{row.day}</div>
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
              No day analysis data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}