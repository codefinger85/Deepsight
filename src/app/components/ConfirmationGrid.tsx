import * as React from "react"
import { RangeCell } from "./RangeCell"
import { ConfirmationAnalysis } from "@/lib/database"
import "./table-styles.css"

interface ConfirmationGridProps {
  data: ConfirmationAnalysis[]
  className?: string
}

export function ConfirmationGrid({ data, className = "" }: ConfirmationGridProps) {
  return (
    <div className={`confirmation-grid-container ${className}`}>
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
      <div className="max-h-[425px] overflow-y-auto scrollbar-hide">
        <div className="confirmation-grid-content">
          {data.length > 0 ? (
            data.map((row, index) => (
              <React.Fragment key={index}>
                <div className="grid-cell-name">{row.confirmation}</div>
                <div className="grid-cell-data font-semibold">{row.totalCount}</div>
                <div className="grid-cell-data font-regular">{row.winCount}</div>
                <div className="grid-cell-data font-regular">{row.lossCount}</div>
                <div className="grid-cell-data font-semibold">
                  {row.winPercentage}%
                </div>
                <div className="grid-cell-data">
                  <RangeCell rangeValue={row.conf1} />
                </div>
                <div className="grid-cell-data">
                  <RangeCell rangeValue={row.conf2} />
                </div>
                <div className="grid-cell-data">
                  <RangeCell rangeValue={row.conf3} />
                </div>
                <div className="grid-cell-data">
                  <RangeCell rangeValue={row.conf4} />
                </div>
                <div className="grid-cell-data">
                  <RangeCell rangeValue={row.conf5} />
                </div>
                <div className="grid-cell-data">
                  <RangeCell rangeValue={row.conf6} />
                </div>
                <div className="grid-cell-data">
                  <RangeCell rangeValue={row.conf7} />
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="grid-cell-data col-span-12 text-center text-text-secondary py-8">
              No confirmation data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}