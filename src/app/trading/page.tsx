"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Navigation from "@/components/ui/Navigation";
import StartScreen from "@/components/StartScreen";
import { formatInTimeZone } from 'date-fns-tz';
import { Session, Trade } from "@/types/trade";
import SessionDataBar from "@/components/SessionDataBar";
import { FlipVertical2 } from 'lucide-react';

// Key used for storing sessionId in sessionStorage
const SESSION_STORAGE_KEY = 'tradeConfirmer_sessionId';
const LAST_TRADE_STORAGE_KEY = 'tradeConfirmer_lastTrade';

const categories = [
  {
    title: "Rejections",
    items: ["Strong S/R Rejection", "Buyers/Sellers Entry", "Supply/Demand Rejection", "Round Number Rejection", "Trendline Rejection", "CPR Rejection", "QM Rejection"],
  },
  {
    title: "Retracements",
    items: ["Double Pattern Retrace", "Triple Pattern Retrace", "Exhaustion Candle Retrace", "Marubozu Candle Retrace"],
  },
  {
    title: "Breakouts",
    items: ["3rd Touch Break HH/LL", "ABC Break", "Strong S/R Break", "Trendline Break", "Round Number Break", "CPR Break", "Ranging Doji Break", "Overlapping Levels Break"],
  },
  {
    title: "Market Scope",
    items: ["With The Trend", "Micro Range", "Market Sequence", "Psycho Pattern", "Gap"],
  },
];

function Home({ sessionData, trades, onTradeLogged }: { sessionData: Session | undefined, trades: Trade[], onTradeLogged: () => Promise<void> }) {
  const [selectedConfirmations, setSelectedConfirmations] = useState<string[]>([]);
  const [lastTradeConfirmations, setLastTradeConfirmations] = useState<string[]>([]);

  // Load last trade confirmations from sessionStorage after mount
  useEffect(() => {
    const stored = sessionStorage.getItem(LAST_TRADE_STORAGE_KEY);
    if (stored) {
      setLastTradeConfirmations(JSON.parse(stored));
    }
  }, []);

  const toggleConfirmation = (item: string) => {
    setSelectedConfirmations((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const logTrade = async (result: "win" | "loss" | "draw") => {
    const now = new Date();
    const dateTime = formatInTimeZone(now, 'Europe/Paris', "yyyy-MM-dd'T'HH:mm:ssXXX");
    const currentSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (!currentSessionId) {
      console.error("No active session ID found in storage. Cannot log trade.");
      return;
    }

    try {
      const payload = {
        sessionId: currentSessionId,
        date: dateTime,
        confirmationsCount: selectedConfirmations.length,
        confirmations: JSON.stringify(selectedConfirmations),
        result,
      };

      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      sessionStorage.setItem(LAST_TRADE_STORAGE_KEY, JSON.stringify(selectedConfirmations));
      setLastTradeConfirmations(selectedConfirmations);
      setSelectedConfirmations([]);
      
      await onTradeLogged();
    } catch (error) {
      console.error("Error saving trade:", error);
    }
  };

  const copyLastTrade = () => {
    setSelectedConfirmations(lastTradeConfirmations);
  };

  const resetConfirmations = () => {
    setSelectedConfirmations([]);
  };

  return (
    <>
      <div className="container mx-auto px-8 pt-6">
        <SessionDataBar sessionData={sessionData} trades={trades} />
        <div className="flex items-center mb-8 px-2">
          <h2 className="text-xl tracking-tight font-medium bg-gradient-to-b from-slate-950 to-[#708fbb] inline-block text-transparent bg-clip-text">Confirmations</h2>
        </div>
        <div className="categories-container px-4 pb-2 overflow-y-auto;">
          {categories.map((category) => (
            <div key={category.title} className="category mb-10 last:mb-0">
             <div className="category-title-container mb-4 py-1 px-2 -ml-2 border border-slate-200 rounded-xl bg-white w-fit">
              <h3 className="category-title text-[8px] uppercase text-slate-500 font-medium">{category.title}</h3>
              </div>
              <div className="confirmation-items space-y-3.5">
                {category.items.map((item) => (
                  <div key={item} className="confirmation-item flex items-center gap-3">
                    <Checkbox
                      id={item}
                      checked={selectedConfirmations.includes(item)}
                      onCheckedChange={() => toggleConfirmation(item)}
                      className="confirmation-ticker rounded-sm border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 shadow-none"
                    />
                    <label
                      htmlFor={item}
                      className={`confirmation-label text-xs font-normal transition-colors duration-200 hover:text-slate-700 ${
                        selectedConfirmations.includes(item)
                          ? "font-medium text-slate-700"
                          : "text-slate-400"
                      } cursor-pointer`}
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-section fixed bottom-0 left-0 right-0 bg-white border-none border-slate-100 pb-12 pt-6">
        <div className="bottom-section-content-wrapper mx-auto px-8 mb-2">
          <div className="confirmation-count-toolbar flex items-center justify-between border border-slate-200 rounded-md px-3 py-2 bg-white gap-3">
            <div className="confirmation-count-container flex flex-row justify-between gap-3 w-full border-r border-slate-200 pr-3">
              <span className="confirmation-count-label font-normal text-xs text-center text-slate-500 self-center">Confirmation count</span>
              <span className="confirmation-count-value font-medium text-sm text-center text-slate-950">{selectedConfirmations.length}</span>
            </div>
            <div className="toolbar-action-buttons flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={resetConfirmations}
                      className="toolbar-action-reset w-3.5 h-3.5 text-slate-400 hover:text-slate-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="py-2 px-2.5">
                    <p className="text-xs font-normal text-slate-400">Reset</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={copyLastTrade}
                      className="toolbar-action-copy w-3.5 h-3.5 text-slate-400 hover:text-slate-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="py-2 px-2.5">
                    <p className="text-xs font-normal text-slate-400">Copy latest</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex justify-center items-center gap-3 mt-8">
            <div 
              onClick={() => logTrade("loss")}
              className={`w-[90px] flex justify-center items-center px-8 py-2.5 rounded-lg transition-colors duration-200 ${
                selectedConfirmations.length === 0 
                  ? "bg-slate-50 border border-slate-200 cursor-not-allowed opacity-50"
                  : "bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100"
              }`}
            >
              <span className={`font-medium text-xs leading-[20px] ${
                selectedConfirmations.length === 0 
                  ? "text-slate-400" 
                  : "text-slate-700"
              }`}>Loss</span>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    onClick={() => { if (selectedConfirmations.length > 0) logTrade("draw"); }}
                    className={`py-1.5 px-1.5 rounded-md bg-slate-50 border border-slate-200 transition-colors duration-200 ${
                      selectedConfirmations.length === 0 
                        ? "text-slate-400 cursor-not-allowed opacity-50"
                        : "text-slate-400 hover:text-slate-600 cursor-pointer" 
                    }`}
                  >
                    <FlipVertical2 size={14} strokeWidth={2} />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="py-2 px-2.5">
                  <p className="text-xs font-normal text-slate-400">Draw</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div 
              onClick={() => logTrade("win")}
              className={`w-fit flex justify-center items-center px-8 py-2.5 rounded-lg transition-colors duration-200 ${
                selectedConfirmations.length === 0 
                  ? "bg-slate-50 border border-slate-200 cursor-not-allowed opacity-50"
                  : "bg-slate-800 border border-slate-800 cursor-pointer hover:bg-slate-700"
              }`}
            >
              <span className={`font-medium text-xs leading-[20px] ${
                selectedConfirmations.length === 0 
                  ? "text-slate-400" 
                  : "text-slate-50"
              }`}>Win</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TradingPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionTrades, setActiveSessionTrades] = useState<Trade[]>([]);

  // Auto-enter fullscreen mode to hide all browser UI
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        // Check if already in fullscreen
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen({ navigationUI: "hide" });
          console.log('Trading tool entered fullscreen mode');
        }
      } catch (error) {
        console.log('Fullscreen failed:', error);
        // Fallback: Try clicking anywhere to trigger fullscreen
        const handleClick = async () => {
          try {
            if (!document.fullscreenElement) {
              await document.documentElement.requestFullscreen({ navigationUI: "hide" });
              document.removeEventListener('click', handleClick);
            }
          } catch (err) {
            console.log('Fullscreen on click failed:', err);
          }
        };
        document.addEventListener('click', handleClick, { once: true });
      }
    };
    
    // Small delay to ensure page is fully loaded
    const timer = setTimeout(enterFullscreen, 500);
    return () => clearTimeout(timer);
  }, []);

  // Load active session ID from sessionStorage after mount
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    setActiveSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      fetchActiveSessionTrades(activeSessionId);
    } else {
      setActiveSessionTrades([]);
    }
  }, [activeSessionId]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const storedSessions: [string, string, number, number, number, number, number | null, number | null, number, number][] = await response.json();

      const formattedSessions: Session[] = storedSessions.map(
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
          sessionDuration: sessionDuration,
          tradesInterval: tradesInterval,
        })
      );

      setSessions(formattedSessions);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const fetchActiveSessionTrades = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/trades/session/${sessionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const tradesData: [number, string, number, string, string, string, string | null][] = await response.json();
      
      const formattedTrades: Trade[] = tradesData.map(
        ([id, date, confirmationsCount, confirmationsJson, result]) => ({
          id,
          sessionId: sessionId,
          date,
          confirmationsCount,
          confirmations: JSON.parse(confirmationsJson),
          result: result as "win" | "loss" | "draw",
        })
      );
      setActiveSessionTrades(formattedTrades);
    } catch (error) {
      console.error(`Error loading trades for session ${sessionId}:`, error);
      setActiveSessionTrades([]);
    }
  };

  const handleTradeLogged = async () => {
    await fetchSessions();
    if (activeSessionId) {
      await fetchActiveSessionTrades(activeSessionId);
    }
  };

  const handleSessionStart = (sessionId: string) => {
    setActiveSessionId(sessionId);
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  };

  const currentSessionData = sessions.find(s => s.sessionId === activeSessionId);

  return (
    <div>
      <Navigation hasActiveSession={!!activeSessionId} />
      
      {!activeSessionId ? (
        <StartScreen onSessionStart={handleSessionStart} />
      ) : (
        <Home 
          sessionData={currentSessionData}
          trades={activeSessionTrades}
          onTradeLogged={handleTradeLogged} 
        />
      )}
    </div>
  );
}