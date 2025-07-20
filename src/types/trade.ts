export interface Trade {
    id?: number;
    sessionId: string;
    date: string;
    confirmationsCount: number;
    confirmations: string[];
    result: "win" | "loss" | "draw";
  }
  
  export interface Session {
    sessionId: string;
    date: string;
    winCount: number;
    lossCount: number;
    tradesCount: number;
    trades: Trade[];
    winRate: number;
    startingBalance?: number;
    closingBalance?: number;
    sessionDuration?: number; // In minutes
    tradesInterval?: number; // In minutes
  }