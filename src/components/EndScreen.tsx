import { useState } from "react";
import { Input } from "./ui/input";

interface EndScreenProps {
  sessionId: string;
  onSessionEnd: () => void;
  initialTradesCount: number;
}

// Helper function to format the balance for display (copied from StartScreen)
const formatDisplayValue = (value: string): string => {
  if (!value) return "";

  // Remove non-digit characters except for the decimal point
  const cleanedValue = value.replace(/[^\d.]/g, '');
  const parts = cleanedValue.split('.');
  const integerPart = parts[0];
  const fractionalPart = parts.length > 1 ? '.' + parts[1] : '';

  if (!integerPart) {
    // Handle cases like starting with \".\"\n    return fractionalPart ? '0' + fractionalPart : "";
  }

  // Format the integer part with commas
  const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US');

  return formattedInteger + fractionalPart;
};

export default function EndScreen({ sessionId, onSessionEnd, initialTradesCount }: EndScreenProps) {
  const [balance, setBalance] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handler for input changes (copied from StartScreen)
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Keep only digits and the first decimal point
    const cleanedValue = rawValue.replace(/[^\d.]/g, '').replace(/(\\.\\d*)\\./g, '$1');
    setBalance(cleanedValue);
  };

  const handleEndSession = async () => {
    if (!balance || isNaN(parseFloat(balance)) || initialTradesCount === 0) {
      return;
    }

    try {
      const sessionResponse = await fetch(`/api/sessions/${sessionId}`);
      if (!sessionResponse.ok) {
        throw new Error(`HTTP error! status: ${sessionResponse.status}`);
      }
      
      const session: [string, string, number, number, number, number, number | null, number | null] = await sessionResponse.json();

      if (session) {
        const [id, date, winCount, lossCount, tradesCountFromDB, winRate, startingBalance] = session;

        if (tradesCountFromDB === 0) {
           console.warn("Attempted to end session with 0 trades according to DB.");
           return; 
        }

        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            date,
            winCount,
            lossCount,
            tradesCount: tradesCountFromDB,
            winRate,
            startingBalance,
            closingBalance: parseFloat(balance),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        onSessionEnd();
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const handleDeleteSession = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Clear session storage
      sessionStorage.removeItem('tradeConfirmer_sessionId');
      sessionStorage.removeItem('tradeConfirmer_lastTrade');
      
      // Navigate to start screen
      window.location.href = '/';
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return (
    <div className="container mx-auto pb-8 px-8">
      <div>
        <div className="flex flex-col items-center gap-2 self-stretch pt-12 pb-6">
        <h1 className="text-2xl tracking-tight font-semibold bg-gradient-to-b from-slate-950 to-[#708fbb] inline-block text-transparent bg-clip-text">End Session?</h1>
          {initialTradesCount === 0 ? (
            <p className="font-normal text-sm tracking-tight text-slate-400">No trades in this session</p>
          ) : (
            <p className="font-normal text-sm tracking-tight text-slate-400">Enter Your Closing Balance</p>
          )}
        </div>
        
        <div className="w-[150px] mb-5 mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none rounded-lg">
              <span className={`font-medium text-slate-400 transition-colors duration-200 ${balance ? 'text-slate-500' : ''}`}>$</span>
            </div>
            <Input
              type="text"
              inputMode="decimal"
              value={formatDisplayValue(balance)}
              onChange={handleBalanceChange}
              className="pl-6 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-slate-400 h-9"
              placeholder="0.00"
              disabled={initialTradesCount === 0}
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleEndSession}
            disabled={!balance || isNaN(parseFloat(balance)) || initialTradesCount === 0}
            className={`flex justify-center items-center px-3 py-2 rounded-md w-fit transition-colors duration-200 ${
              !balance || isNaN(parseFloat(balance)) || initialTradesCount === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-50'
            }`}
          >
            <span className="font-medium text-xs leading-[20px]">
              End Session
            </span>
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="font-medium text-xs leading-[14px] text-center underline text-red-400 hover:text-red-600 transition-colors duration-200"
          >
            Start Over
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="flex flex-col gap-2.5 w-[260px] bg-white p-5 rounded-lg border border-solid border-slate-200">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-md tracking-tight text-slate-700">Delete session?</span>
                  <span className="font-normal text-sm leading-[20px] text-slate-500">This will delete your session and start over.</span>
                </div>
                <div className="flex items-center gap-3 h-7">
                  <button
                    onClick={handleDeleteSession}
                    className="w-fit flex justify-center items-center gap-2.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors duration-200"
                  >
                    <span className="font-medium text-xs leading-[20px] text-slate-50">Confirm</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="font-medium text-xs leading-[14px] text-center underline capitalize text-slate-400 hover:text-slate-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 