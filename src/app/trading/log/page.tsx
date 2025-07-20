"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/ui/Navigation";
import LogScreen from "@/components/logScreen";
import { Session } from "@/types/trade";

const SESSION_STORAGE_KEY = 'tradeConfirmer_sessionId';

export default function LogPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Load active session ID from sessionStorage after mount
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    setActiveSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, []);

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

  return (
    <div>
      <Navigation hasActiveSession={!!activeSessionId} />
      <LogScreen 
        sessions={sessions}
        onTradeDeleted={fetchSessions}
      />
    </div>
  );
}