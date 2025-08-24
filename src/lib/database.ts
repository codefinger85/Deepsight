import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpjnvbdrhleislhvfpus.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwam52YmRyaGxlaXNsaHZmcHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTI0NjcsImV4cCI6MjA2ODQyODQ2N30.ZUkPEVbhjTf1R58F96sgvp6wIpkP1Fxi0BqKMcg4GdE';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for our database tables
export type Session = {
  id: string;
  date: string;
  winCount: number;
  lossCount: number;
  tradesCount: number;
  winRate: number;
  startingBalance?: number;
  closingBalance?: number;
  earningsResult?: number;
  sessionDuration?: number;
  tradesInterval?: number;
};

export type Trade = {
  id: number;
  sessionId: string;
  date: string;
  confirmationsCount: number;
  confirmations: string;
  result: string;
  lossReason?: string;
};

// Read-only functions for dashboard metrics
export async function getTotalEarnings(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('earningsResult')
      .not('earningsResult', 'is', null);

    if (error) throw error;

    const total = data?.reduce((sum, session) => {
      return sum + (parseFloat(session.earningsResult) || 0);
    }, 0) || 0;

    return total;
  } catch (error) {
    console.error('Error getting total earnings:', error);
    return 0;
  }
}

export async function getOverallWinRate(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('winRate')
      .not('winRate', 'is', null);

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    const totalWinRate = data.reduce((sum, session) => sum + (parseFloat(session.winRate) || 0), 0);
    return Math.round(totalWinRate / data.length);
  } catch (error) {
    console.error('Error getting overall win rate:', error);
    return 0;
  }
}

export async function getTotalSessions(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error getting total sessions:', error);
    return 0;
  }
}

export async function getTotalTrades(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('tradesCount');

    if (error) throw error;

    const total = data?.reduce((sum, session) => {
      return sum + (parseInt(session.tradesCount) || 0);
    }, 0) || 0;

    return total;
  } catch (error) {
    console.error('Error getting total trades:', error);
    return 0;
  }
}

// Get all sessions for more detailed analysis
export async function getAllSessions(): Promise<Session[]> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting all sessions:', error);
    return [];
  }
}

// Get all trades for a specific session
export async function getSessionTrades(sessionId: string): Promise<Trade[]> {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('sessionId', sessionId)
      .order('date', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting session trades:', error);
    return [];
  }
}