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

export type LossReasonAnalysis = {
  lossReason: string;
  totalCount: number;
  lossPercentage: number;
  conf1: number;
  conf2: number;
  conf3: number;
  conf4: number;
  conf5: number;
  conf6: number;
  conf7: number;
};

export type WinningConfirmationAnalysis = {
  confirmation: string;
  totalCount: number;
  conf1: number;
  conf2: number;
  conf3: number;
  conf4: number;
  conf5: number;
  conf6: number;
  conf7: number;
};

export type ConfirmationAnalysis = {
  confirmation: string;
  totalCount: number;
  winCount: number;
  lossCount: number;
  winPercentage: number;
  conf1: string;
  conf2: string;
  conf3: string;
  conf4: string;
  conf5: string;
  conf6: string;
  conf7: string;
};

export type TradesAnalysis = {
  confirmation: string;
  totalCount: number;
  winCount: number;
  lossCount: number;
  winPercentage: number;
  conf1: string;
  conf2: string;
  conf3: string;
  conf4: string;
  conf5: string;
  conf6: string;
  conf7: string;
};

export type DayAnalysis = {
  dayOfWeek: string;
  totalTrades: number;
  winCount: number;
  lossCount: number;
  winPercentage: number;
};

// Types for date filtering
export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type DateFilter = string | DateRange | null;

// Helper function to get date filter
function getDateFilter(dateFilter?: DateFilter) {
  if (!dateFilter) return null;
  
  // Handle custom date range objects
  if (typeof dateFilter === 'object' && dateFilter.start && dateFilter.end) {
    return {
      start: dateFilter.start.toISOString().split('T')[0],
      end: dateFilter.end.toISOString().split('T')[0]
    };
  }
  
  // Handle preset string filters
  if (typeof dateFilter === 'string') {
    if (dateFilter === 'all') return null;
    
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (dateFilter === '7d') {
      daysToSubtract = 7;
    } else if (dateFilter === '14d') {
      daysToSubtract = 14;
    } else if (dateFilter === '21d') {
      daysToSubtract = 21;
    } else if (dateFilter === '30d') {
      daysToSubtract = 30;
    } else if (dateFilter === '90d') {
      daysToSubtract = 90;
    }
    
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return startDate.toISOString().split('T')[0];
  }
  
  return null;
}

// Read-only functions for dashboard metrics
export async function getTotalEarnings(dateFilter?: DateFilter): Promise<number> {
  try {
    let query = supabase
      .from('sessions')
      .select('earningsResult')
      .not('earningsResult', 'is', null);

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

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

export async function getOverallWinRate(dateFilter?: DateFilter): Promise<number> {
  try {
    let query = supabase
      .from('trades')
      .select('result, date');

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    const totalTrades = data.length;
    const wins = data.filter(trade => trade.result === 'win').length;
    
    return Math.round((wins / totalTrades) * 100);
  } catch (error) {
    console.error('Error getting overall win rate:', error);
    return 0;
  }
}

export async function getTotalSessions(dateFilter?: DateFilter): Promise<number> {
  try {
    let query = supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { count, error } = await query;

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error getting total sessions:', error);
    return 0;
  }
}

export async function getTotalTrades(dateFilter?: DateFilter): Promise<number> {
  try {
    let query = supabase
      .from('sessions')
      .select('tradesCount, date');

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

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

export async function getTotalWinningTrades(dateFilter?: DateFilter): Promise<number> {
  try {
    let query = supabase
      .from('trades')
      .select('result, date')
      .eq('result', 'win');

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting total winning trades:', error);
    return 0;
  }
}

export async function getTotalLosingTrades(dateFilter?: DateFilter): Promise<number> {
  try {
    let query = supabase
      .from('trades')
      .select('result, date')
      .eq('result', 'loss');

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting total losing trades:', error);
    return 0;
  }
}

export async function getSessionsAbove60Percent(dateFilter?: DateFilter): Promise<number> {
  try {
    let query = supabase
      .from('sessions')
      .select('winRate, date')
      .gte('winRate', 60);

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting sessions above 60% winrate:', error);
    return 0;
  }
}

export async function getSessionsBelow60Percent(dateFilter?: DateFilter): Promise<number> {
  try {
    let query = supabase
      .from('sessions')
      .select('winRate, date')
      .lt('winRate', 60);

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting sessions below 60% winrate:', error);
    return 0;
  }
}

export async function getLossReasonsWithConfirmations(dateFilter?: DateFilter): Promise<LossReasonAnalysis[]> {
  try {
    let query = supabase
      .from('trades')
      .select('lossReason, confirmationsCount, date')
      .eq('result', 'loss')
      .not('lossReason', 'is', null);

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group and count by loss reason and confirmations
    const groupedData: Record<string, LossReasonAnalysis> = {};

    data?.forEach(trade => {
      const { lossReason, confirmationsCount } = trade;
      if (!lossReason) return;

      // Parse the loss reason - it might be a JSON array or a single string
      let lossReasons: string[] = [];
      
      try {
        // Try to parse as JSON array first
        const parsed = JSON.parse(lossReason);
        if (Array.isArray(parsed)) {
          lossReasons = parsed.filter(reason => reason && reason.trim());
        } else {
          // If it's not an array, treat it as a single reason
          lossReasons = [String(parsed).trim()];
        }
      } catch {
        // If JSON parsing fails, treat it as a single string
        lossReasons = [String(lossReason).trim()];
      }

      // Process each individual loss reason
      lossReasons.forEach(individualReason => {
        if (!individualReason) return;

        if (!groupedData[individualReason]) {
          groupedData[individualReason] = {
            lossReason: individualReason,
            totalCount: 0,
            lossPercentage: 0,
            conf1: 0,
            conf2: 0,
            conf3: 0,
            conf4: 0,
            conf5: 0,
            conf6: 0,
            conf7: 0,
          };
        }

        groupedData[individualReason].totalCount++;

        // Count by confirmation level
        switch (confirmationsCount) {
          case 1: groupedData[individualReason].conf1++; break;
          case 2: groupedData[individualReason].conf2++; break;
          case 3: groupedData[individualReason].conf3++; break;
          case 4: groupedData[individualReason].conf4++; break;
          case 5: groupedData[individualReason].conf5++; break;
          case 6: groupedData[individualReason].conf6++; break;
          case 7: groupedData[individualReason].conf7++; break;
        }
      });
    });

    // Calculate total loss reason occurrences
    const totalLossReasonOccurrences = Object.values(groupedData).reduce((sum, item) => sum + item.totalCount, 0);
    
    // Calculate percentage for each loss reason
    const results = Object.values(groupedData).map(item => ({
      ...item,
      lossPercentage: totalLossReasonOccurrences > 0 ? Math.round((item.totalCount / totalLossReasonOccurrences) * 100) : 0
    }));

    // Convert to array and sort by total count (most frequent first)
    return results.sort((a, b) => b.totalCount - a.totalCount);
  } catch (error) {
    console.error('Error getting loss reasons with confirmations:', error);
    return [];
  }
}

export async function getWinningConfirmationsWithCounts(dateFilter?: DateFilter): Promise<WinningConfirmationAnalysis[]> {
  try {
    let query = supabase
      .from('trades')
      .select('confirmations, confirmationsCount, date')
      .eq('result', 'win')
      .not('confirmations', 'is', null);

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group and count by confirmation type and total confirmation counts
    const groupedData: Record<string, WinningConfirmationAnalysis> = {};

    data?.forEach(trade => {
      const { confirmations, confirmationsCount } = trade;
      if (!confirmations) return;

      // Parse the confirmations - it might be a JSON array or a single string
      let confirmationTypes: string[] = [];
      
      try {
        // Try to parse as JSON array first
        const parsed = JSON.parse(confirmations);
        if (Array.isArray(parsed)) {
          confirmationTypes = parsed.filter(conf => conf && conf.trim());
        } else {
          // If it's not an array, treat it as a single confirmation
          confirmationTypes = [String(parsed).trim()];
        }
      } catch {
        // If JSON parsing fails, treat it as a single string
        confirmationTypes = [String(confirmations).trim()];
      }

      // Process each individual confirmation type
      confirmationTypes.forEach(individualConfirmation => {
        if (!individualConfirmation) return;

        if (!groupedData[individualConfirmation]) {
          groupedData[individualConfirmation] = {
            confirmation: individualConfirmation,
            totalCount: 0,
            conf1: 0,
            conf2: 0,
            conf3: 0,
            conf4: 0,
            conf5: 0,
            conf6: 0,
            conf7: 0,
          };
        }

        groupedData[individualConfirmation].totalCount++;

        // Count by confirmation level (total confirmations in the trade)
        switch (confirmationsCount) {
          case 1: groupedData[individualConfirmation].conf1++; break;
          case 2: groupedData[individualConfirmation].conf2++; break;
          case 3: groupedData[individualConfirmation].conf3++; break;
          case 4: groupedData[individualConfirmation].conf4++; break;
          case 5: groupedData[individualConfirmation].conf5++; break;
          case 6: groupedData[individualConfirmation].conf6++; break;
          case 7: groupedData[individualConfirmation].conf7++; break;
        }
      });
    });

    // Convert to array and sort by total count (most frequent first)
    return Object.values(groupedData).sort((a, b) => b.totalCount - a.totalCount);
  } catch (error) {
    console.error('Error getting winning confirmations with counts:', error);
    return [];
  }
}

export async function getConfirmationAnalysisWithCounts(dateFilter?: DateFilter): Promise<ConfirmationAnalysis[]> {
  try {
    let query = supabase
      .from('trades')
      .select('confirmations, confirmationsCount, result, date')
      .not('confirmations', 'is', null);

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group and count by confirmation type with win/loss breakdown
    const groupedData: Record<string, {
      confirmation: string;
      totalCount: number;
      winCount: number;
      lossCount: number;
      conf1Wins: number;
      conf1Losses: number;
      conf2Wins: number;
      conf2Losses: number;
      conf3Wins: number;
      conf3Losses: number;
      conf4Wins: number;
      conf4Losses: number;
      conf5Wins: number;
      conf5Losses: number;
      conf6Wins: number;
      conf6Losses: number;
    }> = {};

    data?.forEach(trade => {
      const { confirmations, confirmationsCount, result } = trade;
      if (!confirmations) return;

      // Parse the confirmations - it might be a JSON array or a single string
      let confirmationTypes: string[] = [];
      
      try {
        // Try to parse as JSON array first
        const parsed = JSON.parse(confirmations);
        if (Array.isArray(parsed)) {
          confirmationTypes = parsed.filter(conf => conf && conf.trim());
        } else {
          // If it's not an array, treat it as a single confirmation
          confirmationTypes = [String(parsed).trim()];
        }
      } catch {
        // If JSON parsing fails, treat it as a single string
        confirmationTypes = [String(confirmations).trim()];
      }

      const isWin = result === 'win';

      // Process each individual confirmation type
      confirmationTypes.forEach(individualConfirmation => {
        if (!individualConfirmation) return;

        if (!groupedData[individualConfirmation]) {
          groupedData[individualConfirmation] = {
            confirmation: individualConfirmation,
            totalCount: 0,
            winCount: 0,
            lossCount: 0,
            conf1Wins: 0,
            conf1Losses: 0,
            conf2Wins: 0,
            conf2Losses: 0,
            conf3Wins: 0,
            conf3Losses: 0,
            conf4Wins: 0,
            conf4Losses: 0,
            conf5Wins: 0,
            conf5Losses: 0,
            conf6Wins: 0,
            conf6Losses: 0,
            conf7Wins: 0,
            conf7Losses: 0,
          };
        }

        groupedData[individualConfirmation].totalCount++;
        
        if (isWin) {
          groupedData[individualConfirmation].winCount++;
        } else {
          groupedData[individualConfirmation].lossCount++;
        }

        // Count by confirmation level and win/loss
        switch (confirmationsCount) {
          case 1:
            if (isWin) groupedData[individualConfirmation].conf1Wins++;
            else groupedData[individualConfirmation].conf1Losses++;
            break;
          case 2:
            if (isWin) groupedData[individualConfirmation].conf2Wins++;
            else groupedData[individualConfirmation].conf2Losses++;
            break;
          case 3:
            if (isWin) groupedData[individualConfirmation].conf3Wins++;
            else groupedData[individualConfirmation].conf3Losses++;
            break;
          case 4:
            if (isWin) groupedData[individualConfirmation].conf4Wins++;
            else groupedData[individualConfirmation].conf4Losses++;
            break;
          case 5:
            if (isWin) groupedData[individualConfirmation].conf5Wins++;
            else groupedData[individualConfirmation].conf5Losses++;
            break;
          case 6:
            if (isWin) groupedData[individualConfirmation].conf6Wins++;
            else groupedData[individualConfirmation].conf6Losses++;
            break;
          case 7:
            if (isWin) groupedData[individualConfirmation].conf7Wins++;
            else groupedData[individualConfirmation].conf7Losses++;
            break;
        }
      });
    });

    // Convert to array and format the data
    const results: ConfirmationAnalysis[] = Object.values(groupedData).map(item => ({
      confirmation: item.confirmation,
      totalCount: item.totalCount,
      winCount: item.winCount,
      lossCount: item.lossCount,
      winPercentage: item.totalCount > 0 ? Math.round((item.winCount / item.totalCount) * 100) : 0,
      conf1: `${item.conf1Wins}|${item.conf1Losses}`,
      conf2: `${item.conf2Wins}|${item.conf2Losses}`,
      conf3: `${item.conf3Wins}|${item.conf3Losses}`,
      conf4: `${item.conf4Wins}|${item.conf4Losses}`,
      conf5: `${item.conf5Wins}|${item.conf5Losses}`,
      conf6: `${item.conf6Wins}|${item.conf6Losses}`,
      conf7: `${item.conf7Wins}|${item.conf7Losses}`,
    }));

    // Sort by win percentage (highest first), then by total count
    return results.sort((a, b) => {
      if (a.winPercentage !== b.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      return b.totalCount - a.totalCount;
    });
  } catch (error) {
    console.error('Error getting confirmation analysis with counts:', error);
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

export async function getTradesAnalysis(dateFilter?: DateFilter): Promise<TradesAnalysis[]> {
  try {
    let query = supabase
      .from('trades')
      .select('confirmationsCount, result, date');

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Initialize counters
    const analysis = {
      totalTrades: 0,
      totalWins: 0,
      totalLosses: 0,
      conf1Wins: 0,
      conf1Losses: 0,
      conf2Wins: 0,
      conf2Losses: 0,
      conf3Wins: 0,
      conf3Losses: 0,
      conf4Wins: 0,
      conf4Losses: 0,
      conf5Wins: 0,
      conf5Losses: 0,
      conf6Wins: 0,
      conf6Losses: 0,
      conf7Wins: 0,
      conf7Losses: 0,
    };

    // Process each trade
    data?.forEach(trade => {
      const { confirmationsCount, result } = trade;
      const isWin = result === 'win';

      analysis.totalTrades++;
      
      if (isWin) {
        analysis.totalWins++;
      } else {
        analysis.totalLosses++;
      }

      // Count by confirmation level
      switch (confirmationsCount) {
        case 1:
          if (isWin) analysis.conf1Wins++;
          else analysis.conf1Losses++;
          break;
        case 2:
          if (isWin) analysis.conf2Wins++;
          else analysis.conf2Losses++;
          break;
        case 3:
          if (isWin) analysis.conf3Wins++;
          else analysis.conf3Losses++;
          break;
        case 4:
          if (isWin) analysis.conf4Wins++;
          else analysis.conf4Losses++;
          break;
        case 5:
          if (isWin) analysis.conf5Wins++;
          else analysis.conf5Losses++;
          break;
        case 6:
          if (isWin) analysis.conf6Wins++;
          else analysis.conf6Losses++;
          break;
        case 7:
          if (isWin) analysis.conf7Wins++;
          else analysis.conf7Losses++;
          break;
      }
    });

    // Calculate win percentage
    const winPercentage = analysis.totalTrades > 0 
      ? Math.round((analysis.totalWins / analysis.totalTrades) * 100) 
      : 0;

    return [{
      confirmation: "All Trades",
      totalCount: analysis.totalTrades,
      winCount: analysis.totalWins,
      lossCount: analysis.totalLosses,
      winPercentage,
      conf1: `${analysis.conf1Wins}|${analysis.conf1Losses}`,
      conf2: `${analysis.conf2Wins}|${analysis.conf2Losses}`,
      conf3: `${analysis.conf3Wins}|${analysis.conf3Losses}`,
      conf4: `${analysis.conf4Wins}|${analysis.conf4Losses}`,
      conf5: `${analysis.conf5Wins}|${analysis.conf5Losses}`,
      conf6: `${analysis.conf6Wins}|${analysis.conf6Losses}`,
      conf7: `${analysis.conf7Wins}|${analysis.conf7Losses}`,
    }];
  } catch (error) {
    console.error('Error getting trades analysis:', error);
    return [{
      confirmation: "All Trades",
      totalCount: 0,
      winCount: 0,
      lossCount: 0,
      winPercentage: 0,
      conf1: '0|0',
      conf2: '0|0',
      conf3: '0|0',
      conf4: '0|0',
      conf5: '0|0',
      conf6: '0|0',
      conf7: '0|0',
    }];
  }
}

export async function getDayAnalysis(dateFilter?: DateFilter): Promise<DayAnalysis[]> {
  try {
    let query = supabase
      .from('trades')
      .select('date, result');

    const filter = getDateFilter(dateFilter);
    if (filter) {
      if (typeof filter === 'string') {
        query = query.gte('date', filter);
      } else {
        query = query.gte('date', filter.start).lte('date', filter.end);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Initialize day counters
    const dayStats = {
      Monday: { totalTrades: 0, winCount: 0, lossCount: 0 },
      Tuesday: { totalTrades: 0, winCount: 0, lossCount: 0 },
      Wednesday: { totalTrades: 0, winCount: 0, lossCount: 0 },
      Thursday: { totalTrades: 0, winCount: 0, lossCount: 0 },
      Friday: { totalTrades: 0, winCount: 0, lossCount: 0 },
      Saturday: { totalTrades: 0, winCount: 0, lossCount: 0 },
      Sunday: { totalTrades: 0, winCount: 0, lossCount: 0 },
    };

    // Process each trade
    data?.forEach(trade => {
      const date = new Date(trade.date);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (dayStats[dayOfWeek as keyof typeof dayStats]) {
        dayStats[dayOfWeek as keyof typeof dayStats].totalTrades++;
        
        if (trade.result === 'win') {
          dayStats[dayOfWeek as keyof typeof dayStats].winCount++;
        } else {
          dayStats[dayOfWeek as keyof typeof dayStats].lossCount++;
        }
      }
    });

    // Convert to array format
    const results: DayAnalysis[] = Object.entries(dayStats).map(([dayOfWeek, stats]) => ({
      dayOfWeek,
      totalTrades: stats.totalTrades,
      winCount: stats.winCount,
      lossCount: stats.lossCount,
      winPercentage: stats.totalTrades > 0 
        ? Math.round((stats.winCount / stats.totalTrades) * 100) 
        : 0,
    }));

    // Return in weekday order
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return dayOrder.map(day => results.find(result => result.dayOfWeek === day)!);

  } catch (error) {
    console.error('Error getting day analysis:', error);
    return [
      { dayOfWeek: 'Monday', totalTrades: 0, winCount: 0, lossCount: 0, winPercentage: 0 },
      { dayOfWeek: 'Tuesday', totalTrades: 0, winCount: 0, lossCount: 0, winPercentage: 0 },
      { dayOfWeek: 'Wednesday', totalTrades: 0, winCount: 0, lossCount: 0, winPercentage: 0 },
      { dayOfWeek: 'Thursday', totalTrades: 0, winCount: 0, lossCount: 0, winPercentage: 0 },
      { dayOfWeek: 'Friday', totalTrades: 0, winCount: 0, lossCount: 0, winPercentage: 0 },
      { dayOfWeek: 'Saturday', totalTrades: 0, winCount: 0, lossCount: 0, winPercentage: 0 },
      { dayOfWeek: 'Sunday', totalTrades: 0, winCount: 0, lossCount: 0, winPercentage: 0 },
    ];
  }
}

export type ChartData = {
  date: string;
  wins: number;
  losses: number;
  winRate: number;
  tradesCount: number;
};

export async function getChartData(): Promise<ChartData[]> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('date, winCount, lossCount, winRate, tradesCount')
      .order('date', { ascending: true });

    if (error) throw error;

    return data?.map(session => ({
      date: session.date,
      wins: session.winCount,
      losses: session.lossCount,
      winRate: Math.round(parseFloat(session.winRate) || 0),
      tradesCount: session.tradesCount
    })) || [];
  } catch (error) {
    console.error('Error getting chart data:', error);
    return [];
  }
}