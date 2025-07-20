import { createClient, Value } from '@libsql/client';

const client = createClient({
  url: 'libsql://deepsight-legend007.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTI5MTg3MjAsImlkIjoiYWY3YWQyN2MtMGUxNC00NGFjLWE4MzEtOTlkMWU5MGQzOThiIiwicmlkIjoiNDFlMDgxZTctNDFmNy00ZDY1LWIwZjMtMTZkOGYxOGY5MDljIn0.YMpH3ez6xGSmCMrNGu0FWco5qM3JG-W4YO1Fkcueje-3XR_e9__E1KbRcFZTBRH1d6Thi03xqinvLymwYoZlBQ'
});

export async function saveSession(
  id: string,
  date: string,
  winCount: number,
  lossCount: number,
  tradesCount: number,
  winRate: number,
  startingBalance?: number,
  closingBalance?: number
): Promise<void> {
  // Calculate earnings_result
  const earningsResult = startingBalance && closingBalance ? closingBalance - startingBalance : null;
  
  await client.execute({
    sql: `INSERT OR REPLACE INTO sessions (id, date, winCount, lossCount, tradesCount, winRate, starting_balance, closing_balance, earnings_result) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, date, winCount, lossCount, tradesCount, winRate, startingBalance || null, closingBalance || null, earningsResult]
  });
}

export async function saveTrade(
  sessionId: string,
  date: string,
  confirmationsCount: number,
  confirmations: string,
  result: string
): Promise<void> {
  // Get current session stats
  const sessionResult = await client.execute({
    sql: "SELECT winCount, lossCount, tradesCount, sessionDuration, tradesInterval FROM sessions WHERE id = ?",
    args: [sessionId]
  });

  if (sessionResult.rows.length === 0) {
    throw new Error(`Session ${sessionId} not found`);
  }

  const session = sessionResult.rows[0];
  let winCount = session.winCount as number;
  let lossCount = session.lossCount as number;
  let tradesCount = session.tradesCount as number;
  // sessionDuration and tradesInterval are not used in this function
  // const sessionDuration = session.sessionDuration as number;
  // const tradesInterval = session.tradesInterval as number;

  // Update counts based on result
  if (result === "win") {
    winCount += 1;
  } else if (result === "loss") {
    lossCount += 1;
  }
  tradesCount += 1;

  // Calculate new win rate
  const winRate = tradesCount > 0 ? Math.round((winCount / tradesCount) * 100) : 0;

  // Insert the trade
  await client.execute({
    sql: "INSERT INTO trades (session_id, date, confirmationsCount, confirmations, result) VALUES (?, ?, ?, ?, ?)",
    args: [sessionId, date, confirmationsCount, confirmations, result]
  });

  // Update session with new stats
  await client.execute({
    sql: "UPDATE sessions SET winCount = ?, lossCount = ?, tradesCount = ?, winRate = ? WHERE id = ?",
    args: [winCount, lossCount, tradesCount, winRate, sessionId]
  });
}

function convertValue(value: Value): string | number | null {
  if (typeof value === 'bigint') {
    return Number(value);
  }
  return value as string | number | null;
}


export async function getAllSessionsWithTrades(): Promise<{
  sessions: (string | number | null)[][];
  trades: Record<string, (string | number | null)[][]>;
}> {
  try {
    // Get all sessions
    const sessionsResult = await client.execute("SELECT * FROM sessions ORDER BY date DESC");
    const sessions = sessionsResult.rows.map(row => [
      convertValue(row.id),
      convertValue(row.date),
      convertValue(row.winCount),
      convertValue(row.lossCount),
      convertValue(row.tradesCount),
      convertValue(row.winRate),
      convertValue(row.starting_balance),
      convertValue(row.closing_balance),
      convertValue(row.sessionDuration) || 0,
      convertValue(row.tradesInterval) || 0
    ]);

    // Get all trades grouped by session
    const tradesResult = await client.execute({
      sql: "SELECT * FROM trades ORDER BY session_id, date ASC"
    });
    
    const tradesBySession: Record<string, (string | number | null)[][]> = {};
    
    tradesResult.rows.forEach(row => {
      const sessionId = convertValue(row.session_id) as string;
      if (!tradesBySession[sessionId]) {
        tradesBySession[sessionId] = [];
      }
      
      tradesBySession[sessionId].push([
        convertValue(row.id),
        convertValue(row.date),
        convertValue(row.confirmationsCount),
        convertValue(row.confirmations),
        convertValue(row.result),
        convertValue(row.session_id),
        convertValue(row.loss_reason)
      ]);
    });
    
    return {
      sessions,
      trades: tradesBySession
    };
  } catch (error) {
    console.error('Error in getAllSessionsWithTrades:', error);
    throw error;
  }
}


export async function getSessionTrades(sessionId: string): Promise<(string | number | null)[][]> {
  try {
    const result = await client.execute({
      sql: "SELECT * FROM trades WHERE session_id = ? ORDER BY date ASC",
      args: [sessionId]
    });
    
    return result.rows.map(row => [
      convertValue(row.id),
      convertValue(row.date),
      convertValue(row.confirmationsCount),
      convertValue(row.confirmations),
      convertValue(row.result),
      convertValue(row.session_id),
      convertValue(row.loss_reason)
    ]);
  } catch (error) {
    console.error('Error in getSessionTrades for sessionId:', sessionId, error);
    throw error;
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  // Delete trades first
  await client.execute({
    sql: "DELETE FROM trades WHERE session_id = ?",
    args: [sessionId]
  });
  
  // Delete session
  await client.execute({
    sql: "DELETE FROM sessions WHERE id = ?",
    args: [sessionId]
  });
}

export async function deleteTrade(tradeId: number): Promise<void> {
  // Get trade info first
  const tradeResult = await client.execute({
    sql: "SELECT session_id, result FROM trades WHERE id = ?",
    args: [tradeId]
  });
  
  if (tradeResult.rows.length === 0) {
    throw new Error(`Trade ${tradeId} not found`);
  }
  
  const trade = tradeResult.rows[0];
  const sessionId = trade.session_id as string;
  const result = trade.result as string;
  
  // Delete the trade
  await client.execute({
    sql: "DELETE FROM trades WHERE id = ?",
    args: [tradeId]
  });
  
  // Get session stats
  const sessionResult = await client.execute({
    sql: "SELECT winCount, lossCount, tradesCount FROM sessions WHERE id = ?",
    args: [sessionId]
  });
  
  if (sessionResult.rows.length === 0) return;
  
  const session = sessionResult.rows[0];
  let winCount = session.winCount as number;
  let lossCount = session.lossCount as number;
  let tradesCount = session.tradesCount as number;
  
  // Update counts
  if (result === "win" && winCount > 0) {
    winCount -= 1;
  } else if (result === "loss" && lossCount > 0) {
    lossCount -= 1;
  }
  if (tradesCount > 0) {
    tradesCount -= 1;
  }
  
  // Calculate new win rate
  const winRate = tradesCount > 0 ? Math.round((winCount / tradesCount) * 100) : 0;
  
  // Update session
  await client.execute({
    sql: "UPDATE sessions SET winCount = ?, lossCount = ?, tradesCount = ?, winRate = ? WHERE id = ?",
    args: [winCount, lossCount, tradesCount, winRate, sessionId]
  });
}

export async function getLatestBalance(): Promise<number | null> {
  const result = await client.execute(`
    SELECT closing_balance 
    FROM sessions 
    WHERE closing_balance IS NOT NULL 
    ORDER BY date DESC 
    LIMIT 1
  `);
  
  return result.rows.length > 0 ? (result.rows[0].closing_balance as number) : null;
}

export async function getWinrateByYear(year: number): Promise<[string, number, number, number, number] | null> {
  const result = await client.execute({
    sql: `SELECT 
            COALESCE(SUM(winCount), 0) as totalWins,
            COALESCE(SUM(lossCount), 0) as totalLosses,
            COALESCE(SUM(tradesCount), 0) as totalTrades,
            COUNT(*) as sessionCount,
            COALESCE(SUM(earnings_result), 0) as totalEarnings
          FROM sessions 
          WHERE substr(date, 1, 4) = ?`,
    args: [year.toString()]
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  const totalTrades = convertValue(row.totalTrades) as number;
  const winrate = totalTrades > 0 ? Math.round(((convertValue(row.totalWins) as number) / totalTrades) * 100) : 0;
  
  return [
    year.toString(),
    winrate,
    totalTrades,
    convertValue(row.sessionCount) as number,
    convertValue(row.totalEarnings) as number
  ];
}

export async function getWinrateByMonth(year: number, month: number): Promise<[string, number, number, number, number] | null> {
  const monthStr = month.toString().padStart(2, '0');
  const datePrefix = `${year}-${monthStr}`;
  
  const result = await client.execute({
    sql: `SELECT 
            COALESCE(SUM(winCount), 0) as totalWins,
            COALESCE(SUM(lossCount), 0) as totalLosses,
            COALESCE(SUM(tradesCount), 0) as totalTrades,
            COUNT(*) as sessionCount,
            COALESCE(SUM(earnings_result), 0) as totalEarnings
          FROM sessions 
          WHERE substr(date, 1, 7) = ?`,
    args: [datePrefix]
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  const totalTrades = convertValue(row.totalTrades) as number;
  const winrate = totalTrades > 0 ? Math.round(((convertValue(row.totalWins) as number) / totalTrades) * 100) : 0;
  
  return [
    `${year}-${monthStr}`,
    winrate,
    totalTrades,
    convertValue(row.sessionCount) as number,
    convertValue(row.totalEarnings) as number
  ];
}

export async function getWinrateByWeek(year: number, week: number): Promise<[string, number, number, number, number] | null> {
  // Calculate approximate date range for the week
  // Note: This is a simplified implementation - you may need more sophisticated week calculation
  const startDate = new Date(year, 0, 1 + (week - 1) * 7);
  const endDate = new Date(year, 0, 1 + week * 7);
  
  const startDateStr = startDate.toISOString().substring(0, 10);
  const endDateStr = endDate.toISOString().substring(0, 10);
  
  const result = await client.execute({
    sql: `SELECT 
            COALESCE(SUM(winCount), 0) as totalWins,
            COALESCE(SUM(lossCount), 0) as totalLosses,
            COALESCE(SUM(tradesCount), 0) as totalTrades,
            COUNT(*) as sessionCount,
            COALESCE(SUM(earnings_result), 0) as totalEarnings
          FROM sessions 
          WHERE date >= ? AND date < ?`,
    args: [startDateStr, endDateStr]
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  const totalTrades = convertValue(row.totalTrades) as number;
  const winrate = totalTrades > 0 ? Math.round(((convertValue(row.totalWins) as number) / totalTrades) * 100) : 0;
  
  return [
    `${year}-W${week}`,
    winrate,
    totalTrades,
    convertValue(row.sessionCount) as number,
    convertValue(row.totalEarnings) as number
  ];
}

export async function updateLossReasons(tradeId: number, lossReasons: string): Promise<void> {
  await client.execute({
    sql: "UPDATE trades SET loss_reason = ? WHERE id = ?",
    args: [lossReasons, tradeId]
  });
}

export async function endSession(sessionId: string): Promise<void> {
  // For now, this function exists but doesn't calculate duration/interval
  // You can implement the timing logic if needed
  // Session ended
}

export async function getSession(sessionId: string): Promise<(string | number | null)[] | null> {
  const result = await client.execute({
    sql: "SELECT * FROM sessions WHERE id = ?",
    args: [sessionId]
  });
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return [
    convertValue(row.id),
    convertValue(row.date),
    convertValue(row.winCount),
    convertValue(row.lossCount),
    convertValue(row.tradesCount),
    convertValue(row.winRate),
    convertValue(row.starting_balance),
    convertValue(row.closing_balance)
  ];
}