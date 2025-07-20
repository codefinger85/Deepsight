"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/ui/Navigation";
import EndScreen from "@/components/EndScreen";
import { Session } from "@/types/trade";

const SESSION_STORAGE_KEY = 'tradeConfirmer_sessionId';
const LAST_TRADE_STORAGE_KEY = 'tradeConfirmer_lastTrade';

export default function EndPage() {
  const router = useRouter();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load active session ID from sessionStorage after mount
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    setActiveSessionId(storedSessionId);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    // Only redirect after loading is complete and there's no active session
    if (!isLoading && !activeSessionId) {
      router.push('/trading');
    }
  }, [activeSessionId, isLoading, router]);

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

  const handleSessionEnd = async () => {
    if (activeSessionId) {
      try {
        const response = await fetch(`/api/sessions/${activeSessionId}/end`, {
          method: 'PUT',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Session ended successfully, duration/interval saved.");
      } catch (error) {
        console.error("Error ending session:", error);
      }
    }
    
    setActiveSessionId(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(LAST_TRADE_STORAGE_KEY);
    sessionStorage.removeItem('tradeConfirmer_sessionStartTime');
    
    // Navigate to main dashboard instead of trading page
    router.push('/');
  };

  const currentSessionData = sessions.find(s => s.sessionId === activeSessionId);

  if (isLoading) {
    return null; // Show nothing while loading
  }

  if (!activeSessionId) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <Navigation hasActiveSession={!!activeSessionId} />
      <EndScreen 
        sessionId={activeSessionId} 
        onSessionEnd={handleSessionEnd}
        initialTradesCount={currentSessionData?.tradesCount ?? 0}
      />
    </div>
  );
}