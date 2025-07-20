import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { formatInTimeZone } from 'date-fns-tz';
import { Input } from "@/components/ui/input";

interface StartScreenProps {
  onSessionStart: (sessionId: string) => void;
}

// Helper function to format the balance for display
const formatDisplayValue = (value: string): string => {
  if (!value) return "";

  // Remove non-digit characters except for the decimal point
  const cleanedValue = value.replace(/[^\d.]/g, '');
  const parts = cleanedValue.split('.');
  const integerPart = parts[0];
  const fractionalPart = parts.length > 1 ? '.' + parts[1] : '';

  if (!integerPart) {
    // Handle cases like starting with "."
    return fractionalPart ? '0' + fractionalPart : "";
  }

  // Format the integer part with commas
  const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US');

  return formattedInteger + fractionalPart;
};

export default function StartScreen({ onSessionStart }: StartScreenProps) {
  const [balance, setBalance] = useState<string>("");

  const handleLatestBalance = async () => {
    try {
      const response = await fetch('/api/latest-balance');
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }
      const latestBalance: number | null = await response.json();
      if (latestBalance !== null) {
        setBalance(latestBalance.toString());
      }
    } catch (error) {
      console.error("Error fetching latest balance:", error);
    }
  };

  // Handler for input changes
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Keep only digits and the first decimal point
    const cleanedValue = rawValue.replace(/[^\d.]/g, '').replace(/(\.\d*)\./g, '$1');
    setBalance(cleanedValue);
  };

  const handleStartSession = async () => {
    if (!balance || isNaN(parseFloat(balance))) {
      return;
    }

    const sessionId = uuidv4();
    const now = new Date();
    const dateTime = formatInTimeZone(now, 'Europe/Paris', "yyyy-MM-dd'T'HH:mm:ssXXX");

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: sessionId,
          date: dateTime,
          winCount: 0,
          lossCount: 0,
          tradesCount: 0,
          winRate: 0,
          startingBalance: parseFloat(balance),
          closingBalance: null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      sessionStorage.setItem('tradeConfirmer_sessionId', sessionId);
      sessionStorage.setItem('tradeConfirmer_sessionStartTime', dateTime);

      onSessionStart(sessionId);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  return (
    <div className="container mx-auto pb-8 px-8">
      <div>
        <div className="flex flex-col items-center gap-2 self-stretch pt-12 pb-6">
          <h1 className="text-2xl tracking-tight font-semibold bg-gradient-to-b from-slate-950 to-[#708fbb] inline-block text-transparent bg-clip-text">Welcome To Binjour</h1>
          <p className="font-normal text-sm tracking-tight text-slate-400">Enter Your Current Balance</p>
        </div>
        
        <div className="w-[150px] mx-auto mb-3">
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
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleLatestBalance}
            className="font-medium text-xs leading-[14px] text-center underline text-slate-400 hover:text-slate-700 transition-colors duration-200"
          >
            Latest Balance
          </button>
          
          <button
            onClick={handleStartSession}
            disabled={!balance || isNaN(parseFloat(balance))}
            className={`flex justify-center items-center px-3 py-2 rounded-md w-fit transition-colors duration-200 ${
              !balance || isNaN(parseFloat(balance))
                ? 'bg-slate-100 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <span className={`font-medium text-xs leading-[20px] ${
              !balance || isNaN(parseFloat(balance)) ? 'text-slate-400' : 'text-slate-50'
            }`}>
              Start Session
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 