"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/ui/Navigation";
import Analyze from "@/components/Analyze";

const SESSION_STORAGE_KEY = 'tradeConfirmer_sessionId';

export default function AnalyzePage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Load active session ID from sessionStorage after mount
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    setActiveSessionId(storedSessionId);
  }, []);

  return (
    <div>
      <Navigation hasActiveSession={!!activeSessionId} />
      <Analyze />
    </div>
  );
}