import React, { useState, useMemo, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, RotateCcw, DollarSign, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getWeek, getMonth } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Data structure for individual winrate entries (monthly or weekly)
interface WinrateData {
  period: string;
  winrate: number;
  trades: number;
  sessions: number;
  earnings?: number;
  isSelected?: boolean;
  status?: 'disabled' | 'selected' | 'normal';
}

// Calculate available years for selection (from 2024 to current year)
const currentYear = new Date().getFullYear();
// Show current year and all years back to 2024 (minimum)
const years = Array.from(
  { length: Math.max(1, currentYear - 2023) }, 
  (_, i) => currentYear - i
).filter(year => year >= 2024);

// Lookup table for converting short month names to full names
const monthNames = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December"
};

// Initial dummy data structure with placeholder values for each year
const dataByYear: { [key: string]: { monthly: WinrateData[], weekly: WinrateData[] } } = {
  '2024': {
    monthly: [
      { period: "Jan", winrate: 82, trades: 0, sessions: 0 },
      { period: "Feb", winrate: 65, trades: 0, sessions: 0 },
      { period: "Mar", winrate: 75, trades: 0, sessions: 0 },
      { period: "Apr", winrate: 70, trades: 0, sessions: 0 },
      { period: "May", winrate: 82, trades: 0, sessions: 0 },
      { period: "Jun", winrate: 78, trades: 0, sessions: 0 },
      { period: "Jul", winrate: 73, trades: 0, sessions: 0 },
      { period: "Aug", winrate: 80, trades: 0, sessions: 0 },
      { period: "Sep", winrate: 85, trades: 0, sessions: 0 },
      { period: "Oct", winrate: 79, trades: 0, sessions: 0 },
      { period: "Nov", winrate: 72, trades: 0, sessions: 0 },
      { period: "Dec", winrate: 75, trades: 0, sessions: 0 },
    ],
    weekly: Array(52).fill(null).map((_, index) => ({
      period: `W${index + 1}`,
      winrate: 0,
      trades: 0,
      sessions: 0
    })),
  },
  '2025': {
    monthly: [
      { period: "Jan", winrate: 78, trades: 0, sessions: 0 },
      { period: "Feb", winrate: 80, trades: 0, sessions: 0 },
      { period: "Mar", winrate: 83, trades: 0, sessions: 0 },
      { period: "Apr", winrate: 85, trades: 0, sessions: 0 },
      { period: "May", winrate: 0, trades: 0, sessions: 0 },
      { period: "Jun", winrate: 0, trades: 0, sessions: 0 },
      { period: "Jul", winrate: 0, trades: 0, sessions: 0 },
      { period: "Aug", winrate: 0, trades: 0, sessions: 0 },
      { period: "Sep", winrate: 0, trades: 0, sessions: 0 },
      { period: "Oct", winrate: 0, trades: 0, sessions: 0 },
      { period: "Nov", winrate: 0, trades: 0, sessions: 0 },
      { period: "Dec", winrate: 0, trades: 0, sessions: 0 },
    ],
    weekly: Array.from({ length: 52 }, (_, i) => ({
      period: `W${i + 1}`,
      // Random winrate between 75-95% for first 16 weeks, rest are 0
      winrate: i < 16 ? Math.floor(Math.random() * 20) + 75 : 0,
      trades: 0,
      sessions: 0,
    })),
  },
  'last12': {
    monthly: [
      { period: "Jan", winrate: 78, trades: 0, sessions: 0 },
      { period: "Feb", winrate: 80, trades: 0, sessions: 0 },
      { period: "Mar", winrate: 83, trades: 0, sessions: 0 },
      { period: "Apr", winrate: 85, trades: 0, sessions: 0 },
      { period: "May", winrate: 82, trades: 0, sessions: 0 },
      { period: "Jun", winrate: 78, trades: 0, sessions: 0 },
      { period: "Jul", winrate: 73, trades: 0, sessions: 0 },
      { period: "Aug", winrate: 80, trades: 0, sessions: 0 },
      { period: "Sep", winrate: 85, trades: 0, sessions: 0 },
      { period: "Oct", winrate: 79, trades: 0, sessions: 0 },
      { period: "Nov", winrate: 72, trades: 0, sessions: 0 },
      { period: "Dec", winrate: 75, trades: 0, sessions: 0 },
    ],
    weekly: Array.from({ length: 52 }, (_, i) => ({
      period: `W${i + 1}`,
      winrate: Math.floor(Math.random() * 25) + 70, // Random winrate between 70-95%
      trades: 0,
      sessions: 0,
    })),
  }
};

// Tooltip component that displays detailed information when hovering over chart bars
interface TooltipPayload {
  payload: {
    period: string;
    status: string;
    winrate: number;
    trades: number;
    sessions: number;
    earnings?: number;
  };
}

const CustomTooltipContent = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0];
  const period = item.payload.period;
  const status = item.payload.status;
  
  // Hide tooltip for disabled bars
  if (status === 'disabled') {
    return null;
  }
  
  // Format period - either convert "W15" to "Week 15" or "Jan" to "January"
  let formattedPeriod = period;
  if (period.startsWith('W')) {
    formattedPeriod = `Week ${period.substring(1)}`;
  } else if (period in monthNames) {
    formattedPeriod = monthNames[period as keyof typeof monthNames];
  }
  
  return (
    <div className="min-w-[180px] rounded-lg border border-slate-200 bg-background px-3 py-3 text-xs shadow-xl gap-1.5">
      <div className="grid gap-1.5">
        <div className="font-medium text-slate-700 mb-1">{formattedPeriod}</div>
        <div className="grid grid-cols-[auto_1fr] gap-4 w-full">
          <span className="text-slate-400 whitespace-nowrap">Sessions</span>
          <span className="font-normal text-slate-400 text-right">
            {item.payload.sessions}
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-4 w-full">
          <span className="text-slate-400 whitespace-nowrap">Trades</span>
          <span className="font-normal text-slate-400 text-right">
            {item.payload.trades}
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-4 w-full">
          <span className="font-medium text-slate-500 whitespace-nowrap">Winrate</span>
          <span className="font-medium text-slate-500 text-right">
            {item.payload.winrate.toLocaleString()}%
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-4 w-full mt-1 pt-3 border-t border-slate-200">
          <span className="text-slate-700 font-medium whitespace-nowrap">Earnings</span>
          <span className={`font-medium text-right ${
            (item.payload.earnings ?? 0) > 0 ? 'text-emerald-500' : (item.payload.earnings ?? 0) < 0 ? 'text-red-400' : 'text-slate-400'
          }`}>
            {(item.payload.earnings ?? 0) > 0 ? '+ ' : (item.payload.earnings ?? 0) < 0 ? '- ' : ''}${Math.abs(item.payload.earnings || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main chart component that displays winrate data with interactive controls
export default function WinrateChart() {
  // Core state management for chart controls and view options
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());  // Currently selected year or 'last12'
  const [view, setView] = useState<"month" | "week">("month");                      // Toggle between month/week view
  const [isResetting, setIsResetting] = useState(false);                            // Animation state for reset button
  const [realData, setRealData] = useState<{ [key: string]: { monthly: WinrateData[], weekly: WinrateData[] } }>({});  // Actual data from database
  const [centerIndex, setCenterIndex] = useState(() => {
    return getMonth(new Date());  // Initialize to current month
  });
  const [showEarnings, setShowEarnings] = useState(false);
  const [displayedWinrate, setDisplayedWinrate] = useState<number>(0);
  const [displayedEarnings, setDisplayedEarnings] = useState<number>(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch real winrate data whenever the selected year changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize empty data structure for the new year
        const data: { monthly: WinrateData[], weekly: WinrateData[] } = {
          monthly: [],
          weekly: []
        };

        if (selectedYear === 'last12') {
          // Special handling for "Last 12 months" view
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth();

          // Fetch last 12 months of data, handling year wraparound
          for (let i = 0; i < 12; i++) {
            let targetMonth = currentMonth - i;
            let targetYear = currentYear;
            if (targetMonth < 0) {
              targetMonth += 12;
              targetYear -= 1;
            }
            const response = await fetch(`/api/winrate/month/${targetYear}/${targetMonth + 1}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: [string, number, number, number, number] = await response.json();
            const monthIndex = (targetMonth + 12) % 12;
            data.monthly[monthIndex] = {
              period: Object.keys(monthNames)[monthIndex],
              winrate: result ? Math.round(result[1]) : 0,
              trades: result ? result[2] : 0,
              sessions: result ? result[3] : 0,
              earnings: result ? result[4] : 0
            };
          }

          // Initialize array with 52 weeks
          data.weekly = Array(52).fill(null).map((_, index) => ({
            period: `W${index + 1}`,
            winrate: 0,
            trades: 0,
            sessions: 0
          }));

          // Fetch last 52 weeks of data, handling year wraparound
          const currentWeek = getWeek(currentDate, { weekStartsOn: 1 }); // Get week number (1-53)
          for (let i = 0; i < 52; i++) { // Iterate 52 times for 52 weeks
            const weekOffset = i;
            let targetWeek = currentWeek - weekOffset;
            let targetYear = currentYear;
            
            // Adjust year if week number goes below 1
            while (targetWeek <= 0) {
              targetYear -= 1;
              // Determine weeks in the previous year (handle leap years - approximate is fine)
              const weeksInPrevYear = getWeek(new Date(targetYear, 11, 31), { weekStartsOn: 1 });
              targetWeek += weeksInPrevYear; 
            }

            try { // Added try-catch for individual week fetch
              const response = await fetch(`/api/winrate/week/${targetYear}/${targetWeek - 1}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const result: [string, number, number, number, number] = await response.json();

              // Calculate the correct 0-51 index based on the targetWeek (1-52)
              const weekIndex = (targetWeek - 1 + 52) % 52; // Correct mapping to 0-51 index
              
              if (result) {
                 // Ensure data.weekly is initialized before assignment
                 if (!data.weekly[weekIndex]) {
                    data.weekly[weekIndex] = { period: `W${targetWeek}`, winrate: 0, trades: 0, sessions: 0, earnings: 0 };
                 }
                 // Update the specific index with fetched data
                 data.weekly[weekIndex] = {
                    period: `W${targetWeek}`, // Use the actual target week number (1-52)
                    winrate: Math.round(result[1]),
                    trades: result[2],
                    sessions: result[3],
                    earnings: result[4]
                 };
              }
            } catch (weekError) {
               // Log error for specific week but continue fetching others
               console.error(`Error fetching data for Week ${targetWeek}, Year ${targetYear}:`, weekError);
            }
          }
        } else {
          // Handling for specific year selection
          const year = parseInt(selectedYear);
          
          // Fetch all months for the selected year
          for (let month = 0; month < 12; month++) {
            const response = await fetch(`/api/winrate/month/${year}/${month + 1}`);
            if (!response.ok) {
              console.error(`HTTP error! status: ${response.status}`);
              continue;
            }
            const result: [string, number, number, number, number] = await response.json();
            data.monthly.push({
              period: Object.keys(monthNames)[month],
              winrate: result ? Math.round(result[1]) : 0,
              trades: result ? result[2] : 0,
              sessions: result ? result[3] : 0,
              earnings: result ? result[4] : 0
            });
          }

          // Fetch all weeks for the selected year
          for (let week = 0; week < 52; week++) {
            const response = await fetch(`/api/winrate/week/${year}/${week}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: [string, number, number, number, number] = await response.json();
            data.weekly.push({
              period: `W${week + 1}`,
              winrate: result ? Math.round(result[1]) : 0,
              trades: result ? result[2] : 0,
              sessions: result ? result[3] : 0,
              earnings: result ? result[4] : 0
            });
          }
        }

        // Update state with new data while preserving existing data
        setRealData(prev => ({
          ...prev,
          [selectedYear]: data
        }));
      } catch (error) {
        console.error("Error fetching winrate data:", error);
      }
    };

    fetchData();
  }, [selectedYear]);

  // When the year selection changes
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    
    const currentMonth = getMonth(new Date());
    const currentWeek = getWeek(new Date(), { weekStartsOn: 1 }) - 1; // 0-indexed

    if (year === 'last12') {
      if (view === 'month') {
        // Set to earliest month (11 months ago)
        const startMonth = (currentMonth - 11 + 12) % 12; 
        setCenterIndex(startMonth);
      } else {
        // Set to earliest week (51 weeks ago)
        const startWeek = (currentWeek - 51 + 52) % 52; 
        setCenterIndex(startWeek);
      }
    } else if (year === currentYear.toString()) {
      setCenterIndex(view === 'month' ? currentMonth : currentWeek);
    } else {
      setCenterIndex(0); // Start at Jan or W1 for past years
    }
  };

  // Handle view change
  const handleViewChange = (newView: "month" | "week") => {
    setView(newView);

    const currentMonth = getMonth(new Date());
    const currentWeek = getWeek(new Date(), { weekStartsOn: 1 }) - 1; // 0-indexed

    if (selectedYear === 'last12') {
      if (newView === "month") {
         // Set to earliest month (11 months ago)
        const startMonth = (currentMonth - 11 + 12) % 12; 
        setCenterIndex(startMonth);
      } else {
        // Set to earliest week (51 weeks ago)
        const startWeek = (currentWeek - 51 + 52) % 52;
        setCenterIndex(startWeek);
      }
    } else if (selectedYear === currentYear.toString()) {
       setCenterIndex(newView === 'month' ? currentMonth : currentWeek);
    } else {
      setCenterIndex(0); // Start at Jan or W1 for past years
    }
  };

  // Get current index based on view
  const currentIndex = (() => {
    const now = new Date();
    if (view === "month") {
      return getMonth(now);
    } else {
      return getWeek(now, { weekStartsOn: 1 }) - 1;  // 1 = Monday
    }
  })();
  
  // Check if we're viewing the current year
  const isCurrentYear = selectedYear === currentYear.toString();

  // Function to smoothly reset to current month/week
  const handleReset = () => {
    // For "Last 12 months", reset to the starting point (earliest month/week)
    if (selectedYear === 'last12') {
      const currentMonth = getMonth(new Date());
      const currentWeek = getWeek(new Date(), { weekStartsOn: 1 }) - 1; // 0-indexed
      
      // Calculate target index based on the view
      const targetIndex = view === 'month' 
        ? (currentMonth + 1) % 12 // Earliest month in the 12-month range
        : (currentWeek + 1) % 52; // Earliest week in the 52-week range
        
      if (centerIndex === targetIndex) return;
      
      setIsResetting(true);
      
      // Calculate the shortest path to the target month/week
      let diff = targetIndex - centerIndex;
      
      // Adjust the difference to always take the shortest path
      if (view === "month") {
        if (diff > 6) diff -= 12;
        if (diff < -6) diff += 12;
      } else {
        if (diff > 26) diff -= 52;
        if (diff < -26) diff += 52;
      }
      
      // Create an array of intermediate positions
      const steps = Array.from({ length: Math.abs(diff) }, (_, i) => {
        const step = diff > 0 ? i + 1 : -(i + 1);
        return ((centerIndex + step + (view === "month" ? 12 : 52)) % (view === "month" ? 12 : 52));
      });
      
      // Animate through the steps
      steps.forEach((targetIndex, i) => {
        setTimeout(() => {
          setCenterIndex(targetIndex);
          if (i === steps.length - 1) {
            setIsResetting(false);
          }
        }, i * 50);
      });
    } else {
      // For other views, reset to current month/week (original behavior)
      if (centerIndex === currentIndex) return;
      
      setIsResetting(true);
      
      // Calculate the shortest path to the current month/week
      let diff = currentIndex - centerIndex;
      
      // Adjust the difference to always take the shortest path
      if (view === "month") {
        if (diff > 6) diff -= 12;
        if (diff < -6) diff += 12;
      } else {
        if (diff > 26) diff -= 52;
        if (diff < -26) diff += 52;
      }
      
      // Create an array of intermediate positions
      const steps = Array.from({ length: Math.abs(diff) }, (_, i) => {
        const step = diff > 0 ? i + 1 : -(i + 1);
        return ((centerIndex + step + (view === "month" ? 12 : 52)) % (view === "month" ? 12 : 52));
      });
      
      // Animate through the steps
      steps.forEach((targetIndex, i) => {
        setTimeout(() => {
          setCenterIndex(targetIndex);
          if (i === steps.length - 1) {
            setIsResetting(false);
          }
        }, i * 50);
      });
    }
  };

  // Calculate which data points should be visible in the current chart view
  const visibleData = useMemo(() => {
    // Use real data if available, otherwise fall back to dummy data
    const yearData = realData[selectedYear] || dataByYear[selectedYear];
    
    if (view === "week") {
      // Helper function to process weekly data points
      const getWeekData = (weekIndex: number) => {
        const wrappedIndex = ((weekIndex % 52) + 52) % 52;
        const item = yearData.weekly[wrappedIndex];
        const isFuture = wrappedIndex > currentIndex && selectedYear === currentYear.toString();
        const isDisabled = item.trades === 0 || isFuture;
        const currentWinrate = isDisabled ? Math.floor(Math.random() * 51) + 20 : item.winrate;
        // Calculate bar height value
        const barHeightValue = !isDisabled && item.winrate === 0 ? 5 : currentWinrate;
        return {
          ...item,
          period: `W${wrappedIndex + 1}`,
          winrate: currentWinrate, // Keep original winrate logic
          barHeightValue: barHeightValue, // Add value for bar height
          trades: isDisabled ? 0 : item.trades,
          sessions: isDisabled ? 0 : item.sessions,
          earnings: isDisabled ? 0 : item.earnings,
          isSelected: wrappedIndex === centerIndex,
          status: isDisabled ? 'disabled' : wrappedIndex === centerIndex ? 'selected' : 'normal'
        };
      };

      // Return 7 weeks of data centered on the selected week
      return Array.from({ length: 7 }, (_, index) => {
        const weekOffset = index - 3;
        const targetWeek = centerIndex + weekOffset;
        return getWeekData(targetWeek);
      });
    }

    // Helper function to process monthly data points
    const getMonthData = (monthIndex: number) => {
      const wrappedIndex = ((monthIndex % 12) + 12) % 12;
      const item = yearData.monthly[wrappedIndex];
      const isFuture = wrappedIndex > currentIndex && selectedYear === currentYear.toString(); // Added year check
      // Use trades === 0 for month disabling consistency
      const isDisabled = item.trades === 0 || isFuture;
      const currentWinrate = isDisabled ? Math.floor(Math.random() * 51) + 20 : item.winrate;
       // Calculate bar height value
      const barHeightValue = !isDisabled && item.winrate === 0 ? 5 : currentWinrate;
      return {
        period: item.period,
        winrate: currentWinrate, // Keep original winrate logic
        barHeightValue: barHeightValue, // Add value for bar height
        trades: isDisabled ? 0 : item.trades,
        sessions: isDisabled ? 0 : item.sessions,
        earnings: isDisabled ? 0 : item.earnings,
        isSelected: wrappedIndex === centerIndex,
        status: isDisabled ? 'disabled' : wrappedIndex === centerIndex ? 'selected' : 'normal'
      };
    };

    // Return 7 months of data centered on the selected month
    return Array.from({ length: 7 }, (_, index) => {
      const monthOffset = index - 3;
      const targetMonth = centerIndex + monthOffset;
      return getMonthData(targetMonth);
    });
  }, [centerIndex, view, selectedYear, realData, currentIndex]);

  // Navigation handlers for moving through periods
  const handlePrevious = () => {
    setCenterIndex(prev => {
      const maxIndex = view === "month" ? 11 : 51;
      return ((prev - 1 + (maxIndex + 1)) % (maxIndex + 1));  // Wrap around to end when going before first period
    });
  };

  const handleNext = () => {
    setCenterIndex(prev => {
      const maxIndex = view === "month" ? 11 : 51;
      return (prev + 1) % (maxIndex + 1);  // Wrap around to start when going past last period
    });
  };

  // Get the currently selected period's data for display
  const selectedData = view === "week" 
    ? (realData[selectedYear]?.weekly[centerIndex] || dataByYear[selectedYear]?.weekly[centerIndex] || { period: "", winrate: 0 })
    : (realData[selectedYear]?.monthly[centerIndex] || dataByYear[selectedYear]?.monthly[centerIndex] || { period: "", winrate: 0 });

  // Animate winrate/earnings changes
  useEffect(() => {
    if (isInitialLoad) return;

    let startTime: number | null = null;
    let animationFrame: number;
    const startValue = showEarnings ? displayedEarnings : displayedWinrate;
    const targetValue = showEarnings ? (selectedData.earnings ?? 0) : selectedData.winrate;
    const ANIMATION_DURATION = 1000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / ANIMATION_DURATION, 1);
      
      const eased = progress * (2 - progress);
      const currentValue = startValue + (targetValue - startValue) * eased;
      
      if (showEarnings) {
        setDisplayedEarnings(currentValue);
      } else {
        setDisplayedWinrate(Math.round(currentValue));
      }
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [selectedData.winrate, selectedData.earnings, showEarnings, isInitialLoad, displayedEarnings, displayedWinrate]);

  // Update isInitialLoad after first data fetch
  useEffect(() => {
    if (Object.keys(realData).length > 0) {
      setIsInitialLoad(false);
    }
  }, [realData]);

  // Get comparison data (previous period or current period) for relative performance
  const comparisonData = view === "week" 
    ? (centerIndex === currentIndex 
        ? (realData[selectedYear]?.weekly[(centerIndex - 1 + 52) % 52] || dataByYear[selectedYear]?.weekly[(centerIndex - 1 + 52) % 52])
        : (realData[selectedYear]?.weekly[currentIndex] || dataByYear[selectedYear]?.weekly[currentIndex]))
    : (centerIndex === currentIndex 
        ? (realData[selectedYear]?.monthly[(centerIndex - 1 + 12) % 12] || dataByYear[selectedYear]?.monthly[(centerIndex - 1 + 12) % 12])
        : (realData[selectedYear]?.monthly[currentIndex] || dataByYear[selectedYear]?.monthly[currentIndex]));

  // Adjust the comparison text based on whether the current period is selected
  const comparisonText = centerIndex === currentIndex
    ? `vs. last ${view === "week" ? "week" : "month"}` // Change "current" to "last" here
    : `vs. current ${view === "week" ? "week" : "month"}`; // Keep "current" when viewing other periods

  const chartConfig = {
    winrate: {
      label: "Winrate",
      color: "hsl(var(--chart-1))",
    },
  };

  // Calculate aggregate statistics for the entire year
  const yearlyStats = useMemo(() => {
    const yearData = realData[selectedYear] || dataByYear[selectedYear];
    
    // Calculate total sessions and trades from monthly data
    const totalSessions = yearData.monthly.reduce((sum, month) => sum + (month.sessions || 0), 0);
    const totalTrades = yearData.monthly.reduce((sum, month) => sum + (month.trades || 0), 0);
    
    // Calculate average winrate only from months that have trades
    const monthsWithTrades = yearData.monthly.filter(month => month.trades > 0);
    const averageWinrate = monthsWithTrades.length > 0
      ? Math.round(monthsWithTrades.reduce((sum, month) => sum + month.winrate, 0) / monthsWithTrades.length)
      : 0;
    
    // Calculate total earnings
    const totalEarnings = yearData.monthly.reduce((sum, month) => sum + (month.earnings || 0), 0);
    
    return {
      sessions: totalSessions,
      trades: totalTrades,
      winrate: averageWinrate,
      earnings: totalEarnings
    };
  }, [selectedYear, realData]);

  return (
    <div className="w-full flex flex-col">
      {/* ===== TOP CONTROLS SECTION ===== */}
      
      <div className="flex justify-between items-center pt-1">
        <div className="flex items-center justify-between w-full border border-slate-200 rounded-md py-1.5 px-1">
          <div className="flex items-center gap-2">        
            {/* Month/Week view toggle */}
            <button
              onClick={() => handleViewChange(view === "month" ? "week" : "month")}
              className="text-slate-500 text-xs font-normal hover:text-slate-700 transition-color duration-200 w-[50px] h-[1.250rem] text-start border-r border-slate-200 ml-2"
            >
              {view === "month" ? "Month" : "Week"}
            </button>

            {/* Year selector dropdown */}
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200 w-fit h-1 gap-1 focus:ring-0 focus:ring-offset-0 shadow-none border-none px-0 flex-row-reverse">
                <SelectValue>{selectedYear === 'last12' ? '12 Months' : selectedYear}</SelectValue>
              </SelectTrigger>
              <SelectContent className="w-fit px-2 py-1 border-slate-200 shadow-lg">
                <SelectItem className="text-xs text-slate-400 hover:text-slate-500 hover:bg-slate-50 focus:bg-slate-50 data-[highlighted]:bg-slate-50" value="last12">Last 12 months</SelectItem>
                {years.map((year) => (
                  <SelectItem className="text-xs text-slate-400 hover:text-slate-500 hover:bg-slate-50 focus:bg-slate-50 data-[highlighted]:bg-slate-50" key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center border-l border-slate-200 h-[1.250rem] pl-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowEarnings(!showEarnings)}
                    className="w-6 h-5 rounded-md text-slate-500 hover:text-slate-700 flex items-center justify-center"
                  >
                    {showEarnings ? (
                      <DollarSign className="w-3.5 h-3.5" />
                    ) : (
                      <LineChart className="w-3.5 h-3.5" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="pb-1.5 pt-1.5">
                  <p className="text-xs font-normal text-slate-400">
                    {showEarnings ? "Earnings" : "Winrate"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* ===== MAIN CHART SECTION ===== */}
      <div className="flex flex-col mt-10 group">
        {/* Header container with title, toggles, and year */}
        <div className="flex flex-col items-center mb-1">
          <div className="w-full flex justify-center items-center relative w-[97%]">
            <h2 className="text-md tracking-tight text-slate-400 mb-1">
              {centerIndex === currentIndex && isCurrentYear
                ? `${showEarnings ? 'Earnings' : 'Winrate'} This ${view === "week" ? "Week" : "Month"}` 
                : view === "week" 
                  ? `${showEarnings ? 'Earnings' : 'Winrate'} Week ${centerIndex + 1}` 
                  : `${showEarnings ? 'Earnings' : 'Winrate'} ${monthNames[selectedData.period as keyof typeof monthNames]}`}
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleReset}
                    className={cn(
                      "opacity-0 group-hover:opacity-100 absolute right-0 text-slate-400 w-7 h-7 flex items-center justify-center rounded-md bg-slate-50 hover:text-slate-500 transition-opacity",
                      isResetting && "animate-spin"
                    )}
                    disabled={(selectedYear === 'last12' 
                      ? (view === 'month' 
                        ? centerIndex === ((getMonth(new Date()) + 1) % 12) 
                        : centerIndex === ((getWeek(new Date(), { weekStartsOn: 1 }) - 1 + 1) % 52))
                      : centerIndex === currentIndex) || isResetting}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="pb-1.5 pt-1.5">
                  <p className="text-xs font-normal text-slate-400">Reset</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-row items-center justify-center w-[100px] text-xs text-slate-400 mb-1">
            <span>
              {selectedYear === 'last12' 
                ? view === 'month' 
                  ? centerIndex > getMonth(new Date())
                    ? currentYear - 1 
                    : currentYear
                  : centerIndex > (getWeek(new Date(), { weekStartsOn: 1 }) - 1) 
                    ? currentYear - 1 
                    : currentYear
                : selectedYear}
            </span>
          </div>
        </div>

        {/* Navigation and value display container */}
        <div className="w-full flex items-center justify-between">
          <button onClick={handlePrevious} className="w-7 h-7 flex items-center justify-center rounded-md bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-[1.8em] font-bold tracking-tight flex items-center gap-1.5">
            {showEarnings 
              ? displayedEarnings === 0 
                ? `$0.00`
                : <>
                    <span className="text-[0.6em] font-normal text-slate-500">
                      {displayedEarnings > 0 ? '+' : '−'}
                    </span>
                    ${Math.abs(displayedEarnings).toFixed(2)}
                  </>
              : `${displayedWinrate}%`
            }
          </div>

          <button onClick={handleNext} className="w-7 h-7 flex items-center justify-center rounded-md bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison text container */}
        <div className="flex justify-center">
          {comparisonData && (
            selectedData.trades === 0 ? (
              <div className="text-sm font-normal tracking-tight text-slate-400">
                No trades in this period
              </div>
            ) : (
              <div className={`text-sm font-normal tracking-tight ${
                showEarnings
                  ? ((selectedData.earnings ?? 0) > (comparisonData.earnings ?? 0) ? "text-emerald-500" : "text-red-400")
                  : (selectedData.winrate > comparisonData.winrate ? "text-emerald-500" : "text-red-400")
              }`}>
                {showEarnings 
                  ? `${(selectedData.earnings ?? 0) > (comparisonData.earnings ?? 0) ? "+" : "-"}$${
                      Math.abs((selectedData.earnings ?? 0) - (comparisonData.earnings ?? 0)).toFixed(2)
                    } ${comparisonText}`
                  : `${selectedData.winrate > comparisonData.winrate ? "+" : "-"}${
                      Math.abs(selectedData.winrate - comparisonData.winrate)
                    }% ${comparisonText}`
                }
              </div>
            )
          )}
        </div>

        {/* ===== CHART CONTAINER ===== */}
        {/* Responsive bar chart displaying winrate data with custom styling and tooltips */}
        <div className="w-full h-[180px] mt-4 overflow-visible">
          <ChartContainer config={chartConfig} className="h-[180px] w-full overflow-visible [&_.recharts-cartesian-axis-tick_text.current]:fill-slate-700 [&_.recharts-cartesian-axis-tick_text]:fill-slate-400">
            <BarChart 
              data={visibleData}
              width={500}
              height={170}
              className="overflow-visible"
            >
              <defs>
                {visibleData.map((_, index) => (
                  <React.Fragment key={index}>
                    <linearGradient id={`barGradient-normal-${index}`} x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#64748b" stopOpacity="1" />
                      <stop offset="40%" stopColor="#020617" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id={`barGradient-disabled-${index}`} x1="0" y1="1" x2="0" y2="0">
                      <stop offset="00%" stopColor="#f8fafc" stopOpacity="1" />
                      <stop offset="40%" stopColor="#e2e8f0" stopOpacity="1" />
                    </linearGradient>
                  </React.Fragment>
                ))}
              </defs>
              <CartesianGrid 
                vertical={false} 
                horizontal={false}
                stroke="rgb(226 232 240)" // slate-200
              />
              <XAxis
                dataKey="period"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={0}
                tick={({ x, y, payload }) => {
                  const isSelected = payload.value === selectedData.period;
                  return (
                    <text
                      x={x}
                      y={y}
                      dy={16}
                      textAnchor="middle"
                      className={isSelected ? "font-semibold current" : ""}
                    >
                      {payload.value}
                    </text>
                  );
                }}
              />
              <ChartTooltip 
                content={<CustomTooltipContent />} 
                cursor={false}
                position={{ y: -30 }}
                offset={0}
              />
              <Bar 
                dataKey="barHeightValue"
                radius={[6, 6, 0, 0]}
              >
                {visibleData.map((entry, index) => {
                  const isDisabled = entry.status === 'disabled';
                  const isSelected = entry.period === selectedData.period;
                  
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        isSelected && isDisabled
                          ? `url(#barGradient-disabled-${index})`
                          : isSelected 
                            ? `url(#barGradient-normal-${index})`
                            : isDisabled 
                              ? `url(#barGradient-disabled-${index})`
                              : `url(#barGradient-normal-${index})`
                      }
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        {/* ===== YEARLY STATISTICS SECTION ===== */}
        {/* Accordion displaying yearly statistics */}
        <div className="w-full mt-6 px-2">
        <Accordion type="single" collapsible className="w-full border-none shadow-none">
          <AccordionItem value="yearly-stats" className="border border-slate-200 rounded-md">
            <AccordionTrigger className="py-3 hover:no-underline hover:text-slate-700 data-[state=open]:text-slate-700">
              <span className="text-xs font-medium text-slate-500 pt-[1px] ">Yearly details - {selectedYear === 'last12' ? '12 months' : selectedYear}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Number of sessions</span>
                  <span className="text-xs text-slate-400">{yearlyStats.sessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Number of trades</span>
                  <span className="text-xs text-slate-400">{yearlyStats.trades}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500">Average winrate</span>
                  <span className="text-xs font-medium text-slate-500">{yearlyStats.winrate}%</span>
                </div>
                <div className="flex justify-between items-center mt-1 pt-3 border-t border-slate-200">
                  <span className="text-xs font-medium text-slate-700">Earnings</span>
                  <span className={`text-xs font-medium ${
                    yearlyStats.earnings > 0 ? 'text-emerald-500' : yearlyStats.earnings < 0 ? 'text-red-400' : 'text-slate-500'
                  }`}>
                    {yearlyStats.earnings > 0 ? '+ ' : yearlyStats.earnings < 0 ? '- ' : ''}${Math.abs(yearlyStats.earnings || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        </div>
      </div>
    </div>
  );
} 