import { useState, useEffect, useMemo } from "react";
import { useSessionsWithTrades } from '@/hooks/useSessionsWithTrades';
import { Card } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X, CircleCheck, Ban, Equal, ChevronDown } from "lucide-react";
import { format, isAfter, isBefore, isSameDay, parseISO, differenceInSeconds } from "date-fns";
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { Session } from "@/types/trade";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LossReasonIcon from "./LossReasonIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface LogScreenProps {
  sessions: Session[];
  onBack?: () => void; // Made optional as we're not using it anymore
  onTradeDeleted?: () => Promise<void>;
}

type TradeData = [number, string, number, string, "win" | "loss" | "draw", string, string | null];

const cleanConfirmationText = (text: string) => {
  return text
    .replace(/[\[\]"]/g, '') // Remove brackets and quotes
    .split(',')
    .map(item => item.trim())
    .filter(item => item); // Remove empty items
};

// Helper function to format duration in seconds to HH:MM:SS
const formatDuration = (totalSeconds: number | null): string => {
  if (totalSeconds === null || totalSeconds < 0) return "-";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Helper function to format interval in seconds to "Xm"
const formatInterval = (totalSeconds: number | null): string => {
  if (totalSeconds === null || totalSeconds <= 0) return "-";
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 1) {
    return "<1m";
  }
  return `${minutes}m`;
};

// Function to calculate average interval based on trades (like SessionDataBar)
const calculateAverageIntervalSecondsLog = (trades: TradeData[]): number | null => {
  if (!trades || trades.length < 2) {
    return null; // Return null instead of 0 for formatting consistency
  }
  // Sort trades by date (index 1 is the date string)
  const sortedTrades = [...trades].sort((a, b) => parseISO(a[1]).getTime() - parseISO(b[1]).getTime());
  let totalIntervalSeconds = 0;
  for (let i = 1; i < sortedTrades.length; i++) {
    const time1 = parseISO(sortedTrades[i - 1][1]);
    const time2 = parseISO(sortedTrades[i][1]);
    totalIntervalSeconds += differenceInSeconds(time2, time1);
  }
  const averageSeconds = totalIntervalSeconds / (sortedTrades.length - 1);
  return Math.round(averageSeconds);
};

export default function LogScreen({ sessions = [], onTradeDeleted }: LogScreenProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [sessionTrades, setSessionTrades] = useState<Record<string, TradeData[]>>({});
  const [localSessions, setLocalSessions] = useState<Session[]>(sessions);
  const [showEndPrompt, setShowEndPrompt] = useState(false);
  const [sessionToEnd, setSessionToEnd] = useState<string | null>(null);
  const [displayedWinrate, setDisplayedWinrate] = useState<number>(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [liveDuration, setLiveDuration] = useState<number | null>(null);

  // Load active session ID from sessionStorage after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActiveSessionId(sessionStorage.getItem('tradeConfirmer_sessionId'));
    }
  }, []);

  useEffect(() => {
    setLocalSessions(sessions);
  }, [sessions]);

  // Use React Query for persistent caching
  const { data: sessionsWithTrades, error: dataError } = useSessionsWithTrades();
  
  // Update local state when React Query data changes
  useEffect(() => {
    if (sessionsWithTrades) {
      // Convert sessions data to the format expected by the component
      const formattedSessions: Session[] = sessionsWithTrades.sessions.map(
        ([sessionId, date, winCount, lossCount, tradesCount, winRate, startingBalance, closingBalance, sessionDuration, tradesInterval]) => ({
          sessionId: sessionId as string,
          date: date as string,
          winCount: winCount as number,
          lossCount: lossCount as number,
          tradesCount: tradesCount as number,
          winRate: winRate as number,
          startingBalance: startingBalance === null ? undefined : startingBalance as number,
          closingBalance: closingBalance === null ? undefined : closingBalance as number,
          trades: [],
          sessionDuration: sessionDuration as number,
          tradesInterval: tradesInterval as number,
        })
      );
      
      // Convert trades data to match TradeData type
      const convertedTrades: Record<string, TradeData[]> = {};
      Object.entries(sessionsWithTrades.trades).forEach(([sessionId, trades]) => {
        convertedTrades[sessionId] = trades.map(trade => trade as TradeData);
      });
      
      setLocalSessions(formattedSessions);
      setSessionTrades(convertedTrades);
      setIsInitialLoad(false);
    }
  }, [sessionsWithTrades]);
  
  // Show error if data loading failed
  useEffect(() => {
    if (dataError) {
      console.error("Error fetching sessions with trades:", dataError);
      setIsInitialLoad(false);
    }
  }, [dataError]);

  // Effect for live duration updates for the active session
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const activeSession = localSessions.find(s => s.sessionId === activeSessionId);

    if (activeSession) {
      const startTime = parseISO(activeSession.date).getTime();
      
      const updateLiveData = async () => {
        const now = Date.now();
        const durationSeconds = Math.floor((now - startTime) / 1000);
        setLiveDuration(durationSeconds);
        
        // Removed incorrect live interval calculation logic
      };

      // Initial update
      updateLiveData(); 

      // Set interval for subsequent updates
      intervalId = setInterval(updateLiveData, 1000);

    } else {
      // Reset if no active session or it's not in the filtered list
      setLiveDuration(null);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  // Rerun only when activeSessionId or localSessions change
  }, [activeSessionId, localSessions]);

  const filteredSessions = localSessions
    .filter((session) => {
      if (!selectedRange.start || !selectedRange.end) return true;
      try {
        const sessionDate = toZonedTime(parseISO(session.date), 'Europe/Paris');
        return (
          (isAfter(sessionDate, selectedRange.start) || isSameDay(sessionDate, selectedRange.start)) &&
          (isBefore(sessionDate, selectedRange.end) || isSameDay(sessionDate, selectedRange.end))
        );
      } catch (error) {
        console.error("Error parsing date:", error);
        return false;
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const resetDate = () => {
    setSelectedRange({
      start: null,
      end: null,
    });
  };

  const handleDeleteTrade = async (tradeId: number, sessionId: string) => {
    try {
      // Delete trade (this will also update session stats)
      const deleteResponse = await fetch(`/api/trades/${tradeId}`, {
        method: 'DELETE',
      });
      
      if (!deleteResponse.ok) {
        throw new Error(`HTTP error! status: ${deleteResponse.status}`);
      }
      
      // Get the updated trades
      const tradesResponse = await fetch(`/api/trades/session/${sessionId}`);
      if (!tradesResponse.ok) {
        throw new Error(`HTTP error! status: ${tradesResponse.status}`);
      }
      const updatedTrades: TradeData[] = await tradesResponse.json();
      
      // Update trades in state
      setSessionTrades(prev => ({
        ...prev,
        [sessionId]: updatedTrades
      }));

      // If this was the active session and we just deleted the last trade
      if (sessionId === activeSessionId && updatedTrades.length === 0) {
        // Show the notification
        setSessionToEnd(sessionId);
        setShowEndPrompt(true);
        // Clear session storage
        sessionStorage.removeItem('tradeConfirmer_sessionId');
        sessionStorage.removeItem('tradeConfirmer_lastTrade');
      }

      // Get updated sessions
      const sessionsResponse = await fetch('/api/sessions');
      if (!sessionsResponse.ok) {
        throw new Error(`HTTP error! status: ${sessionsResponse.status}`);
      }
      const updatedSessions: [string, string, number, number, number, number, number | null, number | null, number, number][] = await sessionsResponse.json();
      
      const sessionData: Session[] = updatedSessions.map(
        ([sessionId, date, winCount, lossCount, tradesCount, winRate, startingBalance, closingBalance, sessionDuration, tradesInterval]) => ({
          sessionId,
          date,
          winCount,
          lossCount,
          tradesCount,
          winRate,
          startingBalance: startingBalance === null ? undefined : startingBalance,
          closingBalance: closingBalance === null ? undefined : closingBalance,
          trades: [],
          sessionDuration,
          tradesInterval,
        })
      );
      
      setLocalSessions(sessionData);
      
      // Call the parent callback if provided
      if (onTradeDeleted) {
        await onTradeDeleted();
      }
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  // Calculate average win rate only from sessions with trades
  const averageWinRate = useMemo(() => {
    if (filteredSessions.length === 0) return 0;
    
    const sessionsWithTrades = filteredSessions.filter(session => 
      (sessionTrades[session.sessionId] || []).length > 0
    );
    
    if (sessionsWithTrades.length === 0) return 0;
    
    const total = sessionsWithTrades.reduce((sum, session) => sum + session.winRate, 0);
    return Math.round(total / sessionsWithTrades.length);
  }, [filteredSessions, sessionTrades]);

  // Animate winrate changes
  useEffect(() => {
    if (isInitialLoad) return;

    let startTime: number | null = null;
    let animationFrame: number;
    const startValue = displayedWinrate;
    const targetValue = averageWinRate;
    const ANIMATION_DURATION = 1000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / ANIMATION_DURATION, 1);
      
      const eased = progress * (2 - progress);
      const currentValue = Math.round(startValue + (targetValue - startValue) * eased);
      
      setDisplayedWinrate(currentValue);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [averageWinRate, isInitialLoad, displayedWinrate]);

  // Calculate aggregated stats for the selected date range
  const selectedRangeStats = useMemo(() => {
    if (filteredSessions.length === 0) {
      return {
        totalWins: 0,
        totalLosses: 0,
        totalTrades: 0,
        totalDraws: 0,
        averageDurationSeconds: null,
        averageIntervalSeconds: null,
        totalEarnings: 0,
      };
    }

    let totalWins = 0;
    let totalLosses = 0;
    let totalTrades = 0;
    let totalDurationSeconds = 0;
    let totalIntervalSeconds = 0;
    let sessionsWithDurationCount = 0;
    let sessionsWithIntervalCount = 0;
    let totalEarnings = 0;

    for (const session of filteredSessions) {
      totalWins += session.winCount;
      totalLosses += session.lossCount;
      totalTrades += session.tradesCount;

      // Check if sessionDuration exists and is valid before using
      if (session.sessionDuration !== undefined && session.sessionDuration !== null && session.sessionDuration > 0) {
        totalDurationSeconds += session.sessionDuration;
        sessionsWithDurationCount++;
      }

      // Check if tradesInterval exists and is valid before using
      if (session.tradesInterval !== undefined && session.tradesInterval !== null && session.tradesInterval > 0) {
        totalIntervalSeconds += session.tradesInterval;
        sessionsWithIntervalCount++;
      }

      if (session.closingBalance !== null && session.closingBalance !== undefined && session.startingBalance !== undefined) {
        totalEarnings += (session.closingBalance - session.startingBalance);
      }
    }

    const averageDurationSeconds = sessionsWithDurationCount > 0 
      ? Math.round(totalDurationSeconds / sessionsWithDurationCount) 
      : null;
    const averageIntervalSeconds = sessionsWithIntervalCount > 0 
      ? Math.round(totalIntervalSeconds / sessionsWithIntervalCount) 
      : null;
    const totalDraws = totalTrades - totalWins - totalLosses;

    return {
      totalWins,
      totalLosses,
      totalTrades,
      totalDraws,
      averageDurationSeconds,
      averageIntervalSeconds,
      totalEarnings,
    };
  }, [filteredSessions]);

  // Add console log for debugging
  console.log("LogScreen Rendering:", {
    propsSessions: sessions, // Check the incoming prop
    localSessionsState: localSessions, // Check the local state
    filteredSessionsResult: filteredSessions, // Check the derived filtered list
    sessionTradesState: sessionTrades // Check the fetched trades
  });

    return (
      <div className="container mx-auto pb-8 px-8">
          <Card className="card-container">
            <div className="pt-6">
              {showEndPrompt && sessionToEnd && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="flex flex-col gap-2.5 w-[260px] bg-white p-5 rounded-lg border border-solid border-slate-200">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-semibold text-[15px] leading-[16px] text-slate-700">Session Deleted</span>
                        <span className="font-normal text-[14px] leading-[20px] text-slate-500">You&apos;ve deleted all trades in your session and the session has been deleted.</span>
                      </div>
                      <div className="flex items-center gap-3 h-7">
                        <button
                          onClick={() => {
                            setShowEndPrompt(false);
                            setSessionToEnd(null);
                            window.location.href = '/';
                          }}
                          className="w-[67px] flex justify-center items-center gap-2.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-md transition-colors duration-200"
                        >
                          <span className="font-semibold text-[12px] leading-[20px] text-slate-50">OK</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full flex items-center flex-col">
                <div className="w-full flex items-center justify-between bg-white rounded-lg border border-solid border-slate-200 px-3 py-2.5">
                  <div className="flex items-center justify-between w-full pr-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-xs text-slate-700 leading-none">
                      {selectedRange.start && selectedRange.end 
                        ? `${format(selectedRange.start, "d MMM")} - ${format(selectedRange.end, "d MMM")}`
                        : "Winrate all-time"}
                    </span>
                    <span className="font-normal text-xs text-slate-400 leading-none">
                      {filteredSessions.length} sessions
                    </span>
                  </div>

                  <span className="font-medium text-md text-slate-800">{displayedWinrate}%</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-px bg-slate-200"></div>
                    
                    <button
                      onClick={resetDate}
                      className="toolbar-action-reset w-3.5 h-3.5 text-slate-400 hover:text-slate-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                          <path d="M3 3v5h5"/>
                        </svg>
                    </button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors duration-200 ease-in-out">
                          <CalendarIcon className="w-4 h-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-auto p-0"
                        align="end"
                        side="bottom"
                        sideOffset={5}
                        alignOffset={-10}
                        collisionPadding={10}
                        avoidCollisions={true}
                      >
                        <Calendar
                          mode="range"
                          selected={{
                            from: selectedRange.start || undefined,
                            to: selectedRange.end || undefined,
                          }}
                          onSelect={(range) => {
                            setSelectedRange({
                              start: range?.from || null,
                              end: range?.to || null,
                            });
                            if (range?.to) {
                              const popoverTrigger = document.querySelector('[data-state="open"]');
                              if (popoverTrigger) {
                                (popoverTrigger as HTMLElement).click();
                              }
                            }
                          }}
                          numberOfMonths={2}
                          className="rounded-md border border-gray-200"
                          weekStartsOn={1}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="selected-range-details-dropdown-wrap w-full mb-10">
                  
                    <Accordion type="single" collapsible className="w-full border-none shadow-none">
                      <AccordionItem value="selected-range-details" className="data-[state=open]:border-none group border-none">
                        <div className="flex justify-center items-center w-full -mt-[12px]">
                          <span className="relative inline-flex items-center justify-center border border-slate-200 rounded-2xl bg-white shrink-0 w-5 h-5">
                            <AccordionTrigger 
                              className="hover:no-underline text-transparent hover:text-transparent p-0 [&>svg]:invisible flex items-center justify-center w-full h-full"
                            >
                            </AccordionTrigger>
                            <ChevronDown className="absolute w-3.5 h-3.5 text-slate-400 group-data-[state=open]:text-slate-700 group-data-[state=open]:rotate-180 transition-transform duration-200 pointer-events-none" />
                          </span>
                        </div>
                        <AccordionContent className="pt-0 pb-4 border border-slate-200 rounded-md mt-1.5 mb-2 shadow-sm px-0">
                        <div className="flex justify-between items-center border-b border-slate-200 px-4 py-3 bg-slate-50 rounded-tr-md rounded-tl-md">
                          <span className="text-xs font-medium text-slate-700 pt-[1px]">Period details</span>
                            </div>
                          <div className="flex flex-col gap-2.5 pt-4 px-4">                 
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Avg. session duration</span>
                              <span className="text-xs text-slate-400">{formatDuration(selectedRangeStats.averageDurationSeconds)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Avg. trade interval</span>
                              <span className="text-xs text-slate-400">{formatInterval(selectedRangeStats.averageIntervalSeconds)}</span>   
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Trades count</span>
                              <span className="text-xs text-slate-400">{selectedRangeStats.totalTrades}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Loss count</span>
                              <span className="text-xs text-slate-400">{selectedRangeStats.totalLosses}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Draw count</span>
                              <span className="text-xs text-slate-400">{selectedRangeStats.totalDraws}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1 pt-3 border-t border-slate-200">
                              <span className="text-xs font-normal text-slate-400">Win count</span>
                              <span className="text-xs font-medium text-slate-500">{selectedRangeStats.totalWins}</span>
                            </div>
                             <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-slate-500">Earnings</span>
                              <span className={`text-xs font-medium ${selectedRangeStats.totalEarnings > 0 ? 'text-emerald-500' : selectedRangeStats.totalEarnings < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                                {/* Show sign only if non-zero, remove explicit $ */}
                                {selectedRangeStats.totalEarnings > 0 ? '+ ' : selectedRangeStats.totalEarnings < 0 ? '- ' : ''}${Math.abs(selectedRangeStats.totalEarnings).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  
                </div>
              </div>

              <div className="logscreen-heading-wrap flex items-center mb-10 px-2">
                <h2 className="logscreen-heading text-xl tracking-tight font-medium bg-gradient-to-b from-slate-950 to-[#708fbb] inline-block text-transparent bg-clip-text">Trade log</h2>
              </div>

              <div className="session-list flex-1 overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
                {filteredSessions.length === 0 ? (
                  <div className="empty-sessions">
                    No sessions yet
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <div key={session.sessionId} className="flex flex-col items-center self-stretch [&:not(:first-child)]:mt-12">                     
                      
                      <div className="session-table-header-wrap flex flex-col w-full px-4 gap-2 pb-4 pt-4 border-t border-r border-l border-slate-200 rounded-tl-md rounded-tr-md bg-slate-50">
                        <div className="session-table-header-top-row flex justify-between items-center w-full">
                          <span className="font-medium text-xs leading-none tracking-tight text-slate-700 text-left">
                            {formatInTimeZone(parseISO(session.date), 'Europe/Paris', 'd MMM yyyy')}
                          </span>
                          <div className="flex flex-row items-center gap-2">
                            <span className="font-normal text-xs text-slate-400 leading-none">Winrate</span>
                          {/*<span className="py-1.5 px-2 min-w-[50px] border border-slate-200 rounded-2xl font-medium text-[11px] text-slate-700 bg-white leading-none text-center">{session.winRate}%</span>*/}
                         
                          </div>
                        </div>

                        <div className="session-table-header-bottom-row flex justify-between items-center w-full">
                          
                          {session.startingBalance !== undefined && (
                            <div className="w-fit h-[15px] flex gap-1">
                              <span className="font-medium text-[12px] text-slate-400">
                                ${session.startingBalance.toFixed(2)}
                              </span>
                              {((): React.ReactNode => {
                                if (session.sessionId === activeSessionId && session.closingBalance == null) {
                                  return (
                                    <span className="font-medium text-[12px] text-slate-400">
                                      (Active)
                                    </span>
                                  );
                                }
                                
                                const startBalance = session.startingBalance ?? 0;
                                const closing = session.closingBalance ?? startBalance;
                                const profitLoss = closing - startBalance;
                                const sign = profitLoss > 0 ? '+' : profitLoss < 0 ? '-' : '+';
                                const colorClass = 
                                  profitLoss > 0 ? 'text-emerald-500' : 
                                  profitLoss < 0 ? 'text-red-400' : 
                                  'text-slate-400';

                                return (
                                  <span className={`font-medium text-[12px] ${colorClass}`}>
                                    {sign} ${Math.abs(profitLoss).toFixed(2)}
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                          <span className="min-w-[33px] font-medium text-xs text-slate-700 leading-none text-right">{session.winRate}%</span>
                        </div>
                      </div>

                      <div className="session-table-trades-list w-full mx-3 px-4 pb-3 pt-3 mt-0 border border-slate-200 rounded-br-md rounded-bl-md">
                      <div className="session-table-trades-list-top-row w-full mb-1">
                        <Accordion type="single" collapsible className="w-full border-none shadow-none">
                          <AccordionItem value={`session-details-${session.sessionId}`} className="data-[state=open]:border-none group border-none">               
                            <div className="flex justify-center items-center w-full -mt-[22px]">
                              <span className="relative inline-flex items-center justify-center border border-slate-200 rounded-2xl bg-white shrink-0 w-5 h-5">
                                <AccordionTrigger 
                                  className="hover:no-underline text-transparent hover:text-transparent p-0 [&>svg]:invisible flex items-center justify-center w-full h-full"
                                >
                                </AccordionTrigger>
                                {/* Absolutely positioned custom icon with group-based rotation */}
                                <ChevronDown className="absolute w-3.5 h-3.5 text-slate-400 group-data-[state=open]:text-slate-700 group-data-[state=open]:rotate-180 transition-transform duration-200 pointer-events-none" />
                              </span>
                              
                            </div>

                            <AccordionContent className="pt-0 pb-4 border border-slate-200 rounded-md mt-1.5 mb-2 shadow-sm px-0">
                            <div className="flex justify-between items-center border-b border-slate-200 px-4 py-3 bg-slate-50 rounded-tl-md rounded-tr-md">
                              <span className="text-xs font-medium text-slate-700 pt-[1px]">Session details</span>
                                </div>
                              <div className="flex flex-col gap-2.5 pt-4 px-4">
                                {
                                  (() => {
                                    const isCurrentActive = session.sessionId === activeSessionId;
                                    const duration = isCurrentActive ? liveDuration : (session.sessionDuration ?? null);
                                    
                                    // Calculate interval correctly for active session, else use stored value
                                    let intervalSeconds: number | null;
                                    if (isCurrentActive) {
                                      const currentTrades = sessionTrades[session.sessionId] || [];
                                      intervalSeconds = calculateAverageIntervalSecondsLog(currentTrades);
                                    } else {
                                      intervalSeconds = session.tradesInterval ?? null;
                                    }
                                    
                                    const tradesCount = session.tradesCount;
                                    const winCount = session.winCount;
                                    const lossCount = session.lossCount;
                                    const drawCount = Math.max(0, tradesCount - winCount - lossCount);

                                    return (
                                      <>
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-slate-400">Session duration</span>
                                          <span className="text-xs text-slate-400">{formatDuration(duration)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-slate-400">Avg. trade interval</span>
                                          <span className="text-xs text-slate-400">{formatInterval(intervalSeconds)}</span>   
                                        </div>
                                        <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400">Trades count</span>
                                        <span className="text-xs text-slate-400">{tradesCount}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-slate-400">Loss count</span>
                                          <span className="text-xs text-slate-400">{lossCount}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-slate-400">Draw count</span>
                                          <span className="text-xs text-slate-400">{drawCount}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1 pt-3 border-t border-slate-200">
                                        <span className="text-xs font-medium text-slate-500">Win count</span>
                                        <span className="text-xs font-medium text-slate-500">{winCount}</span>
                                        </div>
                                      </>
                                    );
                                  })()
                                }
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    
                       
                        {(sessionTrades[session.sessionId] || []).map((trade) => (
                          <div key={trade[0]} className="flex justify-between items-center w-full py-2">
                            <div className="flex items-center gap-2 w-[124px] justify-between">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className={`font-normal text-xs leading-[24px] transition-colors duration-200 cursor-pointer ${trade[4] === 'win' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-700'}`}>
                                      {trade[2]} Confirmation{trade[2] !== 1 ? "s" : ""}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent 
                                    className="min-w-[200px] rounded-md shadow-lg p-0"
                                    align="start"
                                    sideOffset={5}
                                  >
                                    <div className="flex justify-between items-center border-b border-slate-200 px-4 py-3 bg-slate-50 rounded-tl-md rounded-tr-md">
                              <span className="text-xs font-medium text-slate-700 leading-none">Confirmations</span>
                                </div>
                                <div className="flex flex-col items-start justify-center gap-2.5 py-4 pr-4 pl-4">
                                    {cleanConfirmationText(trade[3]).map((confirmation, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                        <span className="text-xs font-normal text-slate-400">{confirmation}</span>
                                      </div>
                                    ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              {trade[4] === "loss" && (
                                <LossReasonIcon 
                                  tradeId={trade[0]} 
                                  initialLossReasons={trade[6] as string[] | null}
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center group">
                                <div className={`w-fit flex justify-center items-center rounded-md ${
                                  trade[4] === "win"
                                    ? "bg-slate-50 border border-slate-200"
                                    : trade[4] === "loss" 
                                      ? "bg-white border border-slate-200" 
                                      : "bg-white border border-slate-200"
                                }`}>
                                  <span className={`h-6 w-6 flex items-center justify-center ${
                                    trade[4] === "win"
                                      ? "text-slate-500"
                                      : trade[4] === "loss"
                                        ? "text-rose-300"
                                        : "text-slate-400"
                                  }`}>
                                    {trade[4] === "win" ? <CircleCheck className="w-4 h-4" /> : trade[4] === "loss" ? <Ban className="w-4 h-4" /> : <Equal className="w-4 h-4" />}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDeleteTrade(trade[0], session.sessionId)}
                                  className="w-0 opacity-0 ml-0 overflow-hidden group-hover:opacity-100 group-hover:w-4 group-hover:ml-2 transition-all duration-300"
                                >
                                  <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
      </div>
    );
  }
