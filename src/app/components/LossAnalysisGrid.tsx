import * as React from "react"
import { RangeCell } from "./RangeCell"
import { LossReasonAnalysis } from "@/lib/database"
import "./table-styles.css"

interface LossAnalysisGridProps {
  data: LossReasonAnalysis[]
  className?: string
}

export function LossAnalysisGrid({ data, className = "" }: LossAnalysisGridProps) {
  return (
    <div className={`loss-grid-container ${className}`}>
      {/* Fixed Header */}
      <div className="loss-grid-header">
        <div className="grid-header">Loss Reason</div>
        <div className="grid-header">Total</div>
        <div className="grid-header">Loss Rate</div>
        <div className="grid-header">1 Conf</div>
        <div className="grid-header">2 Conf</div>
        <div className="grid-header">3 Conf</div>
        <div className="grid-header">4 Conf</div>
        <div className="grid-header">5 Conf</div>
        <div className="grid-header">6 Conf</div>
        <div className="grid-header">7 Conf</div>
        <div className="grid-header">8 Conf</div>
      </div>
      
      {/* Scrollable Content */}
      <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
        <div className="loss-grid-content">
          {data.length > 0 ? (
            data.map((row, index) => (
              <React.Fragment key={index}>
                <div className="grid-cell-name">{row.lossReason}</div>
                <div className="grid-cell-data font-semibold">{row.totalCount}</div>
                <div className="grid-cell-data font-semibold">{row.lossPercentage}%</div>
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
                <div className="grid-cell-data">
                  <RangeCell rangeValue={row.conf8} />
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="grid-cell-data col-span-11 text-center text-text-secondary py-8">
              No loss analysis data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}