import React, { useState, useEffect } from 'react';
import { Session, Trade } from '../types/trade';
import { parseISO, differenceInSeconds } from 'date-fns';

// Helper function to format duration in SECONDS to H:MM:SS
function formatSecondsToHHMMSS(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '0:00:00';
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  
  return `${hours}:${paddedMinutes}:${paddedSeconds}`;
}

// Helper function to format duration in SECONDS to "Xm" format
function formatSecondsToMinutesString(totalSeconds: number): string {
  // Match logScreen: return "-" for invalid, null (implicitly handled by NaN check), or <= 0
  if (isNaN(totalSeconds) || totalSeconds <= 0) { 
    return '-';
  }
  // Handle less than 1 minute
  if (totalSeconds < 60) { 
    return '<1m';
  }
  // Calculate total minutes using floor
  const totalMinutes = Math.floor(totalSeconds / 60); 
  return `${totalMinutes}m`;
}

interface SessionDataBarProps {
  sessionData: Session | undefined;
  trades: Trade[];
}

const SessionDataBar: React.FC<SessionDataBarProps> = ({ sessionData, trades }) => {
  const [currentDuration, setCurrentDuration] = useState<string>('00:00:00');

  // Calculate live duration using start time from sessionStorage
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    // Ensure we're running on the client side
    if (typeof window === 'undefined') return;
    
    const startTimeString = sessionStorage.getItem('tradeConfirmer_sessionStartTime');

    if (startTimeString) {
      try {
        const startTime = parseISO(startTimeString); // Parse the stored ISO string
        
        const updateDuration = () => {
          const now = new Date();
          const diffSeconds = differenceInSeconds(now, startTime);
          setCurrentDuration(formatSecondsToHHMMSS(diffSeconds));
        };

        updateDuration(); // Initial update
        intervalId = setInterval(updateDuration, 1000); // Update every second
      } catch (error) {
        console.error("Error parsing stored start time:", error);
        setCurrentDuration('00:00:00'); // Reset on parsing error
      }
    } else {
      // If no start time in storage (e.g., page reload before session sync), 
      // potentially fall back to sessionData prop if needed, or just show 00:00:00.
      // For now, just show 00:00:00 if not found in storage.
      setCurrentDuration('00:00:00');
    }

    // Cleanup interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  // Run only once on mount, reading directly from sessionStorage
  }, []);

  // Calculate average interval in SECONDS
  const calculateAverageIntervalSeconds = (): number => {
    if (trades.length < 2) {
      return 0; 
    }
    const sortedTrades = [...trades].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    let totalIntervalSeconds = 0;
    for (let i = 1; i < sortedTrades.length; i++) {
      const time1 = parseISO(sortedTrades[i - 1].date);
      const time2 = parseISO(sortedTrades[i].date);
      totalIntervalSeconds += differenceInSeconds(time2, time1);
    }
    const averageSeconds = totalIntervalSeconds / (sortedTrades.length - 1);
    // Return the average in seconds, rounded to the nearest second
    return Math.round(averageSeconds);
  };

  // Rename variable to reflect seconds
  const averageIntervalSeconds = calculateAverageIntervalSeconds();

  const tradesCount = sessionData?.tradesCount ?? 0;
  const winRate = sessionData?.winRate ?? 0;

  return (
    <div className="flex justify-between border border-slate-200 rounded-md px-3 py-2 mb-10">
      <div className="flex flex-col items-start gap-0.5 w-[50px]">
        <p className="font-normal text-[11px] text-slate-400 tracking-tight">Duration</p>
        <p className="font-normal text-xs text-slate-500">{currentDuration}</p>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <p className="font-normal text-[11px] text-slate-400 tracking-tight">Count</p>
        <p className="font-normal text-xs text-slate-500">{tradesCount}</p>
      </div>
      <div className="flex flex-col items-center gap-0.5 w-[47px]">
        <p className="font-normal text-[11px] text-slate-400 tracking-tight">Interval</p>
        <p className="font-normal text-xs text-slate-500">{formatSecondsToMinutesString(averageIntervalSeconds)}</p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <p className="font-normal text-[11px] text-slate-400 tracking-tight">Winrate</p>
        <p className="font-semibold text-xs text-slate-700">{winRate}%</p>
      </div>
    </div>
  );
};

export default SessionDataBar; 