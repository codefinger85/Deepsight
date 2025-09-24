import * as React from "react"

interface RangeCellProps {
  rangeValue: string
  className?: string
}

// Utility functions for range calculations
export const parseRangeData = (rangeValue: string): { wins: number; losses: number; draws: number; total: number } => {
  try {
    const [winsStr, lossesStr, drawsStr] = rangeValue.split('|');
    const wins = parseInt(winsStr) || 0;
    const losses = parseInt(lossesStr) || 0;
    const draws = parseInt(drawsStr) || 0;
    return { wins, losses, draws, total: wins + losses + draws };
  } catch {
    return { wins: 0, losses: 0, draws: 0, total: 0 };
  }
};

export const calculateRangeWinPercentage = (wins: number, losses: number): number => {
  const total = wins + losses;
  return total === 0 ? 0 : Math.round((wins / total) * 100);
};

export function RangeCell({ rangeValue, className = "" }: RangeCellProps) {
  const { wins, losses, total } = parseRangeData(rangeValue);
  const percentage = calculateRangeWinPercentage(wins, losses);

  return (
    <div className={`text-center text-sm ${className}`}>
      <div>
        {percentage}%
      </div>
      {total > 0 && (
        <div className="text-text-secondary text-[10px] mt-0.5 border-t pt-0.5 font-medium">
          {wins}W | {losses}L
        </div>
      )}
    </div>
  );
}