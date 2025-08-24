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
  conf1: number;
  conf2: number;
  conf3: number;
  conf4: number;
  conf5: number;
  conf6: number;
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

export async function getTotalWinningTrades(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('result')
      .eq('result', 'win');

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting total winning trades:', error);
    return 0;
  }
}

export async function getTotalLosingTrades(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('result')
      .eq('result', 'loss');

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting total losing trades:', error);
    return 0;
  }
}

export async function getSessionsAbove60Percent(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('winRate')
      .gte('winRate', 60);

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting sessions above 60% winrate:', error);
    return 0;
  }
}

export async function getSessionsBelow60Percent(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('winRate')
      .lt('winRate', 60);

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting sessions below 60% winrate:', error);
    return 0;
  }
}

export async function getLossReasonsWithConfirmations(): Promise<LossReasonAnalysis[]> {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('lossReason, confirmationsCount')
      .eq('result', 'loss')
      .not('lossReason', 'is', null);

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
            conf1: 0,
            conf2: 0,
            conf3: 0,
            conf4: 0,
            conf5: 0,
            conf6: 0,
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
        }
      });
    });

    // Convert to array and sort by total count (most frequent first)
    return Object.values(groupedData).sort((a, b) => b.totalCount - a.totalCount);
  } catch (error) {
    console.error('Error getting loss reasons with confirmations:', error);
    return [];
  }
}

export async function getWinningConfirmationsWithCounts(): Promise<WinningConfirmationAnalysis[]> {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('confirmations, confirmationsCount')
      .eq('result', 'win')
      .not('confirmations', 'is', null);

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

export async function getConfirmationAnalysisWithCounts(): Promise<ConfirmationAnalysis[]> {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('confirmations, confirmationsCount, result')
      .not('confirmations', 'is', null);

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